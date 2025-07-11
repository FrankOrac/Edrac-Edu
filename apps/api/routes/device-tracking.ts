import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../index';

const router = Router();
const prisma = new PrismaClient();

// Get device tracking data
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const devices = [
      {
        id: 1,
        deviceId: 'device-001',
        userId: 1,
        deviceType: 'laptop',
        browser: 'Chrome',
        os: 'Windows 10',
        lastSeen: new Date().toISOString(),
        isActive: true
      }
    ];
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device tracking data' });
  }
});

// Track device activity
router.post('/track', async (req: Request, res: Response) => {
  try {
    const { deviceId, userId, activity } = req.body;

    const trackingData = {
      id: Date.now(),
      deviceId,
      userId,
      activity,
      timestamp: new Date().toISOString()
    };

    res.json({ success: true, data: trackingData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to track device activity' });
  }
});

// Log device access
router.post('/log-access', auth, async (req: Request, res: Response) => {
  try {
    const { deviceInfo, locationInfo, userAgent } = req.body;

    // Calculate risk score
    let riskScore = 0;

    // Check for suspicious patterns
    if (deviceInfo?.deviceType === 'Mobile' && deviceInfo?.screenResolution?.includes('1920')) {
      riskScore += 20;
    }

    if (locationInfo?.country !== 'Nigeria') {
      riskScore += 30;
    }

    if (userAgent?.includes('headless') || userAgent?.includes('bot')) {
      riskScore += 50;
    }

    // Check for multiple simultaneous logins from different locations
    const recentSessions = await getRecentSessions(req.user.id);
    if (recentSessions.length > 1) {
      const locations = recentSessions.map(s => s.location);
      const uniqueLocations = [...new Set(locations)];
      if (uniqueLocations.length > 1) {
        riskScore += 40;
      }
    }

    const sessionData = {
      userId: req.user.id,
      deviceInfo: JSON.stringify(deviceInfo),
      locationInfo: JSON.stringify(locationInfo),
      userAgent,
      riskScore: Math.min(riskScore, 100),
      loginTime: new Date(),
      isActive: true
    };

    // In a real app, you'd save this to database
    // const session = await prisma.userSession.create({ data: sessionData });

    res.json({
      success: true,
      riskScore,
      message: riskScore > 50 ? 'High risk session detected' : 'Session logged successfully'
    });
  } catch (error) {
    console.error('Device tracking error:', error);
    res.status(500).json({ error: 'Failed to log device access' });
  }
});

// Get user sessions
router.get('/sessions', auth, async (req: Request, res: Response) => {
  try {
    // Mock data for now
    const sessions = [
      {
        id: 1,
        userId: req.user.id,
        deviceInfo: {
          deviceType: 'Desktop',
          browser: 'Chrome',
          os: 'Windows 11',
          screenResolution: '1920x1080',
          memory: '8GB',
          cores: 8
        },
        locationInfo: {
          ip: '197.210.227.254',
          country: 'Nigeria',
          city: 'Lagos',
          isp: 'MTN Nigeria'
        },
        riskScore: 5,
        loginTime: new Date(),
        isActive: true
      }
    ];

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Terminate suspicious session
router.post('/terminate-session/:sessionId', auth, async (req: Request, res: Response) => {
  try {
    const sessionId = req.params.sessionId;

    // In real app, mark session as terminated
    // await prisma.userSession.update({
    //   where: { id: parseInt(sessionId) },
    //   data: { isActive: false, terminatedAt: new Date() }
    // });

    res.json({
      success: true,
      message: 'Session terminated successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to terminate session' });
  }
});

// Get security analytics
router.get('/security-analytics', auth, async (req: Request, res: Response) => {
  try {
    const analytics = {
      totalSessions: 1247,
      activeSessions: 892,
      suspiciousAttempts: 23,
      blockedSessions: 5,
      topCountries: [
        { country: 'Nigeria', count: 850, percentage: 68 },
        { country: 'Ghana', count: 120, percentage: 9.6 },
        { country: 'Kenya', count: 100, percentage: 8 },
        { country: 'South Africa', count: 80, percentage: 6.4 },
        { country: 'Others', count: 97, percentage: 8 }
      ],
      deviceTypes: [
        { type: 'Desktop', count: 560, percentage: 45 },
        { type: 'Mobile', count: 436, percentage: 35 },
        { type: 'Tablet', count: 251, percentage: 20 }
      ],
      riskDistribution: {
        low: 85,
        medium: 12,
        high: 3
      }
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch security analytics' });
  }
});

async function getRecentSessions(userId: number) {
  // Mock implementation - in real app, query database
  return [
    {
      id: 1,
      userId,
      location: 'Lagos, Nigeria',
      loginTime: new Date(),
      isActive: true
    }
  ];
}

export default router;