import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
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

// List all results for a session
router.get('/session/:sessionId', requireStudent, async (req: Request, res: Response) => {
  const sessionId = Number(req.params.sessionId);
  try {
    const results = await prisma.cbtResult.findMany({
      where: { sessionId },
      include: { question: true },
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Submit an answer to a question
router.post('/submit', requireStudent, async (req: Request, res: Response) => {
  const { sessionId, questionId, selected } = req.body;
  if (!sessionId || !questionId || selected === undefined) {
    return res.status(400).json({ error: 'sessionId, questionId, and selected are required' });
  }
  try {
    // Get correct answer
    const question = await prisma.cbtQuestion.findUnique({ where: { id: Number(questionId) } });
    if (!question) return res.status(404).json({ error: 'Question not found' });
    const correct = question.answer === selected;
    const result = await prisma.cbtResult.create({
      data: {
        sessionId: Number(sessionId),
        questionId: Number(questionId),
        selected,
        correct,
      },
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

export default router;
