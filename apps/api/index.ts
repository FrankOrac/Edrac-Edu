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
import schoolsRoutes from './routes/schools';

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
app.use('/api/payments', paymentsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/plugins', pluginsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/schools', schoolsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on port ${PORT}`);
});

export default app;