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
}

export default function CbtTestPage() {
  const [user, setUser] = useState<{name:string,role:string,email:string}|null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    }
  }, []);

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

  // Start a new session on mount
  useEffect(() => {
    const startSession = async () => {
      setLoading(true);
      try {
        // TODO: Replace with real userId and duration logic
        const res = await axios.post('/api/cbt-sessions/start', { userId: 1, duration: 30 });
        setSessionId(res.data.id);
        setDuration(res.data.duration);
        // Fetch all questions for this session (for now, fetch all questions)
        const qRes = await axios.get('/api/cbt-questions');
        // Randomize question order and options
        let qs = qRes.data.map((q: any) => ({...q, options: JSON.parse(q.options)}));
        // Fisher-Yates shuffle for questions
        for(let i = qs.length-1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i+1));
          [qs[i], qs[j]] = [qs[j], qs[i]];
        }
        // Shuffle options for each question
        qs = qs.map(q => {
          const opts = [...q.options];
          for(let i = opts.length-1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i+1));
            [opts[i], opts[j]] = [opts[j], opts[i]];
          }
          return { ...q, options: opts };
        });
        setQuestions(qs);
        setTimer(res.data.duration * 60);
      } catch {
        setError('Failed to start session');
      } finally {
        setLoading(false);
      }
    };
    startSession();
    // eslint-disable-next-line
  }, []);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !finished) {
      const t = setTimeout(()=>setTimer(timer-1), 1000);
      return ()=>clearTimeout(t);
    }
    if(timer === 0 && !finished && sessionId) {
      handleFinish();
    }
    // eslint-disable-next-line
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
      // Submit all answers
      for(const q of questions) {
        await axios.post('/api/cbt-results/submit', {
          sessionId,
          questionId: q.id,
          selected: answers[q.id] || '',
        });
      }
      // Fetch results
      const res = await axios.get(`/api/cbt-results/session/${sessionId}`);
      setResult(res.data);
      setSuccess('Test completed!');
    } catch {
      setError('Failed to submit answers');
    } finally {
      setLoading(false);
    }
  };

  if(loading) return <Layout title="CBT Test"><div>Loading...</div></Layout>;
  if(error) return <Layout title="CBT Test"><div className="text-red-500">{error}</div></Layout>;

  if(finished) return (
    <Layout title="CBT Test Result">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 my-8 max-w-2xl mx-auto"
      >
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-blue-700 to-green-400 drop-shadow mb-4">
          Test Result
        </h1>
        <div aria-live="polite" className="mb-4">
          {success && <p className="text-green-600 font-semibold">{success}</p>}
          {error && <p className="text-red-500 font-semibold">{error}</p>}
        </div>
        <ul className="space-y-4">
          {result.map((r:any,i:number)=>(
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i }}
              className={`rounded-xl px-6 py-4 shadow font-semibold ${r.correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
            >
              <span className="">Q:</span> {r.question.text} <br/>
              <span className="">Your answer:</span> {r.selected} <br/>
              {r.correct ? <span className="">Correct</span> : <span className="">Incorrect</span>}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </Layout>
  );

  if(!questions.length) return <Layout title="CBT Test"><div>No questions available.</div></Layout>;

  const q = questions[current];

  return (
    <Layout title="CBT Test">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 my-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-blue-400 drop-shadow">
            CBT Test
          </h1>
          {user && (
            <span className="text-sm text-gray-600 font-semibold ml-4">{user.name} ({user.role})</span>
          )}
        </div>
        <div className="mb-4 text-lg font-semibold text-blue-900">Time left: <span className="font-mono">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</span></div>
        <div className="mb-8">
          <div className="font-semibold text-xl mb-4">Q{current+1}: {q.text}</div>
          <div className="grid gap-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`block w-full text-left px-6 py-3 rounded-xl border font-semibold transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-300 ${answers[q.id]===opt?'bg-blue-100 border-blue-500':'border-gray-300 hover:bg-blue-50'}`}
                onClick={()=>handleSelect(q.id,opt)}
                disabled={finished || loading}
                aria-pressed={answers[q.id]===opt}
                tabIndex={0}
                onKeyDown={e => {
                  if ((e.key === 'Enter' || e.key === ' ') && !(finished || loading)) {
                    handleSelect(q.id, opt);
                  }
                }}
                role="option"
                aria-selected={answers[q.id]===opt}
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mb-6 justify-center">
          <motion.button
            whileHover={{ scale: current!==0 && !finished && !loading ? 1.08 : 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handlePrev}
            disabled={current===0 || finished || loading}
            className="px-5 py-2 rounded-xl border font-semibold bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 shadow disabled:opacity-50"
          >
            Prev
          </motion.button>
          <motion.button
            whileHover={{ scale: current!==questions.length-1 && !finished && !loading ? 1.08 : 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleNext}
            disabled={current===questions.length-1 || finished || loading}
            className="px-5 py-2 rounded-xl border font-semibold bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700 shadow disabled:opacity-50"
          >
            Next
          </motion.button>
        </div>
        <div className="mb-2 flex justify-center">
          <motion.button
            whileHover={{ scale: !finished && !loading ? 1.08 : 1 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleFinish}
            disabled={finished || loading}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600 text-white rounded-2xl font-bold shadow-lg transition-transform disabled:bg-gray-300 disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Finish'}
          </motion.button>
        </div>
      </motion.div>
    </Layout>
  );
}
