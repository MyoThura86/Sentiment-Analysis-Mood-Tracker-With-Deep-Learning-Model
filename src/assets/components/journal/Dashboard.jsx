import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  CalendarToday,
  Insights,
  Add,
  MoreVert,
  Favorite,
  EmojiEmotions,
  Analytics,
  Timeline,
  LocalFireDepartment
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import JournalEntry from './JournalEntry';
import ModelSelector from '../ModelSelector';

const Dashboard = ({ user, onSignOut }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openNewEntry, setOpenNewEntry] = useState(false);
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [selectedModel, setSelectedModel] = useState('both');

  // Load user data from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem(`journal_${user.id}`);
    if (savedEntries) {
      const entries = JSON.parse(savedEntries);
      setJournalEntries(entries);
      generateMoodData(entries);
    } else {
      // Generate sample data for demo
      generateSampleData();
    }
  }, [user.id]);

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
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const dayEntries = entries.filter(entry =>
        entry.date.split('T')[0] === dateString
      );

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
    setMoodData(last7Days);
  };

  const addNewEntry = (entryData) => {
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
  };

  const getStreakCount = () => {
    const today = new Date().toISOString().split('T')[0];
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
      { name: 'Positive', value: distribution.Positive, color: '#4caf50' },
      { name: 'Neutral', value: distribution.Neutral, color: '#ff9800' },
      { name: 'Negative', value: distribution.Negative, color: '#f44336' }
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

  const trend = getRecentTrend();
  const streak = getStreakCount();
  const moodDistribution = getMoodDistribution();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Top Header Bar */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 3,
          px: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background decoration */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            opacity: 0.7
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            opacity: 0.8
          }}
        />

        <Container maxWidth="lg">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 1 }}>
                Welcome back, {user.firstName || user.name}! 👋
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                How are you feeling today?
              </Typography>
            </Box>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  transform: 'scale(1.05)'
                },
                backdropFilter: 'blur(10px)'
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', top: '-20px' }}>

        {/* Stats Cards */}
        <Card
          sx={{
            mb: 4,
            borderRadius: 4,
            background: 'white',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Grid container>
              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <Psychology sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {journalEntries.length}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Total Entries
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }
                  }}
                >
                  <LocalFireDepartment sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    {streak}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Day Streak
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    background: trend === 'improving'
                      ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                      : trend === 'declining'
                      ? 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'
                      : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                    color: 'white',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }
                  }}
                >
                  {trend === 'improving' ? (
                    <TrendingUp sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                  ) : trend === 'declining' ? (
                    <TrendingDown sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                  ) : (
                    <Timeline sx={{ fontSize: 40, mb: 2, opacity: 0.9 }} />
                  )}
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {trend === 'improving' ? 'Improving' : trend === 'declining' ? 'Declining' : 'Stable'}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Recent Trend
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)'
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Box
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                    color: '#333',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    borderLeft: { md: '1px solid rgba(255,255,255,0.1)' }
                  }}
                >
                  <Favorite sx={{ fontSize: 40, mb: 2, color: '#f44336', opacity: 0.9 }} />
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Excellent
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.8 }}>
                    Overall Health
                  </Typography>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)'
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Model Selection Section */}
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          showBoth={true}
        />

        {/* Charts Section */}
        <Grid container spacing={3} mb={4} mt={2}>
          <Grid item xs={12} md={8}>
            <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Timeline sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Mood Trend (Last 7 Days)
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                    />
                    <YAxis
                      domain={[0, 4]}
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e0e0e0' }}
                      tickFormatter={(value) => {
                        const labels = ['', 'Low', 'Neutral', 'Good', 'Great'];
                        return labels[Math.floor(value)] || '';
                      }}
                    />
                    <Tooltip
                      formatter={(value) => {
                        const labels = ['Low', 'Neutral', 'Good', 'Great'];
                        return [labels[Math.floor(value) - 1] || 'Neutral', 'Mood'];
                      }}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stroke="#667eea"
                      strokeWidth={3}
                      fill="url(#colorMood)"
                    />
                    <defs>
                      <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#667eea" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#667eea" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <Analytics sx={{ color: 'secondary.main', mr: 2, fontSize: 28 }} />
                  <Typography variant="h5" fontWeight="bold">
                    Mood Distribution
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={moodDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      labelLine={false}
                    >
                      {moodDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Entries */}
        <Card sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box display="flex" alignItems="center">
                <Psychology sx={{ color: 'primary.main', mr: 2, fontSize: 28 }} />
                <Typography variant="h5" fontWeight="bold">
                  Recent Journal Entries
                </Typography>
              </Box>
              <Chip
                icon={<Analytics />}
                label={`${journalEntries.length} entries analyzed`}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Box>

          {journalEntries.length === 0 ? (
            <Box textAlign="center" py={4}>
              <EmojiEmotions sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No entries yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Start your mental wellness journey by writing your first entry
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenNewEntry(true)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3
                }}
              >
                Write Your First Entry
              </Button>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={3}>
                {journalEntries.slice(0, 3).map((entry, index) => (
                  <Grid item xs={12} key={entry.id}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        border: '1px solid #e0e0e0',
                        borderLeft: `6px solid ${
                          entry.sentiment === 'Positive' ? '#4caf50' :
                          entry.sentiment === 'Negative' ? '#f44336' : '#ff9800'
                        }`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          <Chip
                            label={`${getSentimentEmoji(entry.sentiment)} ${entry.sentiment}`}
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

                      <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, fontSize: '1rem' }}>
                        {entry.text}
                      </Typography>

                      <Box mb={2}>
                        <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                          AI Confidence Score
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={entry.confidence * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 4,
                              backgroundColor:
                                entry.sentiment === 'Positive' ? '#4caf50' :
                                entry.sentiment === 'Negative' ? '#f44336' : '#ff9800'
                            }
                          }}
                        />
                      </Box>

                      {/* Model Comparison Mini View */}
                      {entry.roberta && entry.lstm && (
                        <Box
                          sx={{
                            mt: 2,
                            pt: 2,
                            borderTop: '1px solid #e0e0e0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Model Agreement:
                          </Typography>
                          <Box display="flex" gap={2} alignItems="center">
                            <Typography variant="caption" color="primary.main">
                              RoBERTa: {entry.roberta.sentiment}
                            </Typography>
                            <Typography variant="caption" color="secondary.main">
                              LSTM: {entry.lstm.sentiment}
                            </Typography>
                            {entry.roberta.sentiment === entry.lstm.sentiment && (
                              <Chip
                                label="✓ Agree"
                                size="small"
                                color="success"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            )}
                          </Box>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {journalEntries.length > 3 && (
                <Box textAlign="center" mt={4}>
                  <Button
                    variant="outlined"
                    startIcon={<Insights />}
                    onClick={() => navigate('/entries')}
                    sx={{
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      borderColor: 'primary.main',
                      color: 'primary.main',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    View All Entries ({journalEntries.length})
                  </Button>
                </Box>
              )}
            </Box>
          )}
          </CardContent>
        </Card>
      </Container>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setOpenNewEntry(true)}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          width: 70,
          height: 70,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)'
          },
          transition: 'all 0.3s ease'
        }}
      >
        <Add sx={{ fontSize: 32 }} />
      </Fab>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
        <MenuItem onClick={() => navigate('/research')}>CSV Research Tool</MenuItem>
        <MenuItem onClick={() => {
          onSignOut();
          navigate('/');
        }}>
          Logout
        </MenuItem>
      </Menu>

      {/* New Entry Dialog */}
      <Dialog
        open={openNewEntry}
        onClose={() => setOpenNewEntry(false)}
        maxWidth="md"
        fullWidth
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
    </Box>
  );
};

export default Dashboard;