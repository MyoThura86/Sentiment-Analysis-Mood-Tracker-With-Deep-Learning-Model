// src/api/importCSVApi.js
import { api } from "./api.js";

export const sendCSVFile = async (file, selectedModel = 'both') => {
  try {
    // Create FormData to send file to backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', selectedModel);

    // Send file to backend for real sentiment analysis
    const response = await api.post('/analyze/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for large files
    });

    return response.data;
  } catch (error) {
    console.error("Failed to process CSV file:", error);

    // Enhanced error handling
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'Server error processing CSV file');
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to reach sentiment analysis server');
    } else {
      // Other error
      throw new Error('Error processing CSV file: ' + error.message);
    }
  }
};
