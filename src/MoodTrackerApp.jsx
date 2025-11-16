import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Fade, Box } from '@mui/material';

// Components
import LandingPage from './assets/components/LandingPage';
import SignIn from './assets/components/auth/SignInNew';
import SignUp from './assets/components/auth/SignUpNew';
import OAuthCallback from './assets/components/auth/OAuthCallback';
import Dashboard from './assets/components/journal/DashboardNew';
import AllEntries from './assets/components/journal/AllEntriesNew';
import CSVAnalysis from './assets/components/research/CSVAnalysis';
import DemoPage from './assets/components/DemoPage';
import ProfileSettings from './assets/components/profile/ProfileSettings';
import AIAssistant from './assets/components/mental-health/AIAssistant';
import TestsPage from './assets/components/mental-health/TestsPage';
import TakeTest from './assets/components/mental-health/TakeTest';
import TestResults from './assets/components/mental-health/TestResults';
import TestHistory from './assets/components/mental-health/TestHistory';

// API
import { userApi } from './assets/api/userApi';

// Create custom theme with compact sizing
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#9fa7f3',
      dark: '#4554b7',
    },
    secondary: {
      main: '#764ba2',
      light: '#a375ce',
      dark: '#4f3471',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 13, // Reduced from default 14
    h1: {
      fontWeight: 700,
      fontSize: '2rem', // Reduced from 2.5rem
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.75rem', // Reduced from 2rem
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem', // Reduced
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem', // Reduced
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem', // Reduced
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem', // Reduced
    },
    body1: {
      fontSize: '0.875rem', // Reduced
    },
    body2: {
      fontSize: '0.8rem', // Reduced
    },
    button: {
      fontSize: '0.8rem', // Reduced
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10, // Reduced from 12
          fontWeight: 600,
          padding: '6px 14px', // Reduced padding
        },
        sizeSmall: {
          padding: '4px 10px',
          fontSize: '0.75rem',
        },
        sizeMedium: {
          padding: '6px 14px',
          fontSize: '0.8rem',
        },
        sizeLarge: {
          padding: '8px 18px',
          fontSize: '0.875rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // Reduced from 16
          boxShadow: '0 3px 15px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10, // Reduced from 12
          },
          '& .MuiInputBase-input': {
            fontSize: '0.875rem', // Smaller input text
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem', // Smaller chip text
          height: 26, // Reduced from 32
        },
        sizeSmall: {
          fontSize: '0.7rem',
          height: 22,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 8, // Reduced from 12
        },
        sizeSmall: {
          padding: 6,
        },
      },
    },
  },
});

const MoodTrackerApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const loadUserProfile = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);

          // Check for legacy user ID "1" or invalid data
          if (parsedUser.id === "1" || parsedUser.id === 1 ||
              !parsedUser.firstName && !parsedUser.lastName && (!parsedUser.name || parsedUser.name === "undefined undefined")) {
            console.log('Legacy or invalid user data detected, clearing localStorage and forcing re-login');
            // Clear localStorage and force re-login
            localStorage.removeItem('user');
            localStorage.removeItem('currentUser');
            setUser(null);
            setLoading(false);
            return;
          }

          setUser(parsedUser);

          // Try to fetch updated profile from server
          try {
            const profileResult = await userApi.getProfile(parsedUser);
            if (profileResult.success && profileResult.user) {
              const updatedUser = {
                ...profileResult.user,
                // Ensure name property is properly constructed
                name: profileResult.user.name ||
                      `${profileResult.user.firstName || ''} ${profileResult.user.lastName || ''}`.trim() ||
                      parsedUser.name ||
                      'User'
              };
              setUser(updatedUser);
              localStorage.setItem('user', JSON.stringify(updatedUser));
              console.log('User profile synced from server on app load:', updatedUser);
            }
          } catch (serverError) {
            console.warn('Could not sync profile from server:', serverError);
            // Continue with local user data
          }
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const handleSignIn = async (userData) => {
    try {
      // Ensure userData has proper name construction
      const processedUserData = {
        ...userData,
        name: userData.name ||
              `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
              'User'
      };

      // Set initial user data
      setUser(processedUserData);
      localStorage.setItem('user', JSON.stringify(processedUserData));

      // Initialize user in database if needed
      await userApi.initializeUser(processedUserData);

      // Fetch complete profile from server
      const profileResult = await userApi.getProfile(processedUserData);
      if (profileResult.success && profileResult.user) {
        const updatedUser = {
          ...profileResult.user,
          name: profileResult.user.name ||
                `${profileResult.user.firstName || ''} ${profileResult.user.lastName || ''}`.trim() ||
                processedUserData.name ||
                'User'
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User profile loaded from server:', updatedUser);
      } else {
        console.warn('Failed to fetch user profile:', profileResult.error);
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      // Keep the original user data if server call fails
    }
  };

  const handleSignUp = async (userData) => {
    try {
      // Ensure userData has proper name construction
      const processedUserData = {
        ...userData,
        name: userData.name ||
              `${userData.firstName || ''} ${userData.lastName || ''}`.trim() ||
              'User'
      };

      // Set initial user data
      setUser(processedUserData);
      localStorage.setItem('user', JSON.stringify(processedUserData));

      // Initialize user in database
      await userApi.initializeUser(processedUserData);

      // Fetch complete profile from server
      const profileResult = await userApi.getProfile(processedUserData);
      if (profileResult.success && profileResult.user) {
        const updatedUser = {
          ...profileResult.user,
          name: profileResult.user.name ||
                `${profileResult.user.firstName || ''} ${profileResult.user.lastName || ''}`.trim() ||
                processedUserData.name ||
                'User'
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User profile created and loaded from server:', updatedUser);
      } else {
        console.warn('Failed to fetch user profile after signup:', profileResult.error);
      }
    } catch (error) {
      console.error('Error during sign up:', error);
      // Keep the original user data if server call fails
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleUpdateProfile = async (updatedUser) => {
    try {
      // Update server first
      const updateResult = await userApi.updateProfile(user, updatedUser);
      if (updateResult.success) {
        // Update local state with server response
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('Profile updated successfully on server');
      } else {
        console.error('Failed to update profile on server:', updateResult.error);
        // Still update locally as fallback
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Update locally as fallback
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Fade in timeout={1000}>
            <div style={{ textAlign: 'center', color: 'white' }}>
              <div
                style={{
                  width: 60,
                  height: 60,
                  border: '3px solid rgba(255,255,255,0.3)',
                  borderTop: '3px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 20px',
                }}
              />
              <h2 style={{ margin: 0, fontFamily: 'Inter' }}>MoodTracker</h2>
              <p style={{ margin: '10px 0 0', opacity: 0.9 }}>Loading your wellness journey...</p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          </Fade>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LandingPage />
            }
          />
          <Route
            path="/signin"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignIn onSignIn={handleSignIn} />
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/dashboard" replace /> : <SignUp onSignUp={handleSignUp} />
            }
          />

          {/* Demo Route */}
          <Route
            path="/demo"
            element={<DemoPage />}
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/ai-assistant"
            element={
              user ? <AIAssistant user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/entries"
            element={
              user ? <AllEntries user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/research"
            element={
              user ? <CSVAnalysis user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <Box sx={{ p: 3, backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                  <ProfileSettings user={user} onUpdateProfile={handleUpdateProfile} />
                </Box>
              ) : <Navigate to="/signin" replace />
            }
          />

          {/* Psychological Tests Routes */}
          <Route
            path="/tests"
            element={
              user ? <TestsPage user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/tests/:testId/take"
            element={
              user ? <TakeTest user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/tests/:testId/results"
            element={
              user ? <TestResults user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          <Route
            path="/tests/:testId/history"
            element={
              user ? <TestHistory user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          {/* Welcome Route for New Users */}
          <Route
            path="/welcome"
            element={
              user ? <Dashboard user={user} onSignOut={handleSignOut} /> : <Navigate to="/signin" replace />
            }
          />

          {/* OAuth Callback Routes */}
          <Route
            path="/auth/github/callback"
            element={<OAuthCallback onSignIn={handleSignIn} onSignUp={handleSignUp} />}
          />
          <Route
            path="/auth/google/callback"
            element={<OAuthCallback onSignIn={handleSignIn} onSignUp={handleSignUp} />}
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default MoodTrackerApp;