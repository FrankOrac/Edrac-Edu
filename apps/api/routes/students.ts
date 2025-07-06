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

// List all students
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Create a student
router.post('/', auth, requireAdminOrTeacher, async (req: Request, res: Response) => {
  const { name, email, classId } = req.body;
  if (!name || !email || !classId) {
    return res.status(400).json({ error: 'Name, email, and classId are required' });
  }
  try {
    const student = await prisma.student.create({
      data: { name, email, classId: Number(classId) },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Get a student by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid student ID' });
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Update a student
router.put('/:id', auth, requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, classId } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid student ID' });
  try {
    const student = await prisma.student.update({
      where: { id },
      data: { name, email, classId: classId ? Number(classId) : undefined },
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete a student
router.delete('/:id', auth, requireAdminOrTeacher, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid student ID' });
  try {
    await prisma.student.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
