"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Auth middleware
function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    req.user = { id: 1, role: 'admin' };
    next();
}
// Get all CBT sessions
router.get('/', auth, async (req, res) => {
    try {
        const sessions = await prisma.cbtSession.findMany({
            include: {
                user: { select: { name: true, email: true } },
                results: true,
                questions: true
            }
        });
        res.json(sessions);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch CBT sessions' });
    }
});
// Create new CBT session
router.post('/', auth, async (req, res) => {
    const { userId, duration } = req.body;
    try {
        const session = await prisma.cbtSession.create({
            data: {
                userId: Number(userId),
                duration: Number(duration),
                status: 'PENDING'
            }
        });
        res.status(201).json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create CBT session' });
    }
});
// Get session by ID
router.get('/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    try {
        const session = await prisma.cbtSession.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                results: true,
                questions: true
            }
        });
        if (!session)
            return res.status(404).json({ error: 'Session not found' });
        res.json(session);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch session' });
    }
});
// Complete/end a session
router.post('/:id/complete', auth, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid ID' });
    try {
        // Only allow owner
        const session = await prisma.cbtSession.findUnique({ where: { id } });
        if (!session || session.userId !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        const updatedSession = await prisma.cbtSession.update({
            where: { id },
            data: { status: "COMPLETED", endedAt: new Date() },
        });
        res.json(updatedSession);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to complete session' });
    }
});
exports.default = router;
