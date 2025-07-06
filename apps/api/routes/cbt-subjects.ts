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

// List all CBT subjects
router.get('/', async (req: Request, res: Response) => {
  try {
    const subjects = await prisma.cbtSubject.findMany({ include: { questions: true } });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Create a CBT subject
router.post('/', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const subject = await prisma.cbtSubject.create({ data: { name } });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// Update a subject
router.put('/:id', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const subject = await prisma.cbtSubject.update({ where: { id }, data: { name } });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

// Delete a subject
router.delete('/:id', requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.cbtSubject.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

export default router;
