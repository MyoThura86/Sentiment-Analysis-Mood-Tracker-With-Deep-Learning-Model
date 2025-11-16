import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress,
  Divider,
  Slide,
  Grow,
  Fade
} from '@mui/material';
import PageLayout from '../layout/PageLayout';
import {
  CloudUpload,
  Analytics,
  Download,
  Psychology,
  AutoAwesome,
  Compare,
  Assessment,
  TableChart,
  BarChart
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ModelSelector from '../ModelSelector';
import { useTranslation } from '../../../hooks/useTranslation';

const CSVAnalysis = ({ user, onSignOut }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModel, setSelectedModel] = useState('both');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/plain' ||
      file.type === 'application/csv' ||
      file.name.toLowerCase().endsWith('.csv')
    )) {
      setSelectedFile(file);
      setError('');
    } else {
      setError('Please select a valid CSV file');
    }
  };

  const analyzeCSV = async () => {
    if (!selectedFile) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Use FormData to send the file to the dedicated CSV endpoint
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:5001/api/analyze/csv', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status} ${response.statusText}`);
      }

      const apiResponse = await response.json();
      console.log('📥 CSV Analysis Response:', apiResponse);

      if (!apiResponse.results || !Array.isArray(apiResponse.results)) {
        throw new Error('Invalid response format from server');
      }

      // Transform API response to match component format
      const results = apiResponse.results.map((result, index) => ({
        id: index + 1,
        text: (result.text || '').substring(0, 100) + ((result.text || '').length > 100 ? '...' : ''),
        fullText: result.text || '',
        roberta: result.roberta || null,
        lstm: result.lstm || null,
        agreement: result.agreement || false
      }));

      // Generate summary statistics
      const validResults = results.filter(r => r.roberta && r.lstm);
      const summary = generateSummary(validResults);

      setAnalysisResults({
        results: results,
        summary: summary,
        progress: 100,
        completed: true,
        totalEntries: results.length,
        processedEntries: results.length,
        textColumn: apiResponse.text_column || 'text'
      });

    } catch (err) {
      console.error('🚫 CSV Analysis failed:', err);
      setError(err.message || 'Failed to analyze CSV file');
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = (results) => {
    if (results.length === 0) return null;

    const robertaStats = {
      positive: results.filter(r => r.roberta?.sentiment === 'Positive').length,
      neutral: results.filter(r => r.roberta?.sentiment === 'Neutral').length,
      negative: results.filter(r => r.roberta?.sentiment === 'Negative').length
    };

    const lstmStats = {
      positive: results.filter(r => r.lstm?.sentiment === 'Positive').length,
      neutral: results.filter(r => r.lstm?.sentiment === 'Neutral').length,
      negative: results.filter(r => r.lstm?.sentiment === 'Negative').length
    };

    const agreementCount = results.filter(r => r.agreement).length;
    const disagreementCount = results.length - agreementCount;

    const avgConfidenceRoberta = results.reduce((sum, r) => sum + (r.roberta?.confidence || 0), 0) / results.length;
    const avgConfidenceLSTM = results.reduce((sum, r) => sum + (r.lstm?.confidence || 0), 0) / results.length;

    return {
      totalEntries: results.length,
      roberta: robertaStats,
      lstm: lstmStats,
      agreement: {
        count: agreementCount,
        percentage: (agreementCount / results.length) * 100
      },
      disagreement: {
        count: disagreementCount,
        percentage: (disagreementCount / results.length) * 100
      },
      avgConfidence: {
        roberta: avgConfidenceRoberta,
        lstm: avgConfidenceLSTM
      }
    };
  };

  const exportResults = (format) => {
    if (!analysisResults?.results) return;

    const data = analysisResults.results.filter(r => !r.error);

    if (format === 'csv') {
      const csvContent = [
        ['ID', 'Text', 'RoBERTa_Sentiment', 'RoBERTa_Confidence', 'LSTM_Sentiment', 'LSTM_Confidence', 'Models_Agree', 'RoBERTa_Positive', 'RoBERTa_Neutral', 'RoBERTa_Negative', 'LSTM_Positive', 'LSTM_Neutral', 'LSTM_Negative'],
        ...data.map(item => [
          item.id,
          `"${item.fullText.replace(/"/g, '""')}"`,
          item.roberta?.sentiment || 'N/A',
          item.roberta?.confidence || 0,
          item.lstm?.sentiment || 'N/A',
          item.lstm?.confidence || 0,
          item.agreement ? 'Yes' : 'No',
          item.roberta?.scores?.positive || 0,
          item.roberta?.scores?.neutral || 0,
          item.roberta?.scores?.negative || 0,
          item.lstm?.scores?.positive || 0,
          item.lstm?.scores?.neutral || 0,
          item.lstm?.scores?.negative || 0
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentiment_analysis_results_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify({
        metadata: {
          analysisDate: new Date().toISOString(),
          totalEntries: data.length,
          userId: user.id,
          summary: analysisResults.summary
        },
        results: data
      }, null, 2);

      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sentiment_analysis_results_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    setExportDialogOpen(false);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '#4caf50';
      case 'negative': return '#f44336';
      case 'neutral': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getChartData = () => {
    if (!analysisResults?.summary) return [];

    return [
      {
        sentiment: 'Positive',
        RoBERTa: analysisResults.summary.roberta.positive,
        LSTM: analysisResults.summary.lstm.positive
      },
      {
        sentiment: 'Neutral',
        RoBERTa: analysisResults.summary.roberta.neutral,
        LSTM: analysisResults.summary.lstm.neutral
      },
      {
        sentiment: 'Negative',
        RoBERTa: analysisResults.summary.roberta.negative,
        LSTM: analysisResults.summary.lstm.negative
      }
    ];
  };

  const getAgreementData = () => {
    if (!analysisResults?.summary) return [];

    return [
      { name: 'Agreement', value: analysisResults.summary.agreement.count, color: '#4caf50' },
      { name: 'Disagreement', value: analysisResults.summary.disagreement.count, color: '#f44336' }
    ];
  };

  return (
    <PageLayout user={user} onSignOut={onSignOut} maxWidth="xl">
      {/* Header */}
      <Slide direction="down" in timeout={800}>
        <Box sx={{ mb: 4 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Analytics sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="#333">
                {t('csvResearch.title')}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {t('csvResearch.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Slide>

      {/* Model Selection */}
      <Slide direction="up" in timeout={1000}>
        <Box sx={{ mb: 4 }}>
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            showBoth={true}
          />
        </Box>
      </Slide>

      {/* File Upload - Full Width Large */}
      <Grow in timeout={1200}>
        <Card sx={{
          borderRadius: 5,
          mb: 6,
          boxShadow: '0 12px 48px rgba(0,0,0,0.12)',
          border: '1px solid rgba(102, 126, 234, 0.1)'
        }}>
          <CardContent sx={{ p: { xs: 4, md: 8 } }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ mb: 6, textAlign: 'center' }}>
              📤 {t('csvResearch.uploadCSV')}
            </Typography>

            <Box
              sx={{
                border: '4px dashed #d0d0d0',
                borderRadius: 5,
                p: { xs: 6, md: 12 },
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                backgroundColor: 'rgba(102, 126, 234, 0.03)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)'
                }
              }}
              onClick={() => document.getElementById('csv-upload').click()}
            >
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
              />

              <CloudUpload sx={{ fontSize: 120, color: 'primary.main', mb: 4 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                {selectedFile ? selectedFile.name : t('csvResearch.dragDrop')}
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
                {t('csvResearch.supportedFormat')}
              </Typography>

              {selectedFile && (
                <Chip
                  label={`${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`}
                  color="primary"
                  sx={{
                    mt: 4,
                    fontSize: '1.2rem',
                    py: 4,
                    px: 4,
                    height: 'auto',
                    '& .MuiChip-label': {
                      padding: '12px 16px'
                    }
                  }}
                />
              )}
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 4, borderRadius: 3, fontSize: '1.1rem', py: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={analyzeCSV}
              disabled={!selectedFile || loading}
              startIcon={loading ? <CircularProgress size={28} /> : <Analytics sx={{ fontSize: 32 }} />}
              sx={{
                mt: 6,
                py: 3.5,
                borderRadius: 4,
                fontSize: '1.4rem',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 16px 48px rgba(102, 126, 234, 0.5)',
                },
                '&:disabled': {
                  background: '#ccc'
                }
              }}
            >
              {loading ? t('csvResearch.uploading') : t('csvResearch.analyze')}
            </Button>
          </CardContent>
        </Card>
      </Grow>

      {/* Analysis Progress */}
      {loading && analysisResults && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={analysisResults.progress || 0}
              sx={{ height: 8, borderRadius: 4, mb: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              Processed {analysisResults.processedEntries || 0} of {analysisResults.totalEntries || 0} entries
              ({Math.round(analysisResults.progress || 0)}%)
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {analysisResults && analysisResults.completed && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4, pt: 4 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold">
                  {t('csvResearch.analysisResults')}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={() => setExportDialogOpen(true)}
                  sx={{ borderRadius: 3 }}
                >
                  {t('csvResearch.downloadReport')}
                </Button>
              </Box>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                <Tab icon={<BarChart />} label="Summary" />
                <Tab icon={<TableChart />} label="Detailed Results" />
                <Tab icon={<Compare />} label="Model Comparison" />
              </Tabs>
            </Box>

            {/* Summary Tab */}
            {tabValue === 0 && analysisResults.summary && (
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {analysisResults.summary.totalEntries}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Total Entries Analyzed
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" fontWeight="bold" color="success.main">
                        {analysisResults.summary.agreement.percentage.toFixed(1)}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Model Agreement Rate
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
                      <Typography variant="h4" fontWeight="bold" color="info.main">
                        {((analysisResults.summary.avgConfidence.roberta + analysisResults.summary.avgConfidence.lstm) / 2 * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Average Confidence
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Sentiment Distribution Comparison
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsBarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="sentiment" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="RoBERTa" fill="#2196f3" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="LSTM" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Model Agreement
                      </Typography>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={getAgreementData()}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                            label={(entry) => `${entry.name}: ${entry.value}`}
                          >
                            {getAgreementData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Detailed Results Tab */}
            {tabValue === 1 && (
              <Box sx={{ p: 4 }}>
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>ID</strong></TableCell>
                        <TableCell><strong>Text</strong></TableCell>
                        <TableCell><strong>RoBERTa</strong></TableCell>
                        <TableCell><strong>LSTM</strong></TableCell>
                        <TableCell><strong>Agreement</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {analysisResults.results.filter(r => !r.error).slice(0, 20).map((result) => (
                        <TableRow key={result.id} hover>
                          <TableCell>{result.id}</TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2">
                              {result.text}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={`${result.roberta?.sentiment} (${(result.roberta?.confidence * 100).toFixed(1)}%)`}
                              sx={{
                                backgroundColor: getSentimentColor(result.roberta?.sentiment) + '20',
                                color: getSentimentColor(result.roberta?.sentiment)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={`${result.lstm?.sentiment} (${(result.lstm?.confidence * 100).toFixed(1)}%)`}
                              sx={{
                                backgroundColor: getSentimentColor(result.lstm?.sentiment) + '20',
                                color: getSentimentColor(result.lstm?.sentiment)
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="small"
                              label={result.agreement ? '✓ Yes' : '✗ No'}
                              color={result.agreement ? 'success' : 'error'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {analysisResults.results.length > 20 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Showing first 20 results. Export to see all {analysisResults.results.length} entries.
                  </Typography>
                )}
              </Box>
            )}

            {/* Model Comparison Tab */}
            {tabValue === 2 && analysisResults.summary && (
              <Box sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Psychology sx={{ color: '#2196f3', mr: 2 }} />
                        <Typography variant="h6" fontWeight="bold">
                          RoBERTa Model Performance
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.positive')}:</strong> {analysisResults.summary.roberta.positive} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.neutral')}:</strong> {analysisResults.summary.roberta.neutral} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.negative')}:</strong> {analysisResults.summary.roberta.negative} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Average Confidence:</strong> {(analysisResults.summary.avgConfidence.roberta * 100).toFixed(1)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <AutoAwesome sx={{ color: '#9c27b0', mr: 2 }} />
                        <Typography variant="h6" fontWeight="bold">
                          LSTM Model Performance
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.positive')}:</strong> {analysisResults.summary.lstm.positive} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.neutral')}:</strong> {analysisResults.summary.lstm.neutral} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>{t('csvResearch.negative')}:</strong> {analysisResults.summary.lstm.negative} entries
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        <strong>Average Confidence:</strong> {(analysisResults.summary.avgConfidence.lstm * 100).toFixed(1)}%
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Agreement Analysis
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1">
                        <strong>Total Agreements:</strong> {analysisResults.summary.agreement.count}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1">
                        <strong>Total Disagreements:</strong> {analysisResults.summary.disagreement.count}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="body1">
                        <strong>Agreement Rate:</strong> {analysisResults.summary.agreement.percentage.toFixed(1)}%
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Export Analysis Results
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Choose the format for exporting your analysis results:
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={() => exportResults('csv')}
              startIcon={<TableChart />}
              fullWidth
            >
              Export as CSV
            </Button>
            <Button
              variant="outlined"
              onClick={() => exportResults('json')}
              startIcon={<Assessment />}
              fullWidth
            >
              Export as JSON
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default CSVAnalysis;