#!/usr/bin/env python3
"""
Test MentalBERT embedding extraction without LSTM
"""

import os
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_mentalbert_embedding():
    """Test MentalBERT embedding extraction exactly as per user's implementation"""

    # Model paths - same as user's code
    mentalbert_path = "../mentalbert_based_lstm_model/mentalbert_sentiment_model"
    max_length = 300
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    try:
        logger.info(f"Loading MentalBERT model from: {mentalbert_path}")

        # Load the fine-tuned MentalBERT model as per user's code
        tokenizer = AutoTokenizer.from_pretrained(mentalbert_path)
        model = AutoModel.from_pretrained(mentalbert_path)
        model.to(device)
        model.eval()

        logger.info("MentalBERT model loaded successfully")

        # Test text
        text = "I feel really happy and excited about life!"

        # Tokenize exactly as per user's code
        inputs = tokenizer(
            text,
            padding="max_length",
            truncation=True,
            max_length=max_length,  # 300 as per user's code
            return_tensors="pt"
        )

        # Move inputs to device
        inputs = {key: value.to(device) for key, value in inputs.items()}

        # Get embeddings with no gradient computation
        with torch.no_grad():
            output = model(**inputs)
            # Mean pooling as per user's implementation
            embedding = output.last_hidden_state.mean(dim=1)

        # Convert to numpy and return
        embedding_np = embedding.cpu().numpy()

        logger.info(f"Embedding shape: {embedding_np.shape}")
        logger.info(f"Embedding sample: {embedding_np[0][:5]}")  # First 5 values

        return {
            'success': True,
            'embedding_shape': embedding_np.shape,
            'embedding_sample': embedding_np[0][:5].tolist(),
            'text': text,
            'model_path': mentalbert_path
        }

    except Exception as e:
        logger.error(f"Error loading MentalBERT model: {e}")
        logger.info("Falling back to BERT base model")

        try:
            # Fallback to base BERT model
            model_name = "bert-base-uncased"
            tokenizer = AutoTokenizer.from_pretrained(model_name)
            model = AutoModel.from_pretrained(model_name)
            model.to(device)
            model.eval()

            # Test embedding
            text = "I feel really happy and excited about life!"
            inputs = tokenizer(text, padding="max_length", truncation=True, max_length=max_length, return_tensors="pt")
            inputs = {key: value.to(device) for key, value in inputs.items()}

            with torch.no_grad():
                output = model(**inputs)
                embedding = output.last_hidden_state.mean(dim=1)

            embedding_np = embedding.cpu().numpy()

            logger.info(f"Fallback embedding shape: {embedding_np.shape}")

            return {
                'success': True,
                'fallback': True,
                'model_used': model_name,
                'embedding_shape': embedding_np.shape,
                'embedding_sample': embedding_np[0][:5].tolist(),
                'text': text
            }

        except Exception as e2:
            logger.error(f"Error loading fallback model: {e2}")
            return {
                'success': False,
                'error': str(e2),
                'original_error': str(e)
            }

if __name__ == "__main__":
    print("Testing MentalBERT Embedding Extraction")
    print("=" * 50)

    result = test_mentalbert_embedding()

    if result['success']:
        print(f"✅ Success!")
        if result.get('fallback'):
            print(f"📝 Using fallback model: {result['model_used']}")
        else:
            print(f"📝 Using MentalBERT model: {result['model_path']}")
        print(f"📝 Text: {result['text']}")
        print(f"📝 Embedding shape: {result['embedding_shape']}")
        print(f"📝 Sample values: {result['embedding_sample']}")
    else:
        print(f"❌ Failed:")
        print(f"Error: {result['error']}")