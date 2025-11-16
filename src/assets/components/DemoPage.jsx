import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Slide,
  Fade,
  Stack,
  Divider,
  Paper,
  Tab,
  Tabs,
  CircularProgress
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  AutoAwesome,
  PlayArrow,
  Refresh,
  EmojiEmotions,
  SentimentDissatisfied,
  SentimentNeutral,
  Close,
  BarChart,
  Timeline,
  Analytics,
  Insights,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const DemoPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  // Demo examples with pre-analyzed results
  const demoExamples = [
    {
      text: "I'm feeling so grateful today! Just got promoted at work and my family is healthy. Life is beautiful!",
      sentiment: 'Positive',
      confidence: 0.95,
      roberta_score: 0.93,
      lstm_score: 0.97,
      keywords: ['grateful', 'promoted', 'healthy', 'beautiful'],
      emotion_breakdown: { joy: 0.8, gratitude: 0.9, excitement: 0.7 }
    },
    {
      text: "Feeling quite neutral about today's weather. It's neither good nor bad, just average.",
      sentiment: 'Neutral',
      confidence: 0.89,
      roberta_score: 0.85,
      lstm_score: 0.93,
      keywords: ['neutral', 'neither', 'average'],
      emotion_breakdown: { indifference: 0.7, calm: 0.6, acceptance: 0.5 }
    },
    {
      text: "I'm struggling with anxiety lately. Everything feels overwhelming and I can't seem to catch a break.",
      sentiment: 'Negative',
      confidence: 0.92,
      roberta_score: 0.89,
      lstm_score: 0.95,
      keywords: ['struggling', 'anxiety', 'overwhelming'],
      emotion_breakdown: { anxiety: 0.9, stress: 0.8, sadness: 0.6 }
    },
    {
      text: "Had a mixed day today. Started rough with some bad news, but ended on a high note with good friends.",
      sentiment: 'Mixed',
      confidence: 0.78,
      roberta_score: 0.72,
      lstm_score: 0.84,
      keywords: ['mixed', 'rough', 'bad news', 'high note', 'good friends'],
      emotion_breakdown: { mixed: 0.8, hope: 0.6, disappointment: 0.4 }
    }
  ];

  // Simulate real-time analysis
  const analyzeText = async (text) => {
    setAnalyzing(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple sentiment analysis simulation
    const positiveWords = ['good', 'great', 'excellent', 'happy', 'joy', 'love', 'amazing', 'wonderful', 'fantastic', 'grateful', 'promoted', 'healthy', 'beautiful'];
    const negativeWords = ['bad', 'terrible', 'sad', 'angry', 'hate', 'awful', 'horrible', 'struggling', 'anxiety', 'overwhelming'];

    const words = text.toLowerCase().split(' ');
    const positiveCount = words.filter(word => positiveWords.some(pos => word.includes(pos))).length;
    const negativeCount = words.filter(word => negativeWords.some(neg => word.includes(neg))).length;

    let sentiment, confidence;
    if (positiveCount > negativeCount) {
      sentiment = 'Positive';
      confidence = Math.min(0.85 + (positiveCount * 0.05), 0.98);
    } else if (negativeCount > positiveCount) {
      sentiment = 'Negative';
      confidence = Math.min(0.85 + (negativeCount * 0.05), 0.98);
    } else {
      sentiment = 'Neutral';
      confidence = 0.82;
    }

    setAnalyzing(false);
    return {
      text,
      sentiment,
      confidence,
      roberta_score: confidence - 0.02,
      lstm_score: confidence + 0.01,
      keywords: words.filter(word => [...positiveWords, ...negativeWords].some(key => word.includes(key))),
      emotion_breakdown: sentiment === 'Positive' ? { joy: 0.8, happiness: 0.7 } :
                        sentiment === 'Negative' ? { sadness: 0.7, stress: 0.6 } :
                        { calm: 0.6, neutral: 0.8 }
    };
  };

  // Auto-play demo examples
  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(() => {
        setCurrentExample(prev => (prev + 1) % demoExamples.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoPlay, demoExamples.length]);

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '#4caf50';
      case 'Negative': return '#f44336';
      case 'Neutral': return '#ff9800';
      case 'Mixed': return '#9c27b0';
      default: return '#2196f3';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return <EmojiEmotions />;
      case 'Negative': return <SentimentDissatisfied />;
      case 'Neutral': return <SentimentNeutral />;
      default: return <Psychology />;
    }
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;
    const result = await analyzeText(userInput);
    // Handle result display
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 4
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <IconButton
                onClick={() => navigate('/')}
                sx={{ color: 'white', mr: 2 }}
              >
                <ArrowBack />
              </IconButton>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  🧠 AI Demo
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Experience our advanced sentiment analysis in action
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}>
              <Psychology sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Demo Tabs */}
        <Paper sx={{ mb: 4, borderRadius: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 'bold',
                py: 2
              }
            }}
          >
            <Tab
              icon={<PlayArrow />}
              label="Live Demo"
              iconPosition="start"
            />
            <Tab
              icon={<BarChart />}
              label="Model Comparison"
              iconPosition="start"
            />
            <Tab
              icon={<Timeline />}
              label="Analytics View"
              iconPosition="start"
            />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={4}>
            {/* Input Section */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    ✨ Try It Yourself
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Enter your text and see our AI models analyze the sentiment in real-time
                  </Typography>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Write about your day, feelings, or any thoughts..."
                    variant="outlined"
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleAnalyze}
                    disabled={!userInput.trim() || analyzing}
                    startIcon={analyzing ? <CircularProgress size={20} /> : <AutoAwesome />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    }}
                  >
                    {analyzing ? 'Analyzing...' : 'Analyze Sentiment'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Live Examples */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                      🎯 Live Examples
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => setAutoPlay(!autoPlay)}
                        color={autoPlay ? 'primary' : 'default'}
                      >
                        <PlayArrow />
                      </IconButton>
                      <IconButton
                        onClick={() => setCurrentExample((prev) => (prev + 1) % demoExamples.length)}
                      >
                        <Refresh />
                      </IconButton>
                    </Box>
                  </Box>

                  <Fade in key={currentExample} timeout={500}>
                    <Box>
                      <Paper sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                        <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                          "{demoExamples[currentExample].text}"
                        </Typography>
                      </Paper>

                      {/* Sentiment Result */}
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          sx={{
                            bgcolor: getSentimentColor(demoExamples[currentExample].sentiment),
                            mr: 2,
                            width: 48,
                            height: 48
                          }}
                        >
                          {getSentimentIcon(demoExamples[currentExample].sentiment)}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {demoExamples[currentExample].sentiment}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={demoExamples[currentExample].confidence * 100}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: 'rgba(0,0,0,0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getSentimentColor(demoExamples[currentExample].sentiment),
                                borderRadius: 4
                              }
                            }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(demoExamples[currentExample].confidence * 100)}% confidence
                          </Typography>
                        </Box>
                      </Box>

                      {/* Keywords */}
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Key Phrases:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {demoExamples[currentExample].keywords.map((keyword, index) => (
                            <Chip
                              key={index}
                              label={keyword}
                              size="small"
                              sx={{
                                bgcolor: getSentimentColor(demoExamples[currentExample].sentiment) + '20',
                                color: getSentimentColor(demoExamples[currentExample].sentiment)
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Fade>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={4}>
            {/* Model Comparison */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    🤖 AI Model Comparison
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    See how our RoBERTa and MentalBERT-LSTM models perform on the same text
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 2, border: '2px solid #7c3aed' }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <AutoAwesome sx={{ color: '#7c3aed', mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">
                            RoBERTa Model
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Advanced transformer-based analysis
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={demoExamples[currentExample].roberta_score * 100}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: 'rgba(124, 58, 237, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#7c3aed',
                              borderRadius: 6
                            }
                          }}
                        />
                        <Typography variant="h4" fontWeight="bold" color="#7c3aed" sx={{ mt: 1 }}>
                          {Math.round(demoExamples[currentExample].roberta_score * 100)}%
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, borderRadius: 2, border: '2px solid #059669' }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Psychology sx={{ color: '#059669', mr: 1 }} />
                          <Typography variant="h6" fontWeight="bold">
                            MentalBERT-LSTM
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Mental health specialized model
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={demoExamples[currentExample].lstm_score * 100}
                          sx={{
                            height: 12,
                            borderRadius: 6,
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#059669',
                              borderRadius: 6
                            }
                          }}
                        />
                        <Typography variant="h4" fontWeight="bold" color="#059669" sx={{ mt: 1 }}>
                          {Math.round(demoExamples[currentExample].lstm_score * 100)}%
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Box mt={4}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Combined Analysis Result:
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Chip
                        icon={getSentimentIcon(demoExamples[currentExample].sentiment)}
                        label={`${demoExamples[currentExample].sentiment} (${Math.round(demoExamples[currentExample].confidence * 100)}%)`}
                        sx={{
                          bgcolor: getSentimentColor(demoExamples[currentExample].sentiment),
                          color: 'white',
                          fontSize: '1rem',
                          py: 2,
                          px: 3
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={4}>
            {/* Analytics Dashboard Preview */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    📊 Analytics Dashboard Preview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    This is how your mental health insights would look in the full application
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <Analytics sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="#667eea">
                          94%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Overall Accuracy
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <TrendingUp sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="#4caf50">
                          +15%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Mood Improvement
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                        <Insights sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" color="#ff9800">
                          127
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Insights Generated
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* CTA Section */}
        <Box mt={6} textAlign="center">
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4,
            p: 4
          }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Start Your Journey?
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
              Experience the full power of AI-driven mental health insights
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  bgcolor: 'white',
                  color: '#667eea',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#f8f9fa'
                  }
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signin')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default DemoPage;