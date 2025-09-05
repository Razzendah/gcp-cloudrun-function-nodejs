@echo off
REM Local Development and Testing Script for Windows

echo 🚀 Starting local Cloud Function development server...
echo.

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    echo.
)

REM Run tests first
echo 🧪 Running tests...
npm test

if %errorlevel% equ 0 (
    echo.
    echo ✅ Tests passed! Starting local server...
    echo.
    echo 📡 Your function will be available at:
    echo    🌐 http://localhost:8080
    echo.
    echo 🔗 Test these endpoints:
    echo    Health: http://localhost:8080
    echo    Hello:  http://localhost:8080/api/hello?name=YourName
    echo    Data:   http://localhost:8080/api/data (POST)
    echo.
    echo Press Ctrl+C to stop the server
    echo ================================================
    echo.
    
    REM Start the development server
    npm run dev
) else (
    echo.
    echo ❌ Tests failed! Please fix the issues before running locally.
    pause
    exit /b 1
)
