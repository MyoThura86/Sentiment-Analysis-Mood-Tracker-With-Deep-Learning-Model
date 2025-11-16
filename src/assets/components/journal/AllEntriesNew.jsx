import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Fade,
  Pagination,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Skeleton,
  Grow,
  Slide
} from '@mui/material';
import {
  Delete,
  Edit,
  FilterList,
  Search,
  Psychology,
  TrendingUp,
  TrendingDown,
  Timeline,
  EmojiEmotions,
  CalendarToday,
  Insights
} from '@mui/icons-material';
import PageLayout from '../layout/PageLayout';
import { journalApi } from '../../api/journalApi';
import { useTranslation } from '../../../hooks/useTranslation';

const AllEntries = ({ user, onSignOut }) => {
  const { t } = useTranslation();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sentimentFilter, setSentimentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const entriesPerPage = 6;

  useEffect(() => {
    loadEntries();
  }, [user.id]);

  useEffect(() => {
    filterEntries();
  }, [entries, sentimentFilter, searchQuery]);

  const loadEntries = async () => {
    try {
      setLoading(true);

      // Fetch entries from API
      const result = await journalApi.getEntries(user);

      if (result.success && result.entries) {
        setEntries(result.entries);
      } else {
        console.error('Failed to load entries:', result.error);
        setEntries([]);
      }
    } catch (error) {
      console.error('Error loading entries:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = entries;

    if (sentimentFilter !== 'All') {
      filtered = filtered.filter(entry => entry.sentiment === sentimentFilter);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(entry =>
        entry.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
    setCurrentPage(1);
  };

  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete from API
      const result = await journalApi.deleteEntry(user, selectedEntry.id);

      if (result.success) {
        // Update local state
        const updatedEntries = entries.filter(entry => entry.id !== selectedEntry.id);
        setEntries(updatedEntries);
      } else {
        console.error('Failed to delete entry:', result.error);
        alert('Failed to delete entry. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setSelectedEntry(null);
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '😊';
      case 'Negative': return '😔';
      case 'Neutral': return '😐';
      default: return '😐';
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive': return '#4caf50';
      case 'Negative': return '#f44336';
      case 'Neutral': return '#ff9800';
      default: return '#ff9800';
    }
  };

  const getSentimentStats = () => {
    const stats = { Positive: 0, Negative: 0, Neutral: 0 };
    entries.forEach(entry => {
      stats[entry.sentiment]++;
    });
    return stats;
  };

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const stats = getSentimentStats();

  const StatChip = ({ label, value, color, delay = 0 }) => (
    <Grow in={!loading} timeout={800} style={{ transitionDelay: `${delay}ms` }}>
      <Chip
        label={`${label}: ${value}`}
        sx={{
          backgroundColor: `${color}20`,
          color: color,
          fontWeight: 'bold',
          px: 1,
          py: 0.5,
          '&:hover': {
            backgroundColor: `${color}30`,
            transform: 'translateY(-1px)'
          },
          transition: 'all 0.3s ease'
        }}
      />
    </Grow>
  );

  return (
    <PageLayout user={user} onSignOut={onSignOut} maxWidth="lg">
      {/* Header Section */}
      <Slide direction="down" in={!loading} timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Psychology sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#333">
                {t('journal.allEntries')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('dashboard.startJournaling')}
              </Typography>
            </Box>
          </Box>

          {/* Stats Overview */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
            <StatChip label="Total" value={entries.length} color="#667eea" delay={0} />
            <StatChip label="Positive" value={stats.Positive} color="#4caf50" delay={100} />
            <StatChip label="Neutral" value={stats.Neutral} color="#ff9800" delay={200} />
            <StatChip label="Negative" value={stats.Negative} color="#f44336" delay={300} />
          </Box>
        </Box>
      </Slide>

      {/* Filters and Search */}
      <Slide direction="up" in={!loading} timeout={1000}>
        <Card sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder={t('journal.searchEntries')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center">
                  <FilterList sx={{ mr: 2, color: 'text.secondary' }} />
                  <ToggleButtonGroup
                    value={sentimentFilter}
                    exclusive
                    onChange={(e, value) => value && setSentimentFilter(value)}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    <ToggleButton value="All" sx={{ borderRadius: 2, px: 2 }}>
                      {t('testHistory.allTests')}
                    </ToggleButton>
                    <ToggleButton value="Positive" sx={{ borderRadius: 2, px: 2 }}>
                      😊 {t('csvResearch.positive')}
                    </ToggleButton>
                    <ToggleButton value="Neutral" sx={{ borderRadius: 2, px: 2 }}>
                      😐 {t('csvResearch.neutral')}
                    </ToggleButton>
                    <ToggleButton value="Negative" sx={{ borderRadius: 2, px: 2 }}>
                      😔 {t('csvResearch.negative')}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Slide>

      {/* Entries Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : filteredEntries.length === 0 ? (
        <Grow in timeout={1200}>
          <Card sx={{ borderRadius: 4, textAlign: 'center', py: 8 }}>
            <CardContent>
              <EmojiEmotions sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {searchQuery || sentimentFilter !== 'All' ? t('emptyStates.noResults') : t('dashboard.noEntriesYet')}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {searchQuery || sentimentFilter !== 'All'
                  ? t('emptyStates.adjustFilters')
                  : t('dashboard.startJournaling')
                }
              </Typography>
              {(!searchQuery && sentimentFilter === 'All') && (
                <Button
                  variant="contained"
                  sx={{ borderRadius: 3 }}
                  onClick={() => navigate('/dashboard')}
                >
                  {t('dashboard.startNewEntry')}
                </Button>
              )}
            </CardContent>
          </Card>
        </Grow>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedEntries.map((entry, index) => (
              <Grid item xs={12} md={6} key={entry.id}>
                <Grow in timeout={1000} style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: '1px solid #e0e0e0',
                      borderLeft: `4px solid ${getSentimentColor(entry.sentiment)}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.1)'
                      },
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header */}
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Typography>
                          <Chip
                            label={`${getSentimentEmoji(entry.sentiment)} ${entry.sentiment}`}
                            size="small"
                            sx={{
                              backgroundColor: `${getSentimentColor(entry.sentiment)}20`,
                              color: getSentimentColor(entry.sentiment),
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>

                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteEntry(entry)}
                            sx={{
                              color: '#f44336',
                              '&:hover': {
                                backgroundColor: '#ffebee'
                              }
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Content */}
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          lineHeight: 1.7,
                          flexGrow: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {entry.text}
                      </Typography>

                      {/* Footer */}
                      <Box>
                        <Box display="flex" justifyContent="between" alignItems="center" mb={1}>
                          <Typography variant="caption" color="text.secondary">
                            AI Confidence Score
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {(entry.confidence * 100).toFixed(1)}%
                          </Typography>
                        </Box>
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

                        {/* Model Agreement Indicator */}
                        {entry.roberta && entry.lstm && (
                          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                            <Chip
                              label={entry.roberta.sentiment === entry.lstm.sentiment ? '✓ Models Agree' : '⚠ Models Differ'}
                              size="small"
                              color={entry.roberta.sentiment === entry.lstm.sentiment ? 'success' : 'warning'}
                              variant="outlined"
                            />
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredEntries.length > entriesPerPage && (
            <Fade in timeout={1500}>
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  count={Math.ceil(filteredEntries.length / entriesPerPage)}
                  page={currentPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  color="primary"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </Fade>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {t('journal.delete')} {t('journal.newEntry')}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            {t('journal.delete')}?
          </Typography>
          {selectedEntry && (
            <Paper
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                borderLeft: `4px solid ${getSentimentColor(selectedEntry.sentiment)}`
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(selectedEntry.date).toLocaleDateString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {selectedEntry.text}
              </Typography>
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t('journal.cancel')}
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            {t('journal.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default AllEntries;