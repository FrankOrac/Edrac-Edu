import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Route imports
import studentsRoutes from './routes/students';
import teachersRoutes from './routes/teachers';
import parentsRoutes from './routes/parents';
import attendanceRoutes from './routes/attendance';
import examsRoutes from './routes/exams';
import cbtQuestionsRoutes from './routes/cbt-questions';
import cbtResultsRoutes from './routes/cbt-results';
import cbtSessionsRoutes from './routes/cbt-sessions';
import cbtSubjectsRoutes from './routes/cbt-subjects';
import resultsRoutes from './routes/results';
import assignmentsRoutes from './routes/assignments';
import transcriptsRoutes from './routes/transcripts';
import notificationsRoutes from './routes/notifications';
import eventsRoutes from './routes/events';
import transportRoutes from './routes/transport';
import inventoryRoutes from './routes/inventory';
import libraryRoutes from './routes/library';
import forumsRoutes from './routes/forums';
import paymentsRoutes from './routes/payments';
import analyticsRoutes from './routes/analytics';
import gamificationRoutes from './routes/gamification';
import certificatesRoutes from './routes/certificates';
import alumniRoutes from './routes/alumni';
import groupsRoutes from './routes/groups';
import pluginsRoutes from './routes/plugins';
import aiRoutes from './routes/ai';
import deviceTrackingRoutes from './routes/device-tracking';
import schoolsRoutes from './routes/schools';
import cbtCommentsRoutes from './routes/cbt-comments';
import seoRouter from './routes/seo';
import advertisingRouter from './routes/advertising';
import webAnalyticsRouter from './routes/web-analytics';
import notificationSettingsRouter from './routes/notification-settings';
import errorLogsRouter from './routes/error-logs';
import googleAuthRouter from './routes/google-auth';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Auth middleware
export const auth = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.use('/api/payments', paymentsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/cbt-questions', cbtQuestionsRoutes);
app.use('/api/cbt-results', cbtResultsRoutes);
app.use('/api/cbt-sessions', cbtSessionsRoutes);
app.use('/api/cbt-subjects', cbtSubjectsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/assignments', assignmentsRoutes);
app.use('/api/transcripts', transcriptsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/forums', forumsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/plugins', pluginsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/device-tracking', deviceTrackingRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/cbt-comments', cbtCommentsRoutes);
app.use('/api/seo', seoRouter);
app.use('/api/advertising', advertisingRouter);
app.use('/api/web-analytics', webAnalyticsRouter);
app.use('/api/notification-settings', notificationSettingsRouter);
app.use('/api/error-logs', errorLogsRouter);
app.use('/api/auth', googleAuthRouter);

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
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    console.log('Sending response with token');
    res.json({
      token,
      user: userWithoutPassword
    });
  } catch (error) {
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
    const token = jwt.sign(
      { userId: Date.now(), email, role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const user = { id: Date.now(), email, name, role };

    res.status(201).json({
      token,
      user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`🚀 API Server running on http://${HOST}:${PORT}`);
});

export default app;