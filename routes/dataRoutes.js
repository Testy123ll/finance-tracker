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
// routes/dataRoutes.js

// ... inside the '--- CATEGORY ROUTES ---' section ...

// PUT /api/categories/:id - Update a category
router.put('/categories/:id', protect, async (req, res) => {
    try {
        const { name, type } = req.body;
        const categoryId = parseInt(req.params.id);

        const updatedCategory = await prisma.category.update({
            where: {
                id: categoryId,
                userId: req.userId, // Ensure the user owns the category
            },
            data: {
                name,
                type,
            },
        });
        res.json(updatedCategory);
    } catch (error) {
        console.error('Category update error:', error);
        res.status(500).json({ error: 'Failed to update category.' });
    }
});

// DELETE /api/categories/:id - Delete a category
router.delete('/categories/:id', protect, async (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);

        // NOTE: Prisma handles cascading deletes if configured, 
        // but often, in finance apps, you'd want to prevent deletion if transactions exist.
        // For simplicity here, we rely on the database's foreign key constraints.
        
        await prisma.category.delete({
            where: {
                id: categoryId,
                userId: req.userId, // Ensure the user owns the category
            },
        });
        res.status(204).send(); // 204 No Content is standard for successful deletion
    } catch (error) {
        console.error('Category deletion error:', error);
        // If deletion fails due to foreign key constraints (e.g., linked transactions exist)
        res.status(409).json({ error: 'Cannot delete category: it is linked to existing transactions.' });
    }
});

// ... (Other routes follow)


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
// routes/dataRoutes.js

// ... (Existing CATEGORY and TRANSACTION routes above) ...

// --- BUDGET ROUTES ---
// POST /api/budgets - Create a new budget
router.post('/budgets', protect, async (req, res) => {
    try {
        const { name, totalAmount, startDate, endDate } = req.body;
        
        const budget = await prisma.budget.create({
            data: {
                name,
                totalAmount: parseFloat(totalAmount),
                startDate: new Date(startDate),
                endDate: new Date(endDate),       
                userId: req.userId, // Linked to the authenticated user
            },
        });
        res.status(201).json(budget);
    } catch (error) {
        console.error('Budget creation error:', error);
        res.status(500).json({ error: 'Failed to create budget.' });
    }
});
// routes/dataRoutes.js

// ... (Existing Category, Budget, and Summary routes above) ...

// --- TRANSACTION ROUTES ---

// GET /api/transactions - Get all transactions for the user, with optional filters
router.get('/transactions', protect, async (req, res) => {
    try {
        const userId = req.userId;
        const { startDate, endDate, categoryId } = req.query;

        // Base filter criteria
        const whereClause = {
            userId: userId,
        };

        // Add Date filtering if parameters are provided
        if (startDate || endDate) {
            whereClause.date = {};
            if (startDate) {
                // Ensure date is inclusive (greater than or equal to start of day)
                whereClause.date.gte = new Date(startDate); 
            }
            if (endDate) {
                // Ensure date is inclusive (less than or equal to end of day)
                // We add one day and subtract one millisecond to include the entire end date.
                const adjustedEndDate = new Date(endDate);
                adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
                whereClause.date.lt = adjustedEndDate;
            }
        }
        
        // Add Category filtering if parameter is provided
        if (categoryId) {
            // categoryId from query is a string, ensure it's an integer for Prisma
            whereClause.categoryId = parseInt(categoryId);
        }

        const transactions = await prisma.transaction.findMany({
            where: whereClause,
            include: {
                category: true, // Include category details for the report
            },
            orderBy: {
                date: 'desc', // Sort newest first
            }
        });

        res.json(transactions);
    } catch (error) {
        console.error('Filtered transactions error:', error);
        res.status(500).json({ error: 'Failed to fetch filtered transactions.' });
    }
});

// ... (The POST transaction route follows) ...
// routes/dataRoutes.js

// ... inside the '--- BUDGET ROUTES ---' section ...

// PUT /api/budgets/:id - Update a budget
router.put('/budgets/:id', protect, async (req, res) => {
    try {
        const { name, totalAmount, startDate, endDate } = req.body;
        const budgetId = parseInt(req.params.id);

        const updatedBudget = await prisma.budget.update({
            where: {
                id: budgetId,
                userId: req.userId, // Ensure the user owns the budget
            },
            data: {
                name,
                totalAmount: parseFloat(totalAmount),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });
        res.json(updatedBudget);
    } catch (error) {
        console.error('Budget update error:', error);
        res.status(500).json({ error: 'Failed to update budget.' });
    }
});

// DELETE /api/budgets/:id - Delete a budget
router.delete('/budgets/:id', protect, async (req, res) => {
    try {
        const budgetId = parseInt(req.params.id);
        
        await prisma.budget.delete({
            where: {
                id: budgetId,
                userId: req.userId, // Ensure the user owns the budget
            },
        });
        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Budget deletion error:', error);
        res.status(500).json({ error: 'Failed to delete budget.' });
    }
});

// ... (Other routes follow)
// routes/dataRoutes.js

// ... (Existing CATEGORY, TRANSACTION, and BUDGET routes above) ...

// --- BUDGET PROGRESS ROUTE ---
// GET /api/budgets/progress - Get all budgets along with spending totals for the period
router.get('/budgets/progress', protect, async (req, res) => {
    try {
        const budgets = await prisma.budget.findMany({
            where: { userId: req.userId },
            orderBy: { endDate: 'desc' },
        });

        const budgetsWithProgress = await Promise.all(
            budgets.map(async (budget) => {
                // Find all *expense* transactions within the budget's date range
                const spending = await prisma.transaction.aggregate({
                    _sum: { amount: true },
                    where: {
                        userId: req.userId,
                        date: {
                            gte: budget.startDate, // greater than or equal to start date
                            lte: budget.endDate,   // less than or equal to end date
                        },
                        // We need to filter by transaction categories that are "expense"
                        category: {
                            type: 'expense',
                        },
                    },
                });

                const totalSpent = spending._sum.amount || 0;
                
                // Calculate percentage progress
                const percentage = (totalSpent / budget.totalAmount) * 100;

                return {
                    ...budget,
                    totalSpent: totalSpent,
                    progressPercentage: Math.min(100, Math.round(percentage)), // Cap at 100% for display
                    isOverspent: totalSpent > budget.totalAmount,
                };
            })
        );

        res.json(budgetsWithProgress);
    } catch (error) {
        console.error('Budget progress calculation error:', error);
        res.status(500).json({ error: 'Failed to calculate budget progress.' });
    }
});


// GET /api/budgets - Get all budgets for the logged-in user
router.get('/budgets', protect, async (req, res) => {
    try {
        const budgets = await prisma.budget.findMany({
            where: { userId: req.userId },
            orderBy: { endDate: 'desc' }, // Show recent budgets first
        });
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch budgets.' });
    }
});
// routes/dataRoutes.js

// ... (Existing CATEGORY, TRANSACTION, and BUDGET routes above) ...

// --- DASHBOARD SUMMARY ROUTE ---
// GET /api/summary/monthly-spending - Get total expense amounts per month
router.get('/summary/monthly-spending', protect, async (req, res) => {
    try {
        const userId = req.userId;
        const now = new Date();
        const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
        
        // 1. Get all transactions for the user within the last 6 months
        const recentTransactions = await prisma.transaction.findMany({
            where: {
                userId: userId,
                date: {
                    gte: sixMonthsAgo,
                },
                // Include category to filter by type later
                category: true, 
            },
        });

        // 2. Aggregate spending by month (using JavaScript/Node for grouping)
        const monthlySpendingMap = {};

        recentTransactions.forEach(t => {
            // Only aggregate expenses for spending chart
            if (t.category.type === 'expense') {
                const monthKey = t.date.toISOString().substring(0, 7); // YYYY-MM
                
                if (!monthlySpendingMap[monthKey]) {
                    monthlySpendingMap[monthKey] = 0;
                }
                monthlySpendingMap[monthKey] += t.amount;
            }
        });

        // 3. Prepare data structure for the frontend
        const result = [];
        
        // Loop through the last 6 months to ensure all months are present (even with 0 spending)
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().substring(0, 7);
            const monthLabel = date.toLocaleString('default', { month: 'short' });

            result.unshift({ // unshift to keep months in chronological order
                month: monthLabel,
                spending: monthlySpendingMap[monthKey] || 0,
            });
        }
        
        res.json(result);
    } catch (error) {
        console.error('Monthly spending summary error:', error);
        res.status(500).json({ error: 'Failed to calculate monthly summary.' });
    }
});
// routes/dataRoutes.js

// ... (Existing routes above) ...

// GET /api/summary/monthly-category-spending - Get total expense amounts per category for the current month
router.get('/summary/monthly-category-spending', protect, async (req, res) => {
    try {
        const userId = req.userId;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // 1. Fetch transactions that are expenses and occurred this month
        const monthlyCategorySpending = await prisma.transaction.groupBy({
            by: ['categoryId'],
            _sum: {
                amount: true,
            },
            where: {
                userId: userId,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                category: {
                    type: 'expense',
                },
            },
        });

        // 2. Fetch category names to link with the grouped IDs
        const categoryIds = monthlyCategorySpending.map(item => item.categoryId);
        const categories = await prisma.category.findMany({
            where: {
                id: { in: categoryIds },
            },
            select: { id: true, name: true },
        });

        const categoryMap = categories.reduce((map, cat) => {
            map[cat.id] = cat.name;
            return map;
        }, {});

        // 3. Format the result for the frontend
        const result = monthlyCategorySpending
            .map(item => ({
                categoryName: categoryMap[item.categoryId] || 'Unknown',
                totalSpent: item._sum.amount,
            }))
            .filter(item => item.totalSpent > 0); // Only include categories with spending

        res.json(result);
    } catch (error) {
        console.error('Monthly category summary error:', error);
        res.status(500).json({ error: 'Failed to calculate monthly category summary.' });
    }
});

module.exports = router;
// ...
