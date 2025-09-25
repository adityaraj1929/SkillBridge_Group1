import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import { Handshake, People, Assignment, EmojiPeople } from '@mui/icons-material';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          About SkillBridge
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Connecting Skilled Volunteers with Meaningful Opportunities
        </Typography>
      </Box>

      {/* Mission Section */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          SkillBridge aims to create a meaningful connection between skilled volunteers and NGOs, 
          facilitating impactful social change through collaborative efforts. We believe that everyone 
          has valuable skills to contribute to society, and we're here to bridge the gap between 
          willing volunteers and organizations that need their expertise.
        </Typography>
      </Paper>

      {/* Key Features Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Handshake sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Skilled Volunteering
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Match your professional skills with organizations that need them most
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <People sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              NGO Partnerships
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Connect with verified NGOs working on meaningful causes
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <Assignment sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Project Matching
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Find projects that align with your skills and interests
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', textAlign: 'center' }}>
            <EmojiPeople sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Impact Tracking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Measure and celebrate the difference you make
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Impact Section */}
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Our Impact
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.main">
                1000+
              </Typography>
              <Typography variant="h6">Volunteers Connected</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.main">
                500+
              </Typography>
              <Typography variant="h6">NGOs Supported</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color="primary.main">
                2000+
              </Typography>
              <Typography variant="h6">Projects Completed</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutUs;