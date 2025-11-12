// routes/dataRoutes.js

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { protect } = require('../middleware/auth'); 

const router = express.Router();
const prisma = new PrismaClient();

// --- CATEGORY ROUTES ---
// POST /api/categories - Create a new category
router.post('/categories', protect, async (req, res) => {
    try {
        const { name, type } = req.body;
        const category = await prisma.category.create({
            data: {
                name,
                type,
                userId: req.userId, // Linked to the authenticated user
            },
        });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category.' });
    }
});

// GET /api/categories - Get all categories for the logged-in user
router.get('/categories', protect, async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: req.userId },
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
});


// --- TRANSACTION ROUTES (READ and CREATE) ---

// POST /api/transactions - Add a new transaction
router.post('/transactions', protect, async (req, res) => {
    try {
        const { description, amount, categoryId, date } = req.body;
        
        const transaction = await prisma.transaction.create({
            data: {
                description,
                amount: parseFloat(amount),
                date: new Date(date),       
                categoryId: parseInt(categoryId),
                userId: req.userId, 
            },
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add transaction.' });
    }
});

// GET /api/transactions - Get all transactions for the logged-in user
router.get('/transactions', protect, async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.userId },
            include: { category: { select: { name: true, type: true } } },
            orderBy: { date: 'desc' },
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch transactions.' });
    }
});

module.exports = router;