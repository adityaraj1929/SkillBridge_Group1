import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Grid,
  Badge,
  CircularProgress,
  Alert
} from '@mui/material';
import { Message as MessageIcon, Person } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import Chat from '../../components/Chat/Chat';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get('/api/chats/conversations');
      setConversations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const getParticipantName = (conversation) => {
    if (user.userType === 'volunteer') {
      return conversation.ngo.organizationName;
    }
    return `${conversation.volunteer.firstName} ${conversation.volunteer.lastName}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>
      
      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '70vh', overflow: 'auto' }}>
            <List>
              {conversations.map((conversation) => (
                <React.Fragment key={conversation._id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={selectedChat?._id === conversation._id}
                      onClick={() => setSelectedChat(conversation)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={getParticipantName(conversation)}
                        secondary={conversation.opportunity.title}
                      />
                      {conversation.unreadCount > 0 && (
                        <Badge
                          badgeContent={conversation.unreadCount}
                          color="primary"
                          sx={{ ml: 2 }}
                        >
                          <MessageIcon color="action" />
                        </Badge>
                      )}
                    </ListItemButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
              {conversations.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No conversations yet"
                    secondary="Your chat conversations will appear here"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          {selectedChat ? (
            <Chat
              opportunityId={selectedChat.opportunity._id}
              receiverId={user.userType === 'volunteer' ? selectedChat.ngo._id : selectedChat.volunteer._id}
              receiverName={getParticipantName(selectedChat)}
            />
          ) : (
            <Paper
              sx={{
                height: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <MessageIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start chatting
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;