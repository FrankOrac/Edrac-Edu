
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Auth middleware function
function auth(req: any, res: Response, next: () => void) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  req.user = { id: 1, role: 'admin' };
  next();
}

function requireFinanceOrAdmin(req: any, res: Response, next: () => void) {
  if (req.user?.role !== 'admin' && req.user?.role !== 'finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// List payments with analytics
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate analytics
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, payment) => sum + payment.amount, 0);

    res.json({
      payments,
      analytics: {
        totalRevenue,
        monthlyRevenue,
        totalTransactions: payments.length,
        averageTransaction: payments.length > 0 ? totalRevenue / payments.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Create payment with subscription logic
router.post('/', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const { userId, amount, method, reference, subscriptionPlan, billingCycle } = req.body;
  
  if (!userId || !amount || !method) {
    return res.status(400).json({ error: 'userId, amount, and method are required' });
  }

  try {
    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: Number(userId),
        amount: Number(amount),
        method,
        reference: reference || `PAY-${Date.now()}`,
        status: 'completed'
      },
    });

    // If this is a subscription payment, handle subscription logic
    if (subscriptionPlan) {
      const nextBillingDate = new Date();
      if (billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else if (billingCycle === 'yearly') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      // Here you would create/update subscription record
      // This is a simplified example - in production you'd have a separate subscriptions table
      console.log(`Subscription activated: ${subscriptionPlan} for user ${userId}`);
    }

    res.status(201).json({
      payment,
      subscription: subscriptionPlan ? {
        plan: subscriptionPlan,
        status: 'active',
        nextBilling: subscriptionPlan ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      } : null
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get subscription plans
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 1,
        name: 'Starter',
        price: 29,
        billingCycle: 'monthly',
        features: ['Basic Analytics', 'Email Support', 'Core Features', '5GB Storage'],
        maxUsers: 100,
        popular: false
      },
      {
        id: 2,
        name: 'Professional',
        price: 99,
        billingCycle: 'monthly',
        features: ['Advanced Analytics', 'Priority Support', 'All Features', '50GB Storage', 'API Access'],
        maxUsers: 500,
        popular: true
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 299,
        billingCycle: 'monthly',
        features: ['Custom Analytics', '24/7 Support', 'White Label', 'Unlimited Storage', 'Custom Integrations'],
        maxUsers: 2000,
        popular: false
      }
    ];

    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// SaaS Analytics endpoint
router.get('/analytics', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany();
    
    // Calculate key SaaS metrics
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt).getMonth() === currentMonth)
      .reduce((sum, p) => sum + p.amount, 0);

    // Monthly Recurring Revenue calculation (simplified)
    const subscriptionPayments = payments.filter(p => p.reference?.includes('SUB'));
    const mrr = subscriptionPayments.reduce((sum, p) => sum + p.amount, 0);

    // Revenue by month for the last 6 months
    const revenueByMonth = [];
    for (let i = 5; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      const monthRevenue = payments
        .filter(p => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === month.getMonth() && 
                 paymentDate.getFullYear() === month.getFullYear();
        })
        .reduce((sum, p) => sum + p.amount, 0);
      
      revenueByMonth.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        revenue: monthRevenue,
        subscriptions: subscriptionPayments.filter(p => {
          const paymentDate = new Date(p.createdAt);
          return paymentDate.getMonth() === month.getMonth() && 
                 paymentDate.getFullYear() === month.getFullYear();
        }).length
      });
    }

    const analytics = {
      totalRevenue,
      monthlyRevenue,
      mrr,
      totalPayments: payments.length,
      averageRevenue: payments.length > 0 ? totalRevenue / payments.length : 0,
      revenueByMonth,
      churnRate: 2.3, // This would be calculated based on actual subscription data
      activeSubscriptions: subscriptionPayments.length
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Process subscription renewal
router.post('/subscription/renew', auth, async (req: Request, res: Response) => {
  const { subscriptionId, planId } = req.body;
  
  try {
    // In a real implementation, you would:
    // 1. Validate the subscription
    // 2. Check payment method
    // 3. Process payment
    // 4. Update subscription status
    
    res.json({
      success: true,
      message: 'Subscription renewed successfully',
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to renew subscription' });
  }
});

// Cancel subscription
router.post('/subscription/cancel', auth, async (req: Request, res: Response) => {
  const { subscriptionId, reason } = req.body;
  
  try {
    // In a real implementation, you would:
    // 1. Update subscription status to cancelled
    // 2. Set end date
    // 3. Handle prorations if needed
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // End of current billing period
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Get payment by ID
router.get('/:id', auth, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid payment ID' });
  
  try {
    const payment = await prisma.payment.findUnique({ 
      where: { id },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Update payment
router.put('/:id', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { amount, method, reference, status } = req.body;
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid payment ID' });
  
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        amount: amount !== undefined ? Number(amount) : undefined,
        method,
        reference,
        status,
      },
    });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete payment
router.delete('/:id', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
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
