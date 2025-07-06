import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireAdmin(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List gamification items
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await prisma.gamificationItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gamification items' });
  }
});

// Create gamification item
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { name, points, type, awardedTo, awardedAt } = req.body;
  if (!name || !points || !type) {
    return res.status(400).json({ error: 'name, points, and type are required' });
  }
  try {
    const item = await prisma.gamificationItem.create({
      data: {
        name,
        points: Number(points),
        type,
        awardedTo,
        awardedAt: awardedAt ? new Date(awardedAt) : undefined,
      },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gamification item' });
  }
});

// Get a gamification item by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid gamification item ID' });
  try {
    const item = await prisma.gamificationItem.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Gamification item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gamification item' });
  }
});

// Update a gamification item
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, points, type, awardedTo, awardedAt } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid gamification item ID' });
  try {
    const item = await prisma.gamificationItem.update({
      where: { id },
      data: {
        name,
        points: points !== undefined ? Number(points) : undefined,
        type,
        awardedTo,
        awardedAt: awardedAt ? new Date(awardedAt) : undefined,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gamification item' });
  }
});

// Delete a gamification item
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid gamification item ID' });
  try {
    await prisma.gamificationItem.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gamification item' });
  }
});

export default router;
