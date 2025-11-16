#!/usr/bin/env python3
"""
Simple API server startup script
Use this if you want to run only the API server
"""

import os
import sys

def main():
    print("Starting Sentiment Analysis API Server")
    print("=" * 45)

    # Check if we're in the right directory
    if not os.path.exists("api/auth_api.py"):
        print("❌ API file not found. Please run this script from the Special_project directory.")
        return

    print("API will be available at: http://localhost:5001")
    print("Health check: http://localhost:5001/api/health")
    print("\nStarting API server...")
    print("Press Ctrl+C to stop the server")
    print("-" * 45)

    # Change to API directory and start server
    os.chdir("api")

    try:
        import auth_api
        # This will start the Flask server
    except KeyboardInterrupt:
        print("\nShutting down API server...")
        print("Goodbye!")
    except Exception as e:
        print(f"Error starting API server: {e}")
        print("Please ensure all Python dependencies are installed:")
        print("pip install -r requirements.txt")

if __name__ == "__main__":
    main()