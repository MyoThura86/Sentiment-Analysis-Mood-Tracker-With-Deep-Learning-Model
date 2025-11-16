import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  Paper,
  Divider,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Psychology, AutoAwesome, Compare, Send, Analytics } from '@mui/icons-material';

const DualModelAnalysis = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      case 'neutral': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      case 'neutral': return '😐';
      default: return '🤔';
    }
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/predict/both`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text');
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    if (!results) return [];

    return [
      {
        sentiment: 'Negative',
        RoBERTa: results.roberta.scores?.negative || 0,
        LSTM: results.lstm.scores?.negative || 0,
      },
      {
        sentiment: 'Neutral',
        RoBERTa: results.roberta.scores?.neutral || 0,
        LSTM: results.lstm.scores?.neutral || 0,
      },
      {
        sentiment: 'Positive',
        RoBERTa: results.roberta.scores?.positive || 0,
        LSTM: results.lstm.scores?.positive || 0,
      },
    ];
  };

  const ModelCard = ({ title, result, icon, color }) => (
    <Card sx={{ height: '100%', border: `2px solid ${color}`, borderRadius: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {icon}
          <Typography variant="h6" component="h2" ml={1} color={color}>
            {title}
          </Typography>
        </Box>

        {result.error ? (
          <Alert severity="error">{result.error}</Alert>
        ) : (
          <>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
              <Typography variant="h3" mr={1}>
                {getSentimentEmoji(result.sentiment)}
              </Typography>
              <Chip
                label={result.sentiment}
                sx={{
                  backgroundColor: getSentimentColor(result.sentiment),
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                }}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" mb={2}>
              Confidence: {(result.confidence * 100).toFixed(1)}%
            </Typography>

            <Box mb={2}>
              <Typography variant="body2" gutterBottom>
                Positive: {(result.scores?.positive * 100).toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.scores?.positive * 100}
                sx={{ mb: 1, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#4caf50' } }}
              />

              <Typography variant="body2" gutterBottom>
                Neutral: {(result.scores?.neutral * 100).toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.scores?.neutral * 100}
                sx={{ mb: 1, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' } }}
              />

              <Typography variant="body2" gutterBottom>
                Negative: {(result.scores?.negative * 100).toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.scores?.negative * 100}
                sx={{ backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' } }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Typography variant="h4" component="h1" gutterBottom color="white" textAlign="center">
          🔍 Dual Model Sentiment Analysis
        </Typography>
        <Typography variant="h6" color="white" textAlign="center" opacity={0.9}>
          Compare RoBERTa and LSTM model predictions
        </Typography>
      </Paper>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Enter text to analyze"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your text here..."
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            onClick={analyzeText}
            disabled={loading || !text.trim()}
            fullWidth
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <Compare />}
            sx={{
              py: 1.5,
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)',
              }
            }}
          >
            {loading ? 'Analyzing...' : 'Analyze Sentiment'}
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <ModelCard
                title="RoBERTa Model"
                result={results.roberta}
                icon={<Psychology sx={{ color: '#2196f3' }} />}
                color="#2196f3"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ModelCard
                title="LSTM Model"
                result={results.lstm}
                icon={<AutoAwesome sx={{ color: '#9c27b0' }} />}
                color="#9c27b0"
              />
            </Grid>
          </Grid>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Model Comparison Chart
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="sentiment" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                  <Tooltip
                    formatter={(value) => [`${(value * 100).toFixed(1)}%`, '']}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Bar dataKey="RoBERTa" fill="#2196f3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="LSTM" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default DualModelAnalysis;