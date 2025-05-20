// src/api/importTextApi.js
import { api } from "./api.js";

export const sendMessage = async (text) => {
  try {
    const res = await api.post("/predict", { text });  // wrap in object
    return res.data;
  } catch (error) {
    console.error("Failed to fetch sentiment:", error);
    throw error;
  }
};
