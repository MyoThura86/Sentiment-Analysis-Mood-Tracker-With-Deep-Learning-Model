#!/usr/bin/env python3
"""
Startup script for the Sentiment Analysis API server
"""

import os
import sys
import subprocess
import time

def check_requirements():
    """Check if required packages are installed"""
    required_packages = [
        'flask', 'flask-cors', 'torch', 'transformers',
        'tensorflow', 'numpy'
    ]

    missing_packages = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)

    if missing_packages:
        print("Missing required packages:")
        for package in missing_packages:
            print(f"  - {package}")
        print("\nPlease install them using:")
        print(f"pip install {' '.join(missing_packages)}")
        return False

    return True

def check_models():
    """Check if model files exist"""
    roberta_model_path = os.path.join("Fine_tuned_RoBERTa", "roberta_sentiment_model")
    roberta_tokenizer_path = os.path.join("Fine_tuned_RoBERTa", "roberta_tokenizer")
    lstm_model_path = "mentalbert_lstm_model.keras"

    missing_files = []

    if not os.path.exists(roberta_model_path):
        missing_files.append("RoBERTa model directory")

    if not os.path.exists(roberta_tokenizer_path):
        missing_files.append("RoBERTa tokenizer directory")

    if not os.path.exists(lstm_model_path):
        missing_files.append("LSTM model file")

    if missing_files:
        print("Missing model files:")
        for file in missing_files:
            print(f"  - {file}")
        print("\nPlease ensure all model files are in the correct locations.")
        return False

    return True

def start_api_server():
    """Start the Flask API server"""
    try:
        print("Starting Flask API server...")
        print("Server will be available at: http://localhost:5001")
        print("API endpoints:")
        print("  - GET  /api/health")
        print("  - POST /api/predict/roberta")
        print("  - POST /api/predict/lstm")
        print("  - POST /api/predict/both")
        print("\nPress Ctrl+C to stop the server")
        print("-" * 50)

        # Change to API directory and start server
        os.chdir("api")
        subprocess.run([sys.executable, "auth_api.py"])

    except KeyboardInterrupt:
        print("\nShutting down API server...")
    except Exception as e:
        print(f"Error starting API server: {e}")

def main():
    print("Sentiment Analysis API Startup Script")
    print("=" * 40)

    # Check requirements
    print("1. Checking Python packages...")
    if not check_requirements():
        return
    print("   ✓ All required packages are installed")

    # Check model files
    print("2. Checking model files...")
    if not check_models():
        return
    print("   ✓ All model files found")

    # Start API server
    print("3. Starting API server...")
    start_api_server()

if __name__ == "__main__":
    main()