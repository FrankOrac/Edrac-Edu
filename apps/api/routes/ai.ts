
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

// AI-powered question generator that saves to database
router.post('/generate-questions', auth, async (req: Request, res: Response) => {
  try {
    const { subject, difficulty, count, saveToDatabase } = req.body;
    
    // Extended question templates with more variety
    const questionTemplates = {
      mathematics: [
        { text: "Solve for x: 2x + 5 = 15", options: ["x = 5", "x = 10", "x = 7", "x = 3"], answer: "x = 5", marks: 1, explanation: "Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5" },
        { text: "What is the area of a circle with radius 4cm?", options: ["50.27 cm²", "25.13 cm²", "16π cm²", "8π cm²"], answer: "50.27 cm²", marks: 2, explanation: "Area = πr² = π(4)² = 16π ≈ 50.27 cm²" },
        { text: "Find the derivative of f(x) = x² + 3x", options: ["f'(x) = 2x + 3", "f'(x) = x + 3", "f'(x) = 2x", "f'(x) = x²"], answer: "f'(x) = 2x + 3", marks: 2, explanation: "Using power rule: d/dx(x²) = 2x, d/dx(3x) = 3" },
        { text: "What is 15% of 200?", options: ["30", "25", "35", "20"], answer: "30", marks: 1, explanation: "15% × 200 = 0.15 × 200 = 30" },
        { text: "If a triangle has angles 60°, 70°, what is the third angle?", options: ["50°", "60°", "70°", "40°"], answer: "50°", marks: 1, explanation: "Sum of angles in triangle = 180°, so 180° - 60° - 70° = 50°" }
      ],
      science: [
        { text: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "H2SO4"], answer: "H2O", marks: 1, explanation: "Water molecule consists of 2 hydrogen atoms and 1 oxygen atom" },
        { text: "What force keeps planets in orbit around the sun?", options: ["Gravitational force", "Magnetic force", "Electric force", "Nuclear force"], answer: "Gravitational force", marks: 1, explanation: "Gravity provides the centripetal force needed for orbital motion" },
        { text: "What is the powerhouse of the cell?", options: ["Mitochondria", "Nucleus", "Ribosome", "Chloroplast"], answer: "Mitochondria", marks: 1, explanation: "Mitochondria produce ATP, the energy currency of cells" },
        { text: "What gas do plants absorb during photosynthesis?", options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Hydrogen"], answer: "Carbon dioxide", marks: 1, explanation: "Plants use CO2 and water to produce glucose and oxygen" },
        { text: "What is the speed of light in vacuum?", options: ["3×10⁸ m/s", "3×10⁶ m/s", "3×10¹⁰ m/s", "3×10⁴ m/s"], answer: "3×10⁸ m/s", marks: 2, explanation: "Speed of light is approximately 299,792,458 m/s ≈ 3×10⁸ m/s" }
      ],
      english: [
        { text: "What is a metaphor?", options: ["A direct comparison without 'like' or 'as'", "A comparison using 'like' or 'as'", "An exaggeration", "A sound repetition"], answer: "A direct comparison without 'like' or 'as'", marks: 1, explanation: "Metaphors directly state one thing is another for comparison" },
        { text: "Identify the subject in: 'The cat sat on the mat'", options: ["The cat", "sat", "on the mat", "mat"], answer: "The cat", marks: 1, explanation: "The subject is who or what performs the action" },
        { text: "What is alliteration?", options: ["Repetition of initial consonant sounds", "Repetition of vowel sounds", "Rhyming words", "Opposite meanings"], answer: "Repetition of initial consonant sounds", marks: 1, explanation: "Alliteration repeats the same sound at the beginning of words" },
        { text: "What type of sentence is: 'Please close the door.'?", options: ["Imperative", "Declarative", "Interrogative", "Exclamatory"], answer: "Imperative", marks: 1, explanation: "Imperative sentences give commands or make requests" },
        { text: "What is the plural of 'child'?", options: ["Children", "Childs", "Childes", "Child"], answer: "Children", marks: 1, explanation: "Child has an irregular plural form: children" }
      ],
      history: [
        { text: "In which year did World War II end?", options: ["1945", "1944", "1946", "1943"], answer: "1945", marks: 1, explanation: "WWII ended in 1945 with Germany's surrender in May and Japan's in September" },
        { text: "Who was the first President of the United States?", options: ["George Washington", "John Adams", "Thomas Jefferson", "Benjamin Franklin"], answer: "George Washington", marks: 1, explanation: "George Washington served as the first US President from 1789-1797" },
        { text: "The Renaissance period began in which country?", options: ["Italy", "France", "England", "Germany"], answer: "Italy", marks: 1, explanation: "The Renaissance began in Italy in the 14th century" },
        { text: "What was the primary cause of World War I?", options: ["Assassination of Archduke Franz Ferdinand", "Economic depression", "Religious conflicts", "Colonial disputes"], answer: "Assassination of Archduke Franz Ferdinand", marks: 2, explanation: "The assassination in 1914 triggered the alliance system and led to war" }
      ]
    };
    
    // Find or create subject
    let cbtSubject = await prisma.cbtSubject.findFirst({
      where: { name: { equals: subject, mode: 'insensitive' } }
    });
    
    if (!cbtSubject) {
      cbtSubject = await prisma.cbtSubject.create({
        data: { name: subject }
      });
    }
    
    const templates = questionTemplates[subject.toLowerCase() as keyof typeof questionTemplates] || questionTemplates.mathematics;
    const shuffled = [...templates].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(count || 5, templates.length));
    
    const generatedQuestions = [];
    
    if (saveToDatabase) {
      // Save questions to database
      for (const questionData of selectedQuestions) {
        const savedQuestion = await prisma.cbtQuestion.create({
          data: {
            subjectId: cbtSubject.id,
            text: questionData.text,
            options: JSON.stringify(questionData.options),
            answer: questionData.answer,
            marks: questionData.marks,
            explanation: questionData.explanation
          }
        });
        generatedQuestions.push(savedQuestion);
      }
    } else {
      generatedQuestions.push(...selectedQuestions);
    }
    
    res.json({
      questions: generatedQuestions,
      subject: cbtSubject,
      metadata: {
        subject,
        difficulty: difficulty || 'mixed',
        totalGenerated: generatedQuestions.length,
        savedToDatabase: saveToDatabase || false
      }
    });
    
  } catch (error) {
    console.error('Question generation error:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Bulk question generation endpoint
router.post('/bulk-generate-questions', auth, async (req: Request, res: Response) => {
  try {
    const { subjects, questionsPerSubject, difficulty, saveToDatabase } = req.body;
    const user = (req as any).user;
    
    if (user.role !== 'admin' && user.role !== 'teacher') {
      return res.status(403).json({ error: 'Only admins and teachers can bulk generate questions' });
    }
    
    const results = [];
    
    for (const subject of subjects) {
      const response = await fetch(`${req.protocol}://${req.get('host')}/api/ai/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.header('Authorization') || ''
        },
        body: JSON.stringify({
          subject,
          difficulty,
          count: questionsPerSubject || 10,
          saveToDatabase: saveToDatabase || true
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          subject,
          success: true,
          questionsGenerated: data.metadata.totalGenerated,
          questions: data.questions
        });
      } else {
        results.push({
          subject,
          success: false,
          error: 'Failed to generate questions'
        });
      }
    }
    
    res.json({
      results,
      summary: {
        totalSubjects: subjects.length,
        successfulSubjects: results.filter(r => r.success).length,
        totalQuestionsGenerated: results.reduce((sum, r) => sum + (r.questionsGenerated || 0), 0)
      }
    });
    
  } catch (error) {
    console.error('Bulk question generation error:', error);
    res.status(500).json({ error: 'Failed to bulk generate questions' });
  }
});

export default router;
