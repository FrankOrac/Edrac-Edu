import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireLibrarianOrAdmin(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List library items
router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await prisma.libraryItem.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch library items' });
  }
});

// Add library item
router.post('/', requireLibrarianOrAdmin, async (req: Request, res: Response) => {
  const { title, author, isbn, type, available } = req.body;
  if (!title || !author || !isbn || !type) {
    return res.status(400).json({ error: 'title, author, isbn, and type are required' });
  }
  try {
    const item = await prisma.libraryItem.create({
      data: { title, author, isbn, type, available: available !== undefined ? Boolean(available) : true },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add library item' });
  }
});

// Get a library item by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid library item ID' });
  try {
    const item = await prisma.libraryItem.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ error: 'Library item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch library item' });
  }
});

// Update a library item
router.put('/:id', requireLibrarianOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, author, isbn, type, available } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid library item ID' });
  try {
    const item = await prisma.libraryItem.update({
      where: { id },
      data: {
        title,
        author,
        isbn,
        type,
        available: available !== undefined ? Boolean(available) : undefined,
      },
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update library item' });
  }
});

// Delete a library item
router.delete('/:id', requireLibrarianOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid library item ID' });
  try {
    await prisma.libraryItem.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete library item' });
  }
});

export default router;
