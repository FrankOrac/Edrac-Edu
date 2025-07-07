
-- EduAI Platform Database Setup Script
-- Run this in PostgreSQL to create the database and user

-- Create database
CREATE DATABASE eduai_db;

-- Create user (replace 'your_password' with a strong password)
CREATE USER eduai_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE eduai_db TO eduai_user;

-- Connect to the database
\c eduai_db;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO eduai_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO eduai_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO eduai_user;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Display success message
SELECT 'Database setup completed successfully!' as status;
