import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireAdminOrPluginManager(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List plugins
router.get('/', async (req: Request, res: Response) => {
  try {
    const plugins = await prisma.plugin.findMany();
    res.json(plugins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plugins' });
  }
});

// Create plugin
router.post('/', requireAdminOrPluginManager, async (req: Request, res: Response) => {
  const { name, description, enabled } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }
  try {
    const plugin = await prisma.plugin.create({
      data: {
        name,
        description,
        enabled: enabled === undefined ? false : !!enabled,
      },
    });
    res.status(201).json(plugin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create plugin' });
  }
});

// Get a plugin by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid plugin ID' });
  try {
    const plugin = await prisma.plugin.findUnique({ where: { id } });
    if (!plugin) return res.status(404).json({ error: 'Plugin not found' });
    res.json(plugin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plugin' });
  }
});

// Update a plugin
router.put('/:id', requireAdminOrPluginManager, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, enabled } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid plugin ID' });
  try {
    const plugin = await prisma.plugin.update({
      where: { id },
      data: {
        name,
        description,
        enabled,
      },
    });
    res.json(plugin);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update plugin' });
  }
});

// Delete a plugin
router.delete('/:id', requireAdminOrPluginManager, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid plugin ID' });
  try {
    await prisma.plugin.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete plugin' });
  }
});

// Enable/disable plugin
router.post('/:id/toggle', requireAdminOrPluginManager, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid plugin ID' });
  try {
    const plugin = await prisma.plugin.findUnique({ where: { id } });
    if (!plugin) return res.status(404).json({ error: 'Plugin not found' });
    const updated = await prisma.plugin.update({
      where: { id },
      data: { enabled: !plugin.enabled },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle plugin' });
  }
});

export default router;
