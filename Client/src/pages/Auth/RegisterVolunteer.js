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
  Link as MuiLink,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';

const steps = ['Personal Info', 'Address', 'Skills & Preferences'];

const skillOptions = [
  'Web Development', 'Mobile Development', 'Data Analysis', 'Graphic Design',
  'Content Writing', 'Digital Marketing', 'Project Management', 'Teaching',
  'Photography', 'Video Editing', 'Accounting', 'Legal Advice',
  'Medical Support', 'Event Planning', 'Translation', 'Research'
];

const causeOptions = [
  'Education', 'Healthcare', 'Environment', 'Poverty', 'Technology',
  'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief'
];

const RegisterVolunteer = () => {
  const { registerVolunteer, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      skills: [],
      preferredCauses: [],
    },
  });

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
        return ['firstName', 'lastName', 'email', 'password', 'phone'];
      case 1:
        return ['address.street', 'address.city', 'address.state', 'address.zipCode'];
      case 2:
        return ['availability', 'bio'];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    setError('');
    
    // Transform skills array to the expected format
    const formattedData = {
      ...data,
      skills: data.skills.map(skill => ({
        name: skill,
        level: 'Intermediate', // Default level, can be enhanced later
      })),
    };
    
    const result = await registerVolunteer(formattedData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      if (result.errors && result.errors.length > 0) {
        setError(result.errors.map(err => err.msg).join(', '));
      }
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                {...register('firstName', {
                  required: 'First name is required',
                  maxLength: {
                    value: 50,
                    message: 'First name cannot exceed 50 characters',
                  },
                })}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                {...register('lastName', {
                  required: 'Last name is required',
                  maxLength: {
                    value: 50,
                    message: 'Last name cannot exceed 50 characters',
                  },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Password"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Phone Number"
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Street Address"
                {...register('address.street', {
                  required: 'Street address is required',
                })}
                error={!!errors.address?.street}
                helperText={errors.address?.street?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="City"
                {...register('address.city', {
                  required: 'City is required',
                })}
                error={!!errors.address?.city}
                helperText={errors.address?.city?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="State"
                {...register('address.state', {
                  required: 'State is required',
                })}
                error={!!errors.address?.state}
                helperText={errors.address?.state?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Zip Code"
                {...register('address.zipCode', {
                  required: 'Zip code is required',
                })}
                error={!!errors.address?.zipCode}
                helperText={errors.address?.zipCode?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                defaultValue="India"
                {...register('address.country')}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Availability</InputLabel>
                <Select
                  label="Availability"
                  {...register('availability', {
                    required: 'Availability is required',
                  })}
                  error={!!errors.availability}
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="Weekends">Weekends</MenuItem>
                  <MenuItem value="Flexible">Flexible</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Skills</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Skills" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {skillOptions.map((skill) => (
                        <MenuItem key={skill} value={skill}>
                          {skill}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="preferredCauses"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Preferred Causes</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Preferred Causes" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {causeOptions.map((cause) => (
                        <MenuItem key={cause} value={cause}>
                          {cause}
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
                label="Bio"
                multiline
                rows={4}
                placeholder="Tell us about yourself, your interests, and what motivates you to volunteer..."
                {...register('bio', {
                  maxLength: {
                    value: 500,
                    message: 'Bio cannot exceed 500 characters',
                  },
                })}
                error={!!errors.bio}
                helperText={errors.bio?.message}
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
              Join as a Volunteer
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create your volunteer profile and start making a difference
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
                    'Register'
                  )}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <MuiLink component={Link} to="/login">
                Sign in here
              </MuiLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterVolunteer;
