"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Get all transcripts
router.get('/', async (req, res) => {
    try {
        const mockTranscripts = [
            {
                id: 1,
                studentId: 'ST001',
                studentName: 'John Doe',
                academicYear: '2023/2024',
                semester: 'First',
                courses: [
                    { code: 'MTH101', name: 'Mathematics', grade: 'A', points: 4.0 },
                    { code: 'ENG101', name: 'English Language', grade: 'B+', points: 3.5 },
                    { code: 'PHY101', name: 'Physics', grade: 'A-', points: 3.7 }
                ],
                cgpa: 3.73,
                status: 'approved'
            },
            {
                id: 2,
                studentId: 'ST002',
                studentName: 'Jane Smith',
                academicYear: '2023/2024',
                semester: 'First',
                courses: [
                    { code: 'BIO101', name: 'Biology', grade: 'A', points: 4.0 },
                    { code: 'CHM101', name: 'Chemistry', grade: 'A-', points: 3.7 },
                    { code: 'ENG101', name: 'English Language', grade: 'B+', points: 3.5 }
                ],
                cgpa: 3.73,
                status: 'pending'
            }
        ];
        res.json({
            success: true,
            transcripts: mockTranscripts
        });
    }
    catch (error) {
        console.error('Error fetching transcripts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transcripts'
        });
    }
});
// Get transcript by student ID
router.get('/student/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const mockTranscript = {
            id: 1,
            studentId: studentId,
            studentName: 'John Doe',
            academicYear: '2023/2024',
            semester: 'First',
            courses: [
                { code: 'MTH101', name: 'Mathematics', grade: 'A', points: 4.0 },
                { code: 'ENG101', name: 'English Language', grade: 'B+', points: 3.5 },
                { code: 'PHY101', name: 'Physics', grade: 'A-', points: 3.7 }
            ],
            cgpa: 3.73,
            status: 'approved'
        };
        res.json({
            success: true,
            transcript: mockTranscript
        });
    }
    catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch transcript'
        });
    }
});
// Generate transcript
router.post('/generate', async (req, res) => {
    try {
        const { studentId, academicYear, semester } = req.body;
        if (!studentId || !academicYear || !semester) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }
        const newTranscript = {
            id: Date.now(),
            studentId,
            academicYear,
            semester,
            generatedAt: new Date().toISOString(),
            status: 'generated'
        };
        res.status(201).json({
            success: true,
            transcript: newTranscript,
            message: 'Transcript generated successfully'
        });
    }
    catch (error) {
        console.error('Error generating transcript:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to generate transcript'
        });
    }
});
exports.default = router;
