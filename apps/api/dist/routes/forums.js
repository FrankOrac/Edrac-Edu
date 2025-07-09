"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireForumModeratorOrAdmin(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List forums
router.get('/', async (req, res) => {
    try {
        const forums = await prisma.forum.findMany();
        res.json(forums);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch forums' });
    }
});
// Create forum
router.post('/', requireForumModeratorOrAdmin, async (req, res) => {
    const { title, description } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'title is required' });
    }
    try {
        const forum = await prisma.forum.create({
            data: { title, description },
        });
        res.status(201).json(forum);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create forum' });
    }
});
// Get a forum by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid forum ID' });
    try {
        const forum = await prisma.forum.findUnique({ where: { id } });
        if (!forum)
            return res.status(404).json({ error: 'Forum not found' });
        res.json(forum);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch forum' });
    }
});
// Update a forum
router.put('/:id', requireForumModeratorOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { title, description } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid forum ID' });
    try {
        const forum = await prisma.forum.update({
            where: { id },
            data: { title, description },
        });
        res.json(forum);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update forum' });
    }
});
// Delete a forum
router.delete('/:id', requireForumModeratorOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid forum ID' });
    try {
        await prisma.forum.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete forum' });
    }
});
exports.default = router;
