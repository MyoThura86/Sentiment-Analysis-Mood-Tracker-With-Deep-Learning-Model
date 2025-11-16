import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  AlertTitle,
  Skeleton,
  Container,
  Paper
} from '@mui/material';
import {
  Psychology,
  AccessTime,
  QuestionAnswer,
  TrendingUp,
  Info,
  Assignment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import { testsApi } from '../../api/testsApi';
import { useTranslation } from '../../../hooks/useTranslation';

const TestsPage = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [tests, setTests] = useState([]);
  const [testHistory, setTestHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
    loadHistory();
  }, [language]);

  const loadTests = async () => {
    try {
      const result = await testsApi.getAllTests();
      if (result.success) {
        setTests(result.tests);
      }
    } catch (error) {
      console.error('Error loading tests:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const result = await testsApi.getTestHistory(user);
      console.log('Test history loaded:', result);
      if (result.success) {
        setTestHistory(result.results);
        console.log('Test history state updated:', result.results);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLastTestDate = (testId) => {
    const lastTest = testHistory.find(h => h.test_id === testId);
    if (lastTest) {
      const date = new Date(lastTest.completed_at);
      return date.toLocaleDateString();
    }
    return t('testsPage.testCard.neverTaken');
  };

  const handleTakeTest = (testId) => {
    navigate(`/tests/${testId}/take`);
  };

  const handleViewHistory = (testId) => {
    navigate(`/tests/${testId}/history`);
  };

  if (loading) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={300} />
        </Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout user={user} onSignOut={onSignOut}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('testsPage.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('testsPage.subtitle')}
          </Typography>
        </Box>

        {/* Important Disclaimer */}
        <Alert severity="info" sx={{ mb: 4 }}>
          <AlertTitle>{t('testsPage.disclaimer.title')}</AlertTitle>
          {t('testsPage.disclaimer.text')}
        </Alert>

        {/* Available Tests */}
        <Grid container spacing={3}>
          {tests.map((test) => (
            <Grid size={{ xs: 12, md: 6 }} key={test.id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Test Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight="bold" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}>
                        {test.test_name}
                      </Typography>
                      <Chip
                        label={test.category || 'Mental Health'}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 3,
                      minHeight: '60px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {test.description}
                  </Typography>

                  {/* Test Info */}
                  <Box sx={{ mb: 3, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <QuestionAnswer sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {test.total_questions} {t('testsPage.testCard.questions')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTime sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        ~{Math.ceil(test.duration_minutes)} {t('testsPage.testCard.minutes')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUp sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {t('testsPage.testCard.lastTaken')} {getLastTestDate(test.id)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 2, mt: 'auto' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleTakeTest(test.id)}
                      startIcon={<Assignment />}
                    >
                      {t('testsPage.testCard.takeTest')}
                    </Button>
                    {(() => {
                      const hasHistory = testHistory.some(h => h.test_id === test.id);
                      console.log(`Test ${test.id} (${test.test_name}) has history:`, hasHistory, testHistory.filter(h => h.test_id === test.id));
                      return hasHistory;
                    })() && (
                      <Button
                        variant="outlined"
                        onClick={() => handleViewHistory(test.id)}
                        startIcon={<Info />}
                      >
                        {t('testsPage.testCard.history')}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Crisis Resources */}
        <Paper
          elevation={2}
          sx={{
            mt: 6,
            p: 3,
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {t('testsPage.crisis.title')}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t('testsPage.crisis.text')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2">
              {t('testsPage.crisis.lifeline')}
            </Typography>
            <Typography variant="body2">
              {t('testsPage.crisis.textLine')}
            </Typography>
            <Typography variant="body2">
              {t('testsPage.crisis.emergency')}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </PageLayout>
  );
};

export default TestsPage;
