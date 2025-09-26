import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import RegisterVolunteer from './pages/Auth/RegisterVolunteer';
import RegisterNGO from './pages/Auth/RegisterNGO';
import Dashboard from './pages/Dashboard/Dashboard';
import Opportunities from './pages/Opportunities/Opportunities';
import OpportunityDetail from './pages/Opportunities/OpportunityDetail';
import CreateOpportunity from './pages/Opportunities/CreateOpportunity';
import ManageOpportunities from './pages/NGO/ManageOpportunities';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AboutUs from './pages/AboutUs/AboutUs';
import FAQs from './pages/FAQs/FAQs';
import Gallery from './pages/Gallery/Gallery';
import ContactUs from './pages/Contact/ContactUs';
import Messages from './pages/Messages/Messages';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff5983',
      dark: '#9a0036',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <ChatProvider>
            <Router>
            <div className="App">
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:resettoken" element={<ResetPassword />} />
                <Route path="/register/volunteer" element={<RegisterVolunteer />} />
                <Route path="/register/ngo" element={<RegisterNGO />} />
                <Route path="/opportunities" element={<Opportunities />} />
                <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<ContactUs />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/opportunities/create" element={
                  <ProtectedRoute requiredUserType="ngo">
                    <CreateOpportunity />
                  </ProtectedRoute>
                } />
                <Route path="/opportunities/manage" element={
                  <ProtectedRoute requiredUserType="ngo">
                    <ManageOpportunities />
                  </ProtectedRoute>
                } />
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
