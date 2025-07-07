
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn } from '../lib/auth';
import axios from 'axios';

interface CbtQuestion {
  id: number;
  text: string;
  options: string[];
  marks: number;
  explanation?: string;
  imageUrl?: string;
  comments?: Comment[];
}

interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  replies?: Comment[];
}

export default function CbtTestPage() {
  const [user, setUser] = useState<{name:string,role:string,email:string}|null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for demo mode or login
    const demoParam = router.query.demo;
    if (demoParam === 'true' || !isLoggedIn()) {
      setIsDemoMode(true);
      setUser({ name: 'Demo User', role: 'student', email: 'demo@example.com' });
    }
  }, [router.query]);

  const [sessionId, setSessionId] = useState<number|null>(null);
  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [answers, setAnswers] = useState<{[qid:number]:string}>({});
  const [current, setCurrent] = useState(0);
  const [timer, setTimer] = useState(0);
  const [duration, setDuration] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [testMode, setTestMode] = useState<'practice' | 'real'>('practice');

  // Demo questions for immediate testing
  const demoQuestions: CbtQuestion[] = [
    {
      id: 1,
      text: "What is the capital of Nigeria?",
      options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
      marks: 1,
      explanation: "Abuja is the capital city of Nigeria, located in the Federal Capital Territory.",
      comments: []
    },
    {
      id: 2,
      text: "Which programming language is primarily used for web development?",
      options: ["Python", "JavaScript", "C++", "Java"],
      marks: 1,
      explanation: "JavaScript is the primary programming language for web development, especially for client-side scripting.",
      comments: []
    },
    {
      id: 3,
      text: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      marks: 1,
      explanation: "2 + 2 equals 4. This is basic arithmetic.",
      comments: []
    }
  ];

  useEffect(() => {
    if (isDemoMode) {
      // Use demo questions immediately
      setQuestions(demoQuestions);
      setDuration(15); // 15 minutes demo
      setTimer(15 * 60);
      setSessionId(999); // Demo session ID
    } else {
      startSession();
    }
  }, [isDemoMode]);

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/cbt-sessions/start', { userId: 1, duration: 30 });
      setSessionId(res.data.id);
      setDuration(res.data.duration);
      const qRes = await axios.get('/api/cbt-questions');
      let qs = qRes.data.map((q: any) => ({...q, options: JSON.parse(q.options)}));
      
      // Shuffle questions and options
      for(let i = qs.length-1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [qs[i], qs[j]] = [qs[j], qs[i]];
      }
      
      setQuestions(qs);
      setTimer(res.data.duration * 60);
    } catch {
      setError('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !finished) {
      const t = setTimeout(()=>setTimer(timer-1), 1000);
      return ()=>clearTimeout(t);
    }
    if(timer === 0 && !finished && sessionId) {
      handleFinish();
    }
  }, [timer, finished, sessionId]);

  const handleSelect = (qid: number, opt: string) => {
    setAnswers(a => ({...a, [qid]: opt}));
  };

  const handleNext = () => setCurrent(c => Math.min(c+1, questions.length-1));
  const handlePrev = () => setCurrent(c => Math.max(c-1, 0));

  const handleFinish = async () => {
    setFinished(true);
    setLoading(true);
    try {
      if (isDemoMode) {
        // Demo mode - simulate results
        const demoResults = questions.map(q => ({
          question: q,
          selected: answers[q.id] || '',
          correct: (q.id === 1 && answers[q.id] === 'Abuja') || 
                   (q.id === 2 && answers[q.id] === 'JavaScript') ||
                   (q.id === 3 && answers[q.id] === '4')
        }));
        setResult(demoResults);
      } else {
        // Real mode - submit to API
        for(const q of questions) {
          await axios.post('/api/cbt-results/submit', {
            sessionId,
            questionId: q.id,
            selected: answers[q.id] || '',
          });
        }
        const res = await axios.get(`/api/cbt-results/session/${sessionId}`);
        setResult(res.data);
      }
      setSuccess('Test completed!');
    } catch {
      setError('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (questionId: number) => {
    if (!newComment.trim()) return;
    
    try {
      if (isDemoMode) {
        // Demo mode - add comment locally
        const comment = {
          id: Date.now(),
          text: newComment,
          author: user?.name || 'Demo User',
          timestamp: new Date().toISOString(),
          replies: []
        };
        
        setQuestions(prev => prev.map(q => 
          q.id === questionId 
            ? { ...q, comments: [...(q.comments || []), comment] }
            : q
        ));
      } else {
        // Real mode - submit to API
        await axios.post('/api/cbt-comments', {
          questionId,
          text: newComment,
          author: user?.name || 'Anonymous'
        });
      }
      
      setNewComment('');
      setSuccess('Comment added successfully!');
    } catch {
      setError('Failed to add comment');
    }
  };

  const generateAIResponse = async (questionId: number, comment: string) => {
    try {
      const response = await axios.post('/api/ai/comment-response', {
        questionId,
        comment,
        question: questions.find(q => q.id === questionId)?.text
      });
      
      const aiComment = {
        id: Date.now(),
        text: response.data.response,
        author: 'AI Assistant',
        timestamp: new Date().toISOString(),
        replies: []
      };
      
      setQuestions(prev => prev.map(q => 
        q.id === questionId 
          ? { ...q, comments: [...(q.comments || []), aiComment] }
          : q
      ));
    } catch {
      setError('Failed to generate AI response');
    }
  };

  if(loading) return <Layout title="CBT Test"><div className="flex justify-center items-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div></Layout>;

  if(finished) return (
    <Layout title="CBT Test Result">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 my-8 max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-700 to-green-400 drop-shadow mb-4">
            {isDemoMode ? 'Demo Test Result' : 'Test Result'}
          </h1>
          {isDemoMode && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-semibold">Demo Mode Active</p>
              <p>Register for a full account to access all features and track your progress!</p>
            </div>
          )}
        </div>

        <div className="grid gap-6">
          {result.map((r:any,i:number)=>(
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`rounded-xl px-6 py-4 shadow-lg border-2 ${r.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">Question {i + 1}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${r.correct ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {r.correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <p className="text-gray-800 mb-3">{r.question.text}</p>
              <p className="mb-2"><strong>Your answer:</strong> {r.selected || 'Not answered'}</p>
              
              {r.question.explanation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-blue-800"><strong>Explanation:</strong> {r.question.explanation}</p>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                >
                  {showComments ? 'Hide Comments' : 'Show Comments & Discussion'}
                </button>
                
                {showComments && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3 mb-4">
                      {r.question.comments?.map((comment: Comment) => (
                        <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Ask a question about this answer..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddComment(r.question.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                      >
                        Comment
                      </button>
                      <button
                        onClick={() => generateAIResponse(r.question.id, newComment)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                      >
                        Ask AI
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push(isDemoMode ? '/register' : '/dashboard')}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl font-bold shadow-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
          >
            {isDemoMode ? 'Register for Full Access' : 'Back to Dashboard'}
          </button>
        </div>
      </motion.div>
    </Layout>
  );

  if(!questions.length) return <Layout title="CBT Test"><div className="text-center py-12">No questions available.</div></Layout>;

  const q = questions[current];

  return (
    <Layout title="CBT Test">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 my-8 max-w-4xl mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-blue-400 drop-shadow">
              {isDemoMode ? 'Demo CBT Test' : 'CBT Test'}
            </h1>
            {isDemoMode && (
              <p className="text-sm text-blue-600 mt-2">Try our CBT system - No login required!</p>
            )}
          </div>
          {user && (
            <div className="text-right">
              <span className="text-sm text-gray-600 font-semibold">{user.name}</span>
              <p className="text-xs text-gray-500">{testMode === 'practice' ? 'Practice Mode' : 'Real Test'}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-800">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</div>
            <div className="text-sm text-blue-600">Time Remaining</div>
          </div>
          <div className="bg-green-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-800">{current + 1}/{questions.length}</div>
            <div className="text-sm text-green-600">Question Progress</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-800">{Object.keys(answers).length}</div>
            <div className="text-sm text-purple-600">Answered</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl">Question {current + 1}</h2>
            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{q.marks} mark(s)</span>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            {q.imageUrl && (
              <img src={q.imageUrl} alt="Question image" className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-md" />
            )}
            <p className="text-lg leading-relaxed">{q.text}</p>
          </div>

          <div className="grid gap-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full text-left px-6 py-4 rounded-xl border-2 font-medium transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                  answers[q.id]===opt
                    ? 'bg-blue-100 border-blue-500 text-blue-800 shadow-md'
                    : 'border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                }`}
                onClick={()=>handleSelect(q.id,opt)}
                disabled={finished || loading}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <div className="flex gap-3">
            <button
              onClick={handlePrev}
              disabled={current===0 || finished || loading}
              className="px-6 py-3 rounded-xl border-2 font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={current===questions.length-1 || finished || loading}
              className="px-6 py-3 rounded-xl border-2 font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <button
            onClick={handleFinish}
            disabled={finished || loading}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl font-bold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Finish Test'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {success}
          </div>
        )}
      </motion.div>
    </Layout>
  );
}
