"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireTeacherOrAdmin(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List notifications
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany();
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Create notification
router.post('/', requireTeacherOrAdmin, async (req, res) => {
    const { title, message, recipientId, type } = req.body;
    if (!title || !message || !type) {
        return res.status(400).json({ error: 'title, message, and type are required' });
    }
    try {
        const notification = await prisma.notification.create({
            data: { title, message, recipientId: recipientId ? Number(recipientId) : undefined, type },
        });
        res.status(201).json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create notification' });
    }
});
// Get a notification by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid notification ID' });
    try {
        const notification = await prisma.notification.findUnique({ where: { id } });
        if (!notification)
            return res.status(404).json({ error: 'Notification not found' });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notification' });
    }
});
// Update a notification
router.put('/:id', requireTeacherOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { title, message, recipientId, type } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid notification ID' });
    try {
        const notification = await prisma.notification.update({
            where: { id },
            data: {
                title,
                message,
                recipientId: recipientId ? Number(recipientId) : undefined,
                type,
            },
        });
        res.json(notification);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update notification' });
    }
});
// Delete a notification
router.delete('/:id', requireTeacherOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid notification ID' });
    try {
        await prisma.notification.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
});
exports.default = router;
