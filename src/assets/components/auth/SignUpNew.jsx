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
  Link,
  Alert,
  Fade,
  Container,
  Grow,
  Slide,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Lock,
  Psychology,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Google,
  GitHub
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OAUTH_CONFIG, isOAuthConfigured } from '../../../config/oauth';

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
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const steps = ['Personal Info', 'Account Security', 'Terms & Conditions'];

  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.firstName.trim() && formData.lastName.trim() && formData.email.trim();
      case 1:
        return formData.password.length >= 6 && formData.password === formData.confirmPassword;
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

        setSuccess(true);
        setTimeout(() => {
          // Store user data and JWT token
          localStorage.setItem('user', JSON.stringify(userData));
          if (result.token) {
            localStorage.setItem('token', result.token);
          }
          onSignUp(userData);
          navigate('/welcome');
        }, 2000);
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

  const FloatingElement = ({ children, delay = 0, size = 80 }) => (
    <Box
      sx={{
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        width: size,
        height: size,
        animation: `float ${3 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        '@keyframes float': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
          '100%': { transform: 'translateY(0px)' }
        }
      }}
    >
      {children}
    </Box>
  );

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5001/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential
        }),
      });

      const result = await response.json();

      if (result.success) {
        const userData = {
          ...result.user,
          name: `${result.user.firstName} ${result.user.lastName}`,
          joinDate: result.user.created_at,
          streak: 0,
          totalEntries: 0
        };

        setSuccess(true);
        setTimeout(() => {
          // Store user data and JWT token
          localStorage.setItem('user', JSON.stringify(userData));
          if (result.token) {
            localStorage.setItem('token', result.token);
          }
          onSignUp(userData);
          navigate('/welcome');
        }, 2000);
      } else {
        setError(result.message || 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      setError('Network error during Google authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication was cancelled or failed. Please try again.');
  };

  const handleGitHubSignUp = () => {
    if (!isOAuthConfigured.github()) {
      setError('GitHub OAuth is not configured. Please set up GitHub OAuth in the configuration.');
      return;
    }

    // GitHub OAuth flow
    const params = new URLSearchParams({
      client_id: OAUTH_CONFIG.GITHUB_CLIENT_ID,
      redirect_uri: OAUTH_CONFIG.REDIRECT_URLS.github,
      scope: 'user:email',
      state: 'signup'
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            {/* Social Login Options */}
            <Grow in timeout={800}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                  Quick Sign Up
                </Typography>

                <GoogleOAuthProvider clientId={OAUTH_CONFIG.GOOGLE_CLIENT_ID}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                    {isOAuthConfigured.google() ? (
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        theme="outline"
                        size="large"
                        width="100%"
                        text="signup_with"
                      />
                    ) : (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Google />}
                        disabled
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          textTransform: 'none',
                          borderColor: 'rgba(0,0,0,0.2)',
                          color: 'text.secondary'
                        }}
                      >
                        Google Sign Up (Needs Configuration)
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<GitHub />}
                      sx={{
                        borderRadius: 3,
                        py: 1.5,
                        textTransform: 'none',
                        borderColor: 'rgba(0,0,0,0.2)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'rgba(102, 126, 234, 0.04)'
                        }
                      }}
                      onClick={handleGitHubSignUp}
                    >
                      Sign up with GitHub
                    </Button>
                  </Box>
                </GoogleOAuthProvider>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Or continue with email
                  </Typography>
                </Divider>
              </Box>
            </Grow>

            {/* Regular Form Fields */}
            <Grow in timeout={1000}>
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
                  ),
                }}
              />
            </Grow>
            <Grow in timeout={1200}>
              <TextField
                fullWidth
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grow>
            <Grow in timeout={1400}>
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grow>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Grow in timeout={1000}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                required
                sx={{ mb: 3 }}
                helperText="Minimum 6 characters"
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
                  ),
                }}
              />
            </Grow>
            <Grow in timeout={1200}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
                helperText={
                  formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
                    ? "Passwords don't match"
                    : "Re-enter your password"
                }
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
                  ),
                }}
              />
            </Grow>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Grow in timeout={1000}>
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
                    <Link href="#" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Terms of Service
                    </Link>
                  </Typography>
                }
                sx={{ mb: 2, alignItems: 'flex-start' }}
              />
            </Grow>
            <Grow in timeout={1200}>
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
                    <Link href="#" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                      Privacy Policy
                    </Link>{' '}
                    and consent to data processing
                  </Typography>
                }
                sx={{ alignItems: 'flex-start' }}
              />
            </Grow>
          </Box>
        );

      default:
        return 'Unknown step';
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={1000}>
            <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Welcome to MoodTracker!
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Your account has been created successfully. Redirecting you to your dashboard...
              </Typography>
              <LinearProgress sx={{ mt: 3, borderRadius: 2 }} />
            </Card>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4
      }}
    >
      {/* Background Elements */}
      <FloatingElement delay={0} size={120} />
      <FloatingElement delay={1} size={80} />
      <FloatingElement delay={2} size={100} />

      <Container maxWidth="md">
        <Slide direction="up" in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                p: 4,
                textAlign: 'center'
              }}
            >
              <Grow in timeout={1000}>
                <Box>
                  <Psychology
                    sx={{
                      fontSize: 60,
                      color: 'primary.main',
                      mb: 2,
                      filter: 'drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))'
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Join MoodTracker
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Start your mental wellness journey today
                  </Typography>
                </Box>
              </Grow>
            </Box>

            <CardContent sx={{ p: 4 }}>
              {/* Stepper */}
              <Grow in timeout={1200}>
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{!isMobile && label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Grow>

              <form onSubmit={handleSubmit}>
                {error && (
                  <Fade in>
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        borderRadius: 3
                      }}
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box sx={{ mb: 4 }}>
                  {renderStepContent(activeStep)}
                </Box>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    startIcon={<ArrowBack />}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      visibility: activeStep === 0 ? 'hidden' : 'visible'
                    }}
                  >
                    Back
                  </Button>

                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading || !validateStep(2)}
                      endIcon={loading ? null : <CheckCircle />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {loading ? (
                        <Box display="flex" alignItems="center">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              border: '2px solid rgba(255,255,255,0.3)',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite',
                              mr: 2,
                              '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                              }
                            }}
                          />
                          Creating Account...
                        </Box>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{
                        borderRadius: 3,
                        px: 4,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      variant="body2"
                      onClick={() => navigate('/signin')}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Link
                    component="button"
                    type="button"
                    variant="caption"
                    onClick={() => navigate('/')}
                    sx={{
                      color: 'text.secondary',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main'
                      },
                      transition: 'color 0.3s ease'
                    }}
                  >
                    ← Back to Home
                  </Link>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Slide>
      </Container>
    </Box>
  );
};

export default SignUp;