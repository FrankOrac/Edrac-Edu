
#!/bin/bash

# EduAI Platform Setup and Run Script
# This script installs dependencies, sets up the database, and runs the application

set -e  # Exit on any error

echo "🚀 Starting EduAI Platform Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Install root dependencies
print_status "Installing root dependencies..."
npm install

# Step 2: Install API dependencies
print_status "Installing API dependencies..."
cd apps/api
npm install
cd ../..

# Step 3: Install Web dependencies
print_status "Installing Web dependencies..."
cd apps/web
npm install
cd ../..

# Step 4: Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_status "Created .env file. Please update it with your actual values."
    else
        print_error ".env.example file not found. Creating a basic .env file..."
        cat > .env << EOL
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
EOL
        print_status "Created basic .env file. Please update it with your actual values."
    fi
fi

# Step 5: Set up database
print_status "Setting up database..."

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate

# Create database and run migrations
print_status "Creating database and running migrations..."
npx prisma db push

# Seed the database
print_status "Seeding database with initial data..."
npx prisma db seed

# Step 6: Build the applications
print_status "Building applications..."

# Build API
print_status "Building API..."
cd apps/api
npm run build || print_warning "API build failed, but continuing..."
cd ../..

# Build Web (for production readiness)
print_status "Building Web application..."
cd apps/web
npm run build || print_warning "Web build failed, but continuing..."
cd ../..

# Step 7: Function to start the applications
start_applications() {
    print_status "Starting applications..."
    
    # Kill any existing processes on the ports
    print_status "Cleaning up existing processes..."
    pkill -f "ts-node-dev" || true
    pkill -f "next dev" || true
    
    # Wait a moment for processes to fully terminate
    sleep 2
    
    # Start API server in background
    print_status "Starting API server on port 5000..."
    cd apps/api
    npm run dev &
    API_PID=$!
    cd ../..
    
    # Wait for API to start
    sleep 3
    
    # Start Web server in background
    print_status "Starting Web server on port 3000..."
    cd apps/web
    npm run dev &
    WEB_PID=$!
    cd ../..
    
    # Wait for both servers to start
    sleep 5
    
    print_status "✅ Setup complete!"
    echo ""
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 API: http://localhost:5000"
    echo "📚 API Documentation: http://localhost:5000/api/docs"
    echo ""
    echo "Default login credentials:"
    echo "  Admin: admin@edrac.edu / password123"
    echo "  Teacher: teacher@edrac.edu / password123"
    echo "  Student: student@edrac.edu / password123"
    echo ""
    echo "Press Ctrl+C to stop both servers"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Shutting down servers..."
        kill $API_PID 2>/dev/null || true
        kill $WEB_PID 2>/dev/null || true
        exit 0
    }
    
    # Set up signal handlers
    trap cleanup SIGINT SIGTERM
    
    # Wait for both processes
    wait $API_PID $WEB_PID
}

# Step 8: Health check function
health_check() {
    print_status "Performing health check..."
    
    # Check if API is running
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_status "✅ API server is healthy"
    else
        print_warning "❌ API server is not responding"
    fi
    
    # Check if Web is running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_status "✅ Web server is healthy"
    else
        print_warning "❌ Web server is not responding"
    fi
}

# Step 9: Show help
show_help() {
    echo "EduAI Platform Setup and Run Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start          Start the applications (default)"
    echo "  setup          Only run setup (install dependencies, setup database)"
    echo "  seed           Only seed the database"
    echo "  health         Check if servers are running"
    echo "  clean          Clean up processes and build files"
    echo "  help           Show this help message"
    echo ""
}

# Step 10: Clean up function
clean_up() {
    print_status "Cleaning up..."
    
    # Kill processes
    pkill -f "ts-node-dev" || true
    pkill -f "next dev" || true
    
    # Remove build files
    rm -rf apps/api/dist 2>/dev/null || true
    rm -rf apps/web/.next 2>/dev/null || true
    rm -rf node_modules/.cache 2>/dev/null || true
    
    print_status "✅ Cleanup complete"
}

# Main execution
case "${1:-start}" in
    "setup")
        print_status "Running setup only..."
        # Steps 1-6 already executed above
        print_status "✅ Setup complete! Run '$0 start' to start the servers."
        ;;
    "seed")
        print_status "Seeding database..."
        npx prisma db seed
        print_status "✅ Database seeded successfully!"
        ;;
    "health")
        health_check
        ;;
    "clean")
        clean_up
        ;;
    "help")
        show_help
        ;;
    "start"|"")
        start_applications
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
