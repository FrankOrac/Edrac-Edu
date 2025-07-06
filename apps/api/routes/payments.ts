import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Basic role check stub (expand with real auth later)
function requireFinanceOrAdmin(req: Request, res: Response, next: () => void) {
  // TODO: Replace with real auth/role check
  next();
}

// List payments
router.get('/', async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Create payment
router.post('/', requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const { payer, amount, date, method, reference } = req.body;
  if (!payer || !amount || !date || !method) {
    return res.status(400).json({ error: 'payer, amount, date, and method are required' });
  }
  try {
    const payment = await prisma.payment.create({
      data: { payer, amount: Number(amount), date: new Date(date), method, reference },
    });
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Get a payment by ID
router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid payment ID' });
  try {
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Update a payment
router.put('/:id', requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { payer, amount, date, method, reference } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid payment ID' });
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        payer,
        amount: amount !== undefined ? Number(amount) : undefined,
        date: date ? new Date(date) : undefined,
        method,
        reference,
      },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete a payment
router.delete('/:id', requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid payment ID' });
  try {
    await prisma.payment.delete({ where: { id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

export default router;
