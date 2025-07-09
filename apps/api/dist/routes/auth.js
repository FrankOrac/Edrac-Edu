"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Test credentials for demo
const testUsers = [
    { email: 'admin@eduai.com', password: 'admin123', role: 'admin', name: 'Admin User' },
    { email: 'superadmin@eduai.com', password: 'superadmin123', role: 'superadmin', name: 'Super Admin' },
    { email: 'teacher@eduai.com', password: 'teacher123', role: 'teacher', name: 'Teacher User' },
    { email: 'student@eduai.com', password: 'student123', role: 'student', name: 'Student User' },
    { email: 'parent@eduai.com', password: 'parent123', role: 'parent', name: 'Parent User' },
    { email: 'guest@demo.com', password: 'demo', role: 'student', name: 'Demo User' }
];
// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // Check test credentials first
        const testUser = testUsers.find(user => user.email === email && user.password === password);
        if (testUser) {
            const token = jsonwebtoken_1.default.sign({
                id: Math.floor(Math.random() * 1000),
                email: testUser.email,
                role: testUser.role
            }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                token,
                user: {
                    id: Math.floor(Math.random() * 1000),
                    email: testUser.email,
                    name: testUser.name,
                    role: testUser.role
                }
            });
        }
        // If no test user found, check database (for production users)
        try {
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            });
        }
        catch (dbError) {
            // If database is not available, return error for non-test accounts
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, role = 'student' } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Check if user already exists
        const existingTestUser = testUsers.find(user => user.email === email);
        if (existingTestUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }
            const hashedPassword = bcryptjs_1.default.hashSync(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role
                }
            });
            const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
            res.status(201).json({
                token,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    name: newUser.name,
                    role: newUser.role
                }
            });
        }
        catch (dbError) {
            // If database is not available, create temporary user
            const tempUser = {
                id: Math.floor(Math.random() * 1000),
                email,
                name,
                role
            };
            const token = jsonwebtoken_1.default.sign(tempUser, JWT_SECRET, { expiresIn: '24h' });
            res.status(201).json({
                token,
                user: tempUser
            });
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Verify token endpoint
router.get('/verify', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({
            user: {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                role: decoded.role
            }
        });
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});
// Logout endpoint
router.post('/logout', (req, res) => {
    // In a real app, you might want to blacklist the token
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;
