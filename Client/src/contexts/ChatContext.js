import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Fetch chat partners
  const fetchChatPartners = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const endpoint = user.organizationName
        ? '/api/chat/ngo/chat-partners'
        : '/api/chat/volunteer/chat-partners';
      
      console.log('Fetching chat partners with endpoint:', endpoint);
      const token = localStorage.getItem('token');
      console.log('Using token:', token);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Chat partners response:', data);
      
      if (data.success) {
        setChatPartners(data.partners);
      } else {
        console.error('Failed to fetch chat partners:', data.message);
      }
    } catch (error) {
      console.error('Error fetching chat partners:', error);
    }
  }, [isAuthenticated, user]);

  // Socket connection and message handling
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Initializing socket connection...');
      
      // Connect to socket server
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket'],
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
      });

      // Identify user to socket server
      const userInfo = {
        userId: user._id,
        userType: user.userType || (user.organizationName ? 'ngo' : 'volunteer')
      };
      console.log('Joining chat with user info:', userInfo);
      
      newSocket.emit('join', userInfo);

      // Listen for private messages
      newSocket.on('receiveMessage', ({ from, content, timestamp }) => {
        setMessages(prev => ({
          ...prev,
          [from]: [...(prev[from] || []), { 
            senderId: from, 
            content, 
            timestamp: new Date(timestamp)
          }]
        }));

        // Update unread count if message is from someone other than selected partner
        if (selectedPartner?._id !== from) {
          setUnreadCounts(prev => ({
            ...prev,
            [from]: (prev[from] || 0) + 1
          }));
        }
      });

      // Fetch chat partners when connecting
      fetchChatPartners();

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user, selectedPartner, fetchChatPartners]);

  const sendMessage = (to, content) => {
    if (!socket || !to) {
      console.error('Cannot send message: ' + (!socket ? 'No socket connection' : 'No recipient specified'));
      return;
    }

    const messageData = {
      to,
      content,
      timestamp: new Date()
    };

    socket.emit('sendMessage', messageData);

    // Add message to local state
    setMessages(prev => ({
      ...prev,
      [to]: [...(prev[to] || []), {
        senderId: user._id,
        content,
        timestamp: new Date()
      }]
    }));
  };

  // Mark messages as read when selecting a partner
  const selectPartner = (partner) => {
    setSelectedPartner(partner);
    if (partner) {
      setUnreadCounts(prev => ({
        ...prev,
        [partner._id]: 0
      }));
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      sendMessage, 
      selectedPartner,
      selectPartner,
      chatPartners,
      unreadCounts,
      fetchChatPartners
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;