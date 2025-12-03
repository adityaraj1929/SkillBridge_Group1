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

const steps = ['Organization Info', 'Contact Details', 'Mission & Focus'];

const organizationTypes = [
  'NGO', 'Non-Profit', 'Charity', 'Foundation', 'Trust', 'Society', 'Other'
];

const focusAreaOptions = [
  'Education', 'Healthcare', 'Environment', 'Poverty', 'Technology',
  'Arts', 'Sports', 'Human Rights', 'Animal Welfare', 'Disaster Relief', 'Other'
];

const RegisterNGO = () => {
  const { registerNGO, loading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      organizationName: '',
      email: '',
      password: '',
      registrationNumber: '',
      establishedYear: '',
      organizationType: '',
      phone: '',
      website: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      },
      contactPerson: {
        name: '',
        designation: '',
        email: '',
        phone: '',
      },
      mission: '',
      description: '',
      focusAreas: [],
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
        return ['organizationName', 'email', 'password', 'registrationNumber', 'establishedYear', 'organizationType'];
      case 1:
        return ['phone', 'address.street', 'address.city', 'address.state', 'address.zipCode', 'contactPerson.name', 'contactPerson.designation', 'contactPerson.email', 'contactPerson.phone'];
      case 2:
        return ['mission', 'description', 'focusAreas'];
      default:
        return [];
    }
  };

  const onSubmit = async (data) => {
    setError('');
    
    const result = await registerNGO(data);
    
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Organization Name"
                {...register('organizationName', {
                  required: 'Organization name is required',
                  maxLength: {
                    value: 100,
                    message: 'Organization name cannot exceed 100 characters',
                  },
                })}
                error={!!errors.organizationName}
                helperText={errors.organizationName?.message}
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Registration Number"
                {...register('registrationNumber', {
                  required: 'Registration number is required',
                })}
                error={!!errors.registrationNumber}
                helperText={errors.registrationNumber?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Established Year"
                type="number"
                {...register('establishedYear', {
                  required: 'Established year is required',
                  min: {
                    value: 1800,
                    message: 'Please enter a valid year',
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: 'Year cannot be in the future',
                  },
                })}
                error={!!errors.establishedYear}
                helperText={errors.establishedYear?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Organization Type</InputLabel>
                <Select
                  defaultValue=""
                  label="Organization Type"
                  {...register('organizationType', {
                    required: 'Organization type is required',
                  })}
                  error={!!errors.organizationType}
                >
                  {organizationTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                placeholder="https://example.org"
                {...register('website', {
                  pattern: {
                    value: /^https?:\/\/.+/,
                    message: 'Please enter a valid website URL',
                  },
                })}
                error={!!errors.website}
                helperText={errors.website?.message}
              />
            </Grid>
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
                {...register('address.country')}
              />
            </Grid>
            
            {/* Contact Person */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Contact Person
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Person Name"
                {...register('contactPerson.name', {
                  required: 'Contact person name is required',
                })}
                error={!!errors.contactPerson?.name}
                helperText={errors.contactPerson?.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Designation"
                {...register('contactPerson.designation', {
                  required: 'Designation is required',
                })}
                error={!!errors.contactPerson?.designation}
                helperText={errors.contactPerson?.designation?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Email"
                type="email"
                {...register('contactPerson.email', {
                  required: 'Contact email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                error={!!errors.contactPerson?.email}
                helperText={errors.contactPerson?.email?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Contact Phone"
                {...register('contactPerson.phone', {
                  required: 'Contact phone is required',
                })}
                error={!!errors.contactPerson?.phone}
                helperText={errors.contactPerson?.phone?.message}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Mission Statement"
                multiline
                rows={3}
                placeholder="Describe your organization's mission and goals..."
                {...register('mission', {
                  required: 'Mission statement is required',
                  maxLength: {
                    value: 1000,
                    message: 'Mission cannot exceed 1000 characters',
                  },
                })}
                error={!!errors.mission}
                helperText={errors.mission?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Organization Description"
                multiline
                rows={4}
                placeholder="Provide a detailed description of your organization, its history, and activities..."
                {...register('description', {
                  required: 'Organization description is required',
                  maxLength: {
                    value: 2000,
                    message: 'Description cannot exceed 2000 characters',
                  },
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="focusAreas"
                control={control}
                rules={{ required: 'Please select at least one focus area' }}
                render={({ field }) => (
                  <FormControl fullWidth required>
                    <InputLabel>Focus Areas</InputLabel>
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Focus Areas" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                      error={!!errors.focusAreas}
                    >
                      {focusAreaOptions.map((area) => (
                        <MenuItem key={area} value={area}>
                          {area}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.focusAreas && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.focusAreas.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
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
              Register Your NGO
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join our platform to connect with skilled volunteers
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
                    'Register NGO'
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

export default RegisterNGO;
