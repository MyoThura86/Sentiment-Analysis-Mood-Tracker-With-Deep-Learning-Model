import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Paper,
  IconButton,
  Fade,
  Slide,
  Stack,
  Divider,
  Badge,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  Security,
  AutoGraph,
  Favorite,
  Star,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  Insights,
  Timeline,
  Shield,
  Analytics,
  AutoAwesome,
  Verified,
  TrendingUpOutlined,
  LocalHospital,
  SupportAgent,
  MenuBook,
  EmojiEmotions
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchPlatformStats } from '../api/statsApi';

const LandingPage = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState({ users: 0, entries: 0, accuracy: 0 });
  const [platformStats, setPlatformStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Enhanced features with modern design approach
  const features = [
    {
      icon: <AutoAwesome />,
      title: 'AI-Powered Analysis',
      description: 'Advanced sentiment analysis using RoBERTa and LSTM models to understand your emotional patterns with 90% accuracy.',
      color: '#7c3aed',
      gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      bgPattern: 'radial-gradient(circle at 20% 20%, rgba(124, 58, 237, 0.15) 0%, transparent 50%)'
    },
    {
      icon: <TrendingUpOutlined />,
      title: 'Mood Tracking',
      description: 'Track your emotional journey over time with beautiful visualizations and insights powered by real-time analytics.',
      color: '#059669',
      gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
      bgPattern: 'radial-gradient(circle at 80% 80%, rgba(5, 150, 105, 0.15) 0%, transparent 50%)'
    },
    {
      icon: <Shield />,
      title: 'Private & Secure',
      description: 'Your mental health data is encrypted with bank-level security. Complete privacy guaranteed with zero data sharing.',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
      bgPattern: 'radial-gradient(circle at 20% 80%, rgba(220, 38, 38, 0.15) 0%, transparent 50%)'
    },
    {
      icon: <LocalHospital />,
      title: 'Clinical Insights',
      description: 'Get evidence-based insights and personalized recommendations from mental health professionals.',
      color: '#0ea5e9',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)'
    }
  ];

  // Enhanced testimonials
  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Clinical Psychologist',
      avatar: '👩‍⚕️',
      rating: 5,
      text: 'MoodTracker provides incredibly accurate sentiment analysis. The dual-model approach gives deeper insights than traditional methods.',
      company: 'Stanford Medical Center',
      verified: true
    },
    {
      name: 'Michael Rodriguez',
      role: 'Mental Health Researcher',
      avatar: '👨‍🔬',
      rating: 5,
      text: 'The RoBERTa and LSTM combination is revolutionary. It understands emotional nuances better than any tool I\'ve used.',
      company: 'MIT Research Lab',
      verified: true
    },
    {
      name: 'Emma Thompson',
      role: 'Wellness Coach',
      avatar: '🧘‍♀️',
      rating: 5,
      text: 'The personalized insights help my clients track their progress. It\'s like having an AI therapist available 24/7.',
      company: 'Mindful Living Institute',
      verified: true
    }
  ];

  // Load platform stats from API
  useEffect(() => {
    const loadStats = async () => {
      setStatsLoading(true);
      const result = await fetchPlatformStats();
      setPlatformStats(result.data);
      setStatsLoading(false);
    };
    loadStats();
  }, []);

  // Enhanced stats with real mental health focus
  const stats = platformStats ? [
    {
      number: statsLoading ? <CircularProgress size={16} color="inherit" /> : platformStats.users,
      label: 'Active Users',
      icon: <EmojiEmotions />,
      color: '#7c3aed'
    },
    {
      number: statsLoading ? <CircularProgress size={16} color="inherit" /> : platformStats.entries,
      label: 'Mood Entries',
      icon: <MenuBook />,
      color: '#059669'
    },
    {
      number: statsLoading ? <CircularProgress size={16} color="inherit" /> : platformStats.accuracy,
      label: 'AI Accuracy',
      icon: <Analytics />,
      color: '#dc2626'
    },
    {
      number: statsLoading ? <CircularProgress size={16} color="inherit" /> : platformStats.support,
      label: 'Support',
      icon: <SupportAgent />,
      color: '#0ea5e9'
    }
  ] : [
    { number: '150+', label: 'Active Users', icon: <EmojiEmotions />, color: '#7c3aed' },
    { number: '2.8K+', label: 'Mood Entries', icon: <MenuBook />, color: '#059669' },
    { number: '95%', label: 'AI Accuracy', icon: <Analytics />, color: '#dc2626' },
    { number: '24/7', label: 'Support', icon: <SupportAgent />, color: '#0ea5e9' }
  ];

  // Animated counter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ users: 15, entries: 85, accuracy: 95 });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const FloatingElement = ({ children, delay = 0 }) => (
    <Box
      sx={{
        animation: 'float 6s ease-in-out infinite',
        animationDelay: `${delay}s`,
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        }
      }}
    >
      {children}
    </Box>
  );

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: '#fafbfc' }}>
      {/* Compact Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 2, md: 3 },
          pb: { xs: 4, md: 6 }
        }}
      >
        {/* Modern Geometric Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 15% 15%, rgba(255,255,255,0.08) 0%, transparent 40%),
              radial-gradient(circle at 85% 85%, rgba(124,58,237,0.15) 0%, transparent 40%),
              linear-gradient(135deg, rgba(99,102,241,0.05) 0%, rgba(139,92,246,0.05) 100%)
            `,
            zIndex: 0
          }}
        />

        {/* Repositioned Floating Orbs - Away from text */}
        <Box
          sx={{
            position: 'absolute',
            top: '8%',
            right: '5%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
            animation: 'float 8s ease-in-out infinite',
            backdropFilter: 'blur(10px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '8%',
            width: 60,
            height: 60,
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            background: 'linear-gradient(45deg, rgba(251,191,36,0.15) 0%, rgba(245,158,11,0.08) 100%)',
            animation: 'float 10s ease-in-out infinite reverse',
            backdropFilter: 'blur(8px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '60%',
            right: '20%',
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)',
            animation: 'float 12s ease-in-out infinite',
            backdropFilter: 'blur(6px)',
            zIndex: 0
          }}
        />

        {/* Floating Emoji Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: '12%', md: '15%' },
            left: { xs: '5%', md: '8%' },
            zIndex: 1,
            animation: 'float 6s ease-in-out infinite',
            display: { xs: 'none', sm: 'block' },
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
              '50%': { transform: 'translateY(-20px) rotate(5deg)' },
            }
          }}
        >
          <Box
            sx={{
              fontSize: '3rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            😊
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block',
              mt: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Positive
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: '20%', md: '25%' },
            right: { xs: '8%', md: '12%' },
            zIndex: 1,
            animation: 'float 8s ease-in-out infinite',
            animationDelay: '2s',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          <Box
            sx={{
              fontSize: '3rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            😢
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block',
              mt: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Negative
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: '8%', md: '10%' },
            right: { xs: '20%', md: '25%' },
            zIndex: 1,
            animation: 'float 7s ease-in-out infinite',
            animationDelay: '1s',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <Box
            sx={{
              fontSize: '3rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            😐
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block',
              mt: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Neutral
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: '65%', md: '70%' },
            right: { xs: '15%', md: '18%', lg: '22%' },
            zIndex: 3,
            animation: 'float 9s ease-in-out infinite',
            animationDelay: '3s',
            display: { xs: 'none', lg: 'block' }
          }}
        >
          <Box
            sx={{
              fontSize: '2.5rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 70,
              height: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            🤔
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block',
              mt: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Thoughtful
          </Typography>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: { xs: '65%', md: '70%' },
            right: { xs: '5%', md: '8%', lg: '12%' },
            zIndex: 3,
            animation: 'float 5s ease-in-out infinite',
            animationDelay: '4s',
            display: { xs: 'none', lg: 'block' }
          }}
        >
          <Box
            sx={{
              fontSize: '2.5rem',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              width: 70,
              height: 70,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}
          >
            😌
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'block',
              mt: 1,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Peaceful
          </Typography>
        </Box>

        {/* Mobile Emoji Row */}
        <Box
          sx={{
            display: { xs: 'flex', sm: 'none' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3,
            position: 'absolute',
            top: '5%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '2rem',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mb: 0.5
              }}
            >
              😊
            </Box>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
              Positive
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '2rem',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mb: 0.5
              }}
            >
              😐
            </Box>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
              Neutral
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                fontSize: '2rem',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: 50,
                height: 50,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                mb: 0.5
              }}
            >
              😢
            </Box>
            <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem' }}>
              Negative
            </Typography>
          </Box>
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center" sx={{ minHeight: '70vh', pt: { xs: 0, md: 0 } }}>
            <Grid item xs={12} lg={6}>
              <Fade in timeout={1000}>
                <Box sx={{ maxWidth: { lg: '90%' } }}>
                  {/* Status Badge */}
                  <Badge
                    badgeContent="AI-Powered"
                    sx={{
                      mb: 2,
                      mt: { xs: 4, sm: 2, md: 1 },
                      '& .MuiBadge-badge': {
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        padding: '8px 12px',
                        borderRadius: '12px'
                      }
                    }}
                  >
                    <Chip
                      label="✨ Advanced Mental Health Analytics"
                      sx={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        py: 2,
                        px: 3,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    />
                  </Badge>

                  <Typography
                    variant="h1"
                    component="h1"
                    fontWeight="800"
                    color="white"
                    gutterBottom
                    sx={{
                      fontSize: { xs: '2.2rem', md: '2.8rem', lg: '3.2rem' },
                      lineHeight: 1.1,
                      textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.02em',
                      maxWidth: '100%'
                    }}
                  >
                    Transform Your{' '}
                    <Box
                      component="span"
                      sx={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      Mental Wellness
                    </Box>{' '}
                    Journey
                  </Typography>

                  <Typography
                    variant="h5"
                    color="rgba(255,255,255,0.95)"
                    paragraph
                    sx={{
                      mb: 4,
                      fontSize: { xs: '1rem', md: '1.1rem', lg: '1.2rem' },
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: { xs: '100%', md: '95%', lg: '90%' }
                    }}
                  >
                    Advanced AI sentiment analysis using RoBERTa and LSTM models to provide deep insights into your emotional patterns and mental health journey.
                  </Typography>

                  {/* Action Buttons */}
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={() => navigate('/signup')}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: 4,
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        boxShadow: '0 8px 32px rgba(251, 191, 36, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 12px 40px rgba(251, 191, 36, 0.6)'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Start Free Analysis
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={() => navigate('/demo')}
                      sx={{
                        px: 6,
                        py: 2,
                        borderRadius: 4,
                        border: '2px solid rgba(255,255,255,0.3)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.8)',
                          background: 'rgba(255,255,255,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Stack>

                  {/* Enhanced Stats */}
                  <Box
                    sx={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      p: 4,
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    <Grid container spacing={3}>
                      {stats.map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                          <Box textAlign="center">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 1,
                                color: stat.color
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Typography variant="h4" fontWeight="800" color="white" sx={{ mb: 0.5 }}>
                              {stat.number}
                            </Typography>
                            <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontSize: '0.9rem' }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} lg={6}>
              <Slide direction="left" in timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: { xs: 'center', lg: 'flex-end' },
                    alignItems: 'center',
                    height: '100%',
                    mt: { xs: 6, lg: 0 }
                  }}
                >
                  {/* Main Dashboard Preview */}
                  <FloatingElement delay={0.5}>
                    <Paper
                      elevation={0}
                      sx={{
                        width: { xs: 280, sm: 320, md: 340, lg: 360 },
                        height: { xs: 320, sm: 350, md: 370, lg: 400 },
                        maxWidth: '90vw',
                        borderRadius: 4,
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(30px)',
                        p: { xs: 2.5, md: 3 },
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Header */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" fontWeight="bold" color="#1f2937" gutterBottom>
                          AI Sentiment Analysis
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={95}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'rgba(99,102,241,0.1)',
                            '& .MuiLinearProgress-bar': {
                              background: 'linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)',
                              borderRadius: 3
                            }
                          }}
                        />
                        <Typography variant="caption" color="#6b7280" sx={{ mt: 1, display: 'block' }}>
                          95% Accuracy with RoBERTa + LSTM Models
                        </Typography>
                      </Box>

                      {/* AI Models Preview */}
                      <Stack spacing={3}>
                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #7c3aed15 0%, #a855f725 100%)',
                            border: '1px solid rgba(124,58,237,0.2)'
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <AutoAwesome sx={{ color: '#7c3aed', mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" color="#1f2937">
                              RoBERTa Model
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="#6b7280">
                            Advanced transformer analysis
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, #05966915 0%, #10b98125 100%)',
                            border: '1px solid rgba(5,150,105,0.2)'
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <TrendingUpOutlined sx={{ color: '#059669', mr: 1 }} />
                            <Typography variant="subtitle1" fontWeight="bold" color="#1f2937">
                              MentalBERT-LSTM
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="#6b7280">
                            Mental health specialized insights
                          </Typography>
                        </Box>

                        <Box sx={{ textAlign: 'center', pt: 2 }}>
                          <Chip
                            label="Real-time Analysis"
                            size="small"
                            sx={{
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  </FloatingElement>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Compact Features Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          position: 'relative'
        }}
      >
        <Container maxWidth="lg">
          {/* Section Header */}
          <Box textAlign="center" sx={{ mb: 6, px: { xs: 2, md: 0 } }}>
            <Badge
              badgeContent="Advanced AI"
              sx={{
                mb: 3,
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }
              }}
            >
              <Chip
                label="💡 Powerful Features"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2,
                  px: 3
                }}
              />
            </Badge>

            <Typography
              variant="h2"
              fontWeight="800"
              gutterBottom
              sx={{
                color: '#1f2937',
                fontSize: { xs: '1.8rem', md: '2.2rem', lg: '2.6rem' },
                letterSpacing: '-0.02em',
                mb: 2,
                maxWidth: '90%',
                mx: 'auto'
              }}
            >
              Advanced Tools for Your{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Mental Wellness
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="#6b7280"
              sx={{
                maxWidth: { xs: '90%', md: 650 },
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Everything you need to track, understand, and improve your mental health journey with cutting-edge AI technology.
            </Typography>
          </Box>

          {/* Features Grid */}
          <Grid container spacing={4} sx={{ maxWidth: { xl: '90%' }, mx: 'auto' }}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Fade in timeout={800 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0,0,0,0.08)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      background: `linear-gradient(135deg, white 0%, ${feature.color}05 100%)`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-12px)',
                        boxShadow: `0 32px 64px ${feature.color}25, 0 16px 32px rgba(0,0,0,0.15)`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: feature.bgPattern,
                        opacity: 0.4,
                        zIndex: 0
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                      <Box display="flex" alignItems="flex-start" spacing={3}>
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 3,
                            background: feature.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                            boxShadow: `0 6px 18px ${feature.color}40`,
                            flexShrink: 0
                          }}
                        >
                          {React.cloneElement(feature.icon, { sx: { color: 'white', fontSize: 28 } })}
                        </Box>
                        <Box flex={1}>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            gutterBottom
                            sx={{ color: '#1f2937', mb: 1.5, fontSize: '1.25rem' }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body1"
                            color="#4b5563"
                            sx={{
                              lineHeight: 1.7,
                              fontSize: '1rem'
                            }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {/* Compact CTA Box */}
          <Fade in timeout={1200}>
            <Box
              sx={{
                textAlign: 'center',
                mt: 8,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 4,
                p: 5,
                color: 'white',
                boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background Pattern */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 80% 80%, rgba(124,58,237,0.2) 0%, transparent 50%)
                  `,
                  opacity: 0.8
                }}
              />
              <Box position="relative" zIndex={1}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                  Ready to Transform Your Mental Health?
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.95, mb: 4, maxWidth: 500, mx: 'auto' }}>
                  Join thousands who are already improving their wellness with our advanced AI-powered sentiment analysis
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      px: 6,
                      py: 2,
                      borderRadius: 4,
                      background: 'white',
                      color: '#667eea',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
                      '&:hover': {
                        background: '#f8fafc',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 32px rgba(255,255,255,0.4)'
                      }
                    }}
                  >
                    Start Your Journey Free
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/demo')}
                    sx={{
                      px: 6,
                      py: 2,
                      borderRadius: 4,
                      border: '2px solid rgba(255,255,255,0.4)',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    View Live Demo
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Compact Testimonials Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
        py: { xs: 8, md: 10 },
        position: 'relative'
      }}>
        {/* Modern decorative elements - repositioned */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: 250,
            height: 250,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg">
          {/* Compact Section Header */}
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Badge
              badgeContent="Verified"
              sx={{
                mb: 3,
                '& .MuiBadge-badge': {
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }
              }}
            >
              <Chip
                label="🎯 Trusted Results"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  py: 2,
                  px: 3
                }}
              />
            </Badge>

            <Typography
              variant="h3"
              fontWeight="800"
              gutterBottom
              sx={{
                color: '#1f2937',
                fontSize: { xs: '1.8rem', md: '2.4rem' },
                letterSpacing: '-0.02em',
                mb: 2
              }}
            >
              Trusted by{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Healthcare Professionals
              </Box>
            </Typography>
            <Typography
              variant="h6"
              color="#6b7280"
              sx={{
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1.1rem', md: '1.2rem' }
              }}
            >
              Real stories from mental health experts and researchers who use our AI models
            </Typography>
          </Box>

          {/* Enhanced Testimonials Grid */}
          <Grid container spacing={5}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} lg={4} key={index}>
                <Fade in timeout={1000 + index * 300}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 5,
                      background: 'white',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.1)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      border: '1px solid rgba(0,0,0,0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 24px 64px rgba(0,0,0,0.15)'
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Header with avatar and verification */}
                      <Box display="flex" alignItems="center" mb={4}>
                        <Avatar
                          sx={{
                            mr: 3,
                            fontSize: '2.2rem',
                            width: 70,
                            height: 70,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                          }}
                        >
                          {testimonial.avatar}
                        </Avatar>
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Typography variant="h6" fontWeight="bold" color="#1f2937" sx={{ mr: 1 }}>
                              {testimonial.name}
                            </Typography>
                            {testimonial.verified && (
                              <Verified sx={{ color: '#059669', fontSize: 20 }} />
                            )}
                          </Box>
                          <Typography variant="body2" color="#6b7280" sx={{ mb: 0.5 }}>
                            {testimonial.role}
                          </Typography>
                          <Typography variant="caption" color="#9ca3af" sx={{ fontSize: '0.85rem' }}>
                            {testimonial.company}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Rating */}
                      <Box display="flex" mb={4}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: '#fbbf24', fontSize: 24 }} />
                        ))}
                      </Box>

                      {/* Quote */}
                      <Typography
                        variant="body1"
                        color="#374151"
                        sx={{
                          flex: 1,
                          fontStyle: 'italic',
                          lineHeight: 1.7,
                          fontSize: '1.05rem',
                          position: 'relative',
                          '&::before': {
                            content: '"',
                            fontSize: '4rem',
                            color: '#e5e7eb',
                            position: 'absolute',
                            top: '-20px',
                            left: '-10px',
                            fontFamily: 'serif',
                            lineHeight: 1
                          }
                        }}
                      >
                        {testimonial.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section - Compact */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced decorative elements - repositioned */}
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            right: '5%',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '5%',
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.12) 0%, transparent 70%)',
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box sx={{ maxWidth: { xl: '85%' }, mx: 'auto', textAlign: 'center' }}>
              {/* Compact CTA Content */}
              <Typography
                variant="h2"
                fontWeight="800"
                gutterBottom
                sx={{
                  fontSize: { xs: '2rem', md: '2.6rem', lg: '3rem' },
                  letterSpacing: '-0.02em',
                  mb: 3,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  maxWidth: '90%',
                  mx: 'auto'
                }}
              >
                Begin Your Mental Health{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Transformation
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mb: 5,
                  maxWidth: { xs: '95%', md: 550 },
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Join thousands of users who are improving their mental wellness with advanced AI-powered sentiment analysis using RoBERTa and LSTM models
              </Typography>

              {/* Action Buttons */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3}
                justifyContent="center"
                sx={{ mb: 5 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  onClick={() => navigate('/signup')}
                  sx={{
                    px: 8,
                    py: 2.5,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    boxShadow: '0 12px 40px rgba(251, 191, 36, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 16px 48px rgba(251, 191, 36, 0.6)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Start Free Analysis
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/signin')}
                  sx={{
                    px: 8,
                    py: 2.5,
                    borderRadius: 4,
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.8)',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Sign In
                </Button>
              </Stack>

              {/* Trust Indicators */}
              <Box
                sx={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 4,
                  p: 4,
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: 800,
                  mx: 'auto'
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={4}
                  divider={<Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <CheckCircle sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      Free Forever
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Shield sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      100% Private & Secure
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AutoAwesome sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', fontWeight: '500' }}>
                      95% AI Accuracy
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;