#!/usr/bin/env python3
"""
Simple Model Implementation based on user's Model.py
Direct implementation of the LSTM + MentalBERT logic
"""

import numpy as np
import torch
import tensorflow as tf
from transformers import AutoModel, AutoTokenizer
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for models (following user's Model.py pattern)
model = None
tokenizer = None
mentalbert = None

def load_models():
    """Load models exactly as in user's Model.py"""
    global model, tokenizer, mentalbert

    try:
        # Load the trained LSTM model (user's path from Model.py)
        lstm_path = "../mentalbert_lstm_model.keras"
        if os.path.exists(lstm_path):
            model = tf.keras.models.load_model(lstm_path)
            logger.info(f"LSTM model loaded from: {lstm_path}")
        else:
            logger.error(f"LSTM model not found at: {lstm_path}")
            return False

        # Load the fine-tuned MentalBERT model (user's path from Model.py)
        mentalbert_path = "../mentalbert_sentiment_model"
        if os.path.exists(mentalbert_path):
            tokenizer = AutoTokenizer.from_pretrained(mentalbert_path)
            mentalbert = AutoModel.from_pretrained(mentalbert_path)
            logger.info(f"MentalBERT model loaded from: {mentalbert_path}")
        else:
            logger.error(f"MentalBERT model not found at: {mentalbert_path}")
            return False

        return True

    except Exception as e:
        logger.error(f"Error loading models: {e}")
        return False

def extract_embedding(text):
    """
    Extract embeddings from MentalBERT - exact copy from user's Model.py
    """
    global mentalbert, tokenizer

    if mentalbert is None or tokenizer is None:
        raise ValueError("Models not loaded")

    mentalbert.eval()
    inputs = tokenizer(text, padding="max_length", truncation=True, max_length=300, return_tensors="pt")

    with torch.no_grad():
        output = mentalbert(**inputs)
        embedding = output.last_hidden_state.mean(dim=1)  # Mean pooling

    return embedding.cpu().numpy()

def predict_sentiment(text):
    """
    Predict sentiment - exact copy from user's Model.py
    """
    global model

    if model is None:
        raise ValueError("LSTM model not loaded")

    embedding = extract_embedding(text)

    # Flatten the embedding from shape (1, 1, 768) to (1, 768)
    embedding = embedding.reshape(1, 768)  # Reshape to match the LSTM input shape

    prediction = model.predict(embedding)
    sentiment_class = np.argmax(prediction)  # Get the class with the highest probability

    label_mapping = {0: "Positive", 1: "Negative", 2: "Neutral"}
    predicted_sentiment = label_mapping[sentiment_class]

    # Get confidence scores
    probabilities = prediction[0] if len(prediction.shape) > 1 else prediction
    confidence = float(probabilities[sentiment_class])

    # Create scores dict matching expected format
    scores = {
        'positive': float(probabilities[0]),   # Index 0 = Positive
        'negative': float(probabilities[1]),   # Index 1 = Negative
        'neutral': float(probabilities[2])     # Index 2 = Neutral
    }

    return {
        'sentiment': predicted_sentiment,
        'confidence': confidence,
        'scores': scores,
        'model': 'MentalBERT-LSTM (User Model)',
        'embeddings_used': 'MentalBERT Fine-tuned',
        'architecture': 'User Trained Model'
    }

def predict_with_simple_model(text):
    """
    Main prediction function matching the expected API
    """
    try:
        # Ensure models are loaded
        if model is None or tokenizer is None or mentalbert is None:
            if not load_models():
                raise ValueError("Failed to load models")

        # Make prediction using user's exact logic
        result = predict_sentiment(text)
        return result

    except Exception as e:
        logger.error(f"Error in prediction: {e}")

        # Return fallback prediction
        return {
            'sentiment': 'Neutral',
            'confidence': 0.5,
            'scores': {
                'positive': 0.33,
                'negative': 0.33,
                'neutral': 0.34
            },
            'model': 'MentalBERT-LSTM (Error)',
            'error': str(e)
        }

# Initialize models on import
if __name__ != "__main__":
    load_models()