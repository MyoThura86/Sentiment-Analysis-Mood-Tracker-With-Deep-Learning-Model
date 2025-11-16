import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import { CheckCircle, Error } from '@mui/icons-material';

const OAuthCallback = ({ onSignIn, onSignUp }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setError(`OAuth error: ${error}`);
          setLoading(false);
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setLoading(false);
          return;
        }

        // Determine provider from current path
        const path = window.location.pathname;
        let provider = '';
        let endpoint = '';

        if (path.includes('/auth/github/callback')) {
          provider = 'GitHub';
          endpoint = '/api/auth/github';
        } else if (path.includes('/auth/google/callback')) {
          provider = 'Google';
          endpoint = '/api/auth/google';
        } else {
          setError('Unknown OAuth provider');
          setLoading(false);
          return;
        }

        // Send code to backend for authentication
        const response = await fetch(`http://localhost:5001${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state }),
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

            // Call appropriate callback based on state
            if (state === 'signup') {
              onSignUp(userData);
              navigate('/welcome');
            } else {
              onSignIn(userData);
              navigate('/dashboard');
            }
          }, 2000);
        } else {
          setError(result.message || `${provider} authentication failed`);
        }

      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('Network error during authentication');
      } finally {
        setLoading(false);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, onSignIn, onSignUp]);

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
        <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4, maxWidth: 400 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Authentication Successful!
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Redirecting you to your dashboard...
          </Typography>
          <LinearProgress sx={{ borderRadius: 2 }} />
        </Card>
      </Box>
    );
  }

  if (error) {
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
        <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4, maxWidth: 400 }}>
          <Error sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Authentication Failed
          </Typography>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography
            variant="body2"
            color="primary"
            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/signin')}
          >
            ← Back to Sign In
          </Typography>
        </Card>
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
        justifyContent: 'center'
      }}
    >
      <Card sx={{ borderRadius: 4, textAlign: 'center', p: 4, maxWidth: 400 }}>
        <CircularProgress size={80} sx={{ mb: 3 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Authenticating...
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Please wait while we verify your credentials
        </Typography>
      </Card>
    </Box>
  );
};

export default OAuthCallback;