import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireTeacherOrAdmin(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List events
router.get('/', async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Create event
router.post('/', requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const { title, description, date, location } = req.body;
  if (!title || !date || !location) {
    return res.status(400).json({ error: 'title, date, and location are required' });
  }
  try {
    const event = await prisma.event.create({
      data: { title, description, date: new Date(date), location },
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Get an event by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// Update an event
router.put('/:id', requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, date, location } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        location,
      },
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
});

// Delete an event
router.delete('/:id', requireTeacherOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid event ID' });
  try {
    await prisma.event.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

export default router;
