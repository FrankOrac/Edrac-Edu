
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Middleware to check authentication (placeholder - implement based on your auth system)
const requireAuth = (req: Request, res: Response, next: any) => {
  // Add your authentication logic here
  next();
};

// Get all attendance records
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        student: true
      }
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ error: 'Failed to fetch attendance records' });
  }
});

// Get attendance by student ID
router.get('/student/:studentId', requireAuth, async (req: Request, res: Response) => {
  const studentId = parseInt(req.params.studentId);
  
  if (isNaN(studentId)) {
    return res.status(400).json({ error: 'Invalid student ID' });
  }

  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId },
      include: {
        student: true
      },
      orderBy: { date: 'desc' }
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance' });
  }
});

// Create attendance record
router.post('/', requireAuth, async (req: Request, res: Response) => {
  const { studentId, date, status, remarks } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ error: 'Student ID, date, and status are required' });
  }

  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId: parseInt(studentId),
        date: new Date(date),
        status,
        remarks
      },
      include: {
        student: true
      }
    });
    res.status(201).json(attendance);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ error: 'Failed to create attendance record' });
  }
});

// Update attendance record
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { status, remarks } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid attendance ID' });
  }

  try {
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        status,
        remarks
      },
      include: {
        student: true
      }
    });
    res.json(attendance);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ error: 'Failed to update attendance record' });
  }
});

// Delete attendance record
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid attendance ID' });
  }

  try {
    await prisma.attendance.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting attendance record:', error);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

export default router;
