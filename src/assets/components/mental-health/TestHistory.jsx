import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Skeleton,
  Alert,
  Button,
  Chip,
  LinearProgress,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ArrowBack,
  CalendarToday,
  Assessment
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import PageLayout from '../layout/PageLayout';
import { testsApi } from '../../api/testsApi';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TestHistory = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const [testInfo, setTestInfo] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTestHistory();
  }, [testId]);

  const loadTestHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load test information
      const testResult = await testsApi.getTest(testId);
      if (testResult.success) {
        setTestInfo(testResult.test);
      }

      // Load test history
      const historyResult = await testsApi.getTestHistory(user, testId);
      if (historyResult.success) {
        console.log('Test history loaded:', historyResult.results);
        setHistory(historyResult.results || []);
      } else {
        setError(historyResult.error || 'Failed to load test history');
      }
    } catch (error) {
      console.error('Error loading test history:', error);
      setError('Failed to load test history');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLevel = (score, testName) => {
    // PHQ-9 scoring
    if (testName.includes('PHQ-9')) {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'info' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      if (score <= 19) return { level: 'Moderately Severe', color: 'error' };
      return { level: 'Severe', color: 'error' };
    }

    // GAD-7 scoring
    if (testName.includes('GAD-7')) {
      if (score <= 4) return { level: 'Minimal', color: 'success' };
      if (score <= 9) return { level: 'Mild', color: 'info' };
      if (score <= 14) return { level: 'Moderate', color: 'warning' };
      return { level: 'Severe', color: 'error' };
    }

    // Default scoring
    const percentage = (score / 27) * 100; // Assuming max score of 27
    if (percentage <= 25) return { level: 'Low', color: 'success' };
    if (percentage <= 50) return { level: 'Mild', color: 'info' };
    if (percentage <= 75) return { level: 'Moderate', color: 'warning' };
    return { level: 'High', color: 'error' };
  };

  const getChartData = () => {
    if (!history || history.length === 0) return null;

    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.completed_at) - new Date(b.completed_at)
    );

    return {
      labels: sortedHistory.map(h =>
        new Date(h.completed_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      ),
      datasets: [
        {
          label: 'Score',
          data: sortedHistory.map(h => h.score || h.total_score || 0),
          borderColor: 'rgb(102, 126, 234)',
          backgroundColor: 'rgba(102, 126, 234, 0.5)',
          tension: 0.3,
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Score Progression Over Time',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score'
        }
      }
    }
  };

  const getTrend = () => {
    if (!history || history.length < 2) return null;

    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.completed_at) - new Date(b.completed_at)
    );

    const latest = sortedHistory[sortedHistory.length - 1]?.score || sortedHistory[sortedHistory.length - 1]?.total_score || 0;
    const previous = sortedHistory[sortedHistory.length - 2]?.score || sortedHistory[sortedHistory.length - 2]?.total_score || 0;

    if (latest < previous) {
      return { direction: 'improving', Icon: TrendingDown, color: 'success' };
    } else if (latest > previous) {
      return { direction: 'increasing', Icon: TrendingUp, color: 'error' };
    }
    return { direction: 'stable', Icon: TrendingUp, color: 'info' };
  };

  if (loading) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={100} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={300} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" height={200} />
        </Container>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout user={user} onSignOut={onSignOut}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tests')}
          >
            Back to Tests
          </Button>
        </Container>
      </PageLayout>
    );
  }

  const chartData = getChartData();
  const trend = getTrend();

  return (
    <PageLayout user={user} onSignOut={onSignOut}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/tests')}
            sx={{ mb: 2 }}
          >
            Back to Tests
          </Button>

          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {testInfo?.test_name || 'Test'} History
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Track your progress over time
          </Typography>
        </Box>

        {history.length === 0 ? (
          <Alert severity="info">
            No test history found. Take the test to start tracking your progress.
          </Alert>
        ) : (
          <>
            {/* Summary Stats */}
            <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {history.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tests Taken
                    </Typography>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {history[0]?.score || history[0]?.total_score || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Latest Score
                    </Typography>
                    {trend && (
                      <Chip
                        icon={<trend.Icon />}
                        label={trend.direction}
                        color={trend.color}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="bold" color="primary.main">
                      {history.length > 0 ? Math.round(history.reduce((sum, h) => sum + (h.score || h.total_score || 0), 0) / history.length) : 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Score
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Chart */}
            {chartData && history.length > 1 && (
              <Card sx={{ mb: 4, p: 3 }}>
                <Line data={chartData} options={chartOptions} />
              </Card>
            )}

            {/* History List */}
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
              Test Results
            </Typography>

            {history.map((result, index) => {
              const score = result.score || result.total_score || 0;
              const severity = getSeverityLevel(score, testInfo?.test_name || '');
              const date = new Date(result.completed_at);

              return (
                <Card key={result.id || index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body1">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>

                      <Chip
                        label={severity.level}
                        color={severity.color}
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Score
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {score} / {testInfo?.total_questions ? testInfo.total_questions * 3 : 27}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(score / (testInfo?.total_questions ? testInfo.total_questions * 3 : 27)) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>

                    {result.interpretation && (
                      <Typography variant="body2" color="text.secondary">
                        {result.interpretation}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </>
        )}
      </Container>
    </PageLayout>
  );
};

export default TestHistory;
