@echo off
REM Finance Tracker Development Server Startup Script
REM This script runs both backend and frontend servers

echo Starting Finance Tracker...
echo.
echo Backend will start on: http://localhost:3001
echo Frontend will start on: http://localhost:3000
echo.

cd /d "%~dp0"

REM Start backend in one window
start cmd /k "cd finance-tracker-backend && npm run dev"

REM Wait a moment for backend to start
timeout /t 3 /nobreak

REM Start frontend in another window
start cmd /k "cd finance-tracker-frontend && npm run dev"

echo.
echo Both services are starting...
echo Check the new windows for their status.
