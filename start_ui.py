"""
Python script to start the frontend development server
This works around npm PATH issues on Windows
"""

import subprocess
import sys
import os
from pathlib import Path

def find_npm():
    """Try to find npm executable"""
    common_paths = [
        r"C:\Program Files\nodejs\npm.cmd",
        r"C:\Program Files (x86)\nodejs\npm.cmd",
        r"C:\Users\{}\AppData\Roaming\npm\npm.cmd".format(os.getenv('USERNAME', '')),
    ]

    # First try npm directly (might be in PATH)
    try:
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        return "npm"
    except:
        pass

    # Try common installation paths
    for path in common_paths:
        if os.path.exists(path):
            return path

    return None

def main():
    print("=" * 50)
    print("FRONTEND STARTUP SCRIPT")
    print("=" * 50)

    # Check if we're in the right directory
    if not os.path.exists("package.json"):
        print("Error: package.json not found.")
        print("Please run this script from the Special_project directory.")
        return

    # Try to find npm
    npm_path = find_npm()
    if not npm_path:
        print("Error: Could not find npm.")
        print("Please install Node.js from: https://nodejs.org/")
        print("Or run manually:")
        print('  "C:\\Program Files\\nodejs\\npm.cmd" install')
        print('  "C:\\Program Files\\nodejs\\npm.cmd" run dev')
        return

    print(f"Found npm at: {npm_path}")

    try:
        # Install dependencies
        print("Installing dependencies...")
        subprocess.run([npm_path, "install"], check=True)
        print("Dependencies installed successfully!")

        # Start development server
        print("\nStarting development server...")
        print("Frontend will be available at: http://localhost:5173")
        print("Press Ctrl+C to stop the server")
        print("-" * 50)

        subprocess.run([npm_path, "run", "dev"])

    except subprocess.CalledProcessError as e:
        print(f"Error: {e}")
        print("Try running manually:")
        print(f'  "{npm_path}" install')
        print(f'  "{npm_path}" run dev')
    except KeyboardInterrupt:
        print("\nShutting down frontend server...")
        print("Goodbye!")

if __name__ == "__main__":
    main()