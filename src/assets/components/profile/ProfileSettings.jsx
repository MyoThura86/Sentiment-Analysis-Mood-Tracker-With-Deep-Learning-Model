import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Badge
} from '@mui/material';
import {
  PhotoCamera,
  Edit,
  Save,
  Cancel,
  Person,
  Upload
} from '@mui/icons-material';

const ProfileSettings = ({ user, onUpdateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage('Image size should be less than 5MB.');
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const generateAvatarUrl = (firstName, lastName) => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=667eea&color=fff&size=128&rounded=true`;
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');

    try {
      let avatarUrl = user?.avatar;

      // If user uploaded a new avatar, convert to base64 and store
      if (avatarFile) {
        const reader = new FileReader();
        reader.onload = () => {
          avatarUrl = reader.result; // Base64 string
          saveProfile(avatarUrl);
        };
        reader.readAsDataURL(avatarFile);
      } else if (formData.firstName !== user?.firstName || formData.lastName !== user?.lastName) {
        // If name changed but no new avatar, update generated avatar
        avatarUrl = generateAvatarUrl(formData.firstName, formData.lastName);
        saveProfile(avatarUrl);
      } else {
        saveProfile(avatarUrl);
      }
    } catch (error) {
      setMessage('Error updating profile: ' + error.message);
      setLoading(false);
    }
  };

  const saveProfile = (avatarUrl) => {
    const updatedUser = {
      ...user,
      ...formData,
      avatar: avatarUrl
    };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Call parent callback
    if (onUpdateProfile) {
      onUpdateProfile(updatedUser);
    }

    setLoading(false);
    setEditing(false);
    setAvatarFile(null);
    setMessage('Profile updated successfully!');

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || ''
    });
    setAvatarPreview(user?.avatar);
    setAvatarFile(null);
    setEditing(false);
    setMessage('');
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Profile Settings
        </Typography>

        {message && (
          <Alert
            severity={message.includes('Error') ? 'error' : 'success'}
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              editing ? (
                <IconButton
                  component="label"
                  sx={{
                    backgroundColor: '#667eea',
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      backgroundColor: '#5a6fd8'
                    }
                  }}
                >
                  <PhotoCamera />
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={handleAvatarUpload}
                  />
                </IconButton>
              ) : null
            }
          >
            <Avatar
              src={avatarPreview || user?.avatar}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid #667eea',
                fontSize: '2rem'
              }}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </Badge>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            {editing ? 'Click the camera icon to change your profile picture' : 'Profile Picture'}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bio"
              name="bio"
              multiline
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!editing}
              variant={editing ? "outlined" : "filled"}
              placeholder="Tell us about yourself..."
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          {!editing ? (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setEditing(true)}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 2,
                px: 3
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                onClick={handleSave}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  px: 3
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;