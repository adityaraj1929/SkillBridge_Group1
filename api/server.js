const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const socketio = require('socket.io');
require('dotenv').config();

// Import models
const ChatMessage = require('./models/ChatMessage');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/ngos', require('./routes/ngos'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io setup
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Socket middleware to authenticate user
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

// Socket connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.userId);

  // Join a private room for the user
  socket.join(socket.userId);

  // Handle private messages
  socket.on('sendMessage', async (messageData) => {
    try {
      console.log('Received message data:', messageData);
      
      const { receiverId, content, opportunityId } = messageData;
      
      if (!receiverId || !content) {
        console.error('Invalid message data');
        return;
      }

      // Create and save message
      const message = new ChatMessage({
        senderId: socket.userId,
        receiverId: receiverId,
        content,
        opportunityId,
        timestamp: new Date()
      });
      
      console.log('Saving message:', message);
      await message.save();

      // Emit to recipient and sender
      const messageToSend = {
        messageId: message._id,
        senderId: socket.userId,
        content,
        timestamp: message.timestamp,
        opportunityId
      };

      // Send to recipient
      io.to(receiverId).emit('receiveMessage', messageToSend);
      
      // Send back to sender to confirm delivery
      socket.emit('messageSent', messageToSend);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.userId);
  });
});
