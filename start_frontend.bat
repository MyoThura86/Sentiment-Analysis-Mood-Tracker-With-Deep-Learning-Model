@echo off
echo Starting Sentiment Analysis Frontend...
echo =====================================

echo 1. Installing dependencies...
call npm install

echo.
echo 2. Starting development server...
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo --------------------------------

call npm run dev