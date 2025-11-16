import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Divider,
  Link,
  Alert,
  Fade,
  Paper,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Google,
  GitHub,
  Psychology,
  Celebration,
  Shield,
  FavoriteRounded
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SignUp = ({ onSignUp }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToPrivacy: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const steps = [
    'Personal Information',
    'Account Security',
    'Privacy & Terms'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.email;
      case 1:
        return formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
      case 2:
        return formData.agreeToTerms && formData.agreeToPrivacy;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    } else {
      if (activeStep === 1 && formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
      } else {
        setError('Please fill in all required fields');
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) {
      setError('Please agree to the terms and privacy policy');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the authentication API
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=667eea&color=fff&size=128&rounded=true`
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add name field for compatibility
        const userData = {
          ...result.user,
          name: `${result.user.firstName} ${result.user.lastName}`,
          joinDate: result.user.created_at,
          streak: 0,
          totalEntries: 0
        };

        localStorage.setItem('user', JSON.stringify(userData));
        onSignUp(userData);
        navigate('/welcome');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const FloatingElement = ({ children, delay = 0 }) => (
    <Box
      sx={{
        animation: 'float 6s ease-in-out infinite',
        animationDelay: `${delay}s`,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }}
    >
      {children}
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              fullWidth
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              helperText="Password must be at least 8 characters"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Passwords do not match
              </Typography>
            )}
          </Box>
        );

      case 2:
        return (
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 2
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Shield sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" color="primary">
                  Privacy & Terms
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                We prioritize your mental health data security and privacy. Your journal entries are encrypted and never shared.
              </Typography>
            </Paper>

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" underline="hover" color="primary">
                    Terms of Service
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={handleInputChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link href="#" underline="hover" color="primary">
                    Privacy Policy
                  </Link>
                </Typography>
              }
            />
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Background Elements */}
      <FloatingElement delay={1}>
        <Box
          sx={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </FloatingElement>

      <FloatingElement delay={3}>
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            right: '20%',
            width: 90,
            height: 90,
            borderRadius: '30%',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(10px)'
          }}
        />
      </FloatingElement>

      <Fade in timeout={1000}>
        <Card
          sx={{
            maxWidth: 500,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mb: 2
                }}
              >
                <Celebration sx={{ color: 'white', fontSize: 40 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                Join MoodTracker
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start your journey to better mental wellness
              </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {renderStepContent(index)}
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Navigation Buttons */}
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ borderRadius: 3 }}
              >
                Back
              </Button>

              {activeStep < steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !validateStep(2)}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                or sign up with
              </Typography>
            </Divider>

            {/* Social Sign Up */}
            <Box display="flex" gap={2} mb={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{ borderRadius: 3 }}
              >
                Google
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GitHub />}
                sx={{ borderRadius: 3 }}
              >
                GitHub
              </Button>
            </Box>

            {/* Footer */}
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/signin')}
                  sx={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>

            {/* Motivational Quote */}
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2,
                background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: 2,
                textAlign: 'center'
              }}
            >
              <FavoriteRounded sx={{ color: 'primary.main', mb: 1 }} />
              <Typography variant="body2" fontStyle="italic" color="text.secondary">
                "Taking care of your mental health is an act of self-love."
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default SignUp;