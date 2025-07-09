"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireAdmin(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List all schools
router.get('/', async (req, res) => {
    try {
        const schools = await prisma.school.findMany();
        res.json(schools);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch schools' });
    }
});
// Create a school
router.post('/', requireAdmin, async (req, res) => {
    const { name, domain } = req.body;
    if (!name || !domain) {
        return res.status(400).json({ error: 'Name and domain are required' });
    }
    try {
        const school = await prisma.school.create({
            data: { name, domain },
        });
        res.status(201).json(school);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create school' });
    }
});
// Get a school by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        const school = await prisma.school.findUnique({ where: { id } });
        if (!school)
            return res.status(404).json({ error: 'School not found' });
        res.json(school);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch school' });
    }
});
// Update a school
router.put('/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { name, domain } = req.body;
    if (isNaN(id) || (!name && !domain)) {
        return res.status(400).json({ error: 'Invalid input' });
    }
    try {
        const school = await prisma.school.update({
            where: { id },
            data: { name, domain },
        });
        res.json(school);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update school' });
    }
});
// Delete a school
router.delete('/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }
    try {
        await prisma.school.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete school' });
    }
});
exports.default = router;
