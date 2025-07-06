import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireAdminOrAlumniManager(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List alumni
router.get('/', async (req: Request, res: Response) => {
  try {
    const alumni = await prisma.alumni.findMany();
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' });
  }
});

// Add alumni
router.post('/', requireAdminOrAlumniManager, async (req: Request, res: Response) => {
  const { name, graduationYear, email, occupation, bio } = req.body;
  if (!name || !graduationYear) {
    return res.status(400).json({ error: 'name and graduationYear are required' });
  }
  try {
    const alumni = await prisma.alumni.create({
      data: {
        name,
        graduationYear: Number(graduationYear),
        email,
        occupation,
        bio,
      },
    });
    res.status(201).json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add alumni' });
  }
});

// Get an alumni by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid alumni ID' });
  try {
    const alumni = await prisma.alumni.findUnique({ where: { id } });
    if (!alumni) return res.status(404).json({ error: 'Alumni not found' });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alumni' });
  }
});

// Update alumni
router.put('/:id', requireAdminOrAlumniManager, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, graduationYear, email, occupation, bio } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid alumni ID' });
  try {
    const alumni = await prisma.alumni.update({
      where: { id },
      data: {
        name,
        graduationYear: graduationYear !== undefined ? Number(graduationYear) : undefined,
        email,
        occupation,
        bio,
      },
    });
    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update alumni' });
  }
});

// Delete alumni
router.delete('/:id', requireAdminOrAlumniManager, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid alumni ID' });
  try {
    await prisma.alumni.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alumni' });
  }
});

export default router;
