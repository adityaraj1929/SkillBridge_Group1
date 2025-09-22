import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const steps = ['Basic Info', 'Requirements', 'Details & Benefits'];

const categories = [
  'Education', 'Healthcare', 'Environment', 'Poverty', 'Technology',
  'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other'
];

const skillOptions = [
  'Web Development', 'Mobile Development', 'Data Analysis', 'Graphic Design',
  'Content Writing', 'Digital Marketing', 'Project Management', 'Teaching',
  'Photography', 'Video Editing', 'Accounting', 'Legal Advice',
  'Medical Support', 'Event Planning', 'Translation', 'Research'
];

const benefitOptions = [
  'Certificate', 'Letter of Recommendation', 'Skill Development', 'Networking',
  'Travel Allowance', 'Accommodation', 'Meals', 'Stipend', 'Other'
];

const CreateOpportunity = () => {
  const { user, userType } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    watch,
  } = useForm({
    defaultValues: {
      skillsRequired: [],
      benefits: [],
      location: { type: 'On-site' },
    },
  });

  // Redirect if not NGO
  if (userType !== 'ngo') {
    navigate('/dashboard');
    return null;
  }

  const handleNext = async () => {
    const fieldsToValidate = getFieldsForStep(activeStep);
    const isStepValid = await trigger(fieldsToValidate);
    
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ['title', 'description', 'category', 'duration', 'timeCommitment'];
      case 1:
        return ['skillsRequired', 'maxVolunteers', 'startDate', 'applicationDeadline'];
      case 2:
        return ['location.type', 'location.address.city', 'location.address.state'];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setLoading(true);
    
    try {
      // Format skills data
      const formattedData = {
        ...data,
        skillsRequired: data.skillsRequired.map(skill => ({
          name: skill,
          level: 'Intermediate', // Default level
          description: `Experience in ${skill}`
        })),
        // Ensure dates are properly formatted
        startDate: new Date(data.startDate).toISOString(),
        applicationDeadline: new Date(data.applicationDeadline).toISOString(),
        endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      };

      const response = await axios.post('/api/opportunities', formattedData);
      
      if (response.data) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Create opportunity error:', error);
      setError(error.response?.data?.message || 'Failed to create opportunity');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Opportunity Title"
                {...register('title', {
                  required: 'Title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters',
                  },
                })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Description"
                multiline
                rows={4}
                placeholder="Describe the volunteer opportunity, what volunteers will do, and the impact they'll make..."
                {...register('description', {
                  required: 'Description is required',
                  maxLength: {
                    value: 2000,
                    message: 'Description cannot exceed 2000 characters',
                  },
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  label="Category"
                  {...register('category', {
                    required: 'Category is required',
                  })}
                  error={!!errors.category}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Duration</InputLabel>
                <Select
                  label="Duration"
                  {...register('duration', {
                    required: 'Duration is required',
                  })}
                  error={!!errors.duration}
                >
                  <MenuItem value="1-2 weeks">1-2 weeks</MenuItem>
                  <MenuItem value="1 month">1 month</MenuItem>
                  <MenuItem value="2-3 months">2-3 months</MenuItem>
                  <MenuItem value="6 months">6 months</MenuItem>
                  <MenuItem value="1 year">1 year</MenuItem>
                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Time Commitment</InputLabel>
                <Select
                  label="Time Commitment"
                  {...register('timeCommitment', {
                    required: 'Time commitment is required',
                  })}
                  error={!!errors.timeCommitment}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Weekends">Weekends</MenuItem>
                  <MenuItem value="Flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="skillsRequired"
                control={control}
                rules={{ required: 'Please select at least one skill' }}
                render={({ field }) => (
                  <FormControl fullWidth required>
                    <InputLabel>Skills Required</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Skills Required" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      error={!!errors.skillsRequired}
                    >
                      {skillOptions.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.skillsRequired && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.skillsRequired.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Maximum Volunteers"
                type="number"
                {...register('maxVolunteers', {
                  required: 'Maximum volunteers is required',
                  min: {
                    value: 1,
                    message: 'At least 1 volunteer position is required',
                  },
                })}
                error={!!errors.maxVolunteers}
                helperText={errors.maxVolunteers?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Age"
                type="number"
                {...register('requirements.minAge', {
                  min: {
                    value: 16,
                    message: 'Minimum age cannot be less than 16',
                  },
                })}
                error={!!errors.requirements?.minAge}
                helperText={errors.requirements?.minAge?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('startDate', {
                  required: 'Start date is required',
                })}
                error={!!errors.startDate}
                helperText={errors.startDate?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Application Deadline"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('applicationDeadline', {
                  required: 'Application deadline is required',
                })}
                error={!!errors.applicationDeadline}
                helperText={errors.applicationDeadline?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Date (Optional)"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('endDate')}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Location Type</InputLabel>
                <Select
                  label="Location Type"
                  {...register('location.type', {
                    required: 'Location type is required',
                  })}
                  error={!!errors.location?.type}
                >
                  <MenuItem value="Remote">Remote</MenuItem>
                  <MenuItem value="On-site">On-site</MenuItem>
                  <MenuItem value="Hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {watch('location.type') !== 'Remote' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="City"
                    {...register('location.address.city', {
                      required: 'City is required for on-site/hybrid opportunities',
                    })}
                    error={!!errors.location?.address?.city}
                    helperText={errors.location?.address?.city?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="State"
                    {...register('location.address.state', {
                      required: 'State is required for on-site/hybrid opportunities',
                    })}
                    error={!!errors.location?.address?.state}
                    helperText={errors.location?.address?.state?.message}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address (Optional)"
                    {...register('location.address.street')}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Controller
                name="benefits"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Benefits</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Benefits" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {benefitOptions.map((benefit) => (
                        <MenuItem key={benefit} value={benefit}>
                          {benefit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Additional Requirements (Optional)"
                multiline
                rows={3}
                placeholder="Any additional requirements or qualifications..."
                {...register('requirements.additionalRequirements')}
              />
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ marginTop: 4, marginBottom: 8 }}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Create New Opportunity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Post a volunteer opportunity to connect with skilled volunteers
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Opportunity'
                  )}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateOpportunity;
