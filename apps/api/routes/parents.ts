import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../index';

const router = Router();
const prisma = new PrismaClient();

// Get all parents
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const parents = [
      {
        id: 1,
        name: 'John Parent',
        email: 'parent@edrac.edu',
        phone: '+1234567890',
        students: ['Jane Student'],
        relationship: 'Father'
      }
    ];
    res.json(parents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parents' });
  }
});

// Get parent by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parent = {
      id: parseInt(id),
      name: 'John Parent',
      email: 'parent@edrac.edu',
      phone: '+1234567890',
      students: ['Jane Student'],
      relationship: 'Father'
    };
    res.json(parent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch parent' });
  }
});

// Create new parent
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const parentData = req.body;
    const parent = { id: Date.now(), ...parentData };
    res.status(201).json(parent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create parent' });
  }
});

// Update parent
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const parent = { id: parseInt(id), ...updateData };
    res.json(parent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update parent' });
  }
});

// Delete parent
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Parent deleted successfully', id: parseInt(id) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete parent' });
  }
});

export default router;