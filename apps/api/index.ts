import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Import routes
import studentsRouter from './routes/students';
import teachersRouter from './routes/teachers';
import parentsRouter from './routes/parents';
import attendanceRouter from './routes/attendance';
import examsRouter from './routes/exams';
import cbtQuestionsRouter from './routes/cbt-questions';
import cbtResultsRouter from './routes/cbt-results';
import cbtSessionsRouter from './routes/cbt-sessions';
import cbtSubjectsRouter from './routes/cbt-subjects';
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
import schoolsRouter from './routes/schools';

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  console.warn('Swagger documentation not loaded:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/parents', parentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/exams', examsRouter);
app.use('/api/cbt-questions', cbtQuestionsRouter);
app.use('/api/cbt-results', cbtResultsRouter);
app.use('/api/cbt-sessions', cbtSessionsRouter);
app.use('/api/cbt-subjects', cbtSubjectsRouter);
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
app.use('/api/alumni', alumniRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/plugins', pluginsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/schools', schoolsRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error:', error);
  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API Server running on http://0.0.0.0:${PORT}`);
  console.log(`📚 API Documentation: http://0.0.0.0:${PORT}/api/docs`);
  console.log(`💚 Health Check: http://0.0.0.0:${PORT}/api/health`);
});

export default app;