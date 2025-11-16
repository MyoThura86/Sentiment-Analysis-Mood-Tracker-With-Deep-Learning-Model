// User API for profile and authentication management
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get user ID from localStorage or user object
const getUserId = (user) => {
  if (user && user.id) return user.id;
  if (user && user.email) return user.email; // Use email as fallback identifier

  // Try to get from localStorage as fallback
  const storedUser = localStorage.getItem('user'); // Changed from 'currentUser' to 'user'
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.id || parsedUser.email;
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }

  return 'default_user'; // Fallback for testing
};

// Create headers with JWT token
const createHeaders = (user) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Get JWT token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Fallback to User-ID header for backwards compatibility
    const userId = getUserId(user);
    headers['User-ID'] = userId;
  }

  return headers;
};

export const userApi = {
  // Get user profile with stats
  async getProfile(user) {
    try {
      const userId = getUserId(user);

      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.user) {
        // Update localStorage with the complete user data
        const updatedUser = {
          ...user,
          ...data.user,
          name: data.user.name || user?.name || 'User'
        };

        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      }

      return data;

    } catch (error) {
      console.error('Error fetching user profile:', error);
      return {
        success: false,
        error: error.message,
        user: null
      };
    }
  },

  // Update user profile
  async updateProfile(user, profileData) {
    try {
      const userId = getUserId(user);

      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update localStorage with new profile data
        const updatedUser = { ...user, ...profileData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }

      return data;

    } catch (error) {
      console.error('Error updating user profile:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get dashboard stats
  async getDashboardStats(user) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: error.message,
        stats: {}
      };
    }
  },

  // Initialize user in database if needed
  async initializeUser(userData) {
    try {
      const userId = userData.id || userData.email || 'default_user';
      const headers = {
        'Content-Type': 'application/json',
        'User-ID': userId
      };

      const response = await fetch(`${API_BASE_URL}/users/${userId}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          email: userData.email,
          name: userData.name || `${userData.given_name || ''} ${userData.family_name || ''}`.trim() || 'User'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error initializing user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default userApi;