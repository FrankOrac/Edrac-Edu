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

// List all assignments
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const assignments = await prisma.assignment.findMany();
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Create an assignment
router.post('/', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const { title, description, dueDate, classId } = req.body;
  if (!title || !description || !dueDate || !classId) {
    return res.status(400).json({ error: 'title, description, dueDate, and classId are required' });
  }
  try {
    const assignment = await prisma.assignment.create({
      data: { title, description, dueDate: new Date(dueDate), classId: Number(classId) },
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Get an assignment by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid assignment ID' });
  try {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Update an assignment
router.put('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, dueDate, classId } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid assignment ID' });
  try {
    const assignment = await prisma.assignment.update({
      where: { id },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        classId: classId ? Number(classId) : undefined,
      },
    });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete an assignment
router.delete('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid assignment ID' });
  try {
    await prisma.assignment.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;
