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

// List all transcripts
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const transcripts = await prisma.transcript.findMany();
    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcripts' });
  }
});

// Create a transcript
router.post('/', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const { studentId, year, gpa, remarks } = req.body;
  if (!studentId || !year || gpa === undefined) {
    return res.status(400).json({ error: 'studentId, year, and gpa are required' });
  }
  try {
    const transcript = await prisma.transcript.create({
      data: { studentId: Number(studentId), year: Number(year), gpa: Number(gpa), remarks },
    });
    res.status(201).json(transcript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transcript' });
  }
});

// Get a transcript by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid transcript ID' });
  try {
    const transcript = await prisma.transcript.findUnique({ where: { id } });
    if (!transcript) return res.status(404).json({ error: 'Transcript not found' });
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transcript' });
  }
});

// Update a transcript
router.put('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { studentId, year, gpa, remarks } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid transcript ID' });
  try {
    const transcript = await prisma.transcript.update({
      where: { id },
      data: {
        studentId: studentId ? Number(studentId) : undefined,
        year: year ? Number(year) : undefined,
        gpa: gpa !== undefined ? Number(gpa) : undefined,
        remarks,
      },
    });
    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update transcript' });
  }
});

// Delete a transcript
router.delete('/:id', auth, requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid transcript ID' });
  try {
    await prisma.transcript.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete transcript' });
  }
});

export default router;