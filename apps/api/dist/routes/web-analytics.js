"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get analytics settings
router.get('/settings', async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch analytics settings' });
    }
});
// Update analytics settings
router.put('/settings', async (req, res) => {
    const { googleAnalyticsEnabled, googleAnalyticsId, gtmEnabled, gtmId, facebookPixelEnabled, facebookPixelId, hotjarEnabled, hotjarId, customScripts } = req.body;
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update analytics settings' });
    }
});
exports.default = router;
