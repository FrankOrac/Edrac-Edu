import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

import { auth } from '../index';

function requireTeacherOrAdmin(req: any, res: Response, next: () => void) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// List all exams
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const exams = await prisma.exam.findMany();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Create an exam
router.post('/', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const { title, date, subject, classId } = req.body;
  if (!title || !date || !subject || !classId) {
    return res.status(400).json({ error: 'title, date, subject, and classId are required' });
  }
  try {
    const exam = await prisma.exam.create({
      data: { title, date: new Date(date), subject, classId: Number(classId) },
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Get an exam by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid exam ID' });
  try {
    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam) return res.status(404).json({ error: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Update an exam
router.put('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, date, subject, classId } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid exam ID' });
  try {
    const exam = await prisma.exam.update({
      where: { id },
      data: {
        title,
        date: date ? new Date(date) : undefined,
        subject,
        classId: classId ? Number(classId) : undefined,
      },
    });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete an exam
router.delete('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid exam ID' });
  try {
    await prisma.exam.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

export default router;
