// Tests API for psychological assessments
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get user ID
const getUserId = (user) => {
  if (user && user.id) return user.id;

  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser);
      return parsedUser.id;
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
  }

  return null;
};

// Helper function to get current language
const getLanguage = () => {
  return localStorage.getItem('appLanguage') || 'en';
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

export const testsApi = {
  // Get all available tests
  async getAllTests() {
    try {
      const language = getLanguage();
      const response = await fetch(`${API_BASE_URL}/tests?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching tests:', error);
      return {
        success: false,
        error: error.message,
        tests: []
      };
    }
  },

  // Get specific test with questions
  async getTest(testId) {
    try {
      const language = getLanguage();
      const response = await fetch(`${API_BASE_URL}/tests/${testId}?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching test:', error);
      return {
        success: false,
        error: error.message,
        test: null
      };
    }
  },

  // Submit test answers
  async submitTest(user, testId, answers) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/tests/${testId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error submitting test:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get user's test history
  async getTestHistory(user, testId = null) {
    try {
      const userId = getUserId(user);
      const url = testId
        ? `${API_BASE_URL}/users/${userId}/test-results?test_id=${testId}`
        : `${API_BASE_URL}/users/${userId}/test-results`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching test history:', error);
      return {
        success: false,
        error: error.message,
        results: []
      };
    }
  },

  // Get mental health insights (correlation analysis)
  async getMentalHealthInsights(user) {
    try {
      const userId = getUserId(user);
      const language = getLanguage();

      const response = await fetch(`${API_BASE_URL}/users/${userId}/mental-health-insights?language=${language}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('Error fetching insights:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default testsApi;
