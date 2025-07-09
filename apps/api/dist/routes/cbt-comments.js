"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Auth middleware - simplified for demo purposes
const auth = (req, res, next) => {
    req.user = { id: 1, role: 'student', email: 'demo@example.com' };
    next();
};
// Get comments for a question
router.get('/question/:questionId', async (req, res) => {
    const questionId = Number(req.params.questionId);
    try {
        // For demo purposes, return mock comments
        const comments = [
            {
                id: 1,
                text: "I'm not sure about this answer. Can someone explain?",
                author: "Student User",
                timestamp: new Date().toISOString(),
                replies: [
                    {
                        id: 2,
                        text: "The correct answer is B because...",
                        author: "AI Assistant",
                        timestamp: new Date().toISOString()
                    }
                ]
            }
        ];
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});
// Add a comment to a question
router.post('/', auth, async (req, res) => {
    const { questionId, text, author } = req.body;
    if (!questionId || !text) {
        return res.status(400).json({ error: 'questionId and text are required' });
    }
    try {
        // For demo purposes, return success
        const comment = {
            id: Date.now(),
            questionId: Number(questionId),
            text,
            author: author || 'Anonymous',
            timestamp: new Date().toISOString(),
            replies: []
        };
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
});
// Generate AI response to a comment
router.post('/ai-response', auth, async (req, res) => {
    const { questionId, comment, question } = req.body;
    try {
        // Mock AI response - in production, this would integrate with OpenAI
        const responses = [
            "Great question! Let me explain this concept in detail...",
            "This is a common misconception. The correct approach is...",
            "You're on the right track! Here's what you need to consider...",
            "Let me break this down step by step for better understanding...",
            "This question tests your understanding of fundamental concepts. Here's the explanation..."
        ];
        const aiResponse = responses[Math.floor(Math.random() * responses.length)];
        res.json({
            response: aiResponse,
            timestamp: new Date().toISOString(),
            author: 'AI Assistant'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});
exports.default = router;
