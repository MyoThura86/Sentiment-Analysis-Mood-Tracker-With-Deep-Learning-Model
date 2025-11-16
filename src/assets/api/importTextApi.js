// src/api/importTextApi.js
import { api } from "./api.js";

export const sendMessage = async (text) => {
  try {
    const res = await api.post("/predict/both", { text });  // Use our dual model endpoint
    return res.data;
  } catch (error) {
    console.error("Failed to fetch sentiment:", error);

    // Enhanced error handling
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.error || 'Server error processing text');
    } else if (error.request) {
      // Network error
      throw new Error('Network error: Unable to reach sentiment analysis server. Please check if the server is running.');
    } else {
      // Other error
      throw new Error('Error processing text: ' + error.message);
    }
  }
};
