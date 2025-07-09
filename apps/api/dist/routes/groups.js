"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireAdminOrGroupManager(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List groups
router.get('/', async (req, res) => {
    try {
        const groups = await prisma.group.findMany();
        res.json(groups);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});
// Create group
router.post('/', requireAdminOrGroupManager, async (req, res) => {
    const { name, description, createdAt } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'name is required' });
    }
    try {
        const group = await prisma.group.create({
            data: {
                name,
                description,
                createdAt: createdAt ? new Date(createdAt) : undefined,
            },
        });
        res.status(201).json(group);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create group' });
    }
});
// Get a group by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid group ID' });
    try {
        const group = await prisma.group.findUnique({ where: { id } });
        if (!group)
            return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch group' });
    }
});
// Update a group
router.put('/:id', requireAdminOrGroupManager, async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, createdAt } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid group ID' });
    try {
        const group = await prisma.group.update({
            where: { id },
            data: {
                name,
                description,
                createdAt: createdAt ? new Date(createdAt) : undefined,
            },
        });
        res.json(group);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update group' });
    }
});
// Delete a group
router.delete('/:id', requireAdminOrGroupManager, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid group ID' });
    try {
        await prisma.group.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete group' });
    }
});
exports.default = router;
