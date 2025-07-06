import { Router, Request, Response } from 'express';
import { PrismaClient, CbtSessionStatus } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

import { auth } from '../index';

function requireAdminOrTeacher(req: any, res: Response, next: () => void) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
function requireStudent(req: any, res: Response, next: () => void) {
  if (req.user?.role !== 'student') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// List all CBT sessions (admin/teacher)
router.get('/', auth, requireAdminOrTeacher, async (req: Request, res: Response) => {
  try {
    const sessions = await prisma.cbtSession.findMany({ include: { user: true, results: true, questions: true } });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Create/start a CBT session for a user
router.post('/start', auth, requireStudent, async (req: any, res: Response) => {
  const { duration } = req.body;
  const userId = req.user.id;
  if (!userId || !duration) {
    return res.status(400).json({ error: 'userId and duration are required' });
  }
  try {
    const session = await prisma.cbtSession.create({
      data: {
        userId: Number(userId),
        duration: Number(duration),
        status: CbtSessionStatus.IN_PROGRESS,
      },
    });
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Get a session by ID
router.get('/:id', auth, async (req: any, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    const session = await prisma.cbtSession.findUnique({
      where: { id },
      include: { user: true, results: true, questions: true },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    // Only allow owner or admin/teacher
    if (req.user.role !== 'admin' && req.user.role !== 'teacher' && session.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// Complete/end a session
router.post('/:id/complete', auth, requireStudent, async (req: any, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });
  try {
    // Only allow owner
    const session = await prisma.cbtSession.findUnique({ where: { id } });
    if (!session || session.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const updatedSession = await prisma.cbtSession.update({
      where: { id },
      data: { status: CbtSessionStatus.COMPLETED, endedAt: new Date() },
    });
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: 'Failed to complete session' });
  }
});

export default router;
