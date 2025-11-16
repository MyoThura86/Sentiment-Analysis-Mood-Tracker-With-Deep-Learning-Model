import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  AppBar,
  Toolbar,
  Fade,
  Pagination
} from '@mui/material';
import {
  ArrowBack,
  Delete,
  Edit,
  TrendingUp,
  TrendingDown,
  Timeline,
  FilterList,
  Search,
  Psychology
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AllEntries = ({ user }) => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const entriesPerPage = 6;

  useEffect(() => {
    loadEntries();
  }, [user.id]);

  useEffect(() => {
    filterEntries();
  }, [entries, sentimentFilter]);

  const loadEntries = () => {
    const savedEntries = localStorage.getItem(`journal_${user.id}`);
    if (savedEntries) {
      const parsedEntries = JSON.parse(savedEntries);
      setEntries(parsedEntries);
    }
  };

  const filterEntries = () => {
    if (sentimentFilter === 'All') {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.sentiment === sentimentFilter));
    }
    setCurrentPage(1);
  };

  const deleteEntry = (entryId) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    localStorage.setItem(`journal_${user.id}`, JSON.stringify(updatedEntries));
    setDeleteDialogOpen(false);
    setSelectedEntry(null);
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

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const sentimentCounts = {
    All: entries.length,
    Positive: entries.filter(e => e.sentiment === 'Positive').length,
    Neutral: entries.filter(e => e.sentiment === 'Neutral').length,
    Negative: entries.filter(e => e.sentiment === 'Negative').length
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <AppBar position="sticky" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            All Journal Entries
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {filteredEntries.length} entries
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Filter Buttons */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Typography variant="h6" fontWeight="bold">
                Filter by Sentiment
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {Object.entries(sentimentCounts).map(([sentiment, count]) => (
                  <Chip
                    key={sentiment}
                    label={`${sentiment} (${count})`}
                    onClick={() => setSentimentFilter(sentiment)}
                    variant={sentimentFilter === sentiment ? 'filled' : 'outlined'}
                    sx={{
                      backgroundColor: sentimentFilter === sentiment ? getSentimentColor(sentiment) + '20' : 'transparent',
                      borderColor: getSentimentColor(sentiment),
                      color: getSentimentColor(sentiment),
                      fontWeight: sentimentFilter === sentiment ? 'bold' : 'normal',
                      '&:hover': {
                        backgroundColor: getSentimentColor(sentiment) + '10'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Entries Grid */}
        {filteredEntries.length === 0 ? (
          <Card sx={{ textAlign: 'center', py: 6 }}>
            <CardContent>
              <Psychology sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No entries found
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {sentimentFilter === 'All'
                  ? "You haven't written any journal entries yet"
                  : `No ${sentimentFilter.toLowerCase()} entries found`
                }
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3
                }}
              >
                Write Your First Entry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Grid container spacing={3} mb={4}>
              {currentEntries.map((entry, index) => (
                <Grid item xs={12} md={6} key={entry.id}>
                  <Fade in timeout={300 + index * 100}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        borderLeft: `4px solid ${getSentimentColor(entry.sentiment)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        {/* Header */}
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setSelectedEntry(entry);
                                setDeleteDialogOpen(true);
                              }}
                              sx={{ color: 'text.secondary' }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Sentiment Chip */}
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                          <Chip
                            icon={getSentimentIcon(entry.sentiment)}
                            label={`${getSentimentEmoji(entry.sentiment)} ${entry.sentiment}`}
                            sx={{
                              backgroundColor: getSentimentColor(entry.sentiment) + '20',
                              color: getSentimentColor(entry.sentiment),
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: getSentimentColor(entry.sentiment)
                              }
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {(entry.confidence * 100).toFixed(1)}% confidence
                          </Typography>
                        </Box>

                        {/* Entry Text */}
                        <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                          {entry.text.length > 200
                            ? `${entry.text.substring(0, 200)}...`
                            : entry.text
                          }
                        </Typography>

                        {/* Confidence Bar */}
                        <LinearProgress
                          variant="determinate"
                          value={entry.confidence * 100}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              backgroundColor: getSentimentColor(entry.sentiment)
                            }
                          }}
                        />

                        {/* Model Comparison */}
                        {entry.roberta && entry.lstm && (
                          <Box mt={2} pt={2} borderTop="1px solid #eee">
                            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                              AI Model Comparison:
                            </Typography>
                            <Box display="flex" justifyContent="space-between" gap={2}>
                              <Box textAlign="center" flex={1}>
                                <Typography variant="caption" color="primary.main" fontWeight="bold">
                                  RoBERTa
                                </Typography>
                                <Typography variant="body2">
                                  {getSentimentEmoji(entry.roberta.sentiment)} {entry.roberta.sentiment}
                                </Typography>
                              </Box>
                              <Box textAlign="center" flex={1}>
                                <Typography variant="caption" color="secondary.main" fontWeight="bold">
                                  LSTM
                                </Typography>
                                <Typography variant="body2">
                                  {getSentimentEmoji(entry.lstm.sentiment)} {entry.lstm.sentiment}
                                </Typography>
                              </Box>
                            </Box>
                            {entry.roberta.sentiment === entry.lstm.sentiment && (
                              <Chip
                                label="✅ Models agree"
                                size="small"
                                color="success"
                                sx={{ mt: 1, fontSize: '0.7rem' }}
                              />
                            )}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(event, value) => setCurrentPage(value)}
                  color="primary"
                  size="large"
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Delete Journal Entry
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this entry? This action cannot be undone.
          </Typography>
          {selectedEntry && (
            <Paper
              elevation={1}
              sx={{
                p: 2,
                mt: 2,
                backgroundColor: '#f5f5f5',
                borderLeft: `4px solid ${getSentimentColor(selectedEntry.sentiment)}`
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(selectedEntry.date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2">
                {selectedEntry.text.substring(0, 100)}
                {selectedEntry.text.length > 100 && '...'}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 3 }}>
            Cancel
          </Button>
          <Button
            onClick={() => deleteEntry(selectedEntry.id)}
            color="error"
            variant="contained"
            sx={{ borderRadius: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AllEntries;