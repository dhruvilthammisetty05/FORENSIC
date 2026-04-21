@REM Forensic Evidence Chain - Docker Deployment Script
@REM This script automates the setup and deployment of the forensic system

@echo off
setlocal enabledelayedexpansion

echo.
echo ==========================================
echo  🔐 FORENSIC EVIDENCE CHAIN DEPLOYMENT
echo ==========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker found: 
docker --version
echo.

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not available
    echo Please ensure you have Docker Desktop with Compose support
    pause
    exit /b 1
)

echo ✅ Docker Compose found: 
docker-compose --version
echo.

echo ==========================================
echo  📦 Starting Full Stack Deployment...
echo ==========================================
echo.
echo This will:
echo   1. Build all Docker images
echo   2. Start Ganache blockchain
echo   3. Compile smart contracts
echo   4. Deploy contracts to Ganache
echo   5. Start MongoDB database
echo   6. Start IPFS node
echo   7. Start ClamAV scanner
echo   8. Start backend API
echo   9. Start frontend application
echo.
echo ⏳ This may take 2-5 minutes on first run...
echo.

REM Pull latest images
echo Pulling latest images...
docker-compose pull

REM Full deployment with contract compilation
echo.
echo 🚀 Building and starting containers...
docker-compose --profile deploy up --build

if errorlevel 1 (
    echo.
    echo ❌ Deployment failed!
    echo Please check the output above for errors
    pause
    exit /b 1
)

echo.
echo ==========================================
echo ✅ DEPLOYMENT SUCCESSFUL!
echo ==========================================
echo.
echo 🌐 Access the application:
echo   Frontend:  http://localhost:3001
echo   Backend:   http://localhost:5000
echo   Ganache:   http://localhost:8545
echo   IPFS:      http://localhost:8081
echo.
echo 📝 Next steps:
echo   1. Open http://localhost:3001 in your browser
echo   2. Register a new account
echo   3. Create a case
echo   4. Upload evidence
echo.
echo 💡 To stop: Press Ctrl+C
echo 💾 To restart: docker-compose up
echo 🔄 To redeploy contracts: docker-compose --profile deploy up
echo.

pause
