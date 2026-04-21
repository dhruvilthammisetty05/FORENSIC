#!/usr/bin/env powershell
<#
.SYNOPSIS
    Forensic Evidence Chain - Docker Deployment Script
.DESCRIPTION
    This script automates the setup and deployment of the forensic system
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('deploy', 'start', 'stop', 'logs', 'down')]
    [string]$Action = 'deploy'
)

$ErrorActionPreference = "Stop"

function Write-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "  $Message"
    Write-Host "=========================================="
    Write-Host ""
}

function Write-Success {
    param([string]$Message)
    Write-Host "[OK] $Message" -ForegroundColor Green
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

# Check Docker installation
Write-Header "FORENSIC EVIDENCE CHAIN DEPLOYMENT"

Write-Info "Checking Docker installation..."
try {
    $dockerVersion = docker --version 2>&1
    Write-Success "Docker found: $dockerVersion"
} catch {
    Write-ErrorMsg "Docker is not installed or not in PATH"
    Write-Info "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
}

Write-Info "Checking Docker Compose..."
try {
    $composeVersion = docker-compose --version 2>&1
    Write-Success "Docker Compose found: $composeVersion"
} catch {
    Write-ErrorMsg "Docker Compose is not available"
    Write-Info "Please ensure you have Docker Desktop with Compose support"
    exit 1
}

switch ($Action) {
    'deploy' {
        Write-Header "STARTING FULL STACK DEPLOYMENT"
        
        Write-Info "This will:"
        Write-Info "  1. Build all Docker images"
        Write-Info "  2. Start Ganache blockchain"
        Write-Info "  3. Compile smart contracts"
        Write-Info "  4. Deploy contracts to Ganache"
        Write-Info "  5. Start MongoDB database"
        Write-Info "  6. Start IPFS node"
        Write-Info "  7. Start ClamAV scanner"
        Write-Info "  8. Start backend API"
        Write-Info "  9. Start frontend application"
        Write-Info "This may take 2-5 minutes on first run..."
        
        Write-Host ""
        Write-Info "Pulling latest images..."
        docker-compose pull
        
        Write-Info "Building and starting containers..."
        docker-compose --profile deploy up --build
    }
    
    'start' {
        Write-Header "STARTING FORENSIC SYSTEM"
        Write-Info "Starting containers without redeploying contracts..."
        docker-compose up
    }
    
    'stop' {
        Write-Header "STOPPING FORENSIC SYSTEM"
        Write-Info "Stopping all containers..."
        docker-compose stop
        Write-Success "Containers stopped"
    }
    
    'logs' {
        Write-Header "VIEWING LOGS"
        Write-Info "Backend logs:"
        docker-compose logs -f backend
    }
    
    'down' {
        Write-Header "REMOVING ALL CONTAINERS"
        Write-Info "This will remove all containers and volumes..."
        $confirm = Read-Host "Are you sure? (yes/no)"
        if ($confirm -eq 'yes') {
            docker-compose down -v
            Write-Success "All containers removed"
        } else {
            Write-Info "Cancelled"
        }
    }
}

if ($Action -eq 'deploy' -or $Action -eq 'start') {
    Write-Header "DEPLOYMENT COMPLETE!"
    Write-Host ""
    Write-Host "Access the application:" -ForegroundColor Cyan
    Write-Host "   Frontend:  http://localhost:3001"
    Write-Host "   Backend:   http://localhost:5000"
    Write-Host "   Ganache:   http://localhost:8545"
    Write-Host "   IPFS:      http://localhost:8081"
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Open http://localhost:3001 in your browser"
    Write-Host "   2. Register a new account"
    Write-Host "   3. Create a case"
    Write-Host "   4. Upload evidence"
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor Cyan
    Write-Host "   Stop:           .\deploy.ps1 -Action stop"
    Write-Host "   View logs:      .\deploy.ps1 -Action logs"
    Write-Host "   Restart:        .\deploy.ps1 -Action start"
    Write-Host "   Full reset:     .\deploy.ps1 -Action down"
    Write-Host ""
}
