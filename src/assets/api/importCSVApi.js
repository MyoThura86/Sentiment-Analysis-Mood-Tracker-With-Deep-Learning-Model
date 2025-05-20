// src/api/importCSVApi.js
import { api } from "./api.js";

export const sendCSVFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/analyzefile", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch sentiment:", error);
    throw error;
  }
};