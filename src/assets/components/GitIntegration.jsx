import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  useTheme,
  IconButton
} from '@mui/material';
import {
  GitHub,
  Refresh,
  CloudUpload,
  CloudDownload,
  History,
  Add,
  Commit,
  Branch,
  Merge,
  Info,
  Warning,
  CheckCircle,
  Error,
  Close
} from '@mui/icons-material';

const GitIntegration = () => {
  const [gitStatus, setGitStatus] = useState(null);
  const [commits, setCommits] = useState([]);
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [commitDialog, setCommitDialog] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [remoteName, setRemoteName] = useState('origin');
  const [remoteUrl, setRemoteUrl] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchGitStatus();
    fetchCommits();
    fetchBranches();
  }, []);

  const fetchGitStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/git/status');
      const result = await response.json();

      if (result.success) {
        setGitStatus(result.status);
        setCurrentBranch(result.currentBranch);
      } else {
        setError(result.message || 'Failed to fetch Git status');
      }
    } catch (err) {
      setError('Error connecting to Git API');
    } finally {
      setLoading(false);
    }
  };

  const fetchCommits = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/git/commits');
      const result = await response.json();

      if (result.success) {
        setCommits(result.commits);
      }
    } catch (err) {
      console.error('Error fetching commits:', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/git/branches');
      const result = await response.json();

      if (result.success) {
        setBranches(result.branches);
      }
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) {
      setError('Please enter a commit message');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/git/commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: commitMessage })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Changes committed successfully!');
        setCommitMessage('');
        setCommitDialog(false);
        fetchGitStatus();
        fetchCommits();
      } else {
        setError(result.message || 'Failed to commit changes');
      }
    } catch (err) {
      setError('Error committing changes');
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/git/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remote: remoteName })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Changes pushed to remote successfully!');
        fetchGitStatus();
      } else {
        setError(result.message || 'Failed to push changes');
      }
    } catch (err) {
      setError('Error pushing changes');
    } finally {
      setLoading(false);
    }
  };

  const handlePull = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/git/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remote: remoteName })
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Changes pulled from remote successfully!');
        fetchGitStatus();
        fetchCommits();
      } else {
        setError(result.message || 'Failed to pull changes');
      }
    } catch (err) {
      setError('Error pulling changes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'clean': return <CheckCircle color="success" />;
      case 'modified': return <Warning color="warning" />;
      case 'ahead': return <CloudUpload color="info" />;
      case 'behind': return <CloudDownload color="info" />;
      default: return <Info color="action" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'clean': return 'success';
      case 'modified': return 'warning';
      case 'ahead': return 'info';
      case 'behind': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <GitHub color="primary" />
        Git Integration
      </Typography>

      {error && (
        <Alert
          severity="error"
          onClose={() => setError('')}
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={() => setError('')}>
              <Close />
            </IconButton>
          }
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          onClose={() => setSuccess('')}
          sx={{ mb: 2 }}
          action={
            <IconButton size="small" onClick={() => setSuccess('')}>
              <Close />
            </IconButton>
          }
        >
          {success}
        </Alert>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Repository Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Branch color="primary" />
            Repository Status
            <Button
              size="small"
              startIcon={<Refresh />}
              onClick={fetchGitStatus}
              disabled={loading}
            >
              Refresh
            </Button>
          </Typography>

          {gitStatus && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  Current Branch: <strong>{currentBranch}</strong>
                </Typography>
                <Chip
                  icon={getStatusIcon(gitStatus.status)}
                  label={gitStatus.status}
                  color={getStatusColor(gitStatus.status)}
                  size="small"
                />
              </Box>

              {gitStatus.modified && gitStatus.modified.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="warning.main">
                    Modified Files ({gitStatus.modified.length}):
                  </Typography>
                  <List dense>
                    {gitStatus.modified.slice(0, 5).map((file, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <Warning color="warning" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                      </ListItem>
                    ))}
                    {gitStatus.modified.length > 5 && (
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`... and ${gitStatus.modified.length - 5} more files`}
                          sx={{ fontStyle: 'italic', color: 'text.secondary' }}
                        />
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}

              {gitStatus.staged && gitStatus.staged.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="success.main">
                    Staged Files ({gitStatus.staged.length}):
                  </Typography>
                  <List dense>
                    {gitStatus.staged.map((file, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <CheckCircle color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary={file} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Git Actions */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Git Actions
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCommitDialog(true)}
              disabled={loading || !gitStatus?.modified?.length}
            >
              Stage & Commit
            </Button>

            <Button
              variant="outlined"
              startIcon={<CloudUpload />}
              onClick={handlePush}
              disabled={loading}
            >
              Push
            </Button>

            <Button
              variant="outlined"
              startIcon={<CloudDownload />}
              onClick={handlePull}
              disabled={loading}
            >
              Pull
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Remote Name"
              value={remoteName}
              onChange={(e) => setRemoteName(e.target.value)}
              size="small"
              sx={{ width: 150 }}
            />
            <TextField
              label="Remote URL"
              value={remoteUrl}
              onChange={(e) => setRemoteUrl(e.target.value)}
              placeholder="https://github.com/user/repo.git"
              size="small"
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Recent Commits */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History color="primary" />
            Recent Commits
          </Typography>

          {commits.length > 0 ? (
            <List>
              {commits.slice(0, 10).map((commit, index) => (
                <React.Fragment key={commit.hash}>
                  <ListItem>
                    <ListItemIcon>
                      <Commit color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={commit.message}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {commit.author} • {commit.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {commit.hash.substring(0, 7)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < commits.length - 1 && index < 9 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              No commits found
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Commit Dialog */}
      <Dialog open={commitDialog} onClose={() => setCommitDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Commit</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Commit Message"
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            placeholder="Describe your changes..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommitDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCommit}
            variant="contained"
            disabled={!commitMessage.trim() || loading}
          >
            Commit Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GitIntegration;