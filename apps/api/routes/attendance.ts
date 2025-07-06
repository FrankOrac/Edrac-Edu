import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../index';
const router = Router();
const prisma = new PrismaClient();

function requireTeacherOrAdmin(req: Request, res: Response, next: () => void) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'teacher')) {
    return res.status(403).json({ error: 'Teacher or admin role required' });
  }
  next();
}

// List attendance records
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const attendance = await prisma.attendance.findMany();
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Record attendance
router.post('/', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const { studentId, date, status } = req.body;
  if (!studentId || !date || !status) {
    return res.status(400).json({ error: 'studentId, date, and status are required' });
  }
  try {
    const attendance = await prisma.attendance.create({
      data: { studentId: Number(studentId), date: new Date(date), status },
    });
    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record attendance' });
  }
});

// Get an attendance record by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid attendance ID' });
  try {
    const attendance = await prisma.attendance.findUnique({ where: { id } });
    if (!attendance) return res.status(404).json({ error: 'Attendance record not found' });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance record' });
  }
});

// Update an attendance record
router.put('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { studentId, date, status } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid attendance ID' });
  try {
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        studentId: studentId ? Number(studentId) : undefined,
        date: date ? new Date(date) : undefined,
        status,
      },
    });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Delete an attendance record
router.delete('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid attendance ID' });
  try {
    await prisma.attendance.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;
