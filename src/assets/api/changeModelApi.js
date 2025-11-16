// src/api/importTextApi.js
import { api } from "./api.js";

export const changeModel = async (modelName) => {
  try {
    // For our mock API, we'll just return success
    // In real implementation, this would switch between models
    return {
      success: true,
      modelName: modelName,
      message: `Switched to ${modelName} model`
    };
  } catch (error) {
    console.error("Failed to change model:", error);

    // Enhanced error handling
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error changing model');
    } else if (error.request) {
      throw new Error('Network error: Unable to reach server. Please check if the server is running.');
    } else {
      throw new Error('Error changing model: ' + error.message);
    }
  }
};