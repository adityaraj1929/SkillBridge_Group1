import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import ChatWindow from '../../components/Chat/ChatWindow';
import { useChat } from '../../contexts/ChatContext';

const Chat = () => {
  const {
    chatPartners,
    selectedPartner,
    selectPartner,
    socket,
    fetchChatPartners,
  } = useChat();

  useEffect(() => {
    console.log('Chat component mounted, fetching partners...');
    fetchChatPartners();
  }, [fetchChatPartners]);

  useEffect(() => {
    console.log('Chat partners updated:', chatPartners);
  }, [chatPartners]);

  const renderChatList = () => {
    if (!chatPartners) {
      return (
        <Box p={3}>
          <Typography color="textSecondary" align="center">
            Loading chat partners...
          </Typography>
        </Box>
      );
    }

    if (chatPartners.length === 0) {
      return (
        <Box p={3}>
          <Typography color="textSecondary" align="center">
            No chat partners available. 
            <Typography variant="body2" color="textSecondary" mt={1}>
              Apply to opportunities and get accepted to start chatting!
            </Typography>
          </Typography>
        </Box>
      );
    }

    return (
      <List>
        {chatPartners.map((partner) => {
          console.log('Rendering chat partner:', partner);
          return (
            <React.Fragment key={partner._id}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedPartner?._id === partner._id}
                  onClick={() => {
                    console.log('Selecting chat partner:', partner);
                    selectPartner(partner);
                  }}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      '&:hover': {
                        backgroundColor: 'primary.light',
                      },
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={partner.logo || partner.profilePicture}>
                      {(partner.name || '?')[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={partner.name}
                    secondary={
                      <React.Fragment>
                        <Typography component="span" variant="body2">
                          {partner.opportunities && partner.opportunities.length > 0
                            ? `${partner.opportunities.length} active ${partner.opportunities.length === 1 ? 'opportunity' : 'opportunities'}`
                            : 'No active opportunities'}
                        </Typography>
                      </React.Fragment>
                    }
                    primaryTypographyProps={{
                      color: selectedPartner?._id === partner._id ? 'primary' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
    );
  };

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', p: 2 }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Chat List */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              overflow: 'auto',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ 
              p: 2, 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'primary.main',
              color: 'primary.contrastText'
            }}>
              <Typography variant="h6">
                Conversations
              </Typography>
            </Box>
            {renderChatList()}
          </Paper>
        </Grid>

        {/* Chat Window */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default'
            }}
          >
            {selectedPartner ? (
              <ChatWindow selectedPartner={selectedPartner} socket={socket} />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100%"
              >
                <Box textAlign="center" p={3}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Choose a chat from the list to start messaging
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Chat;