import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  VolunteerActivism,
  Business,
  Search,
  Group,
  TrendingUp,
  Verified,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Search color="primary" sx={{ fontSize: 40 }} />,
      title: 'Find Opportunities',
      description: 'Browse through hundreds of volunteer opportunities that match your skills and interests.',
    },
    {
      icon: <Group color="primary" sx={{ fontSize: 40 }} />,
      title: 'Connect with NGOs',
      description: 'Connect directly with verified NGOs and make a meaningful impact in your community.',
    },
    {
      icon: <TrendingUp color="primary" sx={{ fontSize: 40 }} />,
      title: 'Skill Development',
      description: 'Develop new skills while contributing to causes you care about.',
    },
    {
      icon: <Verified color="primary" sx={{ fontSize: 40 }} />,
      title: 'Verified Organizations',
      description: 'All NGOs are verified to ensure legitimate and impactful volunteer opportunities.',
    },
  ];

  const stats = [
    { number: '500+', label: 'Active Volunteers' },
    { number: '100+', label: 'Partner NGOs' },
    { number: '1000+', label: 'Opportunities Created' },
    { number: '50+', label: 'Cities Covered' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                component="h1"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Bridge Skills with Purpose
              </Typography>
              <Typography
                variant="h6"
                sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
              >
                Connect skilled volunteers with NGOs to create meaningful impact.
                Find opportunities that match your expertise and passion.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  component={Link}
                  to="/register/volunteer"
                  sx={{ px: 4, py: 1.5 }}
                >
                  Join as Volunteer
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  component={Link}
                  to="/opportunities"
                  sx={{ px: 4, py: 1.5, borderColor: 'white', color: 'white' }}
                >
                  Browse Opportunities
                </Button>
              </Box>
            </Grid>
            <Container maxWidth="lg" sx={{ mt: 6 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 4, // equal spacing between all boxes
                }}
              >
                {/* Box 1 */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    width: { xs: '100%', sm: '300px' },
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h4" gutterBottom>🌍</Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Empower Communities with Your Skills
                  </Typography>
                </Paper>

                {/* Box 2 */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    width: { xs: '100%', sm: '300px' },
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h4" gutterBottom>🤝</Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Collaborate with Purpose-Driven NGOs
                  </Typography>
                </Paper>

                {/* Box 3 */}
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    width: { xs: '100%', sm: '300px' },
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Typography variant="h4" gutterBottom>🚀</Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Build Impact & Grow Your Experience
                  </Typography>
                </Paper>
              </Box>
            </Container>

          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    sx={{ fontWeight: 'bold', mb: 1 }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Why Choose SkillBridge?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 8, backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Ready to Make a Difference?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of volunteers and NGOs creating positive change
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <VolunteerActivism color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    For Volunteers
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Use your skills to help NGOs achieve their mission
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/register/volunteer"
                    fullWidth
                  >
                    Join Now
                  </Button>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ textAlign: 'center', p: 3 }}>
                  <Business color="primary" sx={{ fontSize: 48, mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    For NGOs
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Find skilled volunteers to amplify your impact
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    to="/register/ngo"
                    fullWidth
                  >
                    Register NGO
                  </Button>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
