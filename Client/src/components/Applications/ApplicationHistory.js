import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import axios from 'axios';

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/api/users/applications');
      console.log('Fetched applications:', response.data);
      
      // Sort applications by date (newest first) and ensure status is set
      const sortedApplications = response.data.applications
        .map(app => ({
          ...app,
          status: app.status || 'Pending' // Ensure status is always set
        }))
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
      
      setApplications(sortedApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load application history');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initially and set up refresh interval
  useEffect(() => {
    fetchApplications();
    const intervalId = setInterval(fetchApplications, 30000); // Refresh every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'under review': return 'info';
      case 'accepted': return 'success';
      case 'rejected': return 'error';
      case 'withdrawn': return 'default';
      default: return 'warning';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        My Applications
      </Typography>

      {applications.length === 0 ? (
        <Typography color="text.secondary">
          You haven't applied to any opportunities yet.
        </Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Opportunity</TableCell>
                <TableCell>Organization</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Feedback</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application._id}>
                  <TableCell>
                    <Typography variant="body2">
                      {application.opportunity.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {application.opportunity.ngo.organizationName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(application.appliedAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Chip
                        label={application.status}
                        color={getStatusColor(application.status)}
                        size="small"
                      />
                      {application.reviewedAt && (
                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                          Updated: {formatDate(application.reviewedAt)}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    {application.feedback ? (
                      <Tooltip title={application.feedback}>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {application.feedback}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        {application.status === 'Pending' ? 'Awaiting review' : 'No feedback provided'}
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default ApplicationHistory;