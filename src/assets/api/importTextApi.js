// src/api/importTextApi.js
import { analyzeSentiment } from "./api.js";

export const sendMessage = async (text) => {
  try {
    const result = await analyzeSentiment(text);
    return {
      text: result.originalText,
      sentiment: result.sentiment,
    };
  } catch (error) {
    console.error("Failed to fetch sentiment:", error);
    throw error;
  }
};
