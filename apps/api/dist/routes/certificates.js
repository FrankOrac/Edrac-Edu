"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireAdminOrRegistrar(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List certificates
router.get('/', async (req, res) => {
    try {
        const certificates = await prisma.certificate.findMany();
        res.json(certificates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch certificates' });
    }
});
// Issue certificate
router.post('/', requireAdminOrRegistrar, async (req, res) => {
    const { recipient, type, issuedAt, description } = req.body;
    if (!recipient || !type || !issuedAt) {
        return res.status(400).json({ error: 'recipient, type, and issuedAt are required' });
    }
    try {
        const certificate = await prisma.certificate.create({
            data: { recipient, type, issuedAt: new Date(issuedAt), description },
        });
        res.status(201).json(certificate);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to issue certificate' });
    }
});
// Get a certificate by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid certificate ID' });
    try {
        const certificate = await prisma.certificate.findUnique({ where: { id } });
        if (!certificate)
            return res.status(404).json({ error: 'Certificate not found' });
        res.json(certificate);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch certificate' });
    }
});
// Update a certificate
router.put('/:id', requireAdminOrRegistrar, async (req, res) => {
    const id = Number(req.params.id);
    const { recipient, type, issuedAt, description } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid certificate ID' });
    try {
        const certificate = await prisma.certificate.update({
            where: { id },
            data: {
                recipient,
                type,
                issuedAt: issuedAt ? new Date(issuedAt) : undefined,
                description,
            },
        });
        res.json(certificate);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update certificate' });
    }
});
// Delete (revoke) a certificate
router.delete('/:id', requireAdminOrRegistrar, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid certificate ID' });
    try {
        await prisma.certificate.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete certificate' });
    }
});
exports.default = router;
