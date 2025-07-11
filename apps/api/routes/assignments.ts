import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Authentication middleware function
function auth(req: any, res: Response, next: () => void) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  req.user = { id: 1, role: 'admin' };
  next();
}

// Get all assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = [
      {
        id: 1,
        title: 'Mathematics Assignment 1',
        description: 'Solve algebraic equations',
        subject: 'Mathematics',
        dueDate: '2024-02-15',
        status: 'pending',
        createdBy: 'John Teacher'
      },
      {
        id: 2,
        title: 'Science Project',
        description: 'Research on renewable energy',
        subject: 'Science',
        dueDate: '2024-02-20',
        status: 'completed',
        createdBy: 'Jane Teacher'
      }
    ];
    res.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Failed to fetch assignments' });
  }
});

// Get assignment by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = {
      id: parseInt(id),
      title: 'Sample Assignment',
      description: 'This is a sample assignment',
      subject: 'Mathematics',
      dueDate: '2024-02-15',
      status: 'pending',
      createdBy: 'John Teacher'
    };
    res.json(assignment);
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({ error: 'Failed to fetch assignment' });
  }
});

// Create new assignment
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { title, description, subject, dueDate } = req.body;
    const newAssignment = {
      id: Date.now(),
      title,
      description,
      subject,
      dueDate,
      status: 'pending',
      createdBy: 'Current User'
    };
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
});

// Update assignment
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, subject, dueDate, status } = req.body;
    const updatedAssignment = {
      id: parseInt(id),
      title,
      description,
      subject,
      dueDate,
      status,
      createdBy: 'Current User'
    };
    res.json(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({ error: 'Failed to update assignment' });
  }
});

// Delete assignment
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: 'Assignment deleted successfully', id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({ error: 'Failed to delete assignment' });
  }
});

export default router;