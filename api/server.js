const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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
app.use('/api/chats', require('./routes/chats'));

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
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Store active connections
const activeConnections = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user joining with their ID
  socket.on('join', ({ userId, userType }) => {
    activeConnections.set(userId, { socket, userType });
    socket.userId = userId;
    socket.userType = userType;
    console.log(`User ${userId} (${userType}) joined`);
  });

  // Handle private messages
  socket.on('private-message', ({ to, message }) => {
    const recipientConnection = activeConnections.get(to);
    if (recipientConnection) {
      recipientConnection.socket.emit('private-message', {
        from: socket.userId,
        message,
        timestamp: new Date()
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      activeConnections.delete(socket.userId);
      console.log(`User ${socket.userId} disconnected`);
    }
  });
});
