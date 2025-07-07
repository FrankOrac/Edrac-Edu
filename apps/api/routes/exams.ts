
import { Router } from 'express';

const router = Router();

interface Exam {
  id: number;
  title: string;
  subject: string;
  date: string;
  duration: number;
  totalMarks: number;
  createdAt: string;
}

// Mock data
let exams: Exam[] = [
  {
    id: 1,
    title: 'Mathematics Mid-term Exam',
    subject: 'Mathematics',
    date: '2024-02-15',
    duration: 120,
    totalMarks: 100,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Science Final Exam',
    subject: 'Science',
    date: '2024-03-20',
    duration: 180,
    totalMarks: 150,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    title: 'English Literature Quiz',
    subject: 'English',
    date: '2024-02-28',
    duration: 60,
    totalMarks: 50,
    createdAt: new Date().toISOString()
  }
];

// Get all exams
router.get('/', (req, res) => {
  try {
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
});

// Get exam by ID
router.get('/:id', (req, res) => {
  try {
    const exam = exams.find(e => e.id === parseInt(req.params.id));
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

// Create new exam
router.post('/', (req, res) => {
  try {
    const { title, subject, date, duration, totalMarks } = req.body;
    
    if (!title || !subject || !date || !duration || !totalMarks) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newExam: Exam = {
      id: exams.length + 1,
      title,
      subject,
      date,
      duration: parseInt(duration),
      totalMarks: parseInt(totalMarks),
      createdAt: new Date().toISOString()
    };

    exams.push(newExam);
    res.status(201).json(newExam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Update exam
router.put('/:id', (req, res) => {
  try {
    const examIndex = exams.findIndex(e => e.id === parseInt(req.params.id));
    if (examIndex === -1) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const { title, subject, date, duration, totalMarks } = req.body;
    exams[examIndex] = {
      ...exams[examIndex],
      title: title || exams[examIndex].title,
      subject: subject || exams[examIndex].subject,
      date: date || exams[examIndex].date,
      duration: duration ? parseInt(duration) : exams[examIndex].duration,
      totalMarks: totalMarks ? parseInt(totalMarks) : exams[examIndex].totalMarks
    };

    res.json(exams[examIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
});

// Delete exam
router.delete('/:id', (req, res) => {
  try {
    const examIndex = exams.findIndex(e => e.id === parseInt(req.params.id));
    if (examIndex === -1) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    exams.splice(examIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
});

export default router;
