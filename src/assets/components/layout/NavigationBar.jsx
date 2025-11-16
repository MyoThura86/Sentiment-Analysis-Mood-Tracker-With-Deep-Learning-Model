import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Badge,
  Chip,
  Fade,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import {
  Psychology,
  Dashboard,
  Analytics,
  FileUpload,
  Settings,
  Logout,
  Person,
  Notifications,
  Menu as MenuIcon,
  Home,
  Article,
  Assignment,
  TrendingUp,
  Close
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import NotificationSystem from '../NotificationSystem';
import UserAvatar from '../common/UserAvatar';
import LanguageSelector from '../common/LanguageSelector';
import { useTranslation } from '../../../hooks/useTranslation';

const NavigationBar = ({ user, onSignOut, journalEntries = [] }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const navigationItems = [
    { label: t('dashboard.nav.dashboard'), path: '/dashboard', icon: <Dashboard /> },
    { label: t('dashboard.nav.aiAssistant'), path: '/ai-assistant', icon: <Psychology /> },
    { label: t('dashboard.nav.allEntries'), path: '/entries', icon: <Article /> },
    { label: t('dashboard.nav.mentalHealthTests'), path: '/tests', icon: <Assignment /> },
    { label: t('dashboard.nav.csvResearch'), path: '/research', icon: <FileUpload /> },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleProfileMenuClose();
    onSignOut();
    navigate('/');
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const isCurrentPath = (path) => location.pathname === path;

  const handleNotificationClick = () => {
    setNotificationDialogOpen(true);
  };

  const handleNotificationUpdate = (hasNew) => {
    console.log('NavigationBar received notification update:', hasNew);
    setHasNewNotification(hasNew);
  };

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      PaperProps={{
        sx: {
          width: 280,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <IconButton
          onClick={toggleMobileDrawer}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
        >
          <Close />
        </IconButton>
        <Psychology sx={{ fontSize: 40, mb: 1 }} />
        <Typography variant="h6" fontWeight="bold">
          MoodTracker
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          AI-Powered Mental Health
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />

      <List sx={{ px: 1, mt: 1 }}>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            button
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: isCurrentPath(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: isCurrentPath(item.path) ? 'bold' : 'normal'
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 2 }} />
        <Box display="flex" alignItems="center" mb={2}>
          <UserAvatar
            user={user}
            size={40}
            sx={{ mr: 2 }}
          />
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
        <Button
          fullWidth
          startIcon={<Logout />}
          onClick={handleSignOut}
          sx={{
            color: 'white',
            borderColor: 'rgba(255,255,255,0.3)',
            '&:hover': {
              borderColor: 'rgba(255,255,255,0.5)',
              backgroundColor: 'rgba(255,255,255,0.1)'
            }
          }}
          variant="outlined"
        >
          {t('auth.signOut') || 'Sign Out'}
        </Button>
      </Box>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          color: '#333'
        }}
      >
        <Toolbar sx={{ px: { xs: 1.5, md: 3 }, minHeight: { xs: 56, sm: 60 } }}>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              onClick={toggleMobileDrawer}
              sx={{ mr: 1, color: '#667eea', p: 1 }}
              size="small"
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          {/* Logo */}
          <Box display="flex" alignItems="center" sx={{ flexGrow: isMobile ? 1 : 0 }}>
            <Psychology sx={{ color: '#667eea', fontSize: { xs: 24, sm: 28 }, mr: { xs: 0.5, sm: 1 } }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer',
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' }
              }}
              onClick={() => navigate('/dashboard')}
            >
              MoodTracker
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={React.cloneElement(item.icon, { sx: { fontSize: { sm: 18, md: 20 } } })}
                  onClick={() => navigate(item.path)}
                  size="small"
                  sx={{
                    mx: 0.5,
                    px: { sm: 2, md: 2.5 },
                    py: 0.75,
                    borderRadius: 2.5,
                    color: isCurrentPath(item.path) ? 'white' : '#667eea',
                    backgroundColor: isCurrentPath(item.path) ? '#667eea' : 'transparent',
                    fontWeight: isCurrentPath(item.path) ? 'bold' : 'normal',
                    fontSize: { sm: '0.8rem', md: '0.875rem' },
                    '&:hover': {
                      backgroundColor: isCurrentPath(item.path) ? '#5a6fd8' : 'rgba(102, 126, 234, 0.1)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrentPath(item.path) ? '0 3px 12px rgba(102, 126, 234, 0.4)' : 'none'
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Right side - Language, Notifications and Profile */}
          <Box display="flex" alignItems="center">
            {/* Language Selector */}
            <LanguageSelector />

            {!isMobile && (
              <>
                <IconButton
                  onClick={handleNotificationClick}
                  sx={{
                    color: '#667eea',
                    mr: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <Badge
                    badgeContent={hasNewNotification ? 1 : 0}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#ff4444',
                        color: 'white',
                        fontSize: '0.7rem',
                        minWidth: '16px',
                        height: '16px'
                      }
                    }}
                  >
                    <Notifications />
                  </Badge>
                </IconButton>

                <Chip
                  label={user?.name?.split(' ')[0] || user?.firstName || 'User'}
                  avatar={
                    <UserAvatar
                      user={user}
                      size={24}
                    />
                  }
                  onClick={handleProfileMenuOpen}
                  sx={{
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                />
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            minWidth: 200
          }
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="subtitle2" fontWeight="bold" color="#333">
            {user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
        </Box>

        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
          <Person sx={{ mr: 1, color: '#667eea' }} />
          {t('profile.title')}
        </MenuItem>
        <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
          <Settings sx={{ mr: 1, color: '#667eea' }} />
          {t('profile.accountSettings')}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} sx={{ color: '#f44336' }}>
          <Logout sx={{ mr: 1 }} />
          {t('auth.signOut') || 'Sign Out'}
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Notification System */}
      <NotificationSystem
        user={user}
        isOpen={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        onNotificationClick={handleNotificationUpdate}
      />

      {/* Spacer for fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default NavigationBar;