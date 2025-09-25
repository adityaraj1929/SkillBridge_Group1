import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link as MuiLink,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSendOTP = async (data) => {
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      setEmail(data.email);
      setUserType(data.userType);
      const response = await axios.post('/api/auth/forgot-password', data);
      setMessage(response.data.message);
      setActiveStep(1);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email,
        otp,
        userType
      });
      setResetToken(response.data.resetToken);
      navigate(`/reset-password/${response.data.resetToken}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Send OTP</StepLabel>
            </Step>
            <Step>
              <StepLabel>Verify OTP</StepLabel>
            </Step>
          </Stepper>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeStep === 0 
                ? "Enter your email address and we'll send you an OTP"
                : "Enter the OTP sent to your email"}
            </Typography>
          </Box>

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {activeStep === 0 ? (
            <Box component="form" onSubmit={handleSubmit(handleSendOTP)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="userType-label">Account Type</InputLabel>
                <Select
                  labelId="userType-label"
                  id="userType"
                  label="Account Type"
                  {...register('userType', {
                    required: 'Please select account type',
                  })}
                  error={!!errors.userType}
                >
                  <MenuItem value="volunteer">Volunteer</MenuItem>
                  <MenuItem value="ngo">NGO</MenuItem>
                </Select>
                {errors.userType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                    {errors.userType.message}
                  </Typography>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Send OTP'
                )}
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="otp"
                label="Enter OTP"
                name="otp"
                autoComplete="off"
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={!!error}
                helperText={error}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading || !otp}
                onClick={handleVerifyOTP}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Verify OTP'
                )}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={() => {
                  setActiveStep(0);
                  setOtp('');
                  setError('');
                  setMessage('');
                }}
              >
                Back to Email
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Remember your password?{' '}
              <MuiLink component={Link} to="/login" variant="body2">
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
