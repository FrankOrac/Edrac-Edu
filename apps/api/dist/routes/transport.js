"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireTransportManagerOrAdmin(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List transports
router.get('/', async (req, res) => {
    try {
        const transports = await prisma.transport.findMany();
        res.json(transports);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch transports' });
    }
});
// Create transport
router.post('/', requireTransportManagerOrAdmin, async (req, res) => {
    const { route, driver, vehicle, capacity, available } = req.body;
    if (!route || !driver || !vehicle || capacity === undefined) {
        return res.status(400).json({ error: 'route, driver, vehicle, and capacity are required' });
    }
    try {
        const transport = await prisma.transport.create({
            data: { route, driver, vehicle, capacity: Number(capacity), available: available !== undefined ? Boolean(available) : true },
        });
        res.status(201).json(transport);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create transport' });
    }
});
// Get a transport by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid transport ID' });
    try {
        const transport = await prisma.transport.findUnique({ where: { id } });
        if (!transport)
            return res.status(404).json({ error: 'Transport not found' });
        res.json(transport);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch transport' });
    }
});
// Update a transport
router.put('/:id', requireTransportManagerOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { route, driver, vehicle, capacity, available } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid transport ID' });
    try {
        const transport = await prisma.transport.update({
            where: { id },
            data: {
                route,
                driver,
                vehicle,
                capacity: capacity !== undefined ? Number(capacity) : undefined,
                available: available !== undefined ? Boolean(available) : undefined,
            },
        });
        res.json(transport);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update transport' });
    }
});
// Delete a transport
router.delete('/:id', requireTransportManagerOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid transport ID' });
    try {
        await prisma.transport.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete transport' });
    }
});
exports.default = router;
