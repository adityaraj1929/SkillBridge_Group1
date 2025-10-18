import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../contexts/AuthContext';

const ChatWindow = ({ selectedPartner, socket }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!socket || !selectedPartner) return;

    // Load previous messages
    const loadPreviousMessages = async () => {
      console.log('Loading messages for partner:', selectedPartner._id);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/chat/messages/${selectedPartner._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        console.log('Loaded messages:', data);
        
        if (data.success) {
          setMessages(data.messages);
          scrollToBottom();
        } else {
          console.error('Failed to load messages:', data.message);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadPreviousMessages();

    // Listen for new messages
    // Listen for new messages
    socket.on('receiveMessage', (message) => {
      console.log('Received new message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    // Listen for message sent confirmation
    socket.on('messageSent', (message) => {
      console.log('Message sent confirmation:', message);
      // Update pending message to confirmed
      setMessages((prevMessages) => 
        prevMessages.map(msg => 
          msg.pending && msg.timestamp === message.timestamp ? message : msg
        )
      );
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [socket, selectedPartner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket || !selectedPartner) return;

    const messageData = {
      senderId: currentUser._id,
      receiverId: selectedPartner._id,
      content: newMessage.trim(),
      timestamp: new Date(),
      opportunityId: selectedPartner.opportunities?.[0]?.opportunityId
    };

    if (!messageData.opportunityId) {
      console.error('No opportunity ID found for chat');
      return;
    }

    console.log('Sending message:', messageData);
    
    // Add message to local state optimistically
    const optimisticMessage = {
      ...messageData,
      pending: true
    };
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Emit message
    socket.emit('sendMessage', messageData);
    
    // Clear input
    setNewMessage('');
    
    // Scroll to bottom
    scrollToBottom();
  };

  if (!selectedPartner) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: 'calc(100vh - 100px)',
      }}
    >
      {/* Chat Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">
          {selectedPartner.name || selectedPartner.organizationName}
        </Typography>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <List>
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  flexDirection: 'column',
                  alignItems:
                    message.senderId === currentUser._id ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '70%',
                    bgcolor:
                      message.senderId === currentUser._id
                        ? 'primary.main'
                        : 'grey.200',
                    color:
                      message.senderId === currentUser._id ? 'white' : 'text.primary',
                    borderRadius: 2,
                    p: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText primary={message.content} />
                </Box>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </ListItem>
              {index < messages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWindow;