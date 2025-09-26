import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  People,
  Work,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ManageOpportunities = () => {
  const { userType } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (tabValue === 0) {
      fetchOpportunities();
    } else {
      fetchApplications();
    }
  }, [tabValue]);

  // Redirect if not NGO
  if (userType !== 'ngo') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Access denied. This page is for NGOs only.</Alert>
      </Container>
    );
  }

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ngos/opportunities');
      setOpportunities(response.data.opportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      setError('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/ngos/applications');
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !newStatus) return;

    setUpdating(true);
    try {
      await axios.put(`/api/ngos/applications/${selectedApplication._id}/status`, {
        status: newStatus,
        feedback: feedback.trim()
      });
      
      setStatusDialogOpen(false);
      setSelectedApplication(null);
      setNewStatus('');
      setFeedback('');
      fetchApplications(); // Refresh applications
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Under Review': return 'info';
      case 'Accepted': return 'success';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  const renderOpportunities = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Your Opportunities</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component={Link}
          to="/opportunities/create"
        >
          Create New Opportunity
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {opportunities.map((opportunity) => (
            <Grid item xs={12} md={6} lg={4} key={opportunity._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {opportunity.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {opportunity.description.substring(0, 100)}...
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={opportunity.status}
                      color={opportunity.status === 'Active' ? 'success' : 'default'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={opportunity.category}
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <People sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {opportunity.applications?.length || 0} applications
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    <Work sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                    {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers
                  </Typography>
                </CardContent>
                
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    component={Link}
                    to={`/opportunities/${opportunity._id}`}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    disabled
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const renderApplications = () => (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Volunteer Applications
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Volunteer</TableCell>
                <TableCell>Opportunity</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {application.volunteer?.firstName} {application.volunteer?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {application.volunteer?.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {application.opportunityTitle}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {formatDate(application.appliedAt)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={application.status}
                      color={getStatusColor(application.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedApplication(application);
                        setNewStatus(application.status);
                        setStatusDialogOpen(true);
                      }}
                    >
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="My Opportunities" />
          <Tab label="Applications" />
        </Tabs>
      </Box>

      {tabValue === 0 ? renderOpportunities() : renderApplications()}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Review Application</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Volunteer:</strong> {selectedApplication.volunteer?.firstName} {selectedApplication.volunteer?.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Opportunity:</strong> {selectedApplication.opportunityTitle}
              </Typography>
              
              {selectedApplication.coverLetter && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Cover Letter:</strong>
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {selectedApplication.coverLetter}
                    </Typography>
                  </Paper>
                </Box>
              )}

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newStatus}
                  label="Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Under Review">Under Review</MenuItem>
                  <MenuItem value="Accepted">Accepted</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Feedback (Optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the volunteer..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleStatusUpdate} 
            variant="contained" 
            disabled={updating || !newStatus}
          >
            {updating ? <CircularProgress size={24} /> : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageOpportunities;
