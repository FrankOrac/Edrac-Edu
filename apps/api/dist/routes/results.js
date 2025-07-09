"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Auth middleware function
function auth(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    req.user = { id: 1, role: 'admin' };
    next();
}
function requireTeacherOrAdmin(req, res, next) {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'teacher')) {
        return res.status(403).json({ error: 'Teacher or admin role required' });
    }
    next();
}
// List results
router.get('/', auth, async (req, res) => {
    try {
        const results = await prisma.result.findMany();
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});
// Record a result
router.post('/', auth, requireTeacherOrAdmin, async (req, res) => {
    const { studentId, examId, score, grade } = req.body;
    if (!studentId || !examId || score === undefined || !grade) {
        return res.status(400).json({ error: 'studentId, examId, score, and grade are required' });
    }
    try {
        const result = await prisma.result.create({
            data: { studentId: Number(studentId), examId: Number(examId), score: Number(score), grade },
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record result' });
    }
});
// Get a result by ID
router.get('/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid result ID' });
    try {
        const result = await prisma.result.findUnique({ where: { id } });
        if (!result)
            return res.status(404).json({ error: 'Result not found' });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch result' });
    }
});
// Update a result
router.put('/:id', auth, requireTeacherOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { studentId, examId, score, grade } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid result ID' });
    try {
        const result = await prisma.result.update({
            where: { id },
            data: {
                studentId: studentId ? Number(studentId) : undefined,
                examId: examId ? Number(examId) : undefined,
                score: score !== undefined ? Number(score) : undefined,
                grade,
            },
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update result' });
    }
});
// Delete a result
router.delete('/:id', auth, requireTeacherOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid result ID' });
    try {
        await prisma.result.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete result' });
    }
});
exports.default = router;
