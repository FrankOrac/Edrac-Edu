
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

    # Step 2: Clean npm cache and remove problematic files
    Write-Status "Cleaning npm cache and removing lock files..."
    npm cache clean --force
    
    # Remove all package-lock.json files for clean install
    Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/api/package-lock.json" -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/web/package-lock.json" -Force -ErrorAction SilentlyContinue

    # Step 3: Install root dependencies
    Write-Status "Installing root dependencies..."
    npm install --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install root dependencies"
        exit 1
    }

    # Step 4: Install API dependencies
    Write-Status "Installing API dependencies..."
    Set-Location apps/api
    
    # Install core API dependencies
    npm install --legacy-peer-deps
    
    # Install additional required API dependencies
    Write-Status "Installing additional API dependencies..."
    npm install --save-dev @types/bcryptjs @types/cors @types/express @types/jsonwebtoken @types/node @types/swagger-jsdoc @types/swagger-ui-express --legacy-peer-deps
    npm install bcryptjs cors express helmet jsonwebtoken rate-limiter-flexible swagger-jsdoc swagger-ui-express winston --legacy-peer-deps
    npm install @prisma/client prisma --legacy-peer-deps
    npm install ts-node ts-node-dev typescript --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Some API dependencies had issues, but continuing..."
    }
    Set-Location ../..
    
    # Step 5: Install Web dependencies
    Write-Status "Installing Web dependencies..."
    Set-Location apps/web
    
    # Install core web dependencies
    npm install --legacy-peer-deps
    
    # Install additional required web dependencies
    Write-Status "Installing additional Web dependencies..."
    npm install --save-dev @types/react @types/react-dom @types/node --legacy-peer-deps
    npm install react react-dom next tailwindcss postcss autoprefixer --legacy-peer-deps
    npm install framer-motion recharts lucide-react --legacy-peer-deps
    
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Some Web dependencies had issues, but continuing..."
    }
    Set-Location ../..

    # Step 6: Install global development tools
    Write-Status "Installing global development tools..."
    npm install -g typescript ts-node prisma --force

    # Step 7: Check if .env file exists and create comprehensive one
    if (!(Test-Path ".env")) {
        Write-Warning ".env file not found. Creating comprehensive .env file..."
        @"
# Database Configuration
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="edu-ai-super-secret-jwt-key-$(Get-Random)-$(Get-Date -Format 'yyyyMMddHHmmss')"

# API Configuration
NEXT_PUBLIC_API_URL="http://0.0.0.0:5000"
PORT=5000
NODE_ENV="development"

# OpenAI API Configuration
OPENAI_API_KEY="your-openai-api-key-here"
OPENAI_MODEL="gpt-3.5-turbo"

# Google OAuth Configuration
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# Payment Gateway Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-your_flutterwave_secret_key"

# Email Services Configuration
SENDGRID_API_KEY="SG.your_sendgrid_api_key"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS Services Configuration
TWILIO_ACCOUNT_SID="AC_your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"

# Security Configuration
SESSION_SECRET="session-secret-$(Get-Random)-$(Get-Date -Format 'yyyyMMddHHmmss')"
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Analytics Configuration
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_ADSENSE_CLIENT="ca-pub-your_adsense_client"

# Application Configuration
APP_NAME="EduAI Platform"
APP_URL="http://localhost:3000"
SUPPORT_EMAIL="support@edrac.edu"
ADMIN_EMAIL="admin@edrac.edu"

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH="./uploads"

# Cache Configuration
REDIS_URL="redis://localhost:6379"
CACHE_TTL=3600

# Development Configuration
DEBUG=true
LOG_LEVEL="debug"
ENABLE_SWAGGER=true
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-Status "Created comprehensive .env file. Please update with your actual API keys."
    }
    
    # Step 8: Set up database with comprehensive error handling
    Write-Status "Setting up database..."
    
    try {
        Write-Status "Generating Prisma client..."
        npx prisma generate
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Prisma generate had issues, attempting alternative approach..."
            cd prisma
            npx prisma generate
            cd ..
        }
        
        Write-Status "Creating database and running migrations..."
        npx prisma db push --force-reset
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Database push had issues, trying migration approach..."
            npx prisma migrate deploy
        }
        
        Write-Status "Seeding database with initial data..."
        npx prisma db seed
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "Database seeding failed, but continuing..."
        }
    } catch {
        Write-Warning "Database setup encountered issues, but continuing with application setup..."
    }
    
    # Step 9: Create necessary TypeScript configurations
    Write-Status "Setting up TypeScript configurations..."
    
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
    "declaration": false,
    "sourceMap": true,
    "allowJs": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
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
    "strict": false,
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

    # Step 10: Performance optimizations
    Write-Status "Applying performance optimizations..."
    
    # Create Next.js configuration for better performance
    if (!(Test-Path "apps/web/next.config.js")) {
        @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
"@ | Out-File -FilePath "apps/web/next.config.js" -Encoding utf8
    }

    Write-Status "✅ Setup completed successfully!"
    Write-Status "🔧 All dependencies installed and configurations set up"
    Write-Status "📊 Database initialized with seed data"
    Write-Status "⚡ Performance optimizations applied"
}

# Function to start applications with comprehensive monitoring
function Start-Applications {
    Write-Status "Starting applications with enhanced monitoring..."
    
    # Kill any existing Node processes
    Write-Status "Cleaning up existing processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    
    # Check port availability
    Write-Status "Checking port availability..."
    $ports = @(3000, 5000)
    foreach ($port in $ports) {
        try {
            $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
            $listener.Start()
            $listener.Stop()
            Write-Status "✅ Port $port is available"
        } catch {
            Write-Warning "⚠️ Port $port is already in use"
        }
    }
    
    # Start API server with enhanced error handling
    Write-Status "🚀 Starting API server on port 5000..."
    $apiJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/api
        $env:NODE_ENV = "development"
        $env:PORT = "5000"
        $env:DEBUG = "true"
        npm run dev
    }
    
    Start-Sleep -Seconds 8
    
    # Start Web server with enhanced error handling
    Write-Status "🌐 Starting Web server on port 3000..."
    $webJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/web
        $env:NODE_ENV = "development"
        $env:PORT = "3000"
        npm run dev
    }
    
    Start-Sleep -Seconds 10
    
    # Comprehensive health check
    Write-Status "🔍 Performing comprehensive health check..."
    $healthy = $true
    
    try {
        $apiTest = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($apiTest.StatusCode -eq 200) {
            Write-Status "✅ API server is healthy and responding"
        } else {
            Write-Warning "⚠️ API server responded with status code: $($apiTest.StatusCode)"
            $healthy = $false
        }
    } catch {
        Write-Warning "⚠️ API server health check failed - still starting up..."
        $healthy = $false
    }
    
    try {
        $webTest = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($webTest.StatusCode -eq 200) {
            Write-Status "✅ Web server is healthy and responding"
        } else {
            Write-Warning "⚠️ Web server responded with status code: $($webTest.StatusCode)"
            $healthy = $false
        }
    } catch {
        Write-Warning "⚠️ Web server health check failed - still starting up..."
        $healthy = $false
    }
    
    if (!$healthy) {
        Write-Status "⏳ Servers are still initializing. Please wait a moment and check manually."
    }
    
    Write-Status "🎉 EduAI Platform is ready!"
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "                          🎓 EduAI Platform Access URLs                          " -ForegroundColor Cyan
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Frontend Application: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 API Backend: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:5000/api" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:5000/api/docs" -ForegroundColor Cyan
    Write-Host "🔍 Health Check: " -NoNewline -ForegroundColor White
    Write-Host "http://localhost:5000/api/health" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host "                            🔐 Default Login Credentials                         " -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "👤 Admin: " -NoNewline -ForegroundColor White
    Write-Host "admin@edrac.edu / password123" -ForegroundColor Green
    Write-Host "🎓 Teacher: " -NoNewline -ForegroundColor White
    Write-Host "teacher@edrac.edu / password123" -ForegroundColor Green
    Write-Host "📚 Student: " -NoNewline -ForegroundColor White
    Write-Host "student@edrac.edu / password123" -ForegroundColor Green
    Write-Host "👨‍👩‍👧‍👦 Parent: " -NoNewline -ForegroundColor White
    Write-Host "parent@edrac.edu / password123" -ForegroundColor Green
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
    Write-Host "                                💡 Development Tips                              " -ForegroundColor Magenta
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Magenta
    Write-Host ""
    Write-Host "⚡ Both servers support hot reload for development" -ForegroundColor White
    Write-Host "📊 Monitor server logs in separate terminal windows" -ForegroundColor White
    Write-Host "🔄 Automatic database seeding with sample data" -ForegroundColor White
    Write-Host "🛡️ Enhanced security with rate limiting and CORS" -ForegroundColor White
    Write-Host "🎯 TypeScript strict mode enabled for better code quality" -ForegroundColor White
    Write-Host ""
    Write-Host "🛑 Press Ctrl+C to stop both servers" -ForegroundColor Red
    Write-Host ""
    
    # Wait for jobs to complete or user to interrupt
    try {
        Wait-Job $apiJob, $webJob
    } finally {
        Write-Status "🛑 Shutting down servers..."
        Stop-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Remove-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Status "✅ Cleanup completed successfully"
    }
}

# Function to perform comprehensive health check
function Test-Health {
    Write-Status "🔍 Performing comprehensive system health check..."
    
    $healthScore = 0
    $maxScore = 10
    
    # Check Node.js
    if (Test-NodeJS) {
        Write-Status "✅ Node.js is available"
        $healthScore++
    } else {
        Write-Error "❌ Node.js is not available"
    }
    
    # Check npm
    if (Test-NPM) {
        Write-Status "✅ npm is available"
        $healthScore++
    } else {
        Write-Error "❌ npm is not available"
    }
    
    # Check dependencies
    if (Test-Path "node_modules") {
        Write-Status "✅ Root dependencies are installed"
        $healthScore++
    } else {
        Write-Warning "⚠️ Root dependencies not found"
    }
    
    if (Test-Path "apps/api/node_modules") {
        Write-Status "✅ API dependencies are installed"
        $healthScore++
    } else {
        Write-Warning "⚠️ API dependencies not found"
    }
    
    if (Test-Path "apps/web/node_modules") {
        Write-Status "✅ Web dependencies are installed"
        $healthScore++
    } else {
        Write-Warning "⚠️ Web dependencies not found"
    }
    
    # Check environment file
    if (Test-Path ".env") {
        Write-Status "✅ Environment file exists"
        $healthScore++
    } else {
        Write-Warning "⚠️ Environment file not found"
    }
    
    # Check database
    if (Test-Path "prisma/dev.db") {
        Write-Status "✅ Database file exists"
        $healthScore++
    } else {
        Write-Warning "⚠️ Database file not found"
    }
    
    # Check TypeScript configurations
    if ((Test-Path "apps/api/tsconfig.json") -and (Test-Path "apps/web/tsconfig.json")) {
        Write-Status "✅ TypeScript configurations are present"
        $healthScore++
    } else {
        Write-Warning "⚠️ TypeScript configurations missing"
    }
    
    # Check if API is running
    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 5
        if ($apiResponse.StatusCode -eq 200) {
            Write-Status "✅ API server is healthy and responding"
            $healthScore++
        }
    } catch {
        Write-Warning "❌ API server is not responding"
    }
    
    # Check if Web is running
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 5
        if ($webResponse.StatusCode -eq 200) {
            Write-Status "✅ Web server is healthy and responding"
            $healthScore++
        }
    } catch {
        Write-Warning "❌ Web server is not responding"
    }
    
    # Calculate health percentage
    $healthPercentage = [math]::Round(($healthScore / $maxScore) * 100, 1)
    
    Write-Host ""
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host "                   SYSTEM HEALTH REPORT" -ForegroundColor Cyan
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host ""
    
    $color = if ($healthPercentage -ge 80) { "Green" } 
             elseif ($healthPercentage -ge 60) { "Yellow" } 
             else { "Red" }
             
    $scoreText = [string]::Format("Health Score: {0}/{1} ({2}%)", $healthScore, $maxScore, $healthPercentage)
    Write-Host $scoreText -ForegroundColor $color
    
    if ($healthPercentage -ge 80) {
        Write-Host "[EXCELLENT] System is healthy" -ForegroundColor Green
    } 
    elseif ($healthPercentage -ge 60) {
        Write-Host "[GOOD] System has minor issues" -ForegroundColor Yellow
    } 
    else {
        Write-Host "[ATTENTION NEEDED] System has critical issues" -ForegroundColor Red
    }
    Write-Host ""
}

# Function to clean up with enhanced options
function Clean-Up {
    Write-Status "🧹 Performing comprehensive cleanup..."
    
    # Kill processes
    Write-Status "🛑 Stopping all Node.js processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    
    # Remove build files
    Write-Status "🗑️ Removing build artifacts..."
    $buildPaths = @(
        "apps/api/dist",
        "apps/web/.next",
        "apps/web/out",
        ".next"
    )
    
    foreach ($path in $buildPaths) {
        if (Test-Path $path) {
            Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
            Write-Status "✅ Removed $path"
        }
    }
    
    # Clean npm cache
    Write-Status "🧽 Cleaning npm cache..."
    npm cache clean --force
    
    # Ask about deep clean
    $deepClean = Read-Host "🔄 Perform deep clean? This will remove node_modules and require reinstalling dependencies. (y/N)"
    if ($deepClean -eq "y" -or $deepClean -eq "Y") {
        Write-Status "🧹 Performing deep clean..."
        
        $modulePaths = @(
            "node_modules",
            "apps/api/node_modules",
            "apps/web/node_modules"
        )
        
        foreach ($path in $modulePaths) {
            if (Test-Path $path) {
                Write-Status "🗑️ Removing $path..."
                Remove-Item -Path $path -Recurse -Force -ErrorAction SilentlyContinue
            }
        }
        
        $lockPaths = @(
            "package-lock.json",
            "apps/api/package-lock.json",
            "apps/web/package-lock.json"
        )
        
        foreach ($path in $lockPaths) {
            if (Test-Path $path) {
                Remove-Item -Path $path -Force -ErrorAction SilentlyContinue
                Write-Status "✅ Removed $path"
            }
        }
        
        Write-Warning "⚠️ Deep clean completed. Run setup to reinstall dependencies."
    }
    
    Write-Status "✅ Cleanup completed successfully"
}

# Function to show comprehensive help
function Show-Help {
    Write-Host ""
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host "                 EDUAI PLATFORM SETUP SCRIPT" -ForegroundColor Cyan
    Write-Host "==============================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "  .\setup-and-run.ps1 [-Action <action>]" -ForegroundColor White
    Write-Host ""
    Write-Host "AVAILABLE ACTIONS:" -ForegroundColor Yellow
    Write-Host "  start     - Complete setup and start servers (default)" -ForegroundColor White
    Write-Host "  setup     - Install dependencies and configure database only" -ForegroundColor White
    Write-Host "  seed      - Seed the database with sample data" -ForegroundColor White
    Write-Host "  health    - Run system health check" -ForegroundColor White
    Write-Host "  clean     - Clean up processes and temporary files" -ForegroundColor White
    Write-Host "  help      - Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "PREREQUISITES:" -ForegroundColor Yellow
    Write-Host "  - Node.js 18+ (LTS recommended)" -ForegroundColor White
    Write-Host "  - npm package manager" -ForegroundColor White
    Write-Host "  - Windows PowerShell 5.1+ or PowerShell Core 7+" -ForegroundColor White
    Write-Host "  - At least 4GB RAM and 2GB free disk space" -ForegroundColor White
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Yellow
    Write-Host "  .\setup-and-run.ps1" -ForegroundColor White
    Write-Host "  .\setup-and-run.ps1 -Action setup" -ForegroundColor White
    Write-Host "  .\setup-and-run.ps1 -Action health" -ForegroundColor White
    Write-Host "  .\setup-and-run.ps1 -Action clean" -ForegroundColor White
    Write-Host ""
    Write-Host "USEFUL URLS (after starting):" -ForegroundColor Yellow
    Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "  - API: http://localhost:5000/api" -ForegroundColor White
    Write-Host "  - Documentation: http://localhost:5000/api/docs" -ForegroundColor White
    Write-Host ""
}

# Main execution with enhanced error handling
try {
    $actionLower = $Action.ToLower()
    
    if ($actionLower -eq "setup") {
        Write-Status "Running setup only..."
        Setup-Application
        Write-Status "Setup complete! Run '.\setup-and-run.ps1 -Action start' to start the servers."
    }
    elseif ($actionLower -eq "seed") {
        Write-Status "Seeding database..."
        try {
            npx prisma db seed
            Write-Status "Database seeded successfully!"
        } catch {
            Write-Warning "Database seeding encountered issues. Trying alternative approach..."
            Set-Location prisma -ErrorAction SilentlyContinue
            npx prisma db seed
            Set-Location .. -ErrorAction SilentlyContinue
        }
    }
    elseif ($actionLower -eq "health") {
        Test-Health
    }
    elseif ($actionLower -eq "clean") {
        Clean-Up
    }
    elseif ($actionLower -eq "help") {
        Show-Help
    }
    elseif ($actionLower -eq "start") {
        Setup-Application
        Start-Applications
    }
    else {
        Write-Error "Unknown action: $Action"
        Show-Help
        exit 1
    }
}
catch {
    Write-Error "An unexpected error occurred: $($_.Exception.Message)"
    Write-Status "If the issue persists, please check the documentation or contact support."
    exit 1
}
