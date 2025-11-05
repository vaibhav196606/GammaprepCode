@echo off
echo Starting Gammaprep Backend Server...
echo.

echo Checking if MongoDB is running...
sc query MongoDB | find "RUNNING"
if errorlevel 1 (
    echo WARNING: MongoDB service is not running!
    echo Please start MongoDB first with: net start MongoDB
    echo.
    pause
    exit /b 1
)

echo MongoDB is running!
echo.

cd backend
echo Starting backend server on port 5000...
npm run dev

