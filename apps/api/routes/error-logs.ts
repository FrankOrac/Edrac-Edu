
import { Router, Request, Response } from 'express';

const router = Router();

interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent: string;
  url: string;
  resolved: boolean;
}

// In-memory storage for demo (use database in production)
const errorLogs: ErrorLog[] = [];

// Log client-side errors
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, stack, componentStack, timestamp, userAgent, url } = req.body;
    
    const errorLog: ErrorLog = {
      id: Date.now().toString(),
      message,
      stack,
      componentStack,
      timestamp,
      userAgent,
      url,
      resolved: false
    };

    errorLogs.push(errorLog);
    console.error('Client Error Logged:', errorLog);

    res.status(201).json({ message: 'Error logged successfully' });
  } catch (error) {
    console.error('Failed to log error:', error);
    res.status(500).json({ error: 'Failed to log error' });
  }
});

// Get error logs for admin dashboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const { resolved, limit = 50 } = req.query;
    
    let filteredLogs = errorLogs;
    
    if (resolved !== undefined) {
      filteredLogs = errorLogs.filter(log => log.resolved === (resolved === 'true'));
    }
    
    const limitedLogs = filteredLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, parseInt(limit as string));

    res.json({
      logs: limitedLogs,
      total: filteredLogs.length,
      unresolved: errorLogs.filter(log => !log.resolved).length
    });
  } catch (error) {
    console.error('Failed to fetch error logs:', error);
    res.status(500).json({ error: 'Failed to fetch error logs' });
  }
});

// Mark error as resolved
router.put('/:id/resolve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const errorLog = errorLogs.find(log => log.id === id);
    
    if (!errorLog) {
      return res.status(404).json({ error: 'Error log not found' });
    }
    
    errorLog.resolved = true;
    res.json({ message: 'Error marked as resolved' });
  } catch (error) {
    console.error('Failed to resolve error:', error);
    res.status(500).json({ error: 'Failed to resolve error' });
  }
});

export default router;
