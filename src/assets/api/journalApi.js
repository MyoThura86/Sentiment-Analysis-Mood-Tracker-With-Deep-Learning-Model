// Enhanced Journal API with server-side storage and AI recommendations
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get user ID from localStorage or user object
const getUserId = (user) => {
  if (user && user.id) return user.id;

  // Try to get from localStorage as fallback
  const storedUser = localStorage.getItem('currentUser');
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
    const userId = getUserId(user) || 'default_user';
    headers['User-ID'] = userId;
  }

  return headers;
};

// Journal Entry Operations
export const journalApi = {
  // Get all journal entries for the user
  async getEntries(user) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/journal/entries`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        entries: data.entries || [],
        total: data.total || 0
      };
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return {
        success: false,
        error: error.message,
        entries: [],
        total: 0
      };
    }
  },

  // Create a new journal entry
  async createEntry(user, text, tags = []) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/journal/entries`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text: text.trim(),
          tags
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        entry: data.entry,
        message: data.message,
        aiAnalysis: data.ai_analysis || null
      };
    } catch (error) {
      console.error('Error creating journal entry:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Delete a journal entry
  async deleteEntry(user, entryId) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/journal/entries/${entryId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get analytics for user's journal entries
  async getAnalytics(user) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/journal/analytics`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        analytics: data.analytics
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        success: false,
        error: error.message,
        analytics: {
          total_entries: 0,
          sentiment_distribution: {},
          patterns: {},
          trends: {}
        }
      };
    }
  }
};

// AI Recommendations API
export const recommendationsApi = {
  // Get personalized AI recommendations
  async getPersonalizedRecommendations(user) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        recommendations: data.recommendations || [],
        patterns: data.patterns || {},
        insight: data.insight || {},
        currentSentiment: data.current_sentiment || 'Neutral'
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return {
        success: false,
        error: error.message,
        recommendations: [],
        patterns: {},
        insight: {},
        currentSentiment: 'Neutral'
      };
    }
  },

  // Get AI-powered insights for notifications
  async getAIPoweredInsights(user) {
    try {
      const headers = createHeaders(user);

      const response = await fetch(`${API_BASE_URL}/notifications/insights`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        insight: data.insight || {},
        copingStrategies: data.copingStrategies || [],
        patterns: data.patterns || {}
      };
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return {
        success: false,
        error: error.message,
        insight: {},
        copingStrategies: [],
        patterns: {}
      };
    }
  }
};

// Migration utility to move localStorage data to server
export const migrationUtils = {
  // Migrate existing localStorage journal entries to server
  async migrateLocalStorageToServer(user) {
    try {
      const userId = getUserId(user);
      if (!userId) {
        console.warn('No user ID available for migration');
        return { success: false, migrated: 0 };
      }

      // Get existing localStorage entries
      const localEntries = localStorage.getItem(`journal_${userId}`);
      if (!localEntries) {
        console.log('No local entries found to migrate');
        return { success: true, migrated: 0 };
      }

      const entries = JSON.parse(localEntries);
      if (!Array.isArray(entries) || entries.length === 0) {
        console.log('No valid local entries to migrate');
        return { success: true, migrated: 0 };
      }

      // Check if entries already exist on server
      const serverEntries = await journalApi.getEntries(user);
      if (serverEntries.success && serverEntries.total > 0) {
        console.log('Server entries already exist, skipping migration');
        return { success: true, migrated: 0, skipped: true };
      }

      // Migrate each entry to server
      let migratedCount = 0;
      for (const entry of entries) {
        try {
          const result = await journalApi.createEntry(user, entry.text, entry.tags || []);
          if (result.success) {
            migratedCount++;
          }
        } catch (error) {
          console.error('Error migrating entry:', error);
        }
      }

      // Clear localStorage after successful migration
      if (migratedCount > 0) {
        localStorage.removeItem(`journal_${userId}`);
        console.log(`Successfully migrated ${migratedCount} entries to server`);
      }

      return {
        success: true,
        migrated: migratedCount,
        total: entries.length
      };

    } catch (error) {
      console.error('Migration error:', error);
      return {
        success: false,
        error: error.message,
        migrated: 0
      };
    }
  }
};

// Hybrid storage utility for backwards compatibility
export const hybridStorage = {
  // Get entries from server, fallback to localStorage
  async getEntries(user) {
    try {
      // Try server first
      const serverResult = await journalApi.getEntries(user);
      if (serverResult.success && serverResult.entries.length > 0) {
        return serverResult;
      }

      // Fallback to localStorage
      const userId = getUserId(user);
      if (userId) {
        const localEntries = localStorage.getItem(`journal_${userId}`);
        if (localEntries) {
          const entries = JSON.parse(localEntries);
          return {
            success: true,
            entries: Array.isArray(entries) ? entries : [],
            total: Array.isArray(entries) ? entries.length : 0,
            source: 'localStorage'
          };
        }
      }

      return { success: true, entries: [], total: 0, source: 'empty' };
    } catch (error) {
      console.error('Hybrid storage error:', error);
      return { success: false, error: error.message, entries: [], total: 0 };
    }
  },

  // Save entry to server, fallback to localStorage
  async saveEntry(user, text, tags = []) {
    try {
      // Try server first
      const serverResult = await journalApi.createEntry(user, text, tags);
      if (serverResult.success) {
        return serverResult;
      }

      // Fallback to localStorage
      const userId = getUserId(user);
      if (userId) {
        const existingEntries = localStorage.getItem(`journal_${userId}`);
        const entries = existingEntries ? JSON.parse(existingEntries) : [];

        const newEntry = {
          id: Date.now().toString(),
          user_id: userId,
          text: text.trim(),
          date: new Date().toISOString(),
          sentiment: 'Neutral', // Default sentiment
          confidence: 0.5,
          scores: {},
          tags
        };

        entries.unshift(newEntry);
        localStorage.setItem(`journal_${userId}`, JSON.stringify(entries));

        return {
          success: true,
          entry: newEntry,
          source: 'localStorage'
        };
      }

      throw new Error('Unable to save entry');
    } catch (error) {
      console.error('Hybrid save error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default {
  journalApi,
  recommendationsApi,
  migrationUtils,
  hybridStorage
};