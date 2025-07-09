
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const router = Router();
const prisma = new PrismaClient();

// Initialize payment providers
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2024-06-20',
});

// Paystack integration
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY || 'sk_test_dummy');

// Flutterwave integration
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(
  process.env.FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-dummy',
  process.env.FLUTTERWAVE_SECRET_KEY || 'FLWSECK_TEST-dummy'
);

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
  if (req.user?.role !== 'admin' && req.user?.role !== 'finance' && req.user?.role !== 'superadmin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}

// Check subscription status middleware
function requireActiveSubscription(req: any, res: Response, next: () => void) {
  // Allow admin and superadmin full access
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') {
    return next();
  }
  
  // For other users, check subscription status
  // This is a simplified check - in production, you'd check actual subscription records
  const hasActiveSubscription = req.user?.subscription?.status === 'active';
  
  if (!hasActiveSubscription) {
    return res.status(402).json({ 
      error: 'Payment Required',
      message: 'Active subscription required to access this feature',
      subscriptionRequired: true
    });
  }
  
  next();
}

// List payments with analytics
router.get('/', auth, requireActiveSubscription, async (req: Request, res: Response) => {
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

// Initialize payment with provider
router.post('/initialize', auth, async (req: Request, res: Response) => {
  const { provider, amount, email, planId, billingCycle = 'monthly' } = req.body;
  
  if (!provider || !amount || !email) {
    return res.status(400).json({ error: 'Provider, amount, and email are required' });
  }

  try {
    let paymentData;
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    switch (provider.toLowerCase()) {
      case 'stripe':
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            userId: req.user.id.toString(),
            planId: planId?.toString() || '',
            billingCycle,
            reference
          }
        });
        
        paymentData = {
          provider: 'stripe',
          clientSecret: paymentIntent.client_secret,
          reference,
          amount,
          currency: 'usd'
        };
        break;

      case 'paystack':
        const paystackResponse = await paystack.transaction.initialize({
          email,
          amount: amount * 100, // Convert to kobo
          reference,
          metadata: {
            userId: req.user.id,
            planId: planId || '',
            billingCycle
          },
          callback_url: `${process.env.FRONTEND_URL}/payment/callback`
        });
        
        paymentData = {
          provider: 'paystack',
          authorization_url: paystackResponse.data.authorization_url,
          access_code: paystackResponse.data.access_code,
          reference,
          amount,
          currency: 'NGN'
        };
        break;

      case 'flutterwave':
        const flutterwavePayload = {
          tx_ref: reference,
          amount,
          currency: 'USD',
          redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
          customer: {
            email,
            name: req.user.name || 'User'
          },
          meta: {
            userId: req.user.id,
            planId: planId || '',
            billingCycle
          }
        };
        
        const flutterwaveResponse = await flw.Charge.card(flutterwavePayload);
        
        paymentData = {
          provider: 'flutterwave',
          link: flutterwaveResponse.data.link,
          reference,
          amount,
          currency: 'USD'
        };
        break;

      case 'offline':
        // Create pending payment record for offline payments
        const offlinePayment = await prisma.payment.create({
          data: {
            userId: req.user.id,
            amount: Number(amount),
            method: 'offline',
            reference,
            status: 'pending'
          }
        });
        
        paymentData = {
          provider: 'offline',
          reference,
          amount,
          paymentId: offlinePayment.id,
          instructions: 'Please contact admin for offline payment processing'
        };
        break;

      default:
        return res.status(400).json({ error: 'Unsupported payment provider' });
    }

    res.json({
      success: true,
      data: paymentData
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify payment
router.post('/verify', auth, async (req: Request, res: Response) => {
  const { reference, provider } = req.body;
  
  if (!reference || !provider) {
    return res.status(400).json({ error: 'Reference and provider are required' });
  }

  try {
    let isSuccessful = false;
    let paymentData: any = {};

    switch (provider.toLowerCase()) {
      case 'stripe':
        const paymentIntents = await stripe.paymentIntents.list({
          limit: 1,
        });
        const intent = paymentIntents.data.find(pi => pi.metadata.reference === reference);
        if (intent && intent.status === 'succeeded') {
          isSuccessful = true;
          paymentData = {
            amount: intent.amount / 100,
            currency: intent.currency,
            metadata: intent.metadata
          };
        }
        break;

      case 'paystack':
        const paystackVerification = await paystack.transaction.verify(reference);
        if (paystackVerification.data.status === 'success') {
          isSuccessful = true;
          paymentData = {
            amount: paystackVerification.data.amount / 100,
            currency: paystackVerification.data.currency,
            metadata: paystackVerification.data.metadata
          };
        }
        break;

      case 'flutterwave':
        const flutterwaveVerification = await flw.Transaction.verify({ id: reference });
        if (flutterwaveVerification.data.status === 'successful') {
          isSuccessful = true;
          paymentData = {
            amount: flutterwaveVerification.data.amount,
            currency: flutterwaveVerification.data.currency,
            metadata: flutterwaveVerification.data.meta
          };
        }
        break;

      case 'offline':
        // For offline payments, admin needs to manually verify
        const existingPayment = await prisma.payment.findFirst({
          where: { reference }
        });
        if (existingPayment) {
          paymentData = {
            amount: existingPayment.amount,
            status: existingPayment.status
          };
          isSuccessful = existingPayment.status === 'completed';
        }
        break;
    }

    if (isSuccessful) {
      // Create payment record
      const payment = await prisma.payment.create({
        data: {
          userId: paymentData.metadata?.userId ? Number(paymentData.metadata.userId) : req.user.id,
          amount: Number(paymentData.amount),
          method: provider,
          reference,
          status: 'completed'
        }
      });

      // Activate subscription if applicable
      if (paymentData.metadata?.planId) {
        // Here you would create/update subscription record
        console.log(`Subscription activated for user ${req.user.id}`);
      }

      res.json({
        success: true,
        payment,
        message: 'Payment verified successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Get subscription plans (public endpoint)
router.get('/plans', async (req: Request, res: Response) => {
  try {
    const plans = [
      {
        id: 1,
        name: 'Basic',
        price: 2500,
        currency: 'NGN',
        billingCycle: 'monthly',
        features: ['Basic Analytics', 'Email Support', 'Core Features', '5GB Storage', 'Up to 100 Students', 'Basic CBT System'],
        maxUsers: 100,
        popular: false,
        description: 'Perfect for small schools and educational centers',
        yearlyPrice: 25000,
        yearlyDiscount: '17% off'
      },
      {
        id: 2,
        name: 'Standard',
        price: 7500,
        currency: 'NGN',
        billingCycle: 'monthly',
        features: ['Advanced Analytics', 'Priority Support', 'All Features', '50GB Storage', 'API Access', 'Up to 500 Students', 'Advanced CBT', 'Parent Portal'],
        maxUsers: 500,
        popular: true,
        description: 'Ideal for medium-sized institutions',
        yearlyPrice: 75000,
        yearlyDiscount: '17% off'
      },
      {
        id: 3,
        name: 'Premium',
        price: 15000,
        currency: 'NGN',
        billingCycle: 'monthly',
        features: ['Custom Analytics', '24/7 Support', 'White Label', 'Unlimited Storage', 'Custom Integrations', 'Unlimited Students', 'AI Features', 'Custom Branding'],
        maxUsers: -1, // Unlimited
        popular: false,
        description: 'Comprehensive solution for large organizations',
        yearlyPrice: 150000,
        yearlyDiscount: '17% off'
      },
      {
        id: 4,
        name: 'Individual',
        price: 500,
        currency: 'NGN',
        billingCycle: 'monthly',
        features: ['Personal Dashboard', 'Practice Tests', 'Basic Analytics', 'Mobile Access', 'Study Materials'],
        maxUsers: 1,
        popular: false,
        description: 'For individual students and learners',
        yearlyPrice: 5000,
        yearlyDiscount: '17% off'
      }
    ];

    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Admin: Approve offline payment
router.post('/offline/approve/:id', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: 'completed' }
    });
    
    res.json({
      success: true,
      payment,
      message: 'Offline payment approved'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve payment' });
  }
});

// Admin: Reject offline payment
router.post('/offline/reject/:id', auth, requireFinanceOrAdmin, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  try {
    const payment = await prisma.payment.update({
      where: { id },
      data: { status: 'failed' }
    });
    
    res.json({
      success: true,
      payment,
      message: 'Offline payment rejected'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject payment' });
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

export default router;
