"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Basic role check stub (expand with real auth later)
function requireInventoryManagerOrAdmin(req, res, next) {
    // TODO: Replace with real auth/role check
    next();
}
// List inventory items
router.get('/', async (req, res) => {
    try {
        const items = await prisma.inventoryItem.findMany();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
});
// Add inventory item
router.post('/', requireInventoryManagerOrAdmin, async (req, res) => {
    const { name, category, quantity, location, available } = req.body;
    if (!name || !category || quantity === undefined) {
        return res.status(400).json({ error: 'name, category, and quantity are required' });
    }
    try {
        const item = await prisma.inventoryItem.create({
            data: { name, category, quantity: Number(quantity), location, available: available !== undefined ? Boolean(available) : true },
        });
        res.status(201).json(item);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add inventory item' });
    }
});
// Get an inventory item by ID
router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid inventory item ID' });
    try {
        const item = await prisma.inventoryItem.findUnique({ where: { id } });
        if (!item)
            return res.status(404).json({ error: 'Inventory item not found' });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
});
// Update an inventory item
router.put('/:id', requireInventoryManagerOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { name, category, quantity, location, available } = req.body;
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid inventory item ID' });
    try {
        const item = await prisma.inventoryItem.update({
            where: { id },
            data: {
                name,
                category,
                quantity: quantity !== undefined ? Number(quantity) : undefined,
                location,
                available: available !== undefined ? Boolean(available) : undefined,
            },
        });
        res.json(item);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});
// Delete an inventory item
router.delete('/:id', requireInventoryManagerOrAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id))
        return res.status(400).json({ error: 'Invalid inventory item ID' });
    try {
        await prisma.inventoryItem.delete({ where: { id } });
        res.status(204).end();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});
exports.default = router;
