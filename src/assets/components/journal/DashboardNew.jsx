import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Fab,
  Avatar,
  Skeleton,
  useTheme,
  useMediaQuery,
  Slide,
  Grow,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Add,
  Favorite,
  Timeline,
  LocalFireDepartment,
  EmojiEmotions,
  AutoAwesome,
  Insights,
  CalendarToday
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout';
import JournalEntry from './JournalEntry';
import ModelSelector from '../ModelSelector';
import UserAvatar from '../common/UserAvatar';
import MentalHealthInsights from '../mental-health/MentalHealthInsights';
import { journalApi } from '../../api/journalApi';
import { useTranslation } from '../../../hooks/useTranslation';

const Dashboard = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('both');
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load user data from API
  useEffect(() => {
    loadEntries();
  }, [user.id]);

  const loadEntries = async () => {
    try {
      setLoading(true);

      // Fetch entries from the API
      const result = await journalApi.getEntries(user);

      if (result.success && result.entries.length > 0) {
        setJournalEntries(result.entries);
        generateMoodData(result.entries);
      } else {
        // Fallback to localStorage if API fails or returns empty
        const savedEntries = localStorage.getItem(`journal_${user.id}`);
        if (savedEntries) {
          const entries = JSON.parse(savedEntries);
          setJournalEntries(entries);
          generateMoodData(entries);
        }
        // No sample data generation - leave empty if no entries
      }
    } catch (error) {
      console.error('Error loading entries:', error);

      // Fallback to localStorage on error
      const savedEntries = localStorage.getItem(`journal_${user.id}`);
      if (savedEntries) {
        const entries = JSON.parse(savedEntries);
        setJournalEntries(entries);
        generateMoodData(entries);
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSampleData = () => {
    const sampleEntries = [
      {
        id: 1,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Had a great day at work today. Feeling accomplished and happy!",
        sentiment: "Positive",
        confidence: 0.89,
        scores: { positive: 0.89, neutral: 0.08, negative: 0.03 }
      },
      {
        id: 2,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Feeling a bit overwhelmed with all the tasks I need to complete.",
        sentiment: "Negative",
        confidence: 0.76,
        scores: { positive: 0.12, neutral: 0.12, negative: 0.76 }
      },
      {
        id: 3,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Neutral day, nothing special happened. Just going through the motions.",
        sentiment: "Neutral",
        confidence: 0.82,
        scores: { positive: 0.15, neutral: 0.82, negative: 0.03 }
      },
      {
        id: 4,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Spent time with family and friends. Feeling grateful and loved!",
        sentiment: "Positive",
        confidence: 0.91,
        scores: { positive: 0.91, neutral: 0.07, negative: 0.02 }
      },
      {
        id: 5,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Struggled with anxiety today. Need to focus on self-care.",
        sentiment: "Negative",
        confidence: 0.84,
        scores: { positive: 0.05, neutral: 0.11, negative: 0.84 }
      },
      {
        id: 6,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        text: "Feeling optimistic about the future. Started a new exercise routine!",
        sentiment: "Positive",
        confidence: 0.87,
        scores: { positive: 0.87, neutral: 0.10, negative: 0.03 }
      }
    ];

    setJournalEntries(sampleEntries);
    generateMoodData(sampleEntries);
    localStorage.setItem(`journal_${user.id}`, JSON.stringify(sampleEntries));
  };

  const generateMoodData = (entries) => {
    console.log('Generating mood data for entries:', entries.length);

    if (!entries || entries.length === 0) {
      console.log('No entries provided, setting empty mood data');
      setMoodData([]);
      return;
    }

    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayEntries = entries.filter(entry => {
        if (!entry.date) return false;
        const entryDate = entry.date.split('T')[0];
        return entryDate === dateString;
      });

      let avgMood = 0;
      if (dayEntries.length > 0) {
        const moodValues = dayEntries.map(entry => {
          switch (entry.sentiment) {
            case 'Positive': return 3;
            case 'Neutral': return 2;
            case 'Negative': return 1;
            default: return 2;
          }
        });
        avgMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
      }

      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        mood: avgMood,
        entries: dayEntries.length
      });
    }

    console.log('Generated mood data:', last7Days);
    setMoodData(last7Days);
  };

  const addNewEntry = async (entryData) => {
    try {
      // Save to server using new journal API
      const result = await journalApi.createEntry(user, entryData.text);

      if (result.success) {
        // Update local state with the new entry
        const updatedEntries = [result.entry, ...journalEntries];
        setJournalEntries(updatedEntries);
        generateMoodData(updatedEntries);

        // AI analysis will be available in the dedicated AI Assistant page
        if (result.aiAnalysis) {
          console.log('AI Analysis completed for new entry - check AI Assistant page for insights');
        }

        setOpenNewEntry(false);
      } else {
        console.error('Failed to save entry:', result.error);
        // Fallback to localStorage if server fails
        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          ...entryData
        };

        const updatedEntries = [newEntry, ...journalEntries];
        setJournalEntries(updatedEntries);
        generateMoodData(updatedEntries);
        localStorage.setItem(`journal_${user.id}`, JSON.stringify(updatedEntries));
        setOpenNewEntry(false);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      // Fallback to localStorage
      const newEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...entryData
      };

      const updatedEntries = [newEntry, ...journalEntries];
      setJournalEntries(updatedEntries);
      generateMoodData(updatedEntries);
      localStorage.setItem(`journal_${user.id}`, JSON.stringify(updatedEntries));
      setOpenNewEntry(false);
    }
  };

  const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < 30; i++) {
      const checkDate = currentDate.toISOString().split('T')[0];
      const hasEntry = journalEntries.some(entry =>
        entry.date.split('T')[0] === checkDate
      );

      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const getMoodDistribution = () => {
    const distribution = { Positive: 0, Neutral: 0, Negative: 0 };
    journalEntries.forEach(entry => {
      distribution[entry.sentiment]++;
    });

    return [
      {
        name: 'Positive',
        value: distribution.Positive,
        color: '#4CAF50',
        gradient: 'linear-gradient(135deg, #66BB6A 0%, #4CAF50 50%, #43A047 100%)',
        lightColor: '#E8F5E8',
        emoji: '😊'
      },
      {
        name: 'Neutral',
        value: distribution.Neutral,
        color: '#FF9800',
        gradient: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 50%, #FB8C00 100%)',
        lightColor: '#FFF3E0',
        emoji: '😐'
      },
      {
        name: 'Negative',
        value: distribution.Negative,
        color: '#F44336',
        gradient: 'linear-gradient(135deg, #EF5350 0%, #F44336 50%, #E53935 100%)',
        lightColor: '#FFEBEE',
        emoji: '😔'
      }
    ];
  };

  const getRecentTrend = () => {
    if (journalEntries.length < 2) return 'neutral';

    const recent = journalEntries.slice(0, 3);
    const older = journalEntries.slice(3, 6);

    const getAvgScore = (entries) => {
      if (entries.length === 0) return 2;
      return entries.reduce((sum, entry) => {
        switch (entry.sentiment) {
          case 'Positive': return sum + 3;
          case 'Neutral': return sum + 2;
          case 'Negative': return sum + 1;
          default: return sum + 2;
        }
      }, 0) / entries.length;
    };

    const recentAvg = getAvgScore(recent);
    const olderAvg = getAvgScore(older);

    if (recentAvg > olderAvg + 0.2) return 'improving';
    if (recentAvg < olderAvg - 0.2) return 'declining';
    return 'stable';
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '😊';
      case 'Negative': return '😔';
      case 'Neutral': return '😐';
      default: return '😐';
    }
  };

  // Dynamic AI Health Assessment Function
  const getOverallHealthAssessment = () => {
    if (journalEntries.length === 0) {
      return {
        score: 'Start Tracking',
        level: 'neutral',
        percentage: 0,
        gradient: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)'
      };
    }

    // Factor 1: Journal Consistency (0-1)
    const maxStreak = Math.min(streak / 14, 1); // 2 weeks = perfect consistency
    const consistencyScore = maxStreak * 0.25;

    // Factor 2: Recent Mood Average (0-1)
    const recentEntries = journalEntries.slice(0, Math.min(7, journalEntries.length));
    const recentMoodAvg = recentEntries.reduce((sum, entry) => {
      switch (entry.sentiment) {
        case 'Positive': return sum + 3;
        case 'Neutral': return sum + 2;
        case 'Negative': return sum + 1;
        default: return sum + 2;
      }
    }, 0) / recentEntries.length;
    const normalizedRecentMood = (recentMoodAvg - 1) / 2; // Convert 1-3 to 0-1
    const recentMoodScore = normalizedRecentMood * 0.3;

    // Factor 3: Positive Sentiment Ratio (0-1)
    const positiveEntries = journalEntries.filter(entry => entry.sentiment === 'Positive').length;
    const positiveRatio = positiveEntries / journalEntries.length;
    const positiveScore = positiveRatio * 0.2;

    // Factor 4: Trend Improvement (0-1)
    const trend = getRecentTrend();
    const trendScore = (trend === 'improving' ? 1 : trend === 'stable' ? 0.6 : 0.2) * 0.15;

    // Factor 5: Entry Quality/Length (0-1)
    const avgEntryLength = journalEntries.reduce((sum, entry) => sum + entry.text.length, 0) / journalEntries.length;
    const qualityScore = Math.min(avgEntryLength / 200, 1) * 0.1; // 200 chars = good quality

    // Calculate total score (0-100)
    const totalScore = (consistencyScore + recentMoodScore + positiveScore + trendScore + qualityScore) * 100;

    // Determine level and appearance
    let level, score, gradient;
    if (totalScore >= 80) {
      level = 'excellent';
      score = 'Excellent';
      gradient = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    } else if (totalScore >= 65) {
      level = 'good';
      score = 'Good';
      gradient = 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)';
    } else if (totalScore >= 50) {
      level = 'fair';
      score = 'Fair';
      gradient = 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)';
    } else if (totalScore >= 35) {
      level = 'concerning';
      score = 'Concerning';
      gradient = 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)';
    } else {
      level = 'needs_attention';
      score = 'Needs Attention';
      gradient = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    }

    return {
      score,
      level,
      percentage: Math.round(totalScore),
      gradient,
      details: {
        consistency: Math.round(consistencyScore * 400), // Show as percentage contribution
        recentMood: Math.round(recentMoodScore * 333),
        positiveRatio: Math.round(positiveScore * 500),
        trend: Math.round(trendScore * 667),
        quality: Math.round(qualityScore * 1000)
      }
    };
  };

  const trend = getRecentTrend();
  const streak = getStreakCount();
  const moodDistribution = getMoodDistribution();
  const healthAssessment = getOverallHealthAssessment();

  const StatCard = ({ title, value, subtitle, icon, gradient, delay = 0 }) => (
    <Grow in={!loading} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: { xs: '100px', sm: '110px' },
          background: gradient,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <CardContent sx={{ p: { xs: 1.5, sm: 2 }, position: 'relative', zIndex: 1, height: '100%' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                {loading ? <Skeleton variant="text" width={40} sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} /> : value}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
                {title}
              </Typography>
            </Box>
            <Box sx={{ opacity: 0.8, fontSize: { xs: 24, sm: 28 } }}>
              {icon}
            </Box>
          </Box>
          <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
            {subtitle}
          </Typography>
        </CardContent>

        {/* Decorative circles - smaller */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -15,
            left: -15,
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            zIndex: 0
          }}
        />
      </Card>
    </Grow>
  );

  return (
    <PageLayout user={user} onSignOut={onSignOut} maxWidth="xl" journalEntries={journalEntries}>
      {/* Welcome Section */}
      <Slide direction="down" in={!loading} timeout={800}>
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Box display="flex" alignItems="center" mb={{ xs: 1.5, sm: 2 }}>
            <UserAvatar
              user={user}
              size={{ xs: 48, sm: 56 }}
              sx={{
                mr: { xs: 1.5, sm: 2 },
                border: { xs: '2px solid #667eea', sm: '3px solid #667eea' },
                boxShadow: '0 3px 15px rgba(102, 126, 234, 0.3)'
              }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold" color="#333" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' } }}>
                {t('dashboard.welcomeBack')} {user?.firstName || user?.name?.split(' ')[0] || 'User'}! 👋
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 0.3, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                {t('dashboard.howFeeling')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Model Selection */}
      <Slide direction="up" in={!loading} timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            showBoth={true}
          />
        </Box>
      </Slide>

      {/* Stats Cards - Full Frame */}
      <Grow in={!loading} timeout={800}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3, boxShadow: '0 3px 15px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 2.5 }}>
              <Box display="flex" alignItems="center">
                <Insights sx={{ color: 'primary.main', mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 22, sm: 24 } }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  {t('dashboard.keyMetrics')}
                </Typography>
              </Box>
              <Chip
                icon={<CalendarToday sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                label={t('dashboard.dailyTracking')}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              />
            </Box>

            <Grid container spacing={{ xs: 1.5, sm: 2, md: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title={t('dashboard.totalEntries')}
                  value={journalEntries.length}
                  subtitle={t('dashboard.journalEntriesRecorded')}
                  icon={<Psychology sx={{ fontSize: 32 }} />}
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  delay={0}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title={t('dashboard.dayStreak')}
                  value={streak}
                  subtitle={t('dashboard.consecutiveDaysTracked')}
                  icon={<LocalFireDepartment sx={{ fontSize: 32 }} />}
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                  delay={100}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title={t('dashboard.recentTrend')}
                  value={trend === 'improving' ? t('dashboard.improving') : trend === 'declining' ? t('dashboard.declining') : t('dashboard.stable')}
                  subtitle={t('dashboard.yourMoodPattern')}
                  icon={trend === 'improving' ? <TrendingUp sx={{ fontSize: 32 }} /> :
                        trend === 'declining' ? <TrendingDown sx={{ fontSize: 32 }} /> :
                        <Timeline sx={{ fontSize: 32 }} />}
                  gradient={trend === 'improving' ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' :
                           trend === 'declining' ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)' :
                           'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'}
                  delay={200}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip
                  title={
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        {t('dashboard.healthScoreBreakdown')}
                      </Typography>
                      <Typography variant="body2">
                        • {t('dashboard.consistency')}: {Math.round((healthAssessment.details?.consistency || 0))}%
                      </Typography>
                      <Typography variant="body2">
                        • {t('dashboard.recentMood')}: {Math.round((healthAssessment.details?.recentMood || 0))}%
                      </Typography>
                      <Typography variant="body2">
                        • {t('dashboard.positivity')}: {Math.round((healthAssessment.details?.positiveRatio || 0))}%
                      </Typography>
                      <Typography variant="body2">
                        • {t('dashboard.trend')}: {Math.round((healthAssessment.details?.trend || 0))}%
                      </Typography>
                      <Typography variant="body2">
                        • {t('dashboard.entryQuality')}: {Math.round((healthAssessment.details?.quality || 0))}%
                      </Typography>
                    </Box>
                  }
                  arrow
                  placement="top"
                >
                  <div>
                    <StatCard
                      title={t('dashboard.overallHealth')}
                      value={`${healthAssessment.score} (${healthAssessment.percentage}%)`}
                      subtitle={t('dashboard.aiAssessmentScore')}
                      icon={<Favorite sx={{ fontSize: 32 }} />}
                      gradient={healthAssessment.gradient}
                      delay={300}
                    />
                  </div>
                </Tooltip>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grow>

      {/* Mood Analysis Section - Full Flex Frame */}
      <Grow in={!loading} timeout={1200}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 2.5 }}>
              <Box display="flex" alignItems="center">
                <Timeline sx={{ color: 'primary.main', mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 22, sm: 24 } }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  {t('dashboard.moodAnalysis')}
                </Typography>
              </Box>
              <Chip
                icon={<Insights sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                label={`${journalEntries.length} ${t('dashboard.entriesAnalyzed')}`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              />
            </Box>

            {loading ? (
              <Box>
                <Skeleton variant="rectangular" height={300} sx={{ mb: 3, borderRadius: 2 }} />
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              </Box>
            ) : journalEntries.length === 0 ? (
              <Box textAlign="center" py={6}>
                <EmojiEmotions sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('dashboard.noEntriesYet')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {t('dashboard.startJournaling')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenNewEntry(true)}
                  size="large"
                  sx={{ borderRadius: 3 }}
                >
                  {t('dashboard.startNewEntry')}
                </Button>
              </Box>
            ) : (
              <Box>
                {/* Mood Trend Chart Section */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ color: 'primary.main', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                      {t('dashboard.last7Days')} {t('dashboard.moodAnalysis')}
                    </Typography>
                  </Box>
                  <ResponsiveContainer width="100%" height={{ xs: 240, sm: 280 }}>
                    <AreaChart data={moodData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <defs>
                        <linearGradient id="enhancedMoodGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#667eea" stopOpacity={0.9} />
                          <stop offset="30%" stopColor="#667eea" stopOpacity={0.6} />
                          <stop offset="70%" stopColor="#764ba2" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#764ba2" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="50%" stopColor="#9c88ff" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#667eea" floodOpacity="0.3"/>
                        </filter>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="6 6"
                        stroke="url(#lineGradient)"
                        opacity={0.2}
                        strokeWidth={1}
                      />

                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#555', fontWeight: '500' }}
                        axisLine={{ stroke: '#e0e0e0', strokeWidth: 1.5 }}
                        tickLine={{ stroke: '#e0e0e0', strokeWidth: 1.5 }}
                        tickMargin={8}
                      />

                      <YAxis
                        domain={[0, 4]}
                        tick={{ fontSize: 11, fill: '#555', fontWeight: '500' }}
                        axisLine={{ stroke: '#e0e0e0', strokeWidth: 1.5 }}
                        tickLine={{ stroke: '#e0e0e0', strokeWidth: 1.5 }}
                        tickMargin={6}
                        tickFormatter={(value) => {
                          const labels = ['', '😔', '😐', '😊', '🌟'];
                          return labels[Math.floor(value)] || '';
                        }}
                      />

                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                          backdropFilter: 'blur(10px)',
                          padding: '12px 16px',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                        labelStyle={{
                          color: '#333',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          marginBottom: '6px'
                        }}
                        formatter={(value, name) => {
                          const moodLabels = ['😔 ' + t('csvResearch.negative'), '😐 ' + t('csvResearch.neutral'), '😊 ' + t('csvResearch.positive'), '🌟 ' + t('csvResearch.positive')];
                          const moodIndex = Math.floor(value) - 1;
                          const mood = moodLabels[moodIndex] || '😐 ' + t('csvResearch.neutral');
                          return [mood, t('dashboard.averageMood')];
                        }}
                        labelFormatter={(label) => `📅 ${label}`}
                      />

                      <Area
                        type="monotone"
                        dataKey="mood"
                        stroke="url(#lineGradient)"
                        strokeWidth={4}
                        fill="url(#enhancedMoodGradient)"
                        dot={{
                          fill: '#fff',
                          stroke: '#667eea',
                          strokeWidth: 3,
                          r: 6,
                          filter: 'url(#shadow)'
                        }}
                        activeDot={{
                          r: 8,
                          stroke: '#667eea',
                          strokeWidth: 3,
                          fill: '#fff',
                          filter: 'url(#shadow)',
                          style: { cursor: 'pointer' }
                        }}
                        animationDuration={1800}
                        animationEasing="ease-in-out"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>

                {/* Mood Distribution Section */}
                <Box>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ color: 'secondary.main', fontSize: { xs: '0.95rem', sm: '1.05rem' } }}>
                      {t('dashboard.moodAnalysis')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: 'center',
                      gap: 4,
                      maxWidth: '900px',
                      width: '100%'
                    }}>
                      {/* Pie Chart */}
                      <Box sx={{
                        flex: { xs: '1 1 auto', md: '0 0 auto' },
                        width: { xs: '100%', sm: '300px', md: '240px' }
                      }}>
                        <ResponsiveContainer width="100%" height={isMobile ? 220 : 200}>
                          <PieChart>
                            <defs>
                              {moodDistribution.map((entry, index) => (
                                <linearGradient key={`gradient-${index}`} id={`mood-gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                                  <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                                  <stop offset="50%" stopColor={entry.color} stopOpacity={1} />
                                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                                </linearGradient>
                              ))}
                            </defs>
                            <Pie
                              data={moodDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={95}
                              paddingAngle={3}
                              dataKey="value"
                              label={(entry) => entry.value > 0 ? `${entry.emoji} ${((entry.value / journalEntries.length) * 100).toFixed(0)}%` : ''}
                              labelLine={false}
                              animationBegin={0}
                              animationDuration={1500}
                            >
                              {moodDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#mood-gradient-${index})`}
                                  stroke="white"
                                  strokeWidth={3}
                                  style={{
                                    filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.1))',
                                    cursor: 'pointer'
                                  }}
                                />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              formatter={(value, name) => [
                                `${value} ${t('dashboard.journalEntries')} (${((value / journalEntries.length) * 100).toFixed(1)}%)`,
                                name
                              ]}
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                border: 'none',
                                borderRadius: '12px',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(10px)',
                                padding: '12px 16px',
                                fontSize: '14px',
                                fontWeight: '500'
                              }}
                              labelStyle={{
                                color: '#333',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                marginBottom: '4px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>

                      {/* Legend Grid */}
                      <Box sx={{
                        flex: 1,
                        width: { xs: '100%', md: 'auto' },
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(auto-fit, minmax(140px, 1fr))' },
                        gap: 2
                      }}>
                        {moodDistribution.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              p: 2,
                              borderRadius: 3,
                              background: item.lightColor,
                              border: `2px solid ${item.color}20`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: `0 6px 20px ${item.color}30`,
                                border: `2px solid ${item.color}40`
                              }
                            }}
                          >
                            <Typography variant="h6" sx={{ mr: 1.5, fontSize: '1.3rem' }}>
                              {item.emoji}
                            </Typography>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: '600', color: item.color, fontSize: '1rem', mb: 0.5 }}>
                                {item.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip
                                  label={`${item.value} ${t('dashboard.journalEntries')}`}
                                  size="small"
                                  sx={{
                                    backgroundColor: item.color,
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    height: '20px'
                                  }}
                                />
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                  ({((item.value / journalEntries.length) * 100).toFixed(1)}%)
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>


      {/* Mental Health Insights Section */}
      <Grow in={!loading} timeout={1500}>
        <Box sx={{ mb: 4 }}>
          <MentalHealthInsights user={user} />
        </Box>
      </Grow>

      {/* Recent Entries Section */}
      <Grow in={!loading} timeout={1600}>
        <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={{ xs: 2, sm: 2.5 }}>
              <Box display="flex" alignItems="center">
                <Psychology sx={{ color: 'primary.main', mr: { xs: 1, sm: 1.5 }, fontSize: { xs: 22, sm: 24 } }} />
                <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                  {t('dashboard.recentEntries')}
                </Typography>
              </Box>
              <Chip
                icon={<Insights sx={{ fontSize: { xs: 16, sm: 18 } }} />}
                label={`${journalEntries.length} ${t('dashboard.entriesAnalyzed')}`}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
              />
            </Box>

            {loading ? (
              <Box>
                {[...Array(3)].map((_, index) => (
                  <Skeleton key={index} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
                ))}
              </Box>
            ) : journalEntries.length === 0 ? (
              <Box textAlign="center" py={6}>
                <EmojiEmotions sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {t('dashboard.noEntriesYet')}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  {t('dashboard.startJournaling')}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenNewEntry(true)}
                  size="large"
                  sx={{ borderRadius: 3 }}
                >
                  {t('dashboard.startNewEntry')}
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {journalEntries.slice(0, 3).map((entry, index) => (
                  <Grid item xs={12} key={entry.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid #e0e0e0',
                        borderLeft: `4px solid ${
                          entry.sentiment === 'Positive' ? '#4caf50' :
                          entry.sentiment === 'Negative' ? '#f44336' : '#ff9800'
                        }`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </Typography>
                          <Chip
                            label={`${getSentimentEmoji(entry.sentiment)} ${entry.sentiment}`}
                            size="small"
                            sx={{
                              backgroundColor:
                                entry.sentiment === 'Positive' ? '#e8f5e8' :
                                entry.sentiment === 'Negative' ? '#ffebee' : '#fff3e0',
                              color:
                                entry.sentiment === 'Positive' ? '#2e7d32' :
                                entry.sentiment === 'Negative' ? '#c62828' : '#ef6c00',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {(entry.confidence * 100).toFixed(1)}% confidence
                        </Typography>
                      </Box>

                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                        {entry.text}
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={entry.confidence * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor:
                              entry.sentiment === 'Positive' ? '#4caf50' :
                              entry.sentiment === 'Negative' ? '#f44336' : '#ff9800'
                          }
                        }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}

            {journalEntries.length > 3 && (
              <Box textAlign="center" mt={3}>
                <Button
                  variant="outlined"
                  startIcon={<Insights />}
                  onClick={() => navigate('/entries')}
                  size="large"
                  sx={{ borderRadius: 3 }}
                >
                  {t('dashboard.viewAllEntries')} ({journalEntries.length})
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grow>

      {/* Floating Action Button */}
      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        onClick={() => setOpenNewEntry(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          height: { xs: 44, sm: 48 },
          px: { xs: 2, sm: 2.5 },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.6)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <Add sx={{ fontSize: { xs: 22, sm: 24 }, mr: { xs: 0.5, sm: 1 } }} />
        <Typography variant="button" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
          New Entry
        </Typography>
      </Fab>

      {/* New Entry Dialog */}
      <Dialog
        open={openNewEntry}
        onClose={() => setOpenNewEntry(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            New Journal Entry
          </Typography>
        </DialogTitle>
        <DialogContent>
          <JournalEntry onSave={addNewEntry} onCancel={() => setOpenNewEntry(false)} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Dashboard;