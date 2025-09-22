import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  LocationOn,
  Schedule,
  Work,
  People,
  CalendarToday,
  Business,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { user, userType, isAuthenticated } = useAuth();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [userApplication, setUserApplication] = useState(null);

  // Fetch opportunity data initially and refresh every 30 seconds
  useEffect(() => {
    fetchOpportunity();
    const intervalId = setInterval(fetchOpportunity, 30000);
    return () => clearInterval(intervalId);
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      setLoading(true);
      const [opportunityResponse, applicationsResponse] = await Promise.all([
        axios.get(`/api/opportunities/${id}`),
        isAuthenticated && userType === 'volunteer' ? axios.get('/api/users/applications') : Promise.resolve(null)
      ]);
      
      setOpportunity(opportunityResponse.data.opportunity);
      
      if (applicationsResponse) {
        const existingApplication = applicationsResponse.data.applications.find(
          app => app.opportunity._id === id
        );
        setUserApplication(existingApplication);
      }
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      setError('Failed to load opportunity details');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }

    if (userType !== 'volunteer') {
      setError('Only volunteers can apply for opportunities');
      return;
    }

    setApplying(true);
    try {
      await axios.post(`/api/users/apply/${id}`, {
        coverLetter: coverLetter.trim()
      });
      setApplicationSuccess(true);
      setApplyDialogOpen(false);
      setCoverLetter('');
      // Refresh opportunity data to update application count
      fetchOpportunity();
    } catch (error) {
      console.error('Error applying:', error);
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && !opportunity) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!opportunity) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">Opportunity not found</Alert>
      </Container>
    );
  }

  // Mock data structure for backward compatibility
  const mockOpportunity = {
    _id: id,
    title: 'Web Development for Education Platform',
    description: 'Help us build an online learning platform for underprivileged children. We need skilled developers to create responsive web applications using modern technologies. This is a great opportunity to use your technical skills for social good while gaining experience in educational technology.\n\nYou will be working with our team to develop features that will directly impact the learning experience of thousands of children. The platform will include interactive lessons, progress tracking, and gamification elements to make learning engaging and effective.',
    category: 'Technology',
    location: { 
      type: 'Remote', 
      address: { 
        city: 'Mumbai', 
        state: 'Maharashtra',
        street: '123 Tech Park',
        zipCode: '400001',
        country: 'India'
      } 
    },
    duration: '3 months',
    timeCommitment: 'Part-time',
    skillsRequired: [
      { name: 'React', level: 'Intermediate', description: 'Building user interfaces' },
      { name: 'Node.js', level: 'Beginner', description: 'Backend development' },
      { name: 'MongoDB', level: 'Beginner', description: 'Database management' }
    ],
    requirements: {
      minAge: 18,
      education: 'Bachelor\'s Degree',
      experience: '1-2 years',
      languages: ['English', 'Hindi'],
      additionalRequirements: 'Must have own laptop and reliable internet connection'
    },
    benefits: ['Certificate', 'Letter of Recommendation', 'Skill Development', 'Networking'],
    ngo: {
      _id: 'ngo1',
      organizationName: 'Education for All',
      description: 'We are dedicated to providing quality education to underprivileged children across India.',
      logo: '',
      address: { city: 'Mumbai', state: 'Maharashtra' },
      website: 'https://educationforall.org',
      focusAreas: ['Education', 'Technology'],
      establishedYear: 2015
    },
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    applicationDeadline: '2024-01-15',
    maxVolunteers: 5,
    currentVolunteers: 2,
    views: 156,
    status: 'Active'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDeadlinePassed = new Date() > new Date(opportunity.applicationDeadline);
  const isFull = opportunity.currentVolunteers >= opportunity.maxVolunteers;
  const canApply = !isDeadlinePassed && !isFull && opportunity.status === 'Active' && userType === 'volunteer';

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Success Message */}
      {applicationSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Application submitted successfully! The NGO will review your application and get back to you.
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {opportunity.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="h6" color="text.secondary">
                  {opportunity.ngo.organizationName}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={opportunity.category}
                  color="primary"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={opportunity.location.type}
                  variant="outlined"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Chip
                  label={opportunity.status}
                  color={opportunity.status === 'Active' ? 'success' : 'default'}
                  sx={{ mr: 1, mb: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About this Opportunity
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
                {opportunity.description}
              </Typography>
            </Box>

            {/* Skills Required */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Skills Required
              </Typography>
              <Grid container spacing={2}>
                {opportunity.skillsRequired.map((skill, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          {skill.name}
                        </Typography>
                        <Chip
                          label={skill.level}
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {skill.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Requirements */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Requirements
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Minimum Age:</strong> {opportunity.requirements.minAge} years
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Education:</strong> {opportunity.requirements.education}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Experience:</strong> {opportunity.requirements.experience}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Languages:</strong> {opportunity.requirements.languages.join(', ')}
                  </Typography>
                </Grid>
                {opportunity.requirements.additionalRequirements && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Additional Requirements:</strong> {opportunity.requirements.additionalRequirements}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Benefits */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                What You'll Get
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {opportunity.benefits.map((benefit, index) => (
                  <Chip
                    key={index}
                    label={benefit}
                    variant="outlined"
                    color="secondary"
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Info
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {opportunity.location.type === 'Remote' ? 'Remote' : 
                   `${opportunity.location.address.city}, ${opportunity.location.address.state}`}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Schedule sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {opportunity.duration} • {opportunity.timeCommitment}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <People sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                  Starts {formatDate(opportunity.startDate)}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Application Deadline:</strong><br />
              {formatDate(opportunity.applicationDeadline)}
            </Typography>

            {!canApply && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {isDeadlinePassed ? 'Application deadline has passed' : 
                 isFull ? 'This opportunity is full' : 'Applications are closed'}
              </Typography>
            )}

            {userApplication ? (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Application Status:
                </Typography>
                <Chip
                  label={userApplication.status}
                  color={
                    userApplication.status === 'Accepted' ? 'success' :
                    userApplication.status === 'Under Review' ? 'info' :
                    userApplication.status === 'Pending' ? 'warning' :
                    'default'
                  }
                  sx={{ width: '100%', height: 40 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Applied on {formatDate(userApplication.appliedAt)}
                </Typography>
              </Box>
            ) : (
              <Button
                variant="contained"
                fullWidth
                size="large"
                disabled={!canApply}
                onClick={() => setApplyDialogOpen(true)}
                sx={{ mb: 2 }}
              >
                {!isAuthenticated ? 'Login to Apply' :
                 userType !== 'volunteer' ? 'Volunteers Only' :
                 canApply ? 'Apply Now' : 'Cannot Apply'}
              </Button>
            )}
          </Paper>

          {/* NGO Info */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              About {opportunity.ngo.organizationName}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {opportunity.ngo.description}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Established:</strong> {opportunity.ngo.establishedYear}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Focus Areas:</strong> {opportunity.ngo.focusAreas.join(', ')}
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              size="small"
              href={opportunity.ngo.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Website
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Application Dialog */}
      <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for this Opportunity</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            You are applying for: <strong>{opportunity.title}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Cover Letter (Optional)"
            placeholder="Tell the NGO why you're interested in this opportunity and what you can contribute..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplyDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleApply}
            variant="contained"
            disabled={applying}
          >
            {applying ? <CircularProgress size={24} /> : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OpportunityDetail;
