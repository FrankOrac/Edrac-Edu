import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireAdmin(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List analytics reports
router.get('/', async (req: Request, res: Response) => {
  try {
    const reports = await prisma.analyticsReport.findMany();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics reports' });
  }
});

// Create analytics report
router.post('/', requireAdmin, async (req: Request, res: Response) => {
  const { title, data, generatedAt, type } = req.body;
  if (!title || !data || !generatedAt || !type) {
    return res.status(400).json({ error: 'title, data, generatedAt, and type are required' });
  }
  try {
    const report = await prisma.analyticsReport.create({
      data: { title, data, generatedAt: new Date(generatedAt), type },
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create analytics report' });
  }
});

// Get an analytics report by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid analytics report ID' });
  try {
    const report = await prisma.analyticsReport.findUnique({ where: { id } });
    if (!report) return res.status(404).json({ error: 'Analytics report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics report' });
  }
});

// Update an analytics report
router.put('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, data, generatedAt, type } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid analytics report ID' });
  try {
    const report = await prisma.analyticsReport.update({
      where: { id },
      data: {
        title,
        data,
        generatedAt: generatedAt ? new Date(generatedAt) : undefined,
        type,
      },
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update analytics report' });
  }
});

// Delete an analytics report
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid analytics report ID' });
  try {
    await prisma.analyticsReport.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete analytics report' });
  }
});

export default router;
