"""
Simple Flask API for testing the UI without heavy ML dependencies
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://localhost:5174'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

def mock_sentiment_analysis(text):
    """Generate mock sentiment analysis results"""
    # Simulate processing time
    time.sleep(0.5)

    # Generate random but realistic sentiment scores
    scores = [random.uniform(0.1, 0.9) for _ in range(3)]
    total = sum(scores)
    normalized_scores = [score/total for score in scores]

    labels = ["Negative", "Neutral", "Positive"]
    predicted_class = normalized_scores.index(max(normalized_scores))

    return {
        "sentiment": labels[predicted_class],
        "confidence": max(normalized_scores),
        "scores": {
            "negative": normalized_scores[0],
            "neutral": normalized_scores[1],
            "positive": normalized_scores[2]
        }
    }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "roberta_loaded": True,  # Mock as loaded
        "lstm_loaded": True,     # Mock as loaded
        "message": "Mock API running - replace with actual models"
    })

@app.route('/api/predict/roberta', methods=['POST'])
def predict_roberta():
    """Mock RoBERTa model prediction"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        result = mock_sentiment_analysis(text)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/predict/lstm', methods=['POST'])
def predict_lstm():
    """Mock LSTM model prediction"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        result = mock_sentiment_analysis(text)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/predict/both', methods=['POST'])
def predict_both():
    """Mock prediction using both models"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "No text provided"}), 400

        text = data['text']
        if not text.strip():
            return jsonify({"error": "Empty text provided"}), 400

        roberta_result = mock_sentiment_analysis(text)
        lstm_result = mock_sentiment_analysis(text)

        return jsonify({
            "text": text,
            "roberta": roberta_result,
            "lstm": lstm_result
        })

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# Authentication endpoints for testing
@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def auth_login():
    """Mock login endpoint"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')

        # Mock authentication - accept any email/password for testing
        if email and password:
            return jsonify({
                "success": True,
                "token": "mock_jwt_token_12345",
                "user": {
                    "id": 1,
                    "email": email,
                    "name": "Test User"
                }
            })
        else:
            return jsonify({"error": "Email and password required"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def auth_register():
    """Mock registration endpoint"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.get_json()
        email = data.get('email', '')
        password = data.get('password', '')
        name = data.get('name', '')

        # Mock registration - accept any valid data
        if email and password and name:
            return jsonify({
                "success": True,
                "token": "mock_jwt_token_12345",
                "user": {
                    "id": 1,
                    "email": email,
                    "name": name
                }
            })
        else:
            return jsonify({"error": "Email, password, and name required"}), 400
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/auth/google', methods=['POST', 'OPTIONS'])
def auth_google():
    """Mock Google OAuth endpoint"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Mock Google OAuth success
        return jsonify({
            "success": True,
            "token": "mock_google_jwt_token_12345",
            "user": {
                "id": 1,
                "email": "test@gmail.com",
                "name": "Google Test User"
            }
        })
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@app.route('/api/auth/github', methods=['POST', 'OPTIONS'])
def auth_github():
    """Mock GitHub OAuth endpoint"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        # Mock GitHub OAuth success
        return jsonify({
            "success": True,
            "token": "mock_github_jwt_token_12345",
            "user": {
                "id": 1,
                "email": "test@github.com",
                "name": "GitHub Test User"
            }
        })
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    print("=" * 50)
    print("MOCK SENTIMENT ANALYSIS API")
    print("=" * 50)
    print("Server starting at: http://localhost:5001")
    print("Health check: http://localhost:5001/api/health")
    print("Note: This is using mock data for testing UI")
    print("Replace with app.py for real model predictions")
    print("=" * 50)

    app.run(debug=True, host='0.0.0.0', port=5001)