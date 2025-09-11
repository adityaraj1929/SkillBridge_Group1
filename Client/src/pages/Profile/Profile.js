import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, userType, updateUser } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleEditClick = () => {
    // Only include editable fields based on user type
    const editableFields = userType === 'volunteer' 
      ? {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          bio: user.bio || '',
          availability: user.availability || 'Flexible',
        }
      : {
          organizationName: user.organizationName || '',
          phone: user.phone || '',
          description: user.description || '',
        };
    
    setFormData(editableFields);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setError('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const endpoint = userType === 'volunteer' ? '/api/users/profile' : '/api/ngos/profile';
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.put(endpoint, formData, config);

      if (res.data) {
        updateUser(res.data);
        setEditOpen(false);
        setSuccessMessage('Profile updated successfully!');
        setShowSuccess(true);
      } else {
        throw new Error('No data received from server');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to update profile. Please try again.'
      );
    }
    setLoading(false);
  };
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  const renderVolunteerProfile = () => (
    <>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 100, height: 100, fontSize: '2rem' }}
              src={user.profilePicture}
            >
              {user.firstName?.[0]}{user.lastName?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user.bio || 'No bio provided'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Email />}
                label={user.email}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Phone />}
                label={user.phone}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<LocationOn />}
                label={`${user.address?.city}, ${user.address?.state}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Edit />}
              size="large"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Skills */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            {user.skills && user.skills.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={`${skill.name} (${skill.level})`}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No skills added</Typography>
            )}
          </Paper>
        </Grid>

        {/* Availability & Preferences */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Availability & Preferences
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Availability:</strong> {user.availability || 'Not specified'}
              </Typography>
            </Box>
            {user.preferredCauses && user.preferredCauses.length > 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <strong>Preferred Causes:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {user.preferredCauses.map((cause, index) => (
                    <Chip
                      key={index}
                      label={cause}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Education */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Education
            </Typography>
            {user.education && user.education.length > 0 ? (
              user.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {edu.institution} • {edu.year}
                  </Typography>
                  {index < user.education.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No education information</Typography>
            )}
          </Paper>
        </Grid>

        {/* Experience */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            {user.experience && user.experience.length > 0 ? (
              user.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    {exp.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {exp.company} • {exp.duration}
                  </Typography>
                  {exp.description && (
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {exp.description}
                    </Typography>
                  )}
                  {index < user.experience.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No experience information</Typography>
            )}
          </Paper>
        </Grid>

        {/* Application History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Application History
            </Typography>
            {user.appliedOpportunities && user.appliedOpportunities.length > 0 ? (
              <Typography color="text.secondary">
                {user.appliedOpportunities.length} applications submitted
              </Typography>
            ) : (
              <Typography color="text.secondary">
                No applications yet. Start exploring opportunities!
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  const renderNGOProfile = () => (
    <>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              sx={{ width: 100, height: 100, fontSize: '1.5rem' }}
              src={user.logo}
            >
              {user.organizationName?.[0]}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" gutterBottom>
              {user.organizationName}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<Email />}
                label={user.email}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<Phone />}
                label={user.phone}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<LocationOn />}
                label={`${user.address?.city}, ${user.address?.state}`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Edit />}
              size="large"
              onClick={handleEditClick}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Organization Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Organization Details
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Registration Number:</strong> {user.registrationNumber}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Established:</strong> {user.establishedYear}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Type:</strong> {user.organizationType}
              </Typography>
            </Box>
            {user.website && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Website:</strong>{' '}
                  <a href={user.website} target="_blank" rel="noopener noreferrer">
                    {user.website}
                  </a>
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Focus Areas */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Focus Areas
            </Typography>
            {user.focusAreas && user.focusAreas.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {user.focusAreas.map((area, index) => (
                  <Chip
                    key={index}
                    label={area}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">No focus areas specified</Typography>
            )}
          </Paper>
        </Grid>

        {/* Mission */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mission Statement
            </Typography>
            <Typography variant="body1">
              {user.mission || 'No mission statement provided'}
            </Typography>
          </Paper>
        </Grid>

        {/* Contact Person */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Person
            </Typography>
            {user.contactPerson ? (
              <Box>
                <Typography variant="subtitle1">
                  {user.contactPerson.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.contactPerson.designation}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.contactPerson.email} • {user.contactPerson.phone}
                </Typography>
              </Box>
            ) : (
              <Typography color="text.secondary">No contact person information</Typography>
            )}
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistics
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Opportunities:</strong> {user.totalOpportunities || 0}
              </Typography>
            </Box>
            <Box sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Total Volunteers:</strong> {user.totalVolunteers || 0}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                <strong>Verification Status:</strong>{' '}
                <Chip
                  label={user.isVerified ? 'Verified' : 'Pending Verification'}
                  color={user.isVerified ? 'success' : 'warning'}
                  size="small"
                />
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {userType === 'volunteer' ? renderVolunteerProfile() : renderNGOProfile()}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          {error && <Typography color="error">{error}</Typography>}
          <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={userType === 'volunteer' ? 'First Name' : 'Organization Name'}
              name={userType === 'volunteer' ? 'firstName' : 'organizationName'}
              value={formData[userType === 'volunteer' ? 'firstName' : 'organizationName'] || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Bio/Description"
              name={userType === 'volunteer' ? 'bio' : 'description'}
              value={formData[userType === 'volunteer' ? 'bio' : 'description'] || ''}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile;
