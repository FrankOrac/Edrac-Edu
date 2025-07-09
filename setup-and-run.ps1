
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

# Function to setup the application
function Setup-Application {
    # Step 1: Install root dependencies
    Write-Status "Installing root dependencies..."
    npm install
    
    # Step 2: Install API dependencies
    Write-Status "Installing API dependencies..."
    Set-Location apps/api
    npm install
    Set-Location ../..
    
    # Step 3: Install Web dependencies
    Write-Status "Installing Web dependencies..."
    Set-Location apps/web
    npm install
    Set-Location ../..
    
    # Step 4: Check if .env file exists
    if (!(Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from .env.example..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Status "Created .env file. Please update it with your actual values."
        } else {
            Write-Error ".env.example file not found. Creating a basic .env file..."
            @"
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here-change-in-production"

# API Configuration
NEXT_PUBLIC_API_URL="http://0.0.0.0:5000"
PORT=5000

# OpenAI API Key (Optional)
OPENAI_API_KEY="your-openai-api-key-here"

# Payment Gateways (Optional)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
PAYSTACK_SECRET_KEY="sk_test_your_paystack_secret_key"

# Email Services (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
"@ | Out-File -FilePath ".env" -Encoding utf8
            Write-Status "Created basic .env file. Please update it with your actual values."
        }
    }
    
    # Step 5: Set up database
    Write-Status "Setting up database..."
    
    # Generate Prisma client
    Write-Status "Generating Prisma client..."
    npx prisma generate
    
    # Create database and run migrations
    Write-Status "Creating database and running migrations..."
    npx prisma db push
    
    # Seed the database
    Write-Status "Seeding database with initial data..."
    npx prisma db seed
    
    # Step 6: Build the applications
    Write-Status "Building applications..."
    
    # Build API
    Write-Status "Building API..."
    Set-Location apps/api
    try {
        npm run build
    } catch {
        Write-Warning "API build failed, but continuing..."
    }
    Set-Location ../..
    
    # Build Web
    Write-Status "Building Web application..."
    Set-Location apps/web
    try {
        npm run build
    } catch {
        Write-Warning "Web build failed, but continuing..."
    }
    Set-Location ../..
}

# Function to start applications
function Start-Applications {
    Write-Status "Starting applications..."
    
    # Kill any existing Node processes
    Write-Status "Cleaning up existing processes..."
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Wait a moment for processes to fully terminate
    Start-Sleep -Seconds 2
    
    # Start API server
    Write-Status "Starting API server on port 5000..."
    $apiJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/api
        npm run dev
    }
    
    # Wait for API to start
    Start-Sleep -Seconds 3
    
    # Start Web server
    Write-Status "Starting Web server on port 3000..."
    $webJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD/apps/web
        npm run dev
    }
    
    # Wait for both servers to start
    Start-Sleep -Seconds 5
    
    Write-Status "✅ Setup complete!"
    Write-Host ""
    Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 API: http://localhost:5000" -ForegroundColor Cyan
    Write-Host "📚 API Documentation: http://localhost:5000/api/docs" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Default login credentials:"
    Write-Host "  Admin: admin@edrac.edu / password123"
    Write-Host "  Teacher: teacher@edrac.edu / password123"
    Write-Host "  Student: student@edrac.edu / password123"
    Write-Host ""
    Write-Host "Press Ctrl+C to stop both servers"
    
    # Wait for jobs to complete or user to interrupt
    try {
        Wait-Job $apiJob, $webJob
    } finally {
        Write-Status "Shutting down servers..."
        Stop-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Remove-Job $apiJob, $webJob -ErrorAction SilentlyContinue
        Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    }
}

# Function to perform health check
function Test-Health {
    Write-Status "Performing health check..."
    
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
}

# Function to clean up
function Clean-Up {
    Write-Status "Cleaning up..."
    
    # Kill processes
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Remove build files
    Remove-Item -Path "apps/api/dist" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "apps/web/.next" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Status "✅ Cleanup complete"
}

# Function to show help
function Show-Help {
    Write-Host "EduAI Platform Setup and Run Script (Windows PowerShell)"
    Write-Host ""
    Write-Host "Usage: .\setup-and-run.ps1 [-Action <action>]"
    Write-Host ""
    Write-Host "Actions:"
    Write-Host "  start          Start the applications (default)"
    Write-Host "  setup          Only run setup (install dependencies, setup database)"
    Write-Host "  seed           Only seed the database"
    Write-Host "  health         Check if servers are running"
    Write-Host "  clean          Clean up processes and build files"
    Write-Host "  help           Show this help message"
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
        npx prisma db seed
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
