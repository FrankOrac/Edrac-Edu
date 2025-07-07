
import { Router, Request, Response } from 'express';
import { nigeriaSubjects, getSubjectsByLevel, getSubjectsByCategory, getSubjectsByExamType } from '../data/nigeria-subjects';

const router = Router();

// Get all subjects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { level, category, examType } = req.query;
    
    let subjects = nigeriaSubjects;
    
    if (level) {
      subjects = getSubjectsByLevel(level as string);
    }
    
    if (category) {
      subjects = getSubjectsByCategory(category as string);
    }
    
    if (examType) {
      subjects = getSubjectsByExamType(examType as string);
    }
    
    res.json({
      success: true,
      subjects: subjects
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subjects'
    });
  }
});

// Get subject by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subject = nigeriaSubjects.find(s => s.id === id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      subject: subject
    });
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subject'
    });
  }
});

// Create new subject (for custom additions)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, code, description, category, level, examType } = req.body;
    
    // Validate required fields
    if (!name || !code || !category || !level || !examType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const newSubject = {
      id: code.toLowerCase().replace(/\s+/g, '-'),
      name,
      code,
      description: description || '',
      category,
      level,
      examType,
      isCustom: true
    };
    
    // In a real application, you would save this to a database
    // For now, we'll just return the created subject
    res.status(201).json({
      success: true,
      subject: newSubject,
      message: 'Subject created successfully'
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create subject'
    });
  }
});

// Update subject
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, code, description, category, level, examType } = req.body;
    
    // Check if subject exists
    const existingSubject = nigeriaSubjects.find(s => s.id === id);
    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
    }
    
    const updatedSubject = {
      ...existingSubject,
      name: name || existingSubject.name,
      code: code || existingSubject.code,
      description: description || existingSubject.description,
      category: category || existingSubject.category,
      level: level || existingSubject.level,
      examType: examType || existingSubject.examType
    };
    
    res.json({
      success: true,
      subject: updatedSubject,
      message: 'Subject updated successfully'
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update subject'
    });
  }
});

// Delete subject
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if subject exists
    const existingSubject = nigeriaSubjects.find(s => s.id === id);
    if (!existingSubject) {
      return res.status(404).json({
        success: false,
        error: 'Subject not found'
      });
    }
    
    // In a real application, you would delete from database
    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete subject'
    });
  }
});

// Get subject categories
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = ['core', 'elective', 'vocational', 'trade'];
    res.json({
      success: true,
      categories: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get education levels
router.get('/meta/levels', async (req: Request, res: Response) => {
  try {
    const levels = ['primary', 'secondary', 'tertiary'];
    res.json({
      success: true,
      levels: levels
    });
  } catch (error) {
    console.error('Error fetching levels:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch levels'
    });
  }
});

// Get exam types
router.get('/meta/exam-types', async (req: Request, res: Response) => {
  try {
    const examTypes = ['WAEC', 'NECO', 'JAMB', 'NABTEB', 'Primary', 'All'];
    res.json({
      success: true,
      examTypes: examTypes
    });
  } catch (error) {
    console.error('Error fetching exam types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exam types'
    });
  }
});

export default router;
