import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  AlertTitle,
  LinearProgress,
  Container,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Info,
  Phone,
  Message,
  Public,
  ArrowBack,
  TrendingUp,
  Lightbulb,
  Assessment
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { testsApi } from '../../api/testsApi';

const TestResults = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { testId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [crisisDialogOpen, setCrisisDialogOpen] = useState(false);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    submitTest();
  }, []);

  const submitTest = async () => {
    // Use ref to prevent double submission even in StrictMode
    if (hasSubmittedRef.current) {
      console.log('Test already submitted, skipping...');
      return;
    }
    hasSubmittedRef.current = true;

    try {
      const { answers, test } = location.state || {};

      if (!answers || !test) {
        navigate('/tests');
        return;
      }

      // Convert answers to API format
      const formattedAnswers = Object.entries(answers).map(([questionNumber, value]) => ({
        question_number: parseInt(questionNumber),
        value: value
      }));

      const response = await testsApi.submitTest(user, parseInt(testId), formattedAnswers);

      if (response.success) {
        setResult(response.result);

        // Show crisis dialog if needed
        if (response.result.crisis) {
          setCrisisDialogOpen(true);
        }
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'minimal':
        return 'success';
      case 'mild':
        return 'info';
      case 'moderate':
        return 'warning';
      case 'moderately_severe':
      case 'severe':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSeverityLabel = (severity) => {
    return severity.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getScorePercentage = () => {
    if (!result) return 0;
    return (result.total_score / result.max_score) * 100;
  };

  if (loading) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <LinearProgress />
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            Analyzing your responses...
          </Typography>
        </Container>
      </PageLayout>
    );
  }

  if (!result) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Alert severity="error">Could not load results</Alert>
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout user={user} onSignOut={onSignOut}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Test Results
          </Typography>
          <Typography variant="body1" color="text.secondary">
            PHQ-9 Depression Screening
          </Typography>
        </Box>

        {/* Score Card */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h2" fontWeight="bold" color="primary.main">
                {result.total_score}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                out of {result.max_score}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={getScorePercentage()}
              sx={{
                height: 12,
                borderRadius: 6,
                mb: 3,
                bgcolor: 'action.disabledBackground',
                '& .MuiLinearProgress-bar': {
                  bgcolor: getSeverityColor(result.severity_level) + '.main'
                }
              }}
            />

            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label={getSeverityLabel(result.severity_level)}
                color={getSeverityColor(result.severity_level)}
                sx={{ fontSize: 16, px: 2, py: 3 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Interpretation */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assessment sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                What This Means
              </Typography>
            </Box>
            <Typography variant="body1" paragraph>
              {result.description}
            </Typography>
            <Alert severity="info">
              <AlertTitle>Important Reminder</AlertTitle>
              This is a screening tool, not a diagnosis. These results are meant to help you
              understand your current state and decide if you might benefit from professional support.
            </Alert>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Lightbulb sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" fontWeight="bold">
                Recommendations
              </Typography>
            </Box>
            <List>
              {result.recommendations.map((rec, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="success" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Severe Depression Warning */}
        {(result.severity_level === 'severe' || result.severity_level === 'moderately_severe') && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Please Seek Professional Help</AlertTitle>
            Your score indicates you may be experiencing significant symptoms. We strongly
            encourage you to reach out to a mental health professional or crisis resource.
          </Alert>
        )}

        {/* Crisis Resources (always visible) */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 3,
            bgcolor: result.crisis ? 'error.light' : 'warning.light',
            color: result.crisis ? 'error.contrastText' : 'warning.contrastText'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Crisis Resources
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            If you're in crisis or need immediate support:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                <strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Message sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                <strong>Crisis Text Line:</strong> Text HOME to 741741
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Warning sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                <strong>Emergency:</strong> Call 911 or visit your nearest ER
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/tests')}
            startIcon={<ArrowBack />}
            fullWidth
          >
            Back to Tests
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/dashboard')}
            startIcon={<TrendingUp />}
            fullWidth
          >
            View Dashboard
          </Button>
        </Box>

        {/* Next Steps */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Your results have been saved. You can view your test history and track changes over time
            from the Tests page.
          </Typography>
        </Box>
      </Container>

      {/* Crisis Dialog */}
      <Dialog
        open={crisisDialogOpen}
        onClose={() => setCrisisDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'error.contrastText' }}>
          {result.crisis?.title || 'Immediate Support Available'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>You Are Not Alone</AlertTitle>
            {result.crisis?.message}
          </Alert>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Help is Available Now
          </Typography>

          {result.crisis?.resources?.map((resource, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {resource.name}
              </Typography>
              <Typography variant="body2" color="primary.main" fontWeight="bold">
                {resource.contact}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {resource.description}
              </Typography>
            </Paper>
          ))}

          <Alert severity="warning" sx={{ mt: 2 }}>
            If this is an emergency, please call 911 or go to your nearest emergency room immediately.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCrisisDialogOpen(false)} variant="contained">
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default TestResults;
