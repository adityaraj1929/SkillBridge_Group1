import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState({});
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      const newSocket = io('http://localhost:5000', {
        transports: ['websocket']
      });

      // Identify user to socket server
      newSocket.emit('join', {
        userId: user._id,
        userType: user.userType || (user.organizationName ? 'ngo' : 'volunteer')
      });

      // Listen for private messages
      newSocket.on('private-message', ({ from, message, timestamp }) => {
        setMessages(prev => ({
          ...prev,
          [from]: [...(prev[from] || []), { from, message, timestamp }]
        }));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [isAuthenticated, user]);

  const sendMessage = (to, message) => {
    if (socket) {
      socket.emit('private-message', { to, message });
      // Add message to local state
      setMessages(prev => ({
        ...prev,
        [to]: [...(prev[to] || []), {
          from: user._id,
          message,
          timestamp: new Date()
        }]
      }));
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;