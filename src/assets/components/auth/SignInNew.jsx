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
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Psychology,
  ArrowForward,
  LoginRounded,
  Google,
  GitHub
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OAUTH_CONFIG, isOAuthConfigured } from '../../../config/oauth';

const SignIn = ({ onSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

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
          name: result.user.firstName && result.user.lastName
            ? `${result.user.firstName} ${result.user.lastName}`
            : result.user.name || 'User',
          joinDate: result.user.created_at,
          streak: 0,
          totalEntries: 0
        };

        // Store user data and JWT token
        localStorage.setItem('user', JSON.stringify(userData));
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        onSignIn(userData);
        navigate('/dashboard');
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

  const handleGitHubSignIn = () => {
    if (!isOAuthConfigured.github()) {
      setError('GitHub OAuth is not configured. Please set up GitHub OAuth in the configuration.');
      return;
    }

    // GitHub OAuth flow
    const params = new URLSearchParams({
      client_id: OAUTH_CONFIG.GITHUB_CLIENT_ID,
      redirect_uri: OAUTH_CONFIG.REDIRECT_URLS.github,
      scope: 'user:email',
      state: 'signin'
    });

    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call the authentication API
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Add name field for compatibility
        const userData = {
          ...result.user,
          name: result.user.firstName && result.user.lastName
            ? `${result.user.firstName} ${result.user.lastName}`
            : result.user.name || 'User',
          joinDate: result.user.created_at,
          streak: 0,
          totalEntries: 0
        };

        // Store user data and JWT token
        localStorage.setItem('user', JSON.stringify(userData));
        if (result.token) {
          localStorage.setItem('token', result.token);
        }
        onSignIn(userData);
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Elements */}
      <FloatingElement delay={0} size={120} />
      <FloatingElement delay={1} size={80} />
      <FloatingElement delay={2} size={100} />

      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.7 },
            '50%': { transform: 'scale(1.1)', opacity: 0.4 },
            '100%': { transform: 'scale(1)', opacity: 0.7 }
          }
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-150px',
          right: '-150px',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          animation: 'pulse 6s ease-in-out infinite',
        }}
      />

      <Container maxWidth="sm">
        <Slide direction="up" in timeout={800}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(20px)',
              background: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Header with brand */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                p: 4,
                textAlign: 'center',
                position: 'relative'
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
                    Welcome Back
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Continue your mental wellness journey
                  </Typography>
                </Box>
              </Grow>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  {error && (
                    <Fade in>
                      <Alert
                        severity="error"
                        sx={{
                          mb: 3,
                          borderRadius: 3,
                          '& .MuiAlert-icon': {
                            color: '#f44336'
                          }
                        }}
                      >
                        {error}
                      </Alert>
                    </Fade>
                  )}

                  {/* Social Login Options */}
                  <Grow in timeout={1000}>
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" align="center" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Quick Sign In
                      </Typography>

                      <GoogleOAuthProvider clientId={OAUTH_CONFIG.GOOGLE_CLIENT_ID}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                          {isOAuthConfigured.google() && (
                            <Box
                              sx={{
                                width: '100%',
                                '& > div': {
                                  width: '100% !important',
                                  maxWidth: '100% !important'
                                },
                                '& iframe': {
                                  width: '100% !important',
                                  maxWidth: '100% !important'
                                },
                                '& div[role="button"]': {
                                  width: '100% !important',
                                  maxWidth: '100% !important'
                                }
                              }}
                            >
                              <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={handleGoogleError}
                                theme="outline"
                                size="large"
                                text="signin_with"
                              />
                            </Box>
                          )}

                          {isOAuthConfigured.github() && (
                            <Button
                              variant="outlined"
                              fullWidth
                              startIcon={<GitHub />}
                              sx={{
                                height: '40px',
                                borderRadius: '4px',
                                textTransform: 'none',
                                borderColor: 'rgba(0,0,0,0.2)',
                                color: '#1f1f1f',
                                fontSize: '14px',
                                fontWeight: 500,
                                fontFamily: '"Roboto", "Arial", sans-serif',
                                justifyContent: 'center',
                                '&:hover': {
                                  borderColor: 'rgba(0,0,0,0.3)',
                                  backgroundColor: 'rgba(0,0,0,0.04)'
                                }
                              }}
                              onClick={handleGitHubSignIn}
                            >
                              Sign in with GitHub
                            </Button>
                          )}
                        </Box>
                      </GoogleOAuthProvider>

                      <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Or continue with email
                        </Typography>
                      </Divider>
                    </Box>
                  </Grow>

                  <Grow in timeout={1200}>
                    <TextField
                      fullWidth
                      name="email"
                      label="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      inputProps={{
                        style: { borderRadius: 12 }
                      }}
                    />
                  </Grow>

                  <Grow in timeout={1400}>
                    <TextField
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      sx={{ mb: 3 }}
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
                </Box>

                <Grow in timeout={1600}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    endIcon={loading ? null : <ArrowForward />}
                    sx={{
                      py: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)'
                      },
                      '&:disabled': {
                        background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                        transform: 'none',
                        boxShadow: 'none'
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
                        Signing In...
                      </Box>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Grow>

                <Grow in timeout={1800}>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Don't have an account?{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => navigate('/signup')}
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
                        Create Account
                      </Link>
                    </Typography>
                  </Box>
                </Grow>

                <Grow in timeout={2000}>
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
                </Grow>
              </form>
            </CardContent>
          </Card>
        </Slide>
      </Container>
    </Box>
  );
};

export default SignIn;