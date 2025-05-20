// src/api/importTextApi.js
import { api } from "./api.js";

export const changeModel = async (modelName) => {
  try {
    const res = await api.post("/changemodel", { modelName });
    return res.data;
  } catch (error) {
    console.error("Failed to change model:", error);
    throw error;
  }
};