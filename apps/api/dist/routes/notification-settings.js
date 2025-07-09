"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get notification settings
router.get('/settings', async (req, res) => {
    try {
        const settings = await prisma.notificationSettings.findFirst();
        res.json(settings || {
            emailEnabled: true,
            emailProvider: 'sendgrid',
            emailSettings: {
                sendgrid: { apiKey: '', fromEmail: '', fromName: '' },
                mailgun: { apiKey: '', domain: '', fromEmail: '' },
                smtp: { host: '', port: 587, username: '', password: '', secure: false }
            },
            smsEnabled: false,
            smsProvider: 'twilio',
            smsSettings: {
                twilio: { accountSid: '', authToken: '', fromNumber: '' },
                nexmo: { apiKey: '', apiSecret: '', fromNumber: '' }
            },
            triggers: {
                userRegistration: { email: true, sms: false },
                loginAttempt: { email: false, sms: false },
                paymentSuccess: { email: true, sms: true },
                examCompleted: { email: true, sms: false },
                assignmentDue: { email: true, sms: false },
                gradeReleased: { email: true, sms: true }
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notification settings' });
    }
});
// Update notification settings
router.put('/settings', async (req, res) => {
    const { emailEnabled, emailProvider, emailSettings, smsEnabled, smsProvider, smsSettings, triggers } = req.body;
    try {
        const settings = await prisma.notificationSettings.upsert({
            where: { id: 1 },
            update: {
                emailEnabled,
                emailProvider,
                emailSettings,
                smsEnabled,
                smsProvider,
                smsSettings,
                triggers
            },
            create: {
                emailEnabled,
                emailProvider,
                emailSettings,
                smsEnabled,
                smsProvider,
                smsSettings,
                triggers
            }
        });
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update notification settings' });
    }
});
// Send test notification
router.post('/test', async (req, res) => {
    const { type, recipient } = req.body;
    try {
        // Mock sending notification
        const result = {
            success: true,
            message: `Test ${type} sent successfully to ${recipient}`,
            timestamp: new Date().toISOString()
        };
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send test notification' });
    }
});
exports.default = router;
