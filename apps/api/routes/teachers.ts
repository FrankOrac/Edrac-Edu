import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

import { auth } from '../index';

function requireAdmin(req: any, res: Response, next: () => void) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// List all teachers
router.get('/', auth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
});

// Create a teacher
router.post('/', auth, requireAdmin, async (req: Request, res: Response) => {
  const { name, email, subject } = req.body;
  if (!name || !email || !subject) {
    return res.status(400).json({ error: 'Name, email, and subject are required' });
  }
  try {
    const teacher = await prisma.teacher.create({
      data: { name, email, subject },
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

// Get a teacher by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid teacher ID' });
  try {
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teacher' });
  }
});

// Update a teacher
router.put('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, subject } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid teacher ID' });
  try {
    const teacher = await prisma.teacher.update({
      where: { id },
      data: { name, email, subject },
    });
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update teacher' });
  }
});

// Delete a teacher
router.delete('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid teacher ID' });
  try {
    await prisma.teacher.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
});

export default router;