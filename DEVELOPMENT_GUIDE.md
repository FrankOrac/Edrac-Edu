
# EduAI Platform - Development & Maintenance Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Setup](#development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running on Windows](#running-on-windows)
6. [Development Workflow](#development-workflow)
7. [Code Structure](#code-structure)
8. [API Documentation](#api-documentation)
9. [Database Management](#database-management)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Guide](#deployment-guide)
12. [Monitoring & Logging](#monitoring--logging)
13. [Maintenance Tasks](#maintenance-tasks)
14. [Troubleshooting](#troubleshooting)
15. [Contributing Guidelines](#contributing-guidelines)

## Project Overview

EduAI Platform is a comprehensive education management system built with:
- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Google OAuth integration
- **Payment**: Stripe, Paystack, Flutterwave integration
- **AI Integration**: OpenAI for question generation and assistance

## Architecture

```
EduAI Platform
├── apps/
│   ├── web/           # Next.js frontend application
│   └── api/           # Express.js backend API
├── packages/
│   ├── ui/            # Shared UI components
│   └── utils/         # Shared utilities
└── prisma/            # Database schema and migrations
```

## Development Setup

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- PostgreSQL database
- Git

### Installation Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd edu-ai-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
```bash
cp .env.example .env
```

4. **Configure database:**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Start development servers:**
```bash
npm run dev
```

## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eduai_db"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# API Configuration
NEXT_PUBLIC_API_URL="http://0.0.0.0:5000"
PORT=5000

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/google/callback"

# Payment Gateways
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
PAYSTACK_SECRET_KEY="sk_test_..."
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."

# Email Services
SENDGRID_API_KEY="SG...."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# SMS Services (Optional)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# SEO & Analytics
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
GOOGLE_ADSENSE_CLIENT="ca-pub-..."
```

## Running on Windows

### Option 1: Using Command Prompt/PowerShell

1. **Install Node.js:**
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose LTS version for Windows

2. **Install PostgreSQL:**
   - Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - Use default settings during installation

3. **Clone and setup:**
```cmd
git clone <repository-url>
cd edu-ai-platform
npm install
copy .env.example .env
```

4. **Start the application:**
```cmd
npm run dev
```

### Option 2: Using WSL2 (Recommended)

1. **Enable WSL2:**
```powershell
wsl --install
```

2. **Install Ubuntu from Microsoft Store**

3. **Follow Linux setup instructions in WSL terminal**

### Windows Specific Scripts

Create `start-windows.bat`:
```batch
@echo off
echo Starting EduAI Platform...
start cmd /k "cd apps/api && npm run dev"
start cmd /k "cd apps/web && npm run dev"
echo Both servers started!
pause
```

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Run tests
npm run test

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature
```

### 2. Code Quality
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Formatting
npm run format
```

### 3. Database Changes
```bash
# Create migration
npx prisma migrate dev --name migration-name

# Reset database
npx prisma migrate reset

# Seed database
npx prisma db seed
```

## Code Structure

### Frontend (apps/web/)
```
pages/              # Next.js pages (routes)
components/         # Reusable React components
lib/               # Utilities and helpers
styles/            # Global styles and CSS
public/            # Static assets
```

### Backend (apps/api/)
```
routes/            # API route handlers
middleware/        # Express middleware
utils/             # Backend utilities
tests/             # API tests
```

### Key Files
- `apps/web/lib/auth.ts` - Authentication logic
- `apps/api/index.ts` - API server setup
- `prisma/schema.prisma` - Database schema
- `apps/web/components/Layout.tsx` - Main layout component

## API Documentation

### Authentication Endpoints
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/google-url     # Google OAuth URL
POST /api/auth/google-callback # Google OAuth callback
```

### Core Endpoints
```
# Students Management
GET    /api/students          # List all students
GET    /api/students/:id      # Get student by ID
POST   /api/students          # Create new student
PUT    /api/students/:id      # Update student
DELETE /api/students/:id      # Delete student

# CBT System
GET    /api/cbt-subjects      # List CBT subjects
GET    /api/cbt-questions     # List questions
POST   /api/cbt-sessions      # Start CBT session
GET    /api/cbt-results       # Get CBT results

# Payments
GET    /api/payments          # List payments
POST   /api/payments/process  # Process payment
GET    /api/payments/plans    # Get subscription plans
```

## Database Management

### Schema Updates
1. Modify `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev`
3. Update seed file if needed
4. Test migration on staging

### Backup & Restore
```bash
# Backup
pg_dump -U username -h localhost eduai_db > backup.sql

# Restore
psql -U username -h localhost eduai_db < backup.sql
```

## Testing Strategy

### Unit Tests
```bash
# Run all tests
npm run test

# Run specific test file
npm run test auth.test.ts

# Run with coverage
npm run test:coverage
```

### Integration Tests
```bash
# API tests
cd apps/api
npm run test:integration

# Frontend tests
cd apps/web
npm run test:e2e
```

### Test Structure
```
__tests__/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── e2e/              # End-to-end tests
```

## Deployment Guide

### Replit Deployment (Recommended)

1. **Environment Setup:**
   - Configure environment variables in Replit Secrets
   - Ensure database connection strings are correct

2. **Build Process:**
```bash
# Build frontend
cd apps/web && npm run build

# Build backend
cd apps/api && npm run build
```

3. **Production Configuration:**
   - Update `.replit` file for production settings
   - Configure custom domain if needed

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production database URLs
- Configure production API keys
- Set up monitoring credentials

## Monitoring & Logging

### Error Tracking
- Frontend errors logged to `/api/error-logs`
- Backend errors logged to console and database
- Email notifications for critical errors

### Performance Monitoring
- Page load times tracked
- API response times monitored
- Database query performance logged

### Health Checks
```bash
# API health check
curl http://localhost:5000/health

# Database connection check
curl http://localhost:5000/api/health/db
```

## Maintenance Tasks

### Daily Tasks
- Monitor error logs
- Check system performance
- Review user feedback

### Weekly Tasks
- Database backup
- Security updates
- Performance optimization review

### Monthly Tasks
- Dependency updates
- Security audit
- Performance analysis
- Feature usage analytics

### Quarterly Tasks
- Major dependency upgrades
- Architecture review
- Scalability planning

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check API server is running on port 5000
   - Verify environment variables
   - Check network connectivity

2. **Database Connection Issues**
   - Verify DATABASE_URL
   - Check PostgreSQL service status
   - Run `npx prisma db push`

3. **Authentication Problems**
   - Check JWT_SECRET configuration
   - Verify token expiration
   - Clear localStorage and retry

4. **Build Failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run type-check`
   - Update dependencies: `npm update`

### Debug Commands
```bash
# Check all environment variables
printenv | grep -E "(DATABASE|JWT|GOOGLE|STRIPE)"

# Database connection test
npx prisma db push --preview-feature

# API endpoint test
curl -X GET http://localhost:5000/health
```

## Contributing Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Pull Request Process
1. Create feature branch from `main`
2. Implement changes with tests
3. Update documentation if needed
4. Submit PR with clear description
5. Address review feedback
6. Merge after approval

### Code Review Checklist
- [ ] Code follows project standards
- [ ] Tests pass and coverage maintained
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered

## Security Best Practices

1. **Authentication & Authorization**
   - Use strong JWT secrets
   - Implement role-based access control
   - Validate all user inputs

2. **Data Protection**
   - Encrypt sensitive data
   - Use HTTPS in production
   - Regular security audits

3. **API Security**
   - Rate limiting implemented
   - Input validation on all endpoints
   - Proper error handling

## Performance Optimization

1. **Frontend Optimization**
   - Code splitting with Next.js
   - Image optimization
   - Lazy loading for heavy components

2. **Backend Optimization**
   - Database query optimization
   - API response caching
   - Connection pooling

3. **Database Optimization**
   - Proper indexing
   - Query performance monitoring
   - Regular maintenance tasks

## Support & Resources

- **Documentation**: Check this guide and inline code comments
- **Community**: Join our Discord/Slack for discussions
- **Issues**: Report bugs via GitHub issues
- **Email**: Contact dev team at dev@eduai.com

---

*Last updated: January 2024*
*Version: 1.0.0*
