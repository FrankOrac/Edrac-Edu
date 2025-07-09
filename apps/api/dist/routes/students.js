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
    // Add token validation logic here
    req.user = { id: 1, role: 'admin' }; // Mock user for now
    next();
}
function requireAdminOrTeacher(req, res, next) {
    if (req.user?.role !== 'admin' && req.user?.role !== 'teacher') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
}
// List all students
router.get('/', auth, async (req, res) => {
    try {
        const students = await prisma.student.findMany();
        res.json(students);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch students' });
    }
});
// Create a student
router.post('/', auth, requireAdminOrTeacher, async (req, res) => {
    const { name, email, classId } = req.body;
    if (!name || !email || !classId) {
        return res.status(400).json({ error: 'Name, email, and classId are required' });
    }
    try {
        const student = await prisma.student.create({
            data: { name, email, classId: Number(classId) },
        });
        res.status(201).json(student);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create student' });
    }
});
// Get a student by ID
router.get('/:id', auth, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid student ID' });
    try {
        const student = await prisma.student.findUnique({ where: { id } });
        if (!student)
            return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch student' });
    }
});
// Update a student
router.put('/:id', auth, requireAdminOrTeacher, async (req, res) => {
    const id = Number(req.params.id);
    const { name, email, classId } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid student ID' });
    try {
        const student = await prisma.student.update({
            where: { id },
            data: { name, email, classId: classId ? Number(classId) : undefined },
        });
        res.json(student);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update student' });
    }
});
// Delete a student
router.delete('/:id', auth, requireAdminOrTeacher, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid student ID' });
    try {
        await prisma.student.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete student' });
    }
});
// Bulk upload students from Excel
router.post('/bulk-upload', auth, requireAdminOrTeacher, async (req, res) => {
    const { students } = req.body;
    if (!Array.isArray(students)) {
        return res.status(400).json({ error: 'Students array is required' });
    }
    try {
        const results = [];
        const errors = [];
        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            try {
                // Create user first
                const user = await prisma.user.create({
                    data: {
                        email: student.email,
                        name: student.name,
                        password: 'defaultPassword123', // Should be hashed in production
                        role: 'STUDENT',
                        schoolId: student.schoolId ? Number(student.schoolId) : 1
                    }
                });
                // Create student record
                const studentRecord = await prisma.student.create({
                    data: {
                        userId: user.id,
                        schoolId: student.schoolId ? Number(student.schoolId) : 1,
                        classId: student.classId ? Number(student.classId) : null
                    }
                });
                results.push({ row: i + 1, student: studentRecord });
            }
            catch (error) {
                errors.push({ row: i + 1, error: error.message });
            }
        }
        res.json({
            success: true,
            created: results.length,
            errors: errors.length,
            results,
            errors
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to bulk upload students' });
    }
});
exports.default = router;
