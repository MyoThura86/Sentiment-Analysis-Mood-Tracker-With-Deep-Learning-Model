import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  Alert,
  AlertTitle,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Info,
  Lightbulb,
  Assessment,
  Favorite,
  SelfImprovement,
  ShowChart,
  CalendarToday
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { testsApi } from '../../api/testsApi';
import { useTranslation } from '../../../hooks/useTranslation';

const MentalHealthInsights = ({ user }) => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const [insights, setInsights] = useState(null);
  const [testHistories, setTestHistories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, [user, language]);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const result = await testsApi.getMentalHealthInsights(user);
      console.log('Mental health insights API response:', result);

      // Handle both old and new API response formats
      if (result.success) {
        // New format has 'tests' array
        if (result.tests && Array.isArray(result.tests)) {
          console.log('Using new API format with tests array:', result.tests);
          setInsights(result);
        }
        // Old format has 'latest_test' object - convert to new format
        else if (result.latest_test) {
          console.log('Converting old API format to new format');
          const convertedResult = {
            success: true,
            tests: [{
              test_id: result.latest_test.test_id,
              test_name: result.latest_test.test_name,
              latest_score: result.latest_test.total_score || result.latest_test.score,
              max_score: result.latest_test.test_id === 1 ? 27 : result.latest_test.test_id === 2 ? 21 : result.latest_test.test_id === 3 ? 250 : 40,
              severity_level: result.latest_test.severity_level,
              last_taken: result.latest_test.completed_at,
              history_count: 1,
              trend: null
            }],
            recommendations: [
              'Continue regular journaling to track your emotional patterns',
              'Consider retaking assessments to track progress over time',
              'Maintain connections with supportive friends and family'
            ],
            total_assessments: 1
          };
          setInsights(convertedResult);
        } else {
          console.log('No test data in response');
          setInsights(result);
        }
      } else {
        console.log('API returned unsuccessful response');
        setInsights(result);
      }

      // Load historical data for each test
      if (result.success && result.tests && result.tests.length > 0) {
        const histories = {};
        for (const test of result.tests) {
          try {
            const historyResult = await testsApi.getTestHistory(user, test.test_id);
            if (historyResult.success && historyResult.results) {
              histories[test.test_id] = historyResult.results;
            }
          } catch (error) {
            console.error(`Error loading history for test ${test.test_id}:`, error);
          }
        }
        setTestHistories(histories);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'minimal':
      case 'low':
        return 'success';
      case 'mild':
      case 'moderate_low':
        return 'info';
      case 'moderate':
      case 'moderate_high':
        return 'warning';
      case 'moderately_severe':
      case 'severe':
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    const color = getSeverityColor(severity);
    if (color === 'success') return <CheckCircle color="success" />;
    if (color === 'error') return <Warning color="error" />;
    return <Info color={color} />;
  };

  const getOverallWellbeingScore = () => {
    if (!insights?.tests || insights.tests.length === 0) return null;

    // Calculate weighted wellbeing score (inverse for clinical tests)
    let totalScore = 0;
    let count = 0;

    insights.tests.forEach(test => {
      if (test.test_type === 'PHQ9') {
        // Lower is better for depression (0-27)
        totalScore += ((27 - test.latest_score) / 27) * 100;
        count++;
      } else if (test.test_type === 'GAD7') {
        // Lower is better for anxiety (0-21)
        totalScore += ((21 - test.latest_score) / 21) * 100;
        count++;
      } else if (test.test_type === 'PSS10') {
        // Lower is better for stress (0-40)
        totalScore += ((40 - test.latest_score) / 40) * 100;
        count++;
      }
    });

    return count > 0 ? Math.round(totalScore / count) : null;
  };

  const getWellbeingLevel = (score) => {
    if (score >= 80) return { level: 'Excellent', color: 'success', icon: <Favorite /> };
    if (score >= 60) return { level: 'Good', color: 'info', icon: <SelfImprovement /> };
    if (score >= 40) return { level: 'Fair', color: 'warning', icon: <Info /> };
    return { level: 'Needs Attention', color: 'error', icon: <Warning /> };
  };

  const getChartData = (testId) => {
    const history = testHistories[testId];
    if (!history || history.length === 0) return null;

    // Sort by date (oldest first for chart)
    const sortedHistory = [...history].sort(
      (a, b) => new Date(a.completed_at) - new Date(b.completed_at)
    );

    // Take last 10 entries for chart
    const recentHistory = sortedHistory.slice(-10);

    return recentHistory.map((result) => ({
      date: new Date(result.completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: result.score || result.total_score || 0,
      fullDate: result.completed_at
    }));
  };

  const getTestStats = (testId) => {
    const history = testHistories[testId];
    if (!history || history.length === 0) return null;

    const scores = history.map(h => h.score || h.total_score || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    return { avgScore, minScore, maxScore, totalTests: history.length };
  };

  if (loading) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" fontWeight="bold">
{t('insights.title')}
            </Typography>
          </Box>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  if (!insights?.tests || insights.tests.length === 0) {
    return (
      <Card elevation={3}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h5" fontWeight="bold">
{t('insights.title')}
            </Typography>
          </Box>
          <Alert severity="info">
            <AlertTitle>{t('insights.noData')}</AlertTitle>
            {t('insights.noDataText')}
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/tests')}
            sx={{ mt: 2 }}
            startIcon={<Assessment />}
          >
            {t('insights.takeTest')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const wellbeingScore = getOverallWellbeingScore();
  const wellbeing = wellbeingScore ? getWellbeingLevel(wellbeingScore) : null;

  return (
    <Card elevation={3}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
{t('insights.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('insights.subtitle')}
            </Typography>
          </Box>
        </Box>

        {/* Overall Wellbeing Score */}
        {wellbeing && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {wellbeing.icon}
              <Typography variant="h6" sx={{ ml: 1 }}>
{t('insights.overallWellbeing')}
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 1 }}>
              {wellbeingScore}%
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              {wellbeing.level}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={wellbeingScore}
              sx={{
                mt: 2,
                height: 8,
                borderRadius: 4,
                bgcolor: 'rgba(255,255,255,0.3)',
                '& .MuiLinearProgress-bar': {
                  bgcolor: 'white'
                }
              }}
            />
          </Paper>
        )}

        {/* Individual Test Results */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
{t('insights.recentAssessments')}
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {insights.tests.map((test) => {
            const chartData = getChartData(test.test_id);
            const stats = getTestStats(test.test_id);

            return (
              <Grid size={{ xs: 12, lg: 6 }} key={test.test_id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {test.test_name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Last: {new Date(test.last_taken).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        icon={getSeverityIcon(test.severity_level)}
                        label={test.severity_level}
                        color={getSeverityColor(test.severity_level)}
                        size="small"
                      />
                    </Box>

                    {/* Current Score */}
                    <Paper elevation={0} sx={{ p: 2, mb: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Current Score
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          {test.latest_score} / {test.max_score}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(test.latest_score / test.max_score) * 100}
                        color={getSeverityColor(test.severity_level)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Paper>

                    {/* Stats Grid */}
                    {stats && (
                      <Grid container spacing={1} sx={{ mb: 2 }}>
                        <Grid size={4}>
                          <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {t('insights.avgScore')}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {stats.avgScore}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={4}>
                          <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {t('insights.min')}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              {stats.minScore}
                            </Typography>
                          </Paper>
                        </Grid>
                        <Grid size={4}>
                          <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {t('insights.tests')}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                              {stats.totalTests}
                            </Typography>
                          </Paper>
                        </Grid>
                      </Grid>
                    )}

                    {/* Trend Indicator */}
                    {test.trend && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, bgcolor: test.trend === 'improving' ? 'success.50' : 'error.50', borderRadius: 1 }}>
                        {test.trend === 'improving' ? (
                          <TrendingDown color="success" sx={{ fontSize: 20, mr: 1 }} />
                        ) : (
                          <TrendingUp color="error" sx={{ fontSize: 20, mr: 1 }} />
                        )}
                        <Typography variant="body2" fontWeight="medium">
                          {test.trend === 'improving' ? 'Scores are improving' : 'Scores are increasing'}
                        </Typography>
                      </Box>
                    )}

                    {/* Chart */}
                    {chartData && chartData.length > 1 ? (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ShowChart sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                          <Typography variant="caption" fontWeight="medium" color="text.secondary">
                            Progress Chart (Last {chartData.length} tests)
                          </Typography>
                        </Box>
                        <ResponsiveContainer width="100%" height={120}>
                          <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id={`gradient-${test.test_id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#667eea" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#667eea" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 10 }}
                              stroke="#999"
                            />
                            <YAxis
                              domain={[0, test.max_score]}
                              tick={{ fontSize: 10 }}
                              stroke="#999"
                            />
                            <RechartsTooltip
                              contentStyle={{ fontSize: 12, borderRadius: 8 }}
                              formatter={(value) => [`Score: ${value}`, '']}
                            />
                            <Area
                              type="monotone"
                              dataKey="score"
                              stroke="#667eea"
                              strokeWidth={2}
                              fill={`url(#gradient-${test.test_id})`}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        Take more tests to see progress chart
                      </Alert>
                    )}

                    {/* View Details Button */}
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/tests/${test.test_id}/history`)}
                      sx={{ mt: 2 }}
                      fullWidth
                    >
                      View Full History
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Personalized Recommendations */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Lightbulb sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="h6" fontWeight="bold">
{t('insights.recommendations')}
            </Typography>
          </Box>
          <List>
            {insights.recommendations?.slice(0, 5).map((rec, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <CheckCircle color="primary" fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={rec}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/tests')}
            startIcon={<Assessment />}
          >
            {t('testResults.retakeTest')}
          </Button>
          <Button
            variant="text"
            onClick={() => navigate('/ai-assistant')}
            startIcon={<Psychology />}
          >
            {t('insights.talkToAI')}
          </Button>
        </Box>

        {/* Disclaimer */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <AlertTitle>{t('insights.professionalAdvice')}</AlertTitle>
          {t('insights.disclaimer')}
        </Alert>
      </CardContent>
    </Card>
  );
};

export default MentalHealthInsights;
