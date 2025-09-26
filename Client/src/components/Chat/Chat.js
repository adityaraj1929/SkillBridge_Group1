import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { Send } from '@mui/icons-material';
import axios from 'axios';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';

const Chat = ({ opportunityId, receiverId, receiverName }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { messages, sendMessage } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/chats/${opportunityId}`);
        setChatHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [opportunityId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    try {
      const response = await axios.post(
        `/api/chats/${opportunityId}/${receiverId}`,
        { message: inputMessage }
      );
      setChatHistory([...chatHistory, response.data]);
      sendMessage(receiverId, inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 2, height: '500px', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Chat with {receiverName}
      </Typography>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        <List>
          {chatHistory.map((chat, index) => (
            <React.Fragment key={chat._id || index}>
              <ListItem
                sx={{
                  justifyContent: chat.sender._id === user._id ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  sx={{
                    p: 1,
                    maxWidth: '70%',
                    backgroundColor: chat.sender._id === user._id ? 'primary.main' : 'grey.200',
                    color: chat.sender._id === user._id ? 'white' : 'text.primary',
                  }}
                >
                  <ListItemText
                    primary={chat.message}
                    secondary={new Date(chat.timestamp).toLocaleString()}
                    secondaryTypographyProps={{
                      color: chat.sender._id === user._id ? 'inherit' : 'text.secondary',
                    }}
                  />
                </Paper>
              </ListItem>
              {index < chatHistory.length - 1 && <Divider variant="middle" />}
            </React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </List>
      </Box>

      <Box component="form" onSubmit={handleSend} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <IconButton color="primary" type="submit">
          <Send />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat;