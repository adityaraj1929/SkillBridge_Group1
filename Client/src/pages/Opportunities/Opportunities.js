import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import NGOOpportunities from './NGOOpportunities';
import {
  LocationOn,
  Schedule,
  Work,
  Search,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Opportunities = () => {
  const { userType } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(1);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const categories = [
    'Education', 'Healthcare', 'Environment', 'Poverty', 'Technology',
    'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other'
  ];

  // Fetch opportunities from API
  const fetchOpportunities = React.useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      });

      if (searchTerm) params.append('search', searchTerm);
      if (category) params.append('category', category);
      if (location) params.append('location', location);

      const response = await axios.get(`/api/opportunities?${params}`);

      setOpportunities(response.data.opportunities);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError('Failed to load opportunities. Please try again.');
    }
    
    setLoading(false);
  }, [page, searchTerm, category, location]);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  // Render NGO opportunities management if user is NGO
  if (userType === 'ngo') {
    return <NGOOpportunities />;
  }

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = () => {
    setPage(1);
    fetchOpportunities();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Volunteer Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find meaningful volunteer opportunities that match your skills and interests.
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search opportunities"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleSearch}
              sx={{ height: 56 }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">
          {total} opportunities found
        </Typography>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Opportunities Grid */}
          <Grid container spacing={3}>
            {opportunities.map((opportunity) => (
          <Grid item xs={12} md={6} lg={4} key={opportunity._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {opportunity.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {opportunity.ngo.organizationName}
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  {opportunity.description.length > 120
                    ? `${opportunity.description.substring(0, 120)}...`
                    : opportunity.description
                  }
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={opportunity.category}
                    size="small"
                    color="primary"
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={opportunity.location.type}
                    size="small"
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.location.address.city}, {opportunity.location.address.state}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.duration} • {opportunity.timeCommitment}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Work sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {opportunity.currentVolunteers}/{opportunity.maxVolunteers} volunteers
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Skills needed:
                  </Typography>
                  {opportunity.skillsRequired.slice(0, 2).map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill.name}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                  {opportunity.skillsRequired.length > 2 && (
                    <Chip
                      label={`+${opportunity.skillsRequired.length - 2} more`}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Apply by: {formatDate(opportunity.applicationDeadline)}
                </Typography>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  component={Link}
                  to={`/opportunities/${opportunity._id}`}
                  variant="contained"
                  fullWidth
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Opportunities;
