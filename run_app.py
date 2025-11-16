
#!/usr/bin/env python3
"""
Complete application runner for Dual Model Sentiment Analysis
Runs both the Flask API and React frontend
"""

import os
import sys
import subprocess
import time
import threading
import webbrowser
from pathlib import Path

def run_command_in_thread(command, cwd=None, name="Process"):
    """Run a command in a separate thread"""
    def run():
        try:
            print(f"[{name}] Starting...")
            if sys.platform == "win32":
                # For Windows
                subprocess.run(command, shell=True, cwd=cwd)
            else:
                # For Unix-like systems
                subprocess.run(command.split(), cwd=cwd)
        except Exception as e:
            print(f"[{name}] Error: {e}")

    thread = threading.Thread(target=run, daemon=True)
    thread.start()
    return thread

def check_prerequisites():
    """Check if all prerequisites are met"""
    print("Checking prerequisites...")

    # Check if we're in the right directory
    if not os.path.exists("package.json"):
        print("❌ package.json not found. Please run this script from the Special_project directory.")
        return False

    # Check if API directory exists
    if not os.path.exists("api"):
        print("❌ API directory not found.")
        return False

    # Check if model files exist
    model_files = [
        "Fine_tuned_RoBERTa/roberta_sentiment_model",
        "Fine_tuned_RoBERTa/roberta_tokenizer",
        "mentalbert_lstm_model.keras"
    ]

    missing_models = []
    for model_file in model_files:
        if not os.path.exists(model_file):
            missing_models.append(model_file)

    if missing_models:
        print("❌ Missing model files:")
        for model in missing_models:
            print(f"   - {model}")
        return False

    print("✅ All prerequisites met!")
    return True

def check_npm():
    """Check if npm is available"""
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def install_dependencies():
    """Install Python and Node.js dependencies"""
    print("\nInstalling dependencies...")

    # Check if npm is available
    if not check_npm():
        print("⚠️  npm not found in PATH. Skipping Node.js dependency installation.")
        print("Please install Node.js dependencies manually:")
        print("   npm install")
        return "partial"

    # Install Node.js dependencies
    print("📦 Installing Node.js dependencies...")
    try:
        subprocess.run(["npm", "install"], check=True, cwd=".")
        print("✅ Node.js dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Node.js dependencies")
        print("Please install manually: npm install")
        return False

    # Install Python dependencies
    print("🐍 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"],
                      check=True, cwd="api")
        print("✅ Python dependencies installed successfully!")
    except subprocess.CalledProcessError:
        print("❌ Failed to install Python dependencies")
        print("Please install manually: pip install -r api/requirements.txt")
        return False

    return True

def main():
    """Main function to run the complete application"""
    print("🚀 Dual Model Sentiment Analysis Application")
    print("=" * 50)

    # Check prerequisites
    if not check_prerequisites():
        print("\n❌ Prerequisites not met. Please check the setup.")
        return

    # Install dependencies
    dep_result = install_dependencies()
    if dep_result == False:
        print("\n❌ Failed to install dependencies.")
        return
    elif dep_result == "partial":
        print("\n⚠️  Some dependencies may need manual installation.")
        input("Press Enter to continue anyway or Ctrl+C to exit...")

    print("\n🔥 Starting application servers...")
    print("-" * 30)

    try:
        # Start Flask API server (using REAL models)
        api_thread = run_command_in_thread(
            f"{sys.executable} app.py",
            cwd="api",
            name="API Server"
        )

        # Wait a bit for API server to start
        print("⏳ Waiting for API server to start...")
        time.sleep(5)

        # Start React development server
        frontend_thread = run_command_in_thread(
            "npm run dev",
            cwd=".",
            name="Frontend Server"
        )

        # Wait a bit for frontend server to start
        time.sleep(8)

        print("\n🎉 Application is running!")
        print("=" * 30)
        print("🌐 Frontend: http://localhost:5173")
        print("🔧 API:      http://localhost:5001")
        print("📖 API Health: http://localhost:5001/api/health")
        print("\n💡 Features:")
        print("   • Dual model sentiment analysis")
        print("   • Interactive comparison charts")
        print("   • Confidence score visualization")
        print("   • Modern Material-UI interface")
        print("\n⌨️  Press Ctrl+C to stop both servers")
        print("-" * 50)

        # Open browser automatically
        time.sleep(2)
        try:
            webbrowser.open("http://localhost:5173")
        except:
            pass

        # Keep the main thread alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n\n🛑 Shutting down servers...")
        print("👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Error running application: {e}")

if __name__ == "__main__":
    main()