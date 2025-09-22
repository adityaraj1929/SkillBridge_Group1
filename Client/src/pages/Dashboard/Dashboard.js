import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work,
  People,
  TrendingUp,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicationHistory from '../../components/Applications/ApplicationHistory';

const Dashboard = () => {
  const { user, userType } = useAuth();

  const volunteerStats = [
    {
      title: 'Applications Sent',
      value: user?.appliedOpportunities?.length || 0,
      icon: <Work color="primary" />,
      color: 'primary.main',
    },
    {
      title: 'Active Applications',
      value: user?.appliedOpportunities?.filter(app => app.status === 'Pending' || app.status === 'Under Review')?.length || 0,
      icon: <TrendingUp color="secondary" />,
      color: 'secondary.main',
    },
    {
      title: 'Accepted',
      value: user?.appliedOpportunities?.filter(app => app.status === 'Accepted')?.length || 0,
      icon: <People color="success" />,
      color: 'success.main',
    },
  ];

  const ngoStats = [
    {
      title: 'Total Opportunities',
      value: user?.totalOpportunities || 0,
      icon: <Work color="primary" />,
      color: 'primary.main',
    },
    {
      title: 'Active Opportunities',
      value: user?.opportunities?.filter(opp => opp.status === 'Active')?.length || 0,
      icon: <TrendingUp color="secondary" />,
      color: 'secondary.main',
    },
    {
      title: 'Total Volunteers',
      value: user?.totalVolunteers || 0,
      icon: <People color="success" />,
      color: 'success.main',
    },
  ];

  const stats = userType === 'volunteer' ? volunteerStats : ngoStats;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome back, {userType === 'volunteer' ? `${user?.firstName} ${user?.lastName}` : user?.organizationName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userType === 'volunteer' 
            ? 'Discover new volunteer opportunities and track your applications.'
            : 'Manage your opportunities and connect with skilled volunteers.'
          }
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h3" component="div" sx={{ color: stat.color }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {userType === 'volunteer' ? (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/opportunities"
                    startIcon={<Work />}
                    fullWidth
                  >
                    Browse Opportunities
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/profile"
                    startIcon={<People />}
                    fullWidth
                  >
                    Update Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/opportunities/create"
                    startIcon={<Work />}
                    fullWidth
                  >
                    Create New Opportunity
                  </Button>
                  <Button
                    variant="outlined"
                    component={Link}
                    to="/profile"
                    startIcon={<People />}
                    fullWidth
                  >
                    Update Organization Profile
                  </Button>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userType === 'volunteer' 
                ? 'Your recent applications and updates will appear here.'
                : 'Recent applications and opportunity updates will appear here.'
              }
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No recent activity to display.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recommendations/Opportunities Section */}
      <Box sx={{ mt: 4 }}>
        {userType === 'volunteer' && <ApplicationHistory />}

        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            {userType === 'volunteer' ? 'Recommended for You' : 'Your Opportunities'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {userType === 'volunteer' 
              ? 'Based on your skills and interests, here are some opportunities you might like.'
              : 'Manage your posted opportunities and track applications.'
            }
          </Typography>
          <Button
            variant="outlined"
            component={Link}
            to={userType === 'volunteer' ? '/opportunities' : '/opportunities/manage'}
          >
            {userType === 'volunteer' ? 'View All Opportunities' : 'Manage Opportunities'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
