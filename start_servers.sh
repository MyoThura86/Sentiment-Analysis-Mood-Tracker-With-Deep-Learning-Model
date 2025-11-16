#!/bin/bash

echo "================================================"
echo "   SENTIMENT ANALYSIS PROJECT - SERVER STARTUP"
echo "================================================"
echo ""

echo "[1/2] Starting Backend API Server (Port 5001)..."
cd api && python auth_api.py &
BACKEND_PID=$!
cd ..

echo "[2/2] Waiting 3 seconds for backend to start..."
sleep 3

echo "[2/2] Starting Frontend Development Server (Port 5173)..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================"
echo "         SERVERS RUNNING"
echo "================================================"
echo "Backend API:  http://localhost:5001/api/health"
echo "Frontend:     http://localhost:5173"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait