import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  Paper
} from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const ChatList = ({ onSelectChat }) => {
  const [chatPartners, setChatPartners] = useState([]);
  const { userType, user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatPartners = async () => {
      try {
        const endpoint = userType === 'volunteer' 
          ? '/api/chat/volunteer/chat-partners'
          : '/api/chat/ngo/chat-partners';
        
        const response = await axios.get(endpoint);
        setChatPartners(response.data);
      } catch (error) {
        console.error('Error fetching chat partners:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userType) {
      fetchChatPartners();
    }
  }, [userType, user]);

  if (loading) {
    return <Typography>Loading conversations...</Typography>;
  }

  if (chatPartners.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">
          {userType === 'volunteer' 
            ? 'No accepted opportunities yet. Apply to opportunities to start chatting with NGOs!'
            : 'No accepted volunteers yet. Accept volunteer applications to start chatting!'}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ maxHeight: '100vh', overflow: 'auto' }}>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {chatPartners.map((partner, index) => (
          <React.Fragment key={partner.id}>
            <ListItem disablePadding alignItems="flex-start">
              <ListItemButton
                onClick={() => onSelectChat({
                  partnerId: partner.id,
                  partnerName: partner.name,
                  opportunityId: partner.opportunityId
                })}
              >
                <ListItemAvatar>
                  <Avatar>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={partner.name}
                  secondary={
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                      {partner.opportunityTitle}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
            {index < chatPartners.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default ChatList;