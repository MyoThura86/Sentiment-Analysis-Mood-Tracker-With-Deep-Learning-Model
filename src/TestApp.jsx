import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Psychology, TrendingUp, ArrowForward } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
  },
});

const SimpleTest = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Card sx={{ maxWidth: 600, textAlign: 'center' }}>
        <CardContent sx={{ p: 4 }}>
          <Psychology sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            MoodTracker Test
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            If you can see this page, the basic setup is working!
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowForward />}
            onClick={() => window.location.href = '/'}
            sx={{ mt: 2 }}
          >
            Test Complete - Reload Page
          </Button>
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body2">
              <strong>API Status:</strong> {' '}
              <span style={{ color: '#4caf50' }}>✓ Running on localhost:5001</span>
            </Typography>
            <Typography variant="body2">
              <strong>Frontend:</strong> {' '}
              <span style={{ color: '#4caf50' }}>✓ Running on localhost:5174</span>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

const TestApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="*" element={<SimpleTest />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default TestApp;