
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { apiCall } from '../lib/auth';

interface Subject {
  id: number;
  name: string;
}

interface GeneratedQuestion {
  id?: number;
  text: string;
  options: string[];
  answer: string;
  marks: number;
  explanation?: string;
}

const AiQuestionGenerator = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [saveToDatabase, setSaveToDatabase] = useState(true);
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiCall('/api/cbt-subjects');
      setSubjects(response);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const subjectTopics = {
    Mathematics: ['Algebra', 'Geometry', 'Calculus', 'Statistics', 'Trigonometry'],
    Science: ['Physics', 'Chemistry', 'Biology', 'Earth Science'],
    English: ['Grammar', 'Literature', 'Writing', 'Reading Comprehension'],
    History: ['Ancient History', 'Modern History', 'Contemporary History', 'World Wars']
  };

  const generateQuestions = async () => {
    if (!selectedSubject && !bulkMode) return;
    
    setLoading(true);
    try {
      if (bulkMode) {
        const response = await apiCall('/api/ai/bulk-generate-questions', {
          method: 'POST',
          body: JSON.stringify({
            subjects: selectedSubjects,
            questionsPerSubject: questionCount,
            difficulty,
            saveToDatabase
          })
        });
        
        const allQuestions = response.results
          .filter((r: any) => r.success)
          .flatMap((r: any) => r.questions || []);
        setGeneratedQuestions(allQuestions);
        
      } else {
        const response = await apiCall('/api/ai/generate-questions', {
          method: 'POST',
          body: JSON.stringify({
            subject: selectedSubject,
            topic: selectedTopic,
            difficulty,
            count: questionCount,
            saveToDatabase
          })
        });
        setGeneratedQuestions(response.questions);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectName)
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  return (
    <Layout title="AI Question Generator">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">AI Question Generator</h2>
          <p className="text-purple-100">Generate intelligent questions using AI and save them to your question bank</p>
        </div>

        {/* Mode Toggle */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => setBulkMode(false)}
              className={`px-4 py-2 rounded-lg font-medium ${!bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Single Subject
            </button>
            <button
              onClick={() => setBulkMode(true)}
              className={`px-4 py-2 rounded-lg font-medium ${bulkMode ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              Bulk Generation
            </button>
          </div>
        </div>

        {/* Generation Form */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {!bulkMode ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value);
                      setSelectedTopic(''); // Reset topic when subject changes
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.name}>{subject.name}</option>
                    ))}
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="History">History</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic (Optional)</label>
                  <div className="space-y-2">
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      disabled={!selectedSubject}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="">Select Topic</option>
                      {selectedSubject && subjectTopics[selectedSubject as keyof typeof subjectTopics]?.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                      <option value="custom">Custom Topic</option>
                    </select>
                    {selectedTopic === 'custom' && (
                      <input
                        type="text"
                        placeholder="Enter custom topic..."
                        value=""
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mathematics', 'Science', 'English', 'History'].map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => handleSubjectToggle(subject)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Questions {bulkMode ? 'per Subject' : 'Count'}
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={saveToDatabase}
                onChange={(e) => setSaveToDatabase(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Save to Database</span>
            </label>

            <motion.button
              onClick={generateQuestions}
              disabled={loading || (!selectedSubject && !bulkMode) || (bulkMode && selectedSubjects.length === 0)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Questions'}
            </motion.button>
          </div>
        </div>

        {/* Generated Questions */}
        {generatedQuestions.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Generated Questions ({generatedQuestions.length})
            </h3>
            
            <div className="space-y-4">
              {generatedQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Q{index + 1}: {question.text}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {question.marks} mark{question.marks > 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {Array.isArray(question.options) ? question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded border text-sm ${
                          option === question.answer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {option} {option === question.answer && '✓'}
                      </div>
                    )) : JSON.parse(question.options || '[]').map((option: string, optIndex: number) => (
                      <div
                        key={optIndex}
                        className={`p-2 rounded border text-sm ${
                          option === question.answer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        {option} {option === question.answer && '✓'}
                      </div>
                    ))}
                  </div>
                  
                  {question.explanation && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AiQuestionGenerator;
