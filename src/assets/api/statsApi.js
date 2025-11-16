// API functions for fetching platform statistics
const API_BASE_URL = 'http://localhost:5001/api';

export const fetchPlatformStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    return {
      success: false,
      error: error.message,
      // Fallback data in case API is unavailable
      data: {
        users: "150+",
        entries: "2.8K+",
        accuracy: "95%",
        support: "24/7",
        raw_numbers: {
          users: 150,
          entries: 2800,
          accuracy: 95
        }
      }
    };
  }
};