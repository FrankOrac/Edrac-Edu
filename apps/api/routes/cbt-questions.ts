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

// List all CBT questions (optionally filter by subject)
router.get('/', async (req: Request, res: Response) => {
  const subjectId = req.query.subjectId ? Number(req.query.subjectId) : undefined;
  try {
    const questions = await prisma.cbtQuestion.findMany({
      where: subjectId ? { subjectId } : {},
      include: { subject: true, session: true },
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Create a CBT question
router.post('/', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const { subjectId, text, options, answer, marks, explanation } = req.body;
  if (!subjectId || !text || !options || !answer) {
    return res.status(400).json({ error: 'subjectId, text, options, and answer are required' });
  }
  try {
    const question = await prisma.cbtQuestion.create({
      data: {
        subjectId: Number(subjectId),
        text,
        options: JSON.stringify(options),
        answer,
        marks: marks ? Number(marks) : 1,
        explanation,
      },
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Update a question
router.put('/:id', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { text, options, answer, marks, explanation } = req.body;
  try {
    const question = await prisma.cbtQuestion.update({
      where: { id },
      data: {
        text,
        options: options ? JSON.stringify(options) : undefined,
        answer,
        marks: marks ? Number(marks) : undefined,
        explanation,
      },
    });
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete a question
router.delete('/:id', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.cbtQuestion.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

export default router;
