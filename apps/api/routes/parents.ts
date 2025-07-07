import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../index';
const router = Router();
const prisma = new PrismaClient();

function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin role required' });
  }
  next();
}

// List all parents
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const parents = await prisma.parent.findMany();
    res.json(parents);
  } catch (error) {
    console.error("Failed to fetch parents:", error);
    res.status(500).json({ error: 'Failed to fetch parents' });
  }
});

// Create a parent
router.post('/', auth, requireAdmin, async (req: Request, res: Response) => {
  const { name, email, studentId } = req.body;
  if (!name || !email || !studentId) {
    return res.status(400).json({ error: 'Name, email, and studentId are required' });
  }
  try {
    const parent = await prisma.parent.create({
      data: { name, email, studentId: Number(studentId) },
    });
    res.status(201).json(parent);
  } catch (error) {
    console.error("Failed to create parent:", error);
    res.status(500).json({ error: 'Failed to create parent' });
  }
});

// Get a parent by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid parent ID' });
  try {
    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) return res.status(404).json({ error: 'Parent not found' });
    res.json(parent);
  } catch (error) {
    console.error("Failed to fetch parent:", error);
    res.status(500).json({ error: 'Failed to fetch parent' });
  }
});

// Update a parent
router.put('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email, studentId } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid parent ID' });
  try {
    const parent = await prisma.parent.update({
      where: { id },
      data: { name, email, studentId: studentId ? Number(studentId) : undefined },
    });
    res.json(parent);
  } catch (error) {
    console.error("Failed to update parent:", error);
    res.status(500).json({ error: 'Failed to update parent' });
  }
});

// Delete a parent
router.delete('/:id', auth, requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid parent ID' });
  try {
    await prisma.parent.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete parent:", error);
    res.status(500).json({ error: 'Failed to delete parent' });
  }
});

export default router;