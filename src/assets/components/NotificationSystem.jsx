import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Fade,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip
} from '@mui/material';
import {
  AutoAwesome,
  WbSunny,
  LocalFlorist,
  EmojiEmotions,
  Favorite,
  SelfImprovement,
  CheckCircle
} from '@mui/icons-material';

const NotificationSystem = ({ user, onNotificationClick, isOpen, onClose }) => {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [dailyMessage, setDailyMessage] = useState(null);

  // Daily motivational messages - simple and supportive
  const getDailyMotivationalMessage = () => {
    const messages = [
      {
        title: '🌟 You Are Enough',
        message: `Hello ${user?.firstName || 'Friend'}! Remember that you are worthy of love, kindness, and all the good things life has to offer. Your feelings are valid and your journey matters.`,
        icon: <AutoAwesome />,
        color: '#667eea'
      },
      {
        title: '☀️ New Day, New Possibilities',
        message: 'Every sunrise brings fresh opportunities for growth, healing, and joy. Take a moment to appreciate how far you\'ve come on your wellness journey.',
        icon: <WbSunny />,
        color: '#ff9800'
      },
      {
        title: '🌱 Growth Takes Time',
        message: 'Just like a plant needs time to bloom, your mental health journey is a process. Be patient and gentle with yourself as you grow.',
        icon: <LocalFlorist />,
        color: '#4caf50'
      },
      {
        title: '💙 You\'re Not Alone',
        message: 'Remember that millions of people are on similar journeys. Seeking support and taking care of your mental health is a sign of strength, not weakness.',
        icon: <Favorite />,
        color: '#e91e63'
      },
      {
        title: '✨ Small Steps Count',
        message: 'Every journal entry, every moment of self-reflection, every act of self-care is a victory worth celebrating. Progress isn\'t always linear, and that\'s okay.',
        icon: <SelfImprovement />,
        color: '#9c27b0'
      },
      {
        title: '🎯 Trust Your Journey',
        message: 'Your path to wellness is unique to you. Trust in your ability to navigate challenges and celebrate your resilience along the way.',
        icon: <CheckCircle />,
        color: '#00bcd4'
      },
      {
        title: '🌈 Emotions Are Temporary',
        message: 'Whether you\'re feeling joy or sadness today, remember that all emotions are temporary visitors. Allow yourself to feel without judgment.',
        icon: <EmojiEmotions />,
        color: '#795548'
      }
    ];

    // Select message based on day of week to ensure variety
    const dayOfWeek = new Date().getDay();
    return messages[dayOfWeek % messages.length];
  };

  // Check for daily motivational message (once per day)
  useEffect(() => {
    if (!user?.id) return;

    const today = new Date().toISOString().split('T')[0];
    const hasSeenToday = localStorage.getItem(`daily_motivation_seen_${user.id}_${today}`);

    if (!hasSeenToday) {
      setDailyMessage(getDailyMotivationalMessage());
      setHasNewNotification(true);

      if (onNotificationClick) {
        onNotificationClick(true);
      }
    }
  }, [user?.id]);

  // Handle dialog close
  const handleClose = () => {
    const today = new Date().toISOString().split('T')[0];
    // Mark daily motivation as seen
    localStorage.setItem(`daily_motivation_seen_${user?.id}_${today}`, 'true');
    setHasNewNotification(false);
    setDailyMessage(null);

    if (onNotificationClick) {
      onNotificationClick(false);
    }

    onClose();
  };

  // Expose notification state to parent
  useEffect(() => {
    if (onNotificationClick) {
      onNotificationClick(hasNewNotification);
    }
  }, [hasNewNotification, onNotificationClick]);

  return (
    <Box>
      {/* Daily Motivational Message Dialog */}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)'
          }
        }}
      >
        <DialogTitle sx={{ pb: 2, textAlign: 'center' }}>
          <Typography component="div" fontSize="1.5rem" fontWeight="bold" color="#333" gutterBottom>
            Daily Wellness Message
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A gentle reminder for your mental health journey
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          {dailyMessage && (
            <Fade in timeout={800}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${dailyMessage.color}15 0%, #ffffff 100%)`,
                  border: `2px solid ${dailyMessage.color}20`,
                  textAlign: 'center'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      backgroundColor: dailyMessage.color,
                      color: 'white'
                    }}
                  >
                    {dailyMessage.icon}
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="#333">
                    {dailyMessage.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.7,
                      color: '#555',
                      fontSize: '1.1rem',
                      mb: 3
                    }}
                  >
                    {dailyMessage.message}
                  </Typography>

                  <Chip
                    label="Daily Motivation"
                    sx={{
                      backgroundColor: `${dailyMessage.color}20`,
                      color: dailyMessage.color,
                      fontWeight: 'bold'
                    }}
                  />
                </CardContent>
              </Card>
            </Fade>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              onClick={handleClose}
              variant="contained"
              size="large"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Thank You ✨
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default NotificationSystem;