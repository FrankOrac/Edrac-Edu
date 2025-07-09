"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Get all teachers
router.get('/', async (req, res) => {
    try {
        const teachers = await prisma.user.findMany({
            where: { role: 'teacher' },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                // Add other teacher-specific fields
            }
        });
        res.json(teachers);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch teachers' });
    }
});
// Get teacher profile
router.get('/profile/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid teacher ID' });
    try {
        const teacher = await prisma.teacher.findUnique({ where: { id } });
        if (!teacher)
            return res.status(404).json({ error: 'Teacher not found' });
        res.json(teacher);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch teacher' });
    }
});
exports.default = router;
