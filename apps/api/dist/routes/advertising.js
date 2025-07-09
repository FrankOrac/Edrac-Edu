"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get advertising settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await prisma.advertisingSettings.findFirst();
        res.json(settings || {
            adsenseEnabled: false,
            adsenseClientId: '',
            adsenseSlotIds: {
                header: '',
                sidebar: '',
                footer: '',
                inContent: ''
            },
            customAdsEnabled: false,
            customAds: [],
            adNetworks: {
                googleAdsense: { enabled: false, clientId: '' },
                facebookAds: { enabled: false, pixelId: '' },
                amazonAds: { enabled: false, partnerId: '' }
            },
            revenueSharing: {
                enabled: false,
                schoolPercentage: 70,
                platformPercentage: 30
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch advertising settings' });
    }
});
// Update advertising settings
router.put('/settings', async (req, res) => {
    const { adsenseEnabled, adsenseClientId, adsenseSlotIds, customAdsEnabled, customAds, adNetworks, revenueSharing } = req.body;
    try {
        const settings = await prisma.advertisingSettings.upsert({
            where: { id: 1 },
            update: {
                adsenseEnabled,
                adsenseClientId,
                adsenseSlotIds,
                customAdsEnabled,
                customAds,
                adNetworks,
                revenueSharing
            },
            create: {
                adsenseEnabled,
                adsenseClientId,
                adsenseSlotIds,
                customAdsEnabled,
                customAds,
                adNetworks,
                revenueSharing
            }
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update advertising settings' });
    }
});
// Get ad performance analytics
router.get('/analytics', async (req, res) => {
    try {
        // Mock analytics data - integrate with actual ad networks APIs
        const analytics = {
            totalRevenue: 1250.00,
            totalImpressions: 45000,
            totalClicks: 890,
            ctr: 1.98,
            cpm: 2.75,
            dailyStats: [
                { date: '2024-01-01', revenue: 45.20, impressions: 1200, clicks: 25 },
                { date: '2024-01-02', revenue: 52.10, impressions: 1350, clicks: 28 },
                { date: '2024-01-03', revenue: 48.75, impressions: 1180, clicks: 23 }
            ]
        };
        res.json(analytics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ad analytics' });
    }
});
exports.default = router;
