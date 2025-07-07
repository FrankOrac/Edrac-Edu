
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// Get analytics settings
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.analyticsSettings.findFirst();
    res.json(settings || {
      googleAnalyticsEnabled: false,
      googleAnalyticsId: '',
      gtmEnabled: false,
      gtmId: '',
      facebookPixelEnabled: false,
      facebookPixelId: '',
      hotjarEnabled: false,
      hotjarId: '',
      customScripts: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics settings' });
  }
});

// Update analytics settings
router.put('/settings', async (req: Request, res: Response) => {
  const {
    googleAnalyticsEnabled,
    googleAnalyticsId,
    gtmEnabled,
    gtmId,
    facebookPixelEnabled,
    facebookPixelId,
    hotjarEnabled,
    hotjarId,
    customScripts
  } = req.body;

  try {
    const settings = await prisma.analyticsSettings.upsert({
      where: { id: 1 },
      update: {
        googleAnalyticsEnabled,
        googleAnalyticsId,
        gtmEnabled,
        gtmId,
        facebookPixelEnabled,
        facebookPixelId,
        hotjarEnabled,
        hotjarId,
        customScripts
      },
      create: {
        googleAnalyticsEnabled,
        googleAnalyticsId,
        gtmEnabled,
        gtmId,
        facebookPixelEnabled,
        facebookPixelId,
        hotjarEnabled,
        hotjarId,
        customScripts
      }
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update analytics settings' });
  }
});

export default router;
