import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Grow,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tab,
  Tabs,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Rating,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  SmartToy,
  Psychology,
  TrendingUp,
  AccessTime,
  ExpandMore,
  PlayArrow,
  Timeline,
  Insights,
  HealthAndSafety,
  AutoAwesome,
  EmojiEmotions,
  SelfImprovement,
  Favorite,
  LocalFlorist,
  WbSunny,
  Refresh,
  Chat,
  History,
  Timer,
  CheckCircle,
  Close,
  Pause,
  PlayCircleFilled,
  Edit,
  Save,
  Psychology as PsychologyIcon,
  Assessment
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import PageLayout from '../layout/PageLayout';
import { journalApi, recommendationsApi } from '../../api/journalApi';
import { useTranslation } from '../../../hooks/useTranslation';

// Practice Session Modal Component
const PracticeSessionModal = ({ open, strategy, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');
  const [rating, setRating] = useState(0);
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentJournalEntry, setCurrentJournalEntry] = useState('');
  const [beliefRating, setBeliefRating] = useState(50);
  const [balancedThought, setBalancedThought] = useState('');
  const [newBeliefRating, setNewBeliefRating] = useState(50);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize timer when strategy changes
  useEffect(() => {
    if (strategy) {
      setTimeLeft(strategy.duration_minutes * 60); // Convert to seconds
      setCurrentStep(0);
      setIsActive(false);
      setIsPaused(false);
      setStartTime(null);
      setMoodBefore('');
      setMoodAfter('');
      setRating(0);
      setJournalEntries([]);
      setCurrentJournalEntry('');
      setBeliefRating(50);
      setBalancedThought('');
      setNewBeliefRating(50);
      setAiAnalysis(null);
      setIsAnalyzing(false);
    }
  }, [strategy]);

  // Timer logic
  useEffect(() => {
    let interval = null;
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCurrentStep(2); // Move to completion step
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Analyze journal entry with AI
  const analyzeJournalEntry = async (text) => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      // Use the same predict/both endpoint that's used elsewhere
      const response = await fetch('http://localhost:5001/api/predict/both', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('🤖 AI Analysis result:', data);

      setAiAnalysis({
        sentiment: data.sentiment || data.roberta?.sentiment,
        confidence: data.confidence || data.roberta?.confidence,
        roberta: data.roberta,
        lstm: data.lstm
      });
    } catch (error) {
      console.error('❌ Error analyzing journal entry:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save journal entry
  const saveJournalEntry = () => {
    if (currentJournalEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        text: currentJournalEntry,
        beliefRating,
        timestamp: new Date().toISOString(),
        type: 'practice_journal'
      };
      setJournalEntries([...journalEntries, newEntry]);
      analyzeJournalEntry(currentJournalEntry);
      setCurrentJournalEntry('');
    }
  };

  const handleStart = () => {
    setStartTime(Date.now());
    setIsActive(true);
    setCurrentStep(1);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleComplete = () => {
    if (rating > 0) {
      onComplete({
        strategyId: strategy.id,
        strategyName: strategy.name,
        startTime,
        rating,
        moodBefore,
        moodAfter,
        journalEntries,
        balancedThought,
        beliefRatingBefore: beliefRating,
        beliefRatingAfter: newBeliefRating,
        aiAnalysis
      });
    }
  };

  const handleClose = () => {
    setIsActive(false);
    setIsPaused(false);
    onClose();
  };

  if (!strategy) return null;

  const steps = [
    'Pre-Practice Check-in',
    'Practice Session',
    'Post-Practice Reflection'
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          minHeight: '60vh'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography component="div" fontSize="1.5rem" fontWeight="bold" gutterBottom>
          {strategy.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {strategy.description}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 4 }}>
        <Stepper activeStep={currentStep} orientation="vertical">
          {/* Step 0: Pre-Practice Check-in */}
          <Step>
            <StepLabel>Pre-Practice Check-in</StepLabel>
            <StepContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  How are you feeling right now?
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
                  {['anxious', 'stressed', 'sad', 'tired', 'overwhelmed', 'neutral'].map((mood) => (
                    <Chip
                      key={mood}
                      label={mood}
                      clickable
                      color={moodBefore === mood ? 'primary' : 'default'}
                      onClick={() => setMoodBefore(mood)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Box>
                <Button
                  variant="contained"
                  onClick={handleStart}
                  disabled={!moodBefore}
                  startIcon={<PlayCircleFilled />}
                  sx={{
                    mt: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3
                  }}
                >
                  Start Practice ({strategy.duration_minutes} min)
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 1: Practice Session */}
          <Step>
            <StepLabel>Practice Session</StepLabel>
            <StepContent>
              <Card sx={{ p: 3, mb: 3, backgroundColor: '#f8f9ff', border: '2px solid #e3f2fd' }}>
                <Box textAlign="center" mb={3}>
                  <Typography variant="h2" fontWeight="bold" color="primary">
                    {formatTime(timeLeft)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={((strategy.duration_minutes * 60 - timeLeft) / (strategy.duration_minutes * 60)) * 100}
                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* Interactive Journaling for Cognitive Practices */}
                {strategy.id === 'thought_challenging' ? (
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Thought Record & Challenge
                    </Typography>

                    {/* Step 1: Write down negative thought */}
                    <Accordion defaultExpanded sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          1. Write down the negative thought
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="What specific thought is bothering you? Write it exactly as it occurred to you..."
                          value={currentJournalEntry}
                          onChange={(e) => setCurrentJournalEntry(e.target.value)}
                          sx={{ mb: 2 }}
                        />
                        <Button
                          variant="contained"
                          onClick={saveJournalEntry}
                          disabled={!currentJournalEntry.trim()}
                          startIcon={<Save />}
                          size="small"
                        >
                          Save & Analyze
                        </Button>
                      </AccordionDetails>
                    </Accordion>

                    {/* Step 2: Rate belief */}
                    {journalEntries.length > 0 && (
                      <Accordion sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            2. Rate how much you believe it (0-100%)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography gutterBottom>
                            How strongly do you believe this thought right now?
                          </Typography>
                          <Slider
                            value={beliefRating}
                            onChange={(e, value) => setBeliefRating(value)}
                            min={0}
                            max={100}
                            marks={[
                              { value: 0, label: '0%' },
                              { value: 50, label: '50%' },
                              { value: 100, label: '100%' }
                            ]}
                            sx={{ mt: 2 }}
                          />
                          <Typography variant="h6" color="primary" textAlign="center">
                            {beliefRating}% belief strength
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* AI Analysis Results */}
                    {aiAnalysis && (
                      <Card sx={{ p: 2, mb: 2, backgroundColor: '#f0f8ff', border: '1px solid #e3f2fd' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          🤖 AI Analysis
                        </Typography>
                        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                          <Chip
                            icon={<PsychologyIcon />}
                            label={`${aiAnalysis.sentiment} (${Math.round(aiAnalysis.confidence * 100)}%)`}
                            color={aiAnalysis.sentiment === 'Positive' ? 'success' :
                                   aiAnalysis.sentiment === 'Negative' ? 'error' : 'default'}
                          />
                          {aiAnalysis.roberta && (
                            <Chip
                              label={`RoBERTa: ${Math.round(aiAnalysis.roberta.confidence * 100)}%`}
                              size="small"
                            />
                          )}
                          {aiAnalysis.lstm && (
                            <Chip
                              label={`LSTM: ${Math.round(aiAnalysis.lstm.confidence * 100)}%`}
                              size="small"
                            />
                          )}
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          The AI detected patterns in your thought that suggest {aiAnalysis.sentiment.toLowerCase()} emotional content.
                          This can help you understand the emotional impact of this thought.
                        </Typography>
                      </Card>
                    )}

                    {/* Step 3: Create balanced thought */}
                    {journalEntries.length > 0 && (
                      <Accordion sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            3. Create a more balanced thought
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography gutterBottom>
                            Now write a more balanced, realistic version of your thought:
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Rewrite your thought in a more balanced, evidence-based way..."
                            value={balancedThought}
                            onChange={(e) => setBalancedThought(e.target.value)}
                            sx={{ mb: 2 }}
                          />
                          <Typography gutterBottom>
                            How much do you believe the original thought now?
                          </Typography>
                          <Slider
                            value={newBeliefRating}
                            onChange={(e, value) => setNewBeliefRating(value)}
                            min={0}
                            max={100}
                            marks={[
                              { value: 0, label: '0%' },
                              { value: 50, label: '50%' },
                              { value: 100, label: '100%' }
                            ]}
                            sx={{ mt: 2 }}
                          />
                          <Typography variant="h6" color="primary" textAlign="center">
                            {newBeliefRating}% belief strength
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                    )}

                    {/* Journal Entries Display */}
                    {journalEntries.length > 0 && (
                      <Card sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Your Thought Record
                        </Typography>
                        {journalEntries.map((entry, index) => (
                          <Paper key={entry.id} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Original Thought:</strong> {entry.text}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Initial belief: {entry.beliefRating}%
                            </Typography>
                          </Paper>
                        ))}
                        {balancedThought && (
                          <Paper sx={{ p: 2, backgroundColor: '#e8f5e8' }}>
                            <Typography variant="body2" gutterBottom>
                              <strong>Balanced Thought:</strong> {balancedThought}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              New belief: {newBeliefRating}%
                            </Typography>
                          </Paper>
                        )}
                      </Card>
                    )}

                  </Box>
                ) : (
                  /* Regular practice for other strategies */
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      Follow these steps:
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 3 }}>
                      {strategy.instructions}
                    </Typography>
                  </Box>
                )}

                <Box display="flex" justifyContent="center" gap={2} mt={3}>
                  <Button
                    variant="outlined"
                    onClick={handlePause}
                    startIcon={isPaused ? <PlayCircleFilled /> : <Pause />}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => setCurrentStep(2)}
                    startIcon={<CheckCircle />}
                    sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                  >
                    Complete Practice
                  </Button>
                </Box>
              </Card>
            </StepContent>
          </Step>

          {/* Step 2: Post-Practice Reflection */}
          <Step>
            <StepLabel>Post-Practice Reflection</StepLabel>
            <StepContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  How are you feeling now?
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={2} mb={3}>
                  {['calm', 'better', 'relaxed', 'centered', 'same', 'worse'].map((mood) => (
                    <Chip
                      key={mood}
                      label={mood}
                      clickable
                      color={moodAfter === mood ? 'primary' : 'default'}
                      onClick={() => setMoodAfter(mood)}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  ))}
                </Box>

                <Typography variant="body1" gutterBottom>
                  How helpful was this practice?
                </Typography>
                <Rating
                  value={rating}
                  onChange={(event, newValue) => setRating(newValue)}
                  size="large"
                  sx={{ mt: 1, mb: 3 }}
                />

                <Button
                  variant="contained"
                  onClick={handleComplete}
                  disabled={!moodAfter || rating === 0}
                  startIcon={<CheckCircle />}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 3,
                    py: 1.5
                  }}
                >
                  Complete Practice Session
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} startIcon={<Close />}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AIAssistant = ({ user, onSignOut }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
  const [aiInsights, setAiInsights] = useState(null);
  const [copingStrategies, setCopingStrategies] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightHistory, setInsightHistory] = useState([]);
  const [practiceModalOpen, setPracticeModalOpen] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Load data on component mount
  useEffect(() => {
    loadAIAssistantData();
  }, [user?.id]);

  const loadAIAssistantData = async () => {
    console.log('🤖 AI Assistant - Loading data for user:', user);

    if (!user?.id) {
      console.error('❌ No user ID found:', user);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('📚 Loading journal entries...');
      // Load journal entries
      const entriesResult = await journalApi.getEntries(user);
      console.log('📚 Journal entries result:', entriesResult);
      if (entriesResult.success) {
        setJournalEntries(entriesResult.entries);
        console.log('✅ Journal entries loaded:', entriesResult.entries.length);
      } else {
        console.error('❌ Failed to load journal entries:', entriesResult.error);
      }

      console.log('🧠 Loading AI insights...');
      // Load AI insights and recommendations
      const insightsResult = await recommendationsApi.getAIPoweredInsights(user);
      console.log('🧠 AI insights result:', insightsResult);
      if (insightsResult.success) {
        setAiInsights(insightsResult.insight);
        setCopingStrategies(insightsResult.copingStrategies || []);

        // Save the current insight to history if it exists
        if (insightsResult.insight) {
          saveInsightToHistory(insightsResult.insight);
        }

        console.log('✅ AI insights loaded:', insightsResult.insight);
      } else {
        console.error('❌ Failed to load AI insights:', insightsResult.error);
      }

      console.log('📊 Loading analytics...');
      // Load analytics
      const analyticsResult = await journalApi.getAnalytics(user);
      console.log('📊 Analytics result:', analyticsResult);
      if (analyticsResult.success) {
        setAnalytics(analyticsResult.analytics);
        console.log('✅ Analytics loaded:', analyticsResult.analytics);
      } else {
        console.error('❌ Failed to load analytics:', analyticsResult.error);
      }

      // Load insight history from localStorage (after insights are processed)
      const historyKey = `ai_insights_history_${user.id}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      setInsightHistory(history.slice(0, 10)); // Keep last 10 insights
      console.log('📝 Insight history loaded:', history.length, 'items');

      // Load practice history from localStorage
      const practiceHistoryKey = `practice_history_${user.id}`;
      const practiceHist = JSON.parse(localStorage.getItem(practiceHistoryKey) || '[]');
      setPracticeHistory(practiceHist.slice(0, 20)); // Keep last 20 practices
      console.log('🏃‍♂️ Practice history loaded:', practiceHist.length, 'sessions');

    } catch (error) {
      console.error('💥 Error loading AI assistant data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save new insight to history
  const saveInsightToHistory = (insight) => {
    const historyKey = `ai_insights_history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    const newInsight = {
      id: Date.now(),
      date: new Date().toISOString(),
      ...insight
    };

    const updatedHistory = [newInsight, ...history.slice(0, 9)]; // Keep last 10
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    setInsightHistory(updatedHistory);
  };

  // Handle practice session start
  const handleStartPractice = (strategy) => {
    console.log(`🧘‍♀️ Starting practice session: ${strategy.name}`);
    setSelectedStrategy(strategy);
    setPracticeModalOpen(true);
  };

  // Handle practice session completion
  const handlePracticeComplete = (practiceData) => {
    const practiceSession = {
      id: Date.now(),
      strategyId: practiceData.strategyId,
      strategyName: practiceData.strategyName,
      startTime: practiceData.startTime,
      endTime: Date.now(),
      duration: Math.round((Date.now() - practiceData.startTime) / 60000), // minutes
      completed: true,
      userRating: practiceData.rating || null,
      mood_before: practiceData.moodBefore || null,
      mood_after: practiceData.moodAfter || null,
      journalEntries: practiceData.journalEntries || [],
      balancedThought: practiceData.balancedThought || null,
      beliefRatingBefore: practiceData.beliefRatingBefore || null,
      beliefRatingAfter: practiceData.beliefRatingAfter || null,
      aiAnalysis: practiceData.aiAnalysis || null,
      date: new Date().toISOString()
    };

    // Save to localStorage
    const practiceHistoryKey = `practice_history_${user.id}`;
    const history = JSON.parse(localStorage.getItem(practiceHistoryKey) || '[]');
    const updatedHistory = [practiceSession, ...history.slice(0, 19)]; // Keep last 20
    localStorage.setItem(practiceHistoryKey, JSON.stringify(updatedHistory));
    setPracticeHistory(updatedHistory);

    console.log('✅ Practice session saved:', practiceSession);
    setPracticeModalOpen(false);
    setSelectedStrategy(null);
  };

  // Generate mood trend data for chart
  const generateMoodTrendData = () => {
    if (!journalEntries.length) return [];

    const last14Days = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dayEntries = journalEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate.toDateString() === date.toDateString();
      });

      let avgMood = 2; // Default neutral
      if (dayEntries.length > 0) {
        const moodScores = dayEntries.map(entry => {
          switch (entry.sentiment) {
            case 'Positive': return 3;
            case 'Neutral': return 2;
            case 'Negative': return 1;
            default: return 2;
          }
        });
        avgMood = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
      }

      last14Days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        mood: avgMood,
        entries: dayEntries.length
      });
    }

    return last14Days;
  };

  const CurrentInsights = () => (
    <Grid container spacing={3}>
      {/* Latest AI Insight */}
      {aiInsights && (
        <Grid size={{ xs: 12 }}>
          <Grow in timeout={800}>
            <Card
              sx={{
                borderRadius: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="flex-start" mb={3}>
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      mr: 3,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white'
                    }}
                  >
                    <SmartToy sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {aiInsights.title}
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7, fontSize: '1.1rem', opacity: 0.95 }}>
                      {aiInsights.message}
                    </Typography>
                    {aiInsights.confidence && (
                      <Chip
                        size="small"
                        label={`${Math.round(aiInsights.confidence * 100)}% confidence`}
                        sx={{
                          mt: 2,
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>
                  <IconButton
                    onClick={loadAIAssistantData}
                    sx={{ color: 'white', opacity: 0.8 }}
                  >
                    <Refresh />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      )}

      {/* Mood Trend Chart */}
      <Grid size={{ xs: 12, md: 8 }}>
        <Fade in timeout={1000}>
          <Card sx={{ borderRadius: 3, height: '350px' }}>
            <CardContent sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📈 Your Mood Journey (14 Days)
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={generateMoodTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0.5, 3.5]} tickFormatter={(value) => {
                    if (value <= 1.5) return 'Low';
                    if (value <= 2.5) return 'Neutral';
                    return 'Positive';
                  }} />
                  <RechartsTooltip />
                  <Area
                    type="monotone"
                    dataKey="mood"
                    stroke="#667eea"
                    fill="url(#moodGradient)"
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Fade>
      </Grid>

      {/* Quick Stats */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Grow in timeout={1200}>
              <Card sx={{ borderRadius: 3, background: '#f8f9ff' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" color="#667eea">
                    {journalEntries.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Journal Entries
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Grow in timeout={1400}>
              <Card sx={{ borderRadius: 3, background: '#f0f9f0' }}>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="h3" fontWeight="bold" color="#4caf50">
                    {journalEntries.filter(e => e.sentiment === 'Positive').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Positive Entries
                  </Typography>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const CopingStrategies = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
🎯 {t('aiAssistant.copingStrategies.title')}
      </Typography>

      {copingStrategies.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
          <CardContent>
            <SelfImprovement sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('aiAssistant.copingStrategies.noStrategies')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('aiAssistant.copingStrategies.noStrategiesText')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {copingStrategies.map((strategy, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={strategy.id || index}>
              <Grow in timeout={600 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                    border: '1px solid #f0f0f0',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          width: 48,
                          height: 48,
                          mr: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {strategy.name}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {strategy.category && (
                            <Chip
                              size="small"
                              label={strategy.category}
                              sx={{
                                backgroundColor:
                                  strategy.category === 'Depression' ? '#ffebee' :
                                  strategy.category === 'Anxiety' ? '#e8eaf6' :
                                  strategy.category === 'Stress' ? '#fff3e0' :
                                  strategy.category === 'Personality' ? '#f3e5f5' :
                                  strategy.category === 'Mindfulness' ? '#e0f2f1' :
                                  '#e8f5e9',
                                color:
                                  strategy.category === 'Depression' ? '#c62828' :
                                  strategy.category === 'Anxiety' ? '#3949ab' :
                                  strategy.category === 'Stress' ? '#f57c00' :
                                  strategy.category === 'Personality' ? '#7b1fa2' :
                                  strategy.category === 'Mindfulness' ? '#00897b' :
                                  '#2e7d32',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                          <Chip
                            size="small"
                            icon={<AccessTime />}
                            label={`${strategy.duration_minutes} min`}
                            sx={{
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32'
                            }}
                          />
                          <Chip
                            size="small"
                            label={`${strategy.effectiveness_score}/10`}
                            sx={{
                              backgroundColor: '#fff3e0',
                              color: '#f57c00'
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, lineHeight: 1.6 }}
                    >
                      {strategy.description}
                    </Typography>

                    {/* Instructions Preview */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Quick Steps:
                      </Typography>
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: '#f8f9ff',
                          borderRadius: 2,
                          border: '1px solid #e3f2fd'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: 'pre-line',
                            lineHeight: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {strategy.instructions}
                        </Typography>
                      </Paper>
                    </Box>
                  </CardContent>

                  {/* Action Button */}
                  <Box sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      fullWidth
                      size="large"
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                          transform: 'scale(1.02)'
                        }
                      }}
                      onClick={() => handleStartPractice(strategy)}
                    >
                      {t('aiAssistant.copingStrategies.startPractice')}
                    </Button>
                  </Box>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const InsightHistory = () => (
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        📚 {t('aiAssistantComplete.previousInsights.title')}
      </Typography>

      {insightHistory.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
          <CardContent>
            <History sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('aiAssistantComplete.previousInsights.noHistory')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('aiAssistantComplete.previousInsights.noHistoryText')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {insightHistory.map((insight, index) => (
            <Grid size={{ xs: 12, md: 6 }} key={insight.id}>
              <Grow in timeout={500 + index * 100}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #f0f0f0',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.15)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" mb={2}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 2,
                          backgroundColor: '#667eea',
                          color: 'white',
                          fontSize: '0.8rem'
                        }}
                      >
                        <SmartToy />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(insight.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          {insight.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {insight.message}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  // Practice History Component
  const PracticeHistory = () => (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
        🏃‍♂️ {t('aiAssistantComplete.practice.title')}
      </Typography>

      {practiceHistory.length === 0 ? (
        <Card sx={{ borderRadius: 3, textAlign: 'center', py: 6 }}>
          <CardContent>
            <Timer sx={{ fontSize: 60, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('aiAssistantComplete.practice.noHistory')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('aiAssistantComplete.practice.noHistoryText')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {practiceHistory.map((session) => (
            <Grid size={{ xs: 12, md: 6 }} key={session.id}>
              <Card sx={{ borderRadius: 3, border: '1px solid #f0f0f0' }}>
                <CardContent>
                  <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                    <Typography variant="h6" fontWeight="bold">
                      {session.strategyName}
                    </Typography>
                    <Chip
                      size="small"
                      icon={<CheckCircle />}
                      label={t('aiAssistantComplete.practice.completed')}
                      color="success"
                    />
                  </Box>

                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    <Chip
                      size="small"
                      icon={<Timer />}
                      label={`${session.duration} min`}
                      sx={{ backgroundColor: '#e8f5e8' }}
                    />
                    <Chip
                      size="small"
                      label={`${session.userRating}/5 helpful`}
                      sx={{ backgroundColor: '#fff3e0' }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {new Date(session.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Typography>

                  {session.mood_before && session.mood_after && (
                    <Box mt={2}>
                      <Typography variant="caption" color="text.secondary">
                        Mood: {session.mood_before} → {session.mood_after}
                      </Typography>
                    </Box>
                  )}

                  {/* Enhanced data for thought challenging sessions */}
                  {session.journalEntries && session.journalEntries.length > 0 && (
                    <Box mt={2}>
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Typography variant="caption" fontWeight="bold">
                            📝 Thought Record ({session.journalEntries.length} entries)
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {session.journalEntries.map((entry, idx) => (
                            <Paper key={idx} sx={{ p: 1, mb: 1, backgroundColor: '#f9f9f9' }}>
                              <Typography variant="caption" display="block">
                                <strong>Original thought:</strong> {entry.text}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Belief strength: {entry.beliefRating}%
                              </Typography>
                            </Paper>
                          ))}
                          {session.balancedThought && (
                            <Paper sx={{ p: 1, backgroundColor: '#e8f5e8' }}>
                              <Typography variant="caption" display="block">
                                <strong>Balanced thought:</strong> {session.balancedThought}
                              </Typography>
                              {session.beliefRatingBefore && session.beliefRatingAfter && (
                                <Typography variant="caption" color="text.secondary">
                                  Belief change: {session.beliefRatingBefore}% → {session.beliefRatingAfter}%
                                </Typography>
                              )}
                            </Paper>
                          )}
                          {session.aiAnalysis && (
                            <Box mt={1}>
                              <Chip
                                size="small"
                                icon={<PsychologyIcon />}
                                label={`AI: ${session.aiAnalysis.sentiment} (${Math.round(session.aiAnalysis.confidence * 100)}%)`}
                                color={session.aiAnalysis.sentiment === 'Positive' ? 'success' :
                                       session.aiAnalysis.sentiment === 'Negative' ? 'error' : 'default'}
                              />
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );

  const tabContent = [
    { label: t('aiAssistantComplete.tabs.insights'), icon: <Insights />, component: <CurrentInsights /> },
    { label: t('aiAssistantComplete.tabs.copingStrategies'), icon: <HealthAndSafety />, component: <CopingStrategies /> },
    { label: t('aiAssistantComplete.tabs.practiceHistory'), icon: <Timer />, component: <PracticeHistory /> },
    { label: t('aiAssistantComplete.previousInsights.title'), icon: <History />, component: <InsightHistory /> }
  ];

  if (loading) {
    return (
      <PageLayout user={user} onSignOut={onSignOut} maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 3,
              backgroundColor: '#667eea'
            }}
          >
            <SmartToy sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {t('aiAssistantComplete.analyzing')}
          </Typography>
          <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto', borderRadius: 2 }} />
        </Box>
      </PageLayout>
    );
  }

  return (
    <PageLayout user={user} onSignOut={onSignOut} maxWidth="lg">
      {/* Header */}
      <Fade in timeout={600}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mx: 'auto',
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <SmartToy sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {t('aiAssistantComplete.title')}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            {t('aiAssistantComplete.subtitle')}
          </Typography>
        </Box>
      </Fade>

      {/* Navigation Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={(e, newValue) => setCurrentTab(newValue)}
          centered={!isMobile}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              minWidth: 160
            }
          }}
        >
          {tabContent.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{
                '&.Mui-selected': {
                  color: '#667eea'
                }
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Fade in key={currentTab} timeout={500}>
        <Box>
          {tabContent[currentTab].component}
        </Box>
      </Fade>

      {/* Practice Session Modal */}
      <PracticeSessionModal
        open={practiceModalOpen}
        strategy={selectedStrategy}
        onClose={() => setPracticeModalOpen(false)}
        onComplete={handlePracticeComplete}
      />
    </PageLayout>
  );
};

export default AIAssistant;