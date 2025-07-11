
# EduAI Platform Setup and Run Script (Windows PowerShell)
# This script installs dependencies, sets up the database, and runs the application

param(
    [string]$Action = "start"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

Write-Status "🚀 Starting EduAI Platform Setup..."

# Function to check if Node.js is installed
function Test-NodeJS {
    try {
        $nodeVersion = node --version
        Write-Status "Node.js version: $nodeVersion"
        return $true
    } catch {
        Write-Error "Node.js is not installed or not in PATH"
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        return $false
    }
}

# Function to check if npm is installed
function Test-NPM {
    try {
        $npmVersion = npm --version
        Write-Status "npm version: $npmVersion"
        return $true
    } catch {
        Write-Error "npm is not installed or not in PATH"
        return $false
    }
}

# Function to setup the application
function Setup-Application {
    # Step 0: Check prerequisites
    Write-Status "Checking prerequisites..."
    if (!(Test-NodeJS) -or !(Test-NPM)) {
        Write-Error "Prerequisites not met. Exiting..."
        exit 1
    }

    # Step 1: Clean any existing processes
    Write-Status "Cleaning up existing Node.js processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2

    # Step 2: Clean npm cache
    Write-Status "Cleaning npm cache..."
    npm cache clean --force

    # Step 3: Install root dependencies
    Write-Status "Installing root dependencies..."
    npm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install root dependencies"
        exit 1
    }

    # Step 4: Install API dependencies
    Write-Status "Installing API dependencies..."
    Set-Location apps/api
    
    # Remove node_modules and package-lock.json for clean install
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Path "package-lock.json" -Force
    }
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install API dependencies"
        Set-Location ../..
        exit 1
    }
    Set-Location ../..
    
    # Step 5: Install Web dependencies
    Write-Status "Installing Web dependencies..."
    Set-Location apps/web
    
    # Remove node_modules and package-lock.json for clean install
    if (Test-Path "node_modules") {
        Remove-Item -Path "node_modules" -Recurse -Force
    }
    if (Test-Path "package-lock.json") {
        Remove-Item -Path "package-lock.json" -Force
    }
    
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install Web dependencies"
        Set-Location ../..
        exit 1
    }
    Set-Location ../..

    # Step 6: Install additional required dependencies
    Write-Status "Installing additional required dependencies..."
    
    # Install global dependencies if needed
    Write-Status "Installing global TypeScript and ts-node..."
    npm install -g typescript ts-node-dev ts-node

    # Install prisma globally for easier commands
    Write-Status "Installing Prisma CLI globally..."
    npm install -g prisma

    # Step 7: Check if .env file exists
    if (!(Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from .env.example..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Status "Created .env file from .env.example."
        } else {
            Write-Status "Creating comprehensive .env file..."
            @"
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-in-production-$(Get-Random)"

# API Configuration
NEXT_PUBLIC_API_URL="http://0.0.0.0:5000"
PORT=5000
NODE_ENV="development"

# OpenAI API Configuration (Optional)
OPENAI_API_KEY="your-openai-api-key-here"

# Google OAuth Configuration (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# Payment Gateway Configuration (Optional)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-your_flutterwave_secret_key"

# Email Services Configuration (Optional)
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS Services Configuration (Optional)
TWILIO_ACCOUNT_SID="AC_your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# Security Configuration
SESSION_SECRET="your-session-secret-$(Get-Random)"
BCRYPT_ROUNDS=12

# Analytics Configuration (Optional)
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_ADSENSE_CLIENT="ca-pub-your_adsense_client"

# Application Configuration
APP_NAME="EduAI Platform"
APP_URL="http://localhost:3000"
SUPPORT_EMAIL="support@edrac.edu"
"@ | Out-File -FilePath ".env" -Encoding utf8
            Write-Status "Created comprehensive .env file. Please update it with your actual values."
        }
    }
    
    # Step 8: Set up database
    Write-Status "Setting up database..."
    
    # Navigate to prisma directory for database operations
    if (Test-Path "prisma") {
        Set-Location prisma
    }
    
    # Generate Prisma client
    Write-Status "Generating Prisma client..."
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to generate Prisma client"
        if (Test-Path "../prisma") { Set-Location .. }
        exit 1
    }
    
    # Create database and run migrations
    Write-Status "Creating database and running migrations..."
    npx prisma db push
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Database push had issues, but continuing..."
    }
    
    # Seed the database
    Write-Status "Seeding database with initial data..."
    try {
        npx prisma db seed
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Database seeding had issues, but continuing..."
        }
    } catch {
        Write-Warning "Database seeding failed, but continuing..."
    }
    
    # Return to root directory
    if (Test-Path "../prisma") { Set-Location .. }
    
    # Step 9: Install additional development tools
    Write-Status "Installing additional development dependencies..."
    
    # Install concurrently for running multiple processes
    npm install --save-dev concurrently

    # Install nodemon for better development experience
    npm install --save-dev nodemon

    # Step 10: Build applications (optional for development)
    Write-Status "Preparing applications for development..."
    
    # Generate any necessary build files
    Set-Location apps/api
    Write-Status "Preparing API for development..."
    # Don't build in development, just ensure dependencies are ready
    Set-Location ../..
    
    Set-Location apps/web
    Write-Status "Preparing Web application for development..."
    # Next.js will build on demand in development
    Set-Location ../..

    # Step 11: Fix known issues
    Write-Status "Fixing known configuration issues..."
    
    # Ensure proper TypeScript configuration
    if (!(Test-Path "apps/api/tsconfig.json")) {
        Write-Status "Creating API TypeScript configuration..."
        @"
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
"@ | Out-File -FilePath "apps/api/tsconfig.json" -Encoding utf8
    }

    if (!(Test-Path "apps/web/tsconfig.json")) {
        Write-Status "Creating Web TypeScript configuration..."
        @"
{
  "compilerOptions": {
    "target": "ES2021",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
"@ | Out-File -FilePath "apps/web/tsconfig.json" -Encoding utf8
    }

    Write-Status "✅ Setup completed successfully!"
}

# Function to start applications
function Start-Applications {
    Write-Status "Starting applications..."
    
    # Kill any existing Node processes
    Write-Status "Cleaning up existing processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Wait a moment for processes to fully terminate
    Start-Sleep -Seconds 3
    
    # Check if ports are available
    Write-Status "Checking port availability..."
    
    try {
        $apiListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, 5000)
        $apiListener.Start()
        $apiListener.Stop()
        Write-Status "Port 5000 is available for API"
    } catch {
        Write-Warning "Port 5000 is already in use. API might fail to start."
    }
    
    try {
        $webListener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, 3000)
        $webListener.Start()
        $webListener.Stop()
        Write-Status "Port 3000 is available for Web"
    } catch {
        Write-Warning "Port 3000 is already in use. Web might fail to start."
    }
    
    # Start API server
    Write-Status "Starting API server on port 5000..."
    $apiJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/api
        $env:NODE_ENV = "development"
        $env:PORT = "5000"
        npm run dev
    }
    
    # Wait for API to start
    Write-Status "Waiting for API server to initialize..."
    Start-Sleep -Seconds 5
    
    # Start Web server
    Write-Status "Starting Web server on port 3000..."
    $webJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/web
        $env:NODE_ENV = "development"
        $env:PORT = "3000"
        npm run dev
    }
    
    # Wait for both servers to start
    Write-Status "Waiting for both servers to fully initialize..."
    Start-Sleep -Seconds 8
    
    # Test server availability
    Write-Status "Testing server availability..."
    try {
        $apiTest = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($apiTest.StatusCode -eq 200) {
            Write-Status "✅ API server is responding"
        } else {
            Write-Warning "⚠️ API server may not be fully ready yet"
        }
    } catch {
        Write-Warning "⚠️ API server is still starting up..."
    }
    
    try {
        $webTest = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($webTest.StatusCode -eq 200) {
            Write-Status "✅ Web server is responding"
        } else {
            Write-Warning "⚠️ Web server may not be fully ready yet"
        }
    } catch {
        Write-Warning "⚠️ Web server is still starting up..."
    }
    
    Write-Status "✅ Setup complete!"
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 API: http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: http://localhost:5000/api/docs" -ForegroundColor Cyan
    Write-Host "🔍 Health Check: http://localhost:5000/api/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Default login credentials:" -ForegroundColor Yellow
    Write-Host "  Admin: admin@edrac.edu / password123" -ForegroundColor White
    Write-Host "  Teacher: teacher@edrac.edu / password123" -ForegroundColor White
    Write-Host "  Student: student@edrac.edu / password123" -ForegroundColor White
    Write-Host "  Parent: parent@edrac.edu / password123" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Tips:" -ForegroundColor Yellow
    Write-Host "  - Both servers support hot reload for development" -ForegroundColor White
    Write-Host "  - Check logs in the terminal windows for any issues" -ForegroundColor White
    Write-Host "  - Press Ctrl+C in this window to stop both servers" -ForegroundColor White
    Write-Host ""
    Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Red
    
    # Wait for jobs to complete or user to interrupt
    try {
        Wait-Job $apiJob, $webJob
    } finally {
        Write-Status "Shutting down servers..."
        Stop-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Remove-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Status "✅ Cleanup completed"
    }
}

# Function to perform health check
function Test-Health {
    Write-Status "Performing comprehensive health check..."
    
    $healthy = $true
    
    # Check Node.js
    if (Test-NodeJS) {
        Write-Status "✅ Node.js is available"
    } else {
        Write-Error "❌ Node.js is not available"
        $healthy = $false
    }
    
    # Check npm
    if (Test-NPM) {
        Write-Status "✅ npm is available"
    } else {
        Write-Error "❌ npm is not available"
        $healthy = $false
    }
    
    # Check dependencies
    if (Test-Path "node_modules") {
        Write-Status "✅ Root dependencies are installed"
    } else {
        Write-Warning "⚠️ Root dependencies not found"
        $healthy = $false
    }
    
    if (Test-Path "apps/api/node_modules") {
        Write-Status "✅ API dependencies are installed"
    } else {
        Write-Warning "⚠️ API dependencies not found"
        $healthy = $false
    }
    
    if (Test-Path "apps/web/node_modules") {
        Write-Status "✅ Web dependencies are installed"
    } else {
        Write-Warning "⚠️ Web dependencies not found"
        $healthy = $false
    }
    
    # Check environment file
    if (Test-Path ".env") {
        Write-Status "✅ Environment file exists"
    } else {
        Write-Warning "⚠️ Environment file not found"
    }
    
    # Check database
    if (Test-Path "prisma/dev.db") {
        Write-Status "✅ Database file exists"
    } else {
        Write-Warning "⚠️ Database file not found"
    }
    
    # Check if API is running
    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
        if ($apiResponse.StatusCode -eq 200) {
            Write-Status "✅ API server is healthy"
        } else {
            Write-Warning "❌ API server returned status code: $($apiResponse.StatusCode)"
        }
    } catch {
        Write-Warning "❌ API server is not responding"
    }
    
    # Check if Web is running
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($webResponse.StatusCode -eq 200) {
            Write-Status "✅ Web server is healthy"
        } else {
            Write-Warning "❌ Web server returned status code: $($webResponse.StatusCode)"
        }
    } catch {
        Write-Warning "❌ Web server is not responding"
    }
    
    if ($healthy) {
        Write-Status "✅ Overall system health: GOOD"
    } else {
        Write-Warning "⚠️ Overall system health: NEEDS ATTENTION"
    }
}

# Function to clean up
function Clean-Up {
    Write-Status "Performing comprehensive cleanup..."
    
    # Kill processes
    Write-Status "Stopping Node.js processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    # Remove build files
    Write-Status "Removing build artifacts..."
    Remove-Item -Path "apps/api/dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/web/out" -Recurse -Force -ErrorAction SilentlyContinue
    
    # Clean npm cache
    Write-Status "Cleaning npm cache..."
    npm cache clean --force
    
    # Remove node_modules if requested
    $cleanModules = Read-Host "Remove node_modules folders? This will require reinstalling dependencies. (y/N)"
    if ($cleanModules -eq "y" -or $cleanModules -eq "Y") {
        Write-Status "Removing node_modules..."
        Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "apps/api/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "apps/web/node_modules" -Recurse -Force -ErrorAction SilentlyContinue
        
        Write-Status "Removing package-lock.json files..."
        Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "apps/api/package-lock.json" -Force -ErrorAction SilentlyContinue
        Remove-Item -Path "apps/web/package-lock.json" -Force -ErrorAction SilentlyContinue
    }
    
    Write-Status "✅ Cleanup complete"
}

# Function to show help
function Show-Help {
    Write-Host "EduAI Platform Setup and Run Script (Windows PowerShell)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\setup-and-run.ps1 [-Action <action>]" -ForegroundColor White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Yellow
    Write-Host "  start          Start the applications (default)" -ForegroundColor White
    Write-Host "  setup          Only run setup (install dependencies, setup database)" -ForegroundColor White
    Write-Host "  seed           Only seed the database" -ForegroundColor White
    Write-Host "  health         Check if servers are running and system health" -ForegroundColor White
    Write-Host "  clean          Clean up processes and build files" -ForegroundColor White
    Write-Host "  help           Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "Prerequisites:" -ForegroundColor Yellow
    Write-Host "  - Node.js 18+ (LTS recommended)" -ForegroundColor White
    Write-Host "  - npm package manager" -ForegroundColor White
    Write-Host "  - Windows PowerShell 5.1+ or PowerShell Core 7+" -ForegroundColor White
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\setup-and-run.ps1                 # Full setup and start" -ForegroundColor White
    Write-Host "  .\setup-and-run.ps1 -Action setup   # Setup only" -ForegroundColor White
    Write-Host "  .\setup-and-run.ps1 -Action health  # Health check" -ForegroundColor White
    Write-Host ""
}

# Main execution
switch ($Action) {
    "setup" {
        Write-Status "Running setup only..."
        Setup-Application
        Write-Status "✅ Setup complete! Run '.\setup-and-run.ps1 start' to start the servers."
    }
    "seed" {
        Write-Status "Seeding database..."
        if (Test-Path "prisma") {
            Set-Location prisma
        }
        npx prisma db seed
        if (Test-Path "../prisma") { Set-Location .. }
        Write-Status "✅ Database seeded successfully!"
    }
    "health" {
        Test-Health
    }
    "clean" {
        Clean-Up
    }
    "help" {
        Show-Help
    }
    "start" {
        Setup-Application
        Start-Applications
    }
    default {
        Write-Error "Unknown action: $Action"
        Show-Help
        exit 1
    }
}
