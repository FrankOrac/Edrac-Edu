import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
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
      <h1 className="text-2xl font-bold mb-4">Test Result</h1>
      <div aria-live="polite" className="mb-2">
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <ul>
        {result.map((r:any,i:number)=>(
          <li key={i} className={r.correct?'text-green-700':'text-red-700'}>
            <span className="font-semibold">Q:</span> {r.question.text} <br/>
            <span className="font-semibold">Your answer:</span> {r.selected} <br/>
            {r.correct ? <span className="font-semibold">Correct</span> : <span className="font-semibold">Incorrect</span>}
          </li>
        ))}
      </ul>
    </Layout>
  );

  if(!questions.length) return <Layout title="CBT Test"><div>No questions available.</div></Layout>;

  const q = questions[current];

  return (
    <Layout title="CBT Test">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">CBT Test</h1>
        {user && (
          <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
        )}
      </div>
      <div className="mb-2">Time left: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</div>
      <div className="mb-4">
        <div className="font-semibold">Q{current+1}: {q.text}</div>
        <div className="mt-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`block w-full text-left px-4 py-2 mb-2 rounded border ${answers[q.id]===opt?'bg-blue-100 border-blue-500':'border-gray-300 hover:bg-gray-100'}`}
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
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <button onClick={handlePrev} disabled={current===0 || finished || loading} className="px-3 py-1 border rounded">Prev</button>
        <button onClick={handleNext} disabled={current===questions.length-1 || finished || loading} className="px-3 py-1 border rounded">Next</button>
      </div>
      <div className="mb-4">
        <button
          onClick={handleFinish}
          disabled={finished || loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
        >
          {loading ? 'Submitting...' : 'Finish'}
        </button>
      </div>
    </Layout>
  );
  );
}
