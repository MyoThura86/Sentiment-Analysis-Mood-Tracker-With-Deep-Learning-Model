"""
Predictions Blueprint

Handles all ML prediction routes including:
- RoBERTa sentiment prediction
- LSTM sentiment prediction
- Dual model prediction
- CSV batch analysis
"""
from flask import Blueprint, request, jsonify
import pandas as pd
import io
import logging

logger = logging.getLogger(__name__)

# Create blueprint
predictions_bp = Blueprint('predictions', __name__, url_prefix='/api')

# Model variables will be set by app.py
roberta_model = None
roberta_tokenizer = None
lstm_loaded = False


def set_models(roberta_m, roberta_t, lstm_l):
    """Set model references from main app"""
    global roberta_model, roberta_tokenizer, lstm_loaded
    roberta_model = roberta_m
    roberta_tokenizer = roberta_t
    lstm_loaded = lstm_l


# Import prediction functions
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from simple_model import predict_with_simple_model


def predict_roberta_sentiment(text):
    """Predict sentiment using RoBERTa model"""
    if roberta_model is None or roberta_tokenizer is None:
        return {"error": "RoBERTa model not loaded"}

    import torch
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    inputs = roberta_tokenizer(text, return_tensors="pt", truncation=True, max_length=512, padding=True)
    inputs = {k: v.to(device) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = roberta_model(**inputs)
        probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)

    sentiment_map = {0: "Negative", 1: "Neutral", 2: "Positive"}
    predicted_class = probabilities.argmax().item()
    confidence = probabilities[0][predicted_class].item()

    return {
        "sentiment": sentiment_map[predicted_class],
        "confidence": float(confidence),
        "scores": {
            "negative": float(probabilities[0][0]),
            "neutral": float(probabilities[0][1]),
            "positive": float(probabilities[0][2])
        }
    }


def predict_lstm_sentiment(text):
    """Predict sentiment using LSTM model"""
    if not lstm_loaded:
        return {"error": "LSTM model not loaded"}

    result = predict_with_simple_model(text)
    return result


@predictions_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    ---
    tags:
      - System
    responses:
      200:
        description: System health status
        schema:
          type: object
          properties:
            status:
              type: string
            roberta_loaded:
              type: boolean
            lstm_loaded:
              type: boolean
    """
    return jsonify({
        "status": "healthy",
        "roberta_loaded": roberta_model is not None,
        "lstm_loaded": lstm_loaded
    })


@predictions_bp.route('/predict/roberta', methods=['POST'])
def predict_roberta():
    """
    Predict sentiment using RoBERTa model
    ---
    tags:
      - Predictions
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - text
          properties:
            text:
              type: string
              example: I love this product!
              maxLength: 5000
    responses:
      200:
        description: Sentiment prediction result
        schema:
          type: object
          properties:
            sentiment:
              type: string
              enum: [Positive, Neutral, Negative]
            confidence:
              type: number
            scores:
              type: object
      400:
        description: Invalid input
    """
    MAX_TEXT_LENGTH = 5000

    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not isinstance(text, str):
            return jsonify({"error": "Text must be a string"}), 400

        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        if len(text) > MAX_TEXT_LENGTH:
            return jsonify({"error": f"Text too long. Maximum length is {MAX_TEXT_LENGTH} characters"}), 400

        result = predict_roberta_sentiment(text)
        return jsonify(result)

    except Exception as e:
        logger.error(f"RoBERTa prediction error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@predictions_bp.route('/predict/lstm', methods=['POST'])
def predict_lstm():
    """
    Predict sentiment using LSTM model
    ---
    tags:
      - Predictions
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - text
          properties:
            text:
              type: string
              maxLength: 5000
    responses:
      200:
        description: Sentiment prediction result
      400:
        description: Invalid input
    """
    MAX_TEXT_LENGTH = 5000

    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not isinstance(text, str):
            return jsonify({"error": "Text must be a string"}), 400

        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        if len(text) > MAX_TEXT_LENGTH:
            return jsonify({"error": f"Text too long. Maximum length is {MAX_TEXT_LENGTH} characters"}), 400

        result = predict_lstm_sentiment(text)
        return jsonify(result)

    except Exception as e:
        logger.error(f"LSTM prediction error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@predictions_bp.route('/predict/both', methods=['POST'])
def predict_both():
    """
    Predict sentiment using both RoBERTa and LSTM models
    ---
    tags:
      - Predictions
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - text
          properties:
            text:
              type: string
              maxLength: 5000
    responses:
      200:
        description: Dual model prediction results
        schema:
          type: object
          properties:
            text:
              type: string
            roberta:
              type: object
            lstm:
              type: object
            consensus:
              type: boolean
      400:
        description: Invalid input
    """
    MAX_TEXT_LENGTH = 5000

    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not isinstance(text, str):
            return jsonify({"error": "Text must be a string"}), 400

        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        if len(text) > MAX_TEXT_LENGTH:
            return jsonify({"error": f"Text too long. Maximum length is {MAX_TEXT_LENGTH} characters"}), 400

        roberta_result = predict_roberta_sentiment(text)
        lstm_result = predict_lstm_sentiment(text)

        return jsonify({
            "text": text,
            "roberta": roberta_result,
            "lstm": lstm_result,
            "consensus": roberta_result.get('sentiment') == lstm_result.get('sentiment')
        })

    except Exception as e:
        logger.error(f"Dual prediction error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500


@predictions_bp.route('/analyze/csv', methods=['POST'])
def analyze_csv():
    """
    Analyze sentiment for a CSV file
    ---
    tags:
      - Predictions
    consumes:
      - multipart/form-data
    parameters:
      - in: formData
        name: file
        type: file
        required: true
        description: CSV file to analyze (max 10MB, 1000 rows)
    responses:
      200:
        description: CSV analysis results
        schema:
          type: object
          properties:
            total_analyzed:
              type: integer
            results:
              type: array
              items:
                type: object
      400:
        description: Invalid file or file too large
    """
    # Configuration limits
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
    MAX_ROWS = 1000
    MAX_TEXT_LENGTH = 5000

    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not file.filename.lower().endswith('.csv'):
            return jsonify({"error": "File must be a CSV"}), 400

        # Read and validate file size
        try:
            csv_content = file.read()

            # Check file size
            if len(csv_content) > MAX_FILE_SIZE:
                return jsonify({"error": f"File too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB"}), 400

            # Decode and parse CSV
            csv_content = csv_content.decode('utf-8')
            df = pd.read_csv(io.StringIO(csv_content))
        except Exception as e:
            return jsonify({"error": f"Error reading CSV: {str(e)}"}), 400

        # Find text column
        text_column = None
        possible_text_columns = ['text', 'content', 'message', 'comment', 'review', 'description']

        for col in df.columns:
            if col.lower() in possible_text_columns:
                text_column = col
                break

        if text_column is None:
            # Take the first column if no obvious text column found
            text_column = df.columns[0]

        # Filter out empty/null texts
        df = df.dropna(subset=[text_column])
        df = df[df[text_column].str.strip() != '']

        if len(df) == 0:
            return jsonify({"error": "No valid text data found in CSV"}), 400

        # Check row count
        if len(df) > MAX_ROWS:
            return jsonify({"error": f"Too many rows. Maximum is {MAX_ROWS} rows. Your file has {len(df)} rows."}), 400

        # Analyze each text entry
        results = []
        for idx, row in df.iterrows():
            text = str(row[text_column]).strip()
            if not text:
                continue

            # Validate text length
            if len(text) > MAX_TEXT_LENGTH:
                results.append({
                    "row": int(idx + 1),
                    "text": text[:100] + "...",
                    "sentiment": "Error",
                    "confidence": 0.0,
                    "error": f"Text too long (max {MAX_TEXT_LENGTH} characters)"
                })
                continue

            try:
                # Get predictions from both models
                roberta_result = predict_roberta_sentiment(text)
                lstm_result = predict_lstm_sentiment(text)

                # Determine overall sentiment (you can customize this logic)
                overall_sentiment = roberta_result.get('sentiment', 'Neutral')
                confidence = roberta_result.get('confidence', 0.5)

                # Check if models agree
                agreement = (roberta_result.get('sentiment') == lstm_result.get('sentiment'))

                results.append({
                    "row": int(idx + 1),
                    "text": text,
                    "sentiment": overall_sentiment,
                    "confidence": float(confidence),
                    "roberta": roberta_result,
                    "lstm": lstm_result,
                    "agreement": agreement
                })

            except Exception as e:
                # Include failed predictions with error info
                results.append({
                    "row": int(idx + 1),
                    "text": text,
                    "sentiment": "Error",
                    "confidence": 0.0,
                    "error": str(e),
                    "agreement": False
                })

        # Calculate summary statistics
        sentiment_counts = {"Positive": 0, "Neutral": 0, "Negative": 0}
        for result in results:
            sentiment = result.get('sentiment')
            if sentiment in sentiment_counts:
                sentiment_counts[sentiment] += 1

        return jsonify({
            "total_analyzed": len(results),
            "column_used": text_column,
            "sentiment_distribution": sentiment_counts,
            "results": results
        })

    except Exception as e:
        logger.error(f"CSV analysis error: {e}")
        return jsonify({"error": f"Server error: {str(e)}"}), 500
