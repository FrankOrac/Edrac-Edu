import express, { Express, Request, Response, NextFunction } from 'express';

// Extend Express Request type to include 'user' for JWT payload
import { JwtPayload } from 'jsonwebtoken';
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | any;
    }
  }
}
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Modular routers
import studentsRouter from './routes/students';
import teachersRouter from './routes/teachers';
import parentsRouter from './routes/parents';
import attendanceRouter from './routes/attendance';
import examsRouter from './routes/exams';
import resultsRouter from './routes/results';
import assignmentsRouter from './routes/assignments';
import transcriptsRouter from './routes/transcripts';
import notificationsRouter from './routes/notifications';
import eventsRouter from './routes/events';
import transportRouter from './routes/transport';
import inventoryRouter from './routes/inventory';
import libraryRouter from './routes/library';
import forumsRouter from './routes/forums';
import paymentsRouter from './routes/payments';
import analyticsRouter from './routes/analytics';
import gamificationRouter from './routes/gamification';
import certificatesRouter from './routes/certificates';
import alumniRouter from './routes/alumni';
import groupsRouter from './routes/groups';
import pluginsRouter from './routes/plugins';
import aiRouter from './routes/ai';
import cbtSessionsRouter from './routes/cbt-sessions';
import cbtSubjectsRouter from './routes/cbt-subjects';
import cbtQuestionsRouter from './routes/cbt-questions';
import cbtResultsRouter from './routes/cbt-results';

// Load env vars
dotenv.config();
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev_secret';

app.use(cors());
app.use(express.json());

// Modular API endpoints
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/exams', examsRouter);
app.use('/api/results', resultsRouter);
app.use('/api/assignments', assignmentsRouter);
app.use('/api/transcripts', transcriptsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/transport', transportRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/library', libraryRouter);
app.use('/api/forums', forumsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/cbt-sessions', cbtSessionsRouter);
app.use('/api/cbt-subjects', cbtSubjectsRouter);
app.use('/api/cbt-questions', cbtQuestionsRouter);
app.use('/api/cbt-results', cbtResultsRouter);
app.use('/api/alumni', alumniRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/plugins', pluginsRouter);
app.use('/api/ai', aiRouter);

// Register route
app.post('/auth/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hash, name, role: role || 'student' },
    });
    res.json({ id: user.id, email: user.email });
  } catch (err) {
    res.status(400).json({ error: 'User already exists or invalid data' });
  }
});

// Login route
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, AUTH_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

// Auth middleware
export function auth(req: any, res: any, next: any) {
  if (!req.headers.authorization) return res.status(401).json({ error: 'No token' });
  const token = req.headers.authorization.split(' ')[1];
  try {
    const user = jwt.verify(token, AUTH_SECRET);
    req.user = user;
    next();
  } catch (err) {
    const error = err as Error;
    res.status(401).json({ error: error.message || 'Invalid token' });
  }
}

// Example protected route
app.get('/user/me', auth, async (req: any, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  res.json({ id: user?.id, email: user?.email, name: user?.name, role: user?.role });
});

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import OpenAI from 'openai';
import path from 'path';

// Swagger setup
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// OpenAI setup
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ai/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    res.json({ result: completion.choices[0].message?.content });
  } catch (err) {
    res.status(500).json({ error: 'AI error', details: err.message });
  }
});

// School CRUD
app.post('/schools', auth, async (req, res) => {
  const { name, domain } = req.body;
  try {
    const school = await prisma.school.create({ data: { name, domain } });
    res.json(school);
  } catch (err) {
    res.status(400).json({ error: 'School creation failed' });
  }
});

app.get('/schools', auth, async (req, res) => {
  const schools = await prisma.school.findMany();
  res.json(schools);
});

// Assignment CRUD
app.post('/assignments', auth, async (req, res) => {
  const { title, description, dueDate, schoolId } = req.body;
  try {
    const assignment = await prisma.assignment.create({
      data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined, schoolId },
    });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ error: 'Assignment creation failed' });
  }
});

app.get('/assignments', auth, async (req, res) => {
  const assignments = await prisma.assignment.findMany();
  res.json(assignments);
});

app.listen(PORT, () => {
  console.log(`Edu AI API running on port ${PORT}`);
});
