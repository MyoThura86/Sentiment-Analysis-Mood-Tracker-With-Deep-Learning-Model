import React from 'react';
import { Avatar } from '@mui/material';

const UserAvatar = ({
  user,
  size = 40,
  onClick,
  sx = {},
  showOnlineIndicator = false
}) => {
  const avatarStyle = {
    width: size,
    height: size,
    cursor: onClick ? 'pointer' : 'default',
    border: '2px solid #667eea',
    ...sx
  };

  const getInitials = () => {
    if (!user) return '?';

    // Handle new API format with single 'name' field
    if (user.name) {
      const names = user.name.split(' ');
      const firstInitial = names[0]?.[0] || '';
      const lastInitial = names[names.length - 1]?.[0] || '';
      return `${firstInitial}${lastInitial}`.toUpperCase();
    }

    // Fallback to firstName/lastName format
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getAvatarSrc = () => {
    // Check for custom uploaded avatar first
    if (user?.avatar) {
      return user.avatar;
    }

    // Check for profile avatar (legacy support)
    if (user?.profile?.avatar) {
      return user.profile.avatar;
    }

    // Generate UI-Avatars fallback using name field
    if (user?.name) {
      const encodedName = encodeURIComponent(user.name);
      return `https://ui-avatars.com/api/?name=${encodedName}&background=667eea&color=fff&size=128&rounded=true`;
    }

    // Fallback to firstName/lastName format
    if (user?.firstName && user?.lastName) {
      return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=667eea&color=fff&size=128&rounded=true`;
    }

    return null;
  };

  return (
    <Avatar
      src={getAvatarSrc()}
      alt={user ? (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()) : 'User'}
      onClick={onClick}
      sx={avatarStyle}
    >
      {getInitials()}
    </Avatar>
  );
};

export default UserAvatar;