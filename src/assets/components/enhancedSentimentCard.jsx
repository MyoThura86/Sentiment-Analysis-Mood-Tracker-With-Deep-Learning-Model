import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Collapse,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Psychology,
  AutoAwesome,
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

const EnhancedSentimentCard = ({ text, roberta, lstm, timestamp }) => {
  const [expanded, setExpanded] = useState(false);

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
      case 'neutral': return <TrendingFlat sx={{ color: '#ff9800' }} />;
      default: return null;
    }
  };

  const getAgreementStatus = () => {
    if (!roberta?.sentiment || !lstm?.sentiment) return null;

    const agreement = roberta.sentiment === lstm.sentiment;
    return {
      agreed: agreement,
      message: agreement
        ? "Models agree on sentiment"
        : "Models disagree on sentiment"
    };
  };

  const ScoreBar = ({ label, value, color }) => (
    <Box sx={{ mb: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {(value * 100).toFixed(1)}%
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={value * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: color,
            borderRadius: 4
          }
        }}
      />
    </Box>
  );

  const ModelResult = ({ title, result, color, icon }) => (
    <Paper elevation={2} sx={{ p: 2, border: `1px solid ${color}` }}>
      <Box display="flex" alignItems="center" mb={2}>
        {icon}
        <Typography variant="h6" ml={1} color={color}>
          {title}
        </Typography>
      </Box>

      {result?.error ? (
        <Typography color="error">{result.error}</Typography>
      ) : (
        <>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Typography variant="h4" mr={1}>
              {getSentimentEmoji(result?.sentiment)}
            </Typography>
            <Box>
              <Chip
                label={result?.sentiment || 'Unknown'}
                sx={{
                  backgroundColor: getSentimentColor(result?.sentiment),
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 1
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Confidence: {result?.confidence ? (result.confidence * 100).toFixed(1) : 0}%
              </Typography>
            </Box>
          </Box>

          {expanded && result?.scores && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Detailed Scores:
              </Typography>
              <ScoreBar label="Positive" value={result.scores.positive} color="#4caf50" />
              <ScoreBar label="Neutral" value={result.scores.neutral} color="#ff9800" />
              <ScoreBar label="Negative" value={result.scores.negative} color="#f44336" />
            </Box>
          )}
        </>
      )}
    </Paper>
  );

  const agreement = getAgreementStatus();

  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        {/* Text being analyzed */}
        <Box mb={2}>
          <Typography variant="body1" sx={{
            fontStyle: 'italic',
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            borderLeft: '4px solid #2196f3'
          }}>
            "{text}"
          </Typography>
        </Box>

        {/* Agreement indicator */}
        {agreement && (
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Chip
              label={agreement.message}
              color={agreement.agreed ? "success" : "warning"}
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}

        {/* Model results */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ModelResult
              title="RoBERTa"
              result={roberta}
              color="#2196f3"
              icon={<Psychology sx={{ color: '#2196f3' }} />}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ModelResult
              title="LSTM"
              result={lstm}
              color="#9c27b0"
              icon={<AutoAwesome sx={{ color: '#9c27b0' }} />}
            />
          </Grid>
        </Grid>

        {/* Expand/Collapse button */}
        <Box display="flex" justifyContent="center" mt={2}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
            <Typography variant="body2" ml={1}>
              {expanded ? 'Show Less' : 'Show Details'}
            </Typography>
          </IconButton>
        </Box>

        {/* Timestamp */}
        {timestamp && (
          <Box mt={2}>
            <Divider />
            <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
              Analyzed at: {new Date(timestamp).toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedSentimentCard;