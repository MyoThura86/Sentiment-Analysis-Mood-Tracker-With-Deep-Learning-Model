@echo off
echo ================================================
echo    SENTIMENT ANALYSIS PROJECT - SERVER STARTUP
echo ================================================
echo.

echo [1/2] Starting Backend API Server (Port 5001)...
start "Backend API" cmd /k "cd api && python auth_api.py"

echo [2/2] Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend Development Server (Port 5173)...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ================================================
echo         SERVERS STARTING...
echo ================================================
echo Backend API:  http://localhost:5001/api/health
echo Frontend:     http://localhost:5173
echo.
echo Close this window to stop monitoring.
echo Press any key to open the application in browser...
pause > nul

start http://localhost:5173

echo.
echo Both servers should now be running.
echo Check the opened terminal windows for server status.