// src/api/sentimentApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/sentiment'; // Change if deployed

/**
 * Send text to backend and get sentiment prediction.
 * @param {string} text - The input text to analyze.
 * @returns {Promise<{ sentiment: string, originalText: string }>}
 */
export const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(API_URL, { text });
    return response.data;
  } catch (error) {
    console.error('Error fetching sentiment:', error);
    throw error;
  }
};
