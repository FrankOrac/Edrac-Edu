"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
// Route imports
const students_1 = __importDefault(require("./routes/students"));
const teachers_1 = __importDefault(require("./routes/teachers"));
const parents_1 = __importDefault(require("./routes/parents"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const exams_1 = __importDefault(require("./routes/exams"));
const cbt_questions_1 = __importDefault(require("./routes/cbt-questions"));
const cbt_results_1 = __importDefault(require("./routes/cbt-results"));
const cbt_sessions_1 = __importDefault(require("./routes/cbt-sessions"));
const cbt_subjects_1 = __importDefault(require("./routes/cbt-subjects"));
const results_1 = __importDefault(require("./routes/results"));
const assignments_1 = __importDefault(require("./routes/assignments"));
const transcripts_1 = __importDefault(require("./routes/transcripts"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const events_1 = __importDefault(require("./routes/events"));
const transport_1 = __importDefault(require("./routes/transport"));
const inventory_1 = __importDefault(require("./routes/inventory"));
const library_1 = __importDefault(require("./routes/library"));
const forums_1 = __importDefault(require("./routes/forums"));
const payments_1 = __importDefault(require("./routes/payments"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const gamification_1 = __importDefault(require("./routes/gamification"));
const certificates_1 = __importDefault(require("./routes/certificates"));
const alumni_1 = __importDefault(require("./routes/alumni"));
const groups_1 = __importDefault(require("./routes/groups"));
const plugins_1 = __importDefault(require("./routes/plugins"));
const ai_1 = __importDefault(require("./routes/ai"));
const device_tracking_1 = __importDefault(require("./routes/device-tracking"));
const schools_1 = __importDefault(require("./routes/schools"));
const cbt_comments_1 = __importDefault(require("./routes/cbt-comments"));
const seo_1 = __importDefault(require("./routes/seo"));
const advertising_1 = __importDefault(require("./routes/advertising"));
const web_analytics_1 = __importDefault(require("./routes/web-analytics"));
const notification_settings_1 = __importDefault(require("./routes/notification-settings"));
const error_logs_1 = __importDefault(require("./routes/error-logs"));
const google_auth_1 = __importDefault(require("./routes/google-auth"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.API_PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// Auth middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.auth = auth;
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const health_1 = __importDefault(require("./routes/health"));
app.use('/api/health', health_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/students', students_1.default);
app.use('/api/teachers', teachers_1.default);
app.use('/api/parents', parents_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/exams', exams_1.default);
app.use('/api/cbt-questions', cbt_questions_1.default);
app.use('/api/cbt-results', cbt_results_1.default);
app.use('/api/cbt-sessions', cbt_sessions_1.default);
app.use('/api/cbt-subjects', cbt_subjects_1.default);
app.use('/api/results', results_1.default);
app.use('/api/assignments', assignments_1.default);
app.use('/api/transcripts', transcripts_1.default);
app.use('/api/notifications', notifications_1.default);
app.use('/api/events', events_1.default);
app.use('/api/transport', transport_1.default);
app.use('/api/inventory', inventory_1.default);
app.use('/api/library', library_1.default);
app.use('/api/forums', forums_1.default);
app.use('/api/payments', payments_1.default);
app.use('/api/analytics', analytics_1.default);
app.use('/api/gamification', gamification_1.default);
app.use('/api/certificates', certificates_1.default);
app.use('/api/alumni', alumni_1.default);
app.use('/api/groups', groups_1.default);
app.use('/api/plugins', plugins_1.default);
app.use('/api/ai', ai_1.default);
app.use('/api/device-tracking', device_tracking_1.default);
app.use('/api/schools', schools_1.default);
app.use('/api/cbt-comments', cbt_comments_1.default);
app.use('/api/seo', seo_1.default);
app.use('/api/advertising', advertising_1.default);
app.use('/api/web-analytics', web_analytics_1.default);
app.use('/api/notification-settings', notification_settings_1.default);
app.use('/api/error-logs', error_logs_1.default);
app.use('/api/auth', google_auth_1.default);
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Auth routes
app.post('/api/auth/login', async (req, res) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        // In a real app, you'd hash the password and check against database
        // For demo purposes, we'll use hardcoded users
        const users = [
            { id: 1, email: 'admin@edrac.edu', password: 'password123', name: 'Admin User', role: 'admin' },
            { id: 2, email: 'teacher@edrac.edu', password: 'password123', name: 'John Teacher', role: 'teacher' },
            { id: 3, email: 'student@edrac.edu', password: 'password123', name: 'Jane Student', role: 'student' },
            { id: 4, email: 'parent@edrac.edu', password: 'password123', name: 'Parent User', role: 'parent' },
            { id: 5, email: 'superadmin@edrac.edu', password: 'password123', name: 'Super Admin', role: 'superadmin' }
        ];
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            console.log('User not found for email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        console.log('User found:', user.email);
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;
        console.log('Sending response with token');
        res.json({
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role = 'student' } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }
        // Create JWT token
        const token = jsonwebtoken_1.default.sign({ userId: Date.now(), email, role }, JWT_SECRET, { expiresIn: '24h' });
        const user = { id: Date.now(), email, name, role };
        res.status(201).json({
            token,
            user
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
const HOST = '0.0.0.0';
// Add process error handlers
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
app.listen(PORT, HOST, () => {
    console.log(`🚀 API Server running on http://${HOST}:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
    process.exit(1);
});
exports.default = app;
