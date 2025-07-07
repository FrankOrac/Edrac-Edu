
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Subject {
  id: number;
  name: string;
  questionCount: number;
}

const CBTExtra = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activeTab, setActiveTab] = useState<'questions' | 'subjects'>('questions');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'question' | 'subject'>('question');
  const [editingItem, setEditingItem] = useState<Question | Subject | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [questionForm, setQuestionForm] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    subject: '',
    difficulty: 'medium' as const,
  });

  const [subjectForm, setSubjectForm] = useState({
    name: '',
  });

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setQuestions([
        {
          id: 1,
          text: 'What is the capital of Nigeria?',
          options: ['Lagos', 'Abuja', 'Kano', 'Port Harcourt'],
          correctAnswer: 1,
          subject: 'Geography',
          difficulty: 'easy',
        },
        {
          id: 2,
          text: 'Which of the following is a programming language?',
          options: ['HTML', 'CSS', 'JavaScript', 'All of the above'],
          correctAnswer: 2,
          subject: 'Computer Science',
          difficulty: 'medium',
        },
      ]);

      setSubjects([
        { id: 1, name: 'Geography', questionCount: 25 },
        { id: 2, name: 'Computer Science', questionCount: 18 },
        { id: 3, name: 'Mathematics', questionCount: 32 },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const openModal = (type: 'question' | 'subject', item?: Question | Subject) => {
    setModalType(type);
    setEditingItem(item || null);
    
    if (type === 'question' && item) {
      const q = item as Question;
      setQuestionForm({
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        subject: q.subject,
        difficulty: q.difficulty,
      });
    } else if (type === 'subject' && item) {
      const s = item as Subject;
      setSubjectForm({ name: s.name });
    } else {
      // Reset forms
      setQuestionForm({
        text: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        subject: '',
        difficulty: 'medium',
      });
      setSubjectForm({ name: '' });
    }
    
    setShowModal(true);
  };

  const handleSave = () => {
    if (modalType === 'question') {
      if (editingItem) {
        // Update existing question
        setQuestions(prev => prev.map(q => 
          q.id === editingItem.id 
            ? { ...q, ...questionForm, id: editingItem.id }
            : q
        ));
      } else {
        // Add new question
        const newQuestion: Question = {
          id: Date.now(),
          ...questionForm,
        };
        setQuestions(prev => [...prev, newQuestion]);
      }
    } else {
      if (editingItem) {
        // Update existing subject
        setSubjects(prev => prev.map(s => 
          s.id === editingItem.id 
            ? { ...s, name: subjectForm.name }
            : s
        ));
      } else {
        // Add new subject
        const newSubject: Subject = {
          id: Date.now(),
          name: subjectForm.name,
          questionCount: 0,
        };
        setSubjects(prev => [...prev, newSubject]);
      }
    }
    
    setShowModal(false);
  };

  const handleDelete = (type: 'question' | 'subject', id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (type === 'question') {
        setQuestions(prev => prev.filter(q => q.id !== id));
      } else {
        setSubjects(prev => prev.filter(s => s.id !== id));
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout title="CBT Extra">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="CBT Extra">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">CBT Extra Management</h2>
          <p className="text-blue-100">Manage questions and subjects for advanced CBT testing</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'questions', label: 'Questions', count: questions.length },
                { key: 'subjects', label: 'Subjects', count: subjects.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Questions</h3>
                  <button
                    onClick={() => openModal('question')}
                    className="btn-primary"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="grid gap-4">
                  {questions.map((question, index) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                          <div className="flex gap-2 text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {question.subject}
                            </span>
                            <span className={`px-2 py-1 rounded ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => openModal('question', question)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete('question', question.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {question.options.map((option, idx) => (
                          <div
                            key={idx}
                            className={`p-2 rounded ${
                              idx === question.correctAnswer
                                ? 'bg-green-100 text-green-800 font-medium'
                                : 'bg-white text-gray-700'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}. {option}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Subjects Tab */}
            {activeTab === 'subjects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Subjects</h3>
                  <button
                    onClick={() => openModal('subject')}
                    className="btn-primary"
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="grid gap-4">
                  {subjects.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900">{subject.name}</h4>
                          <p className="text-sm text-gray-600">{subject.questionCount} questions</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal('subject', subject)}
                            className="text-blue-600 hover:text-blue-800 p-2"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete('subject', subject.id)}
                            className="text-red-600 hover:text-red-800 p-2"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {editingItem ? 'Edit' : 'Add'} {modalType === 'question' ? 'Question' : 'Subject'}
                  </h3>

                  {modalType === 'question' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text
                        </label>
                        <textarea
                          value={questionForm.text}
                          onChange={(e) => setQuestionForm(prev => ({ ...prev, text: e.target.value }))}
                          className="form-input"
                          rows={3}
                          placeholder="Enter question text..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Options
                        </label>
                        {questionForm.options.map((option, index) => (
                          <div key={index} className="flex gap-2 mb-2">
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={questionForm.correctAnswer === index}
                              onChange={() => setQuestionForm(prev => ({ ...prev, correctAnswer: index }))}
                              className="mt-1"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...questionForm.options];
                                newOptions[index] = e.target.value;
                                setQuestionForm(prev => ({ ...prev, options: newOptions }));
                              }}
                              className="form-input flex-1"
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                          </label>
                          <select
                            value={questionForm.subject}
                            onChange={(e) => setQuestionForm(prev => ({ ...prev, subject: e.target.value }))}
                            className="form-input"
                          >
                            <option value="">Select subject</option>
                            {subjects.map(subject => (
                              <option key={subject.id} value={subject.name}>
                                {subject.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty
                          </label>
                          <select
                            value={questionForm.difficulty}
                            onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value as any }))}
                            className="form-input"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject Name
                      </label>
                      <input
                        type="text"
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        placeholder="Enter subject name..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      className="btn-primary flex-1"
                    >
                      {editingItem ? 'Update' : 'Save'}
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default CBTExtra;
