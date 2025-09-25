import React, { useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';

const ContactUs = () => {
  useEffect(() => {
    // Redirect to Google Form
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSenEk6FTEj4THV9_nDmnPi_CX9C9zaN7f_WVzYNvki0xHr4Vg/viewform?usp=dialog";
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Redirecting to Contact Form...
        </Typography>
        <CircularProgress sx={{ mt: 4 }} />
      </Box>
    </Container>
  );
};

export default ContactUs;