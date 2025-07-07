
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../index';

const router = Router();
const prisma = new PrismaClient();

// Mock AI responses for educational content
const educationalResponses = {
  math: [
    "Mathematics is the foundation of logic and problem-solving. What specific topic would you like help with?",
    "Let's break this down step by step. Mathematics is all about patterns and relationships.",
    "Great question! In mathematics, we always start with understanding the problem first."
  ],
  science: [
    "Science helps us understand the world around us. Which branch interests you most?",
    "The scientific method is: observe, hypothesize, experiment, analyze, conclude.",
    "Every discovery in science builds upon previous knowledge. What would you like to explore?"
  ],
  english: [
    "Language is a powerful tool for communication and expression. How can I help with English?",
    "Reading comprehension improves with practice. Let's work on understanding texts together.",
    "Writing effectively requires clarity, structure, and purpose. What's your writing goal?"
  ],
  history: [
    "History teaches us about human experiences and helps us understand the present.",
    "Every historical event has causes and effects. Which period interests you?",
    "Learning from the past helps us make better decisions for the future."
  ],
  general: [
    "I'm here to help with your educational journey. What subject can I assist you with?",
    "Learning is a continuous process. Every question you ask brings you closer to understanding.",
    "Education opens doors to endless possibilities. How can I support your learning today?"
  ]
};

const getAIResponse = (message: string, context: string = 'general') => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('math') || lowerMessage.includes('calculation') || lowerMessage.includes('algebra')) {
    const responses = educationalResponses.math;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
    const responses = educationalResponses.science;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes('english') || lowerMessage.includes('literature') || lowerMessage.includes('writing') || lowerMessage.includes('reading')) {
    const responses = educationalResponses.english;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  if (lowerMessage.includes('history') || lowerMessage.includes('historical') || lowerMessage.includes('past')) {
    const responses = educationalResponses.history;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  
  // Specific educational responses
  if (lowerMessage.includes('homework') || lowerMessage.includes('assignment')) {
    return "I can help you understand concepts for your homework, but remember that learning comes from working through problems yourself. What specific concept are you struggling with?";
  }
  
  if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
    return "Test preparation is about understanding concepts deeply, not just memorizing. Would you like study strategies or help with specific topics?";
  }
  
  if (lowerMessage.includes('learn') || lowerMessage.includes('study')) {
    return "Effective learning involves active engagement, practice, and reflection. What learning strategies work best for you?";
  }
  
  const responses = educationalResponses.general;
  return responses[Math.floor(Math.random() * responses.length)];
};

// AI Chat endpoint
router.post('/chat', auth, async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;
    const user = (req as any).user;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Generate AI response
    const aiResponse = getAIResponse(message, context);
    
    // Store conversation (optional - you can extend this)
    const conversation = {
      userId: user.id,
      userMessage: message,
      aiResponse: aiResponse,
      timestamp: new Date(),
      context: context || 'general'
    };
    
    res.json({
      response: aiResponse,
      timestamp: conversation.timestamp,
      context: conversation.context
    });
    
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

// Get study recommendations
router.get('/study-recommendations', auth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Mock personalized study recommendations
    const recommendations = [
      {
        subject: 'Mathematics',
        topic: 'Algebra Fundamentals',
        difficulty: 'Intermediate',
        estimatedTime: '30 minutes',
        reason: 'Based on your recent performance in algebra tests'
      },
      {
        subject: 'Science',
        topic: 'Scientific Method',
        difficulty: 'Beginner',
        estimatedTime: '20 minutes',
        reason: 'Foundation for all scientific subjects'
      },
      {
        subject: 'English',
        topic: 'Essay Writing Structure',
        difficulty: 'Intermediate',
        estimatedTime: '45 minutes',
        reason: 'Improve your writing skills for better communication'
      }
    ];
    
    res.json({
      recommendations,
      personalizedMessage: `Hello ${user.name || 'Student'}! Here are your personalized study recommendations.`
    });
    
  } catch (error) {
    console.error('Study recommendations error:', error);
    res.status(500).json({ error: 'Failed to get study recommendations' });
  }
});

// AI-powered question generator
router.post('/generate-questions', auth, async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, count } = req.body;
    
    const questionTemplates = {
      math: [
        { question: "Solve for x: 2x + 5 = 15", answer: "x = 5", type: "algebra" },
        { question: "What is the area of a circle with radius 4cm?", answer: "50.27 cm²", type: "geometry" },
        { question: "Find the derivative of f(x) = x² + 3x", answer: "f'(x) = 2x + 3", type: "calculus" }
      ],
      science: [
        { question: "What is the chemical formula for water?", answer: "H2O", type: "chemistry" },
        { question: "What force keeps planets in orbit around the sun?", answer: "Gravitational force", type: "physics" },
        { question: "What is the powerhouse of the cell?", answer: "Mitochondria", type: "biology" }
      ],
      english: [
        { question: "What is a metaphor?", answer: "A figure of speech that compares two different things without using 'like' or 'as'", type: "literature" },
        { question: "Identify the subject in: 'The cat sat on the mat'", answer: "The cat", type: "grammar" },
        { question: "What is alliteration?", answer: "The repetition of initial consonant sounds in successive words", type: "poetry" }
      ]
    };
    
    const templates = questionTemplates[subject as keyof typeof questionTemplates] || questionTemplates.math;
    const shuffled = templates.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count || 5, templates.length));
    
    res.json({
      questions: selectedQuestions,
      metadata: {
        subject,
        difficulty: difficulty || 'mixed',
        totalGenerated: selectedQuestions.length
      }
    });
    
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

export default router;
