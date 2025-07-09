"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireAdminOrAIManager(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List AI endpoints
router.get('/', async (req, res) => {
    try {
        const endpoints = await prisma.aiEndpoint.findMany();
        res.json(endpoints);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch AI endpoints' });
    }
});
// Create AI endpoint
router.post('/', requireAdminOrAIManager, async (req, res) => {
    const { name, type, url, enabled } = req.body;
    if (!name || !type || !url) {
        return res.status(400).json({ error: 'name, type, and url are required' });
    }
    try {
        const endpoint = await prisma.aiEndpoint.create({
            data: {
                name,
                type,
                url,
                enabled: enabled === undefined ? true : !!enabled,
            },
        });
        res.status(201).json(endpoint);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create AI endpoint' });
    }
});
// Get AI endpoint by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid endpoint ID' });
    try {
        const endpoint = await prisma.aiEndpoint.findUnique({ where: { id } });
        if (!endpoint)
            return res.status(404).json({ error: 'Endpoint not found' });
        res.json(endpoint);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch endpoint' });
    }
});
// Update AI endpoint
router.put('/:id', requireAdminOrAIManager, async (req, res) => {
    const id = Number(req.params.id);
    const { name, type, url, enabled } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid endpoint ID' });
    try {
        const endpoint = await prisma.aiEndpoint.update({
            where: { id },
            data: {
                name,
                type,
                url,
                enabled,
            },
        });
        res.json(endpoint);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update endpoint' });
    }
});
// Delete AI endpoint
router.delete('/:id', requireAdminOrAIManager, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid endpoint ID' });
    try {
        await prisma.aiEndpoint.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete endpoint' });
    }
});
exports.default = router;
