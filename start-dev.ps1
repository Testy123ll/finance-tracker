# Finance Tracker Development Server Startup Script
# Run both backend and frontend servers

Write-Host "Starting Finance Tracker..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend will start on: http://localhost:3001" -ForegroundColor Green
Write-Host "Frontend will start on: http://localhost:3000" -ForegroundColor Green
Write-Host ""

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start backend in one window
Write-Host "Starting Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\finance-tracker-backend'; npm run dev"

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend in another window
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\finance-tracker-frontend'; npm run dev"

Write-Host ""
Write-Host "Both services are starting..." -ForegroundColor Cyan
Write-Host "Check the new windows for their detailed status." -ForegroundColor Cyan
