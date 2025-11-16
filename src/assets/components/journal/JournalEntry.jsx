import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Fade,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Send,
  Psychology,
  Save,
  Cancel,
  Insights,
  TrendingUp,
  TrendingDown,
  Timeline
} from '@mui/icons-material';
import { useTranslation } from '../../../hooks/useTranslation';

const JournalEntry = ({ onSave, onCancel }) => {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please write something before analyzing');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/predict/both', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const result = await response.json();

      // Use LSTM model results as primary (since user prefers LSTM)
      const primaryResult = result.lstm || result.roberta || {};

      setAnalysis({
        text: text.trim(),
        sentiment: primaryResult.sentiment || 'Unknown',
        confidence: primaryResult.confidence || 0,
        scores: primaryResult.scores || { positive: 0, neutral: 0, negative: 0 },
        roberta: result.roberta,
        lstm: result.lstm
      });
    } catch (err) {
      setError(err.message || 'Failed to analyze text. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (!analysis) {
      setError('Please analyze your text before saving');
      return;
    }

    onSave({
      text: analysis.text,
      sentiment: analysis.sentiment,
      confidence: analysis.confidence,
      scores: analysis.scores,
      roberta: analysis.roberta,
      lstm: analysis.lstm
    });

    // Reset form
    setText('');
    setAnalysis(null);
    setError('');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      case 'neutral': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return <TrendingUp sx={{ color: '#4caf50' }} />;
      case 'negative': return <TrendingDown sx={{ color: '#f44336' }} />;
      case 'neutral': return <Timeline sx={{ color: '#ff9800' }} />;
      default: return <Psychology sx={{ color: '#9e9e9e' }} />;
    }
  };

  const getMotivationalMessage = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return "That's wonderful! Keep nurturing these positive feelings. 🌟";
      case 'negative':
        return "It's okay to feel this way. Remember, difficult times don't last, but resilient people do. 💪";
      case 'neutral':
        return "Every feeling is valid. Sometimes neutral days help us appreciate the brighter ones. 🌤️";
      default:
        return "Thank you for sharing your thoughts. Self-reflection is a powerful tool for growth. 🌱";
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Simple Header */}
      <Typography variant="h5" fontWeight="600" gutterBottom sx={{ mb: 3 }}>
        {t('journal.howAreYouFeeling')}
      </Typography>

      {/* Text Input */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={6}
          placeholder={t('journal.writeThoughts')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {text.length} {t('journal.characters')}
          </Typography>

          <Button
            variant="contained"
            onClick={analyzeText}
            disabled={!text.trim() || isAnalyzing}
            startIcon={isAnalyzing ? <CircularProgress size={20} /> : <Insights />}
          >
            {isAnalyzing ? t('common.loading') : t('csvResearch.analyze')}
          </Button>
        </Box>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Analysis Results */}
      {analysis && (
        <Fade in timeout={500}>
          <Box>
            {/* Primary Analysis */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                  <Typography variant="h6" fontWeight="600">
                    Analysis Results
                  </Typography>
                  <Chip
                    label={`${getSentimentEmoji(analysis.sentiment)} ${analysis.sentiment}`}
                    sx={{
                      backgroundColor: getSentimentColor(analysis.sentiment),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>

                {/* Confidence Score */}
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    Confidence: {(analysis.confidence * 100).toFixed(1)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysis.confidence * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: getSentimentColor(analysis.sentiment)
                      }
                    }}
                  />
                </Box>

                {/* Detailed Scores */}
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" color="#4caf50">
                        {(analysis.scores.positive * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('csvResearch.positive')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" color="#ff9800">
                        {(analysis.scores.neutral * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('csvResearch.neutral')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box textAlign="center">
                      <Typography variant="h6" fontWeight="bold" color="#f44336">
                        {(analysis.scores.negative * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t('csvResearch.negative')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Motivational Message */}
                <Alert
                  severity={analysis.sentiment === 'positive' ? 'success' : analysis.sentiment === 'negative' ? 'info' : 'warning'}
                  sx={{ borderRadius: 2 }}
                >
                  {getMotivationalMessage(analysis.sentiment)}
                </Alert>
              </CardContent>
            </Card>

            {/* Model Comparison */}
            {analysis.roberta && analysis.lstm && (
              <Card sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    Model Comparison
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          RoBERTa
                        </Typography>
                        <Typography variant="h6">
                          {getSentimentEmoji(analysis.roberta.sentiment)} {analysis.roberta.sentiment}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(analysis.roberta.confidence * 100).toFixed(1)}% confidence
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" color="secondary" gutterBottom>
                          LSTM
                        </Typography>
                        <Typography variant="h6">
                          {getSentimentEmoji(analysis.lstm.sentiment)} {analysis.lstm.sentiment}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(analysis.lstm.confidence * 100).toFixed(1)}% confidence
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </Fade>
      )}

      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          onClick={onCancel}
          startIcon={<Cancel />}
        >
          {t('journal.cancel')}
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!analysis}
          startIcon={<Save />}
          color="success"
        >
          {t('journal.saveEntry')}
        </Button>
      </Box>
    </Box>
  );
};

export default JournalEntry;