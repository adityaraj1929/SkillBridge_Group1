import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Snackbar,
  Alert,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, LocationOn, Schedule, Work } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import CreateOpportunityDialog from './CreateOpportunityDialog';

const NGOOpportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch NGO's opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('/api/ngos/opportunities');
        setOpportunities(response.data.opportunities);
      } catch (err) {
        setError('Failed to fetch opportunities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  const handleEdit = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setFormData(opportunity);
    setEditOpen(true);
  };

  const handleDelete = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setDeleteOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.put(
        `/api/opportunities/${selectedOpportunity._id}`,
        formData
      );
      const updatedOpportunities = opportunities.map((opp) =>
        opp._id === selectedOpportunity._id ? response.data : opp
      );
      setOpportunities(updatedOpportunities);
      setEditOpen(false);
      setSuccessMessage('Opportunity updated successfully!');
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update opportunity');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/opportunities/${selectedOpportunity._id}`);
      setOpportunities(opportunities.filter(opp => opp._id !== selectedOpportunity._id));
      setDeleteOpen(false);
      setSuccessMessage('Opportunity deleted successfully!');
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete opportunity');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Opportunities</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => setCreateOpen(true)}
        >
          Create Opportunity
        </Button>
      </Box>

      <CreateOpportunityDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(newOpportunity) => {
          setOpportunities([newOpportunity, ...opportunities]);
          setSuccessMessage('Opportunity created successfully!');
          setShowSuccess(true);
        }}
      />

      <Grid container spacing={3}>
        {opportunities.map((opportunity) => (
          <Grid item xs={12} md={6} lg={4} key={opportunity._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {opportunity.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {opportunity.description}
                </Typography>
                <Typography variant="body2">
                  Status: {opportunity.status}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  size="small"
                  onClick={() => handleEdit(opportunity)}
                  color="primary"
                >
                  <Edit />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDelete(opportunity)}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Opportunity</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
            />
            {/* Add more fields as needed */}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Opportunity</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this opportunity? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default NGOOpportunities;
