
# EduAI Platform Windows Setup Script
# Run as Administrator

Write-Host "Setting up EduAI Platform on Windows..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "Please run this script as Administrator!" -ForegroundColor Red
    exit 1
}

# Install Chocolatey if not installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
}

# Install Node.js
Write-Host "Installing Node.js..." -ForegroundColor Yellow
choco install nodejs -y

# Install Git
Write-Host "Installing Git..." -ForegroundColor Yellow
choco install git -y

# Install PostgreSQL
Write-Host "Installing PostgreSQL..." -ForegroundColor Yellow
choco install postgresql14 -y

# Refresh environment variables
Write-Host "Refreshing environment variables..." -ForegroundColor Yellow
refreshenv

# Install Visual Studio Code (optional)
$installVSCode = Read-Host "Install Visual Studio Code? (y/n)"
if ($installVSCode -eq "y" -or $installVSCode -eq "Y") {
    choco install vscode -y
}

Write-Host "Basic tools installed. Now setting up the project..." -ForegroundColor Green

# Navigate to project directory
$projectPath = Read-Host "Enter the full path where you want to clone the project (e.g., C:\Projects)"
if (!(Test-Path $projectPath)) {
    New-Item -ItemType Directory -Path $projectPath -Force
}

Set-Location $projectPath

# Clone repository (if URL provided)
$repoUrl = Read-Host "Enter repository URL (or press Enter to skip)"
if ($repoUrl) {
    git clone $repoUrl
    $projectName = Split-Path $repoUrl -Leaf -Resolve
    $projectName = $projectName -replace "\.git$", ""
    Set-Location $projectName
}

# Install project dependencies
if (Test-Path "package.json") {
    Write-Host "Installing project dependencies..." -ForegroundColor Yellow
    npm install
}

# Copy environment file
if (Test-Path ".env.example") {
    Copy-Item ".env.example" ".env"
    Write-Host "Environment file created. Please edit .env with your configuration." -ForegroundColor Green
}

# Create startup scripts
Write-Host "Creating startup scripts..." -ForegroundColor Yellow

# Create batch file for easy startup
$batchContent = @"
@echo off
echo Starting EduAI Platform...
title EduAI Platform

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in PATH!
    pause
    exit /b 1
)

REM Start API server
start "API Server" cmd /k "cd apps\api && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Web server
start "Web Server" cmd /k "cd apps\web && npm run dev"

echo Both servers are starting...
echo API: http://localhost:5000
echo Web: http://localhost:3000
pause
"@

$batchContent | Out-File -FilePath "start-eduai.bat" -Encoding ASCII

# Create PowerShell script for advanced startup
$psContent = @"
# EduAI Platform Startup Script
Write-Host "Starting EduAI Platform..." -ForegroundColor Green

# Function to check if port is in use
function Test-Port {
    param([int]`$Port)
    try {
        `$listener = [System.Net.Sockets.TcpListener]`$Port
        `$listener.Start()
        `$listener.Stop()
        return `$false
    } catch {
        return `$true
    }
}

# Check if ports are available
if (Test-Port 5000) {
    Write-Host "Port 5000 is already in use!" -ForegroundColor Red
    `$continue = Read-Host "Continue anyway? (y/n)"
    if (`$continue -ne "y") { exit }
}

if (Test-Port 3000) {
    Write-Host "Port 3000 is already in use!" -ForegroundColor Red
    `$continue = Read-Host "Continue anyway? (y/n)"
    if (`$continue -ne "y") { exit }
}

# Start API server
Write-Host "Starting API server on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\api; npm run dev"

# Wait for API to start
Start-Sleep 5

# Start Web server
Write-Host "Starting Web server on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd apps\web; npm run dev"

Write-Host "Servers started!" -ForegroundColor Green
Write-Host "API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Web: http://localhost:3000" -ForegroundColor Cyan
"@

$psContent | Out-File -FilePath "start-eduai.ps1" -Encoding UTF8

Write-Host "Setup completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your configuration"
Write-Host "2. Setup PostgreSQL database"
Write-Host "3. Run 'npx prisma db push' to setup database"
Write-Host "4. Run 'start-eduai.bat' or 'start-eduai.ps1' to start the application"
Write-Host ""
Write-Host "For detailed instructions, see DEVELOPMENT_GUIDE.md" -ForegroundColor Cyan
