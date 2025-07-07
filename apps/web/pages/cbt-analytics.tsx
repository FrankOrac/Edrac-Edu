import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn } from '../lib/auth';
import Layout from '../components/Layout';
import axios from 'axios';

interface CbtSession {
  id: number;
  userId: number;
  status: string;
  duration: number;
  startedAt: string;
  completedAt?: string;
}
interface CbtResult {
  id: number;
  sessionId: number;
  questionId: number;
  selected: string;
  correct: boolean;
  question: { text: string; subjectId: number };
}
interface User {
  id: number;
  name: string;
  email: string;
}

export default function CbtAnalyticsPage() {
  const [user, setUser] = useState<{name:string,role:string,email:string}|null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    }
    // TODO: Fetch user info and check role (admin/teacher)
  }, []);

  const [sessions, setSessions] = useState<CbtSession[]>([]);
  const [results, setResults] = useState<CbtResult[]>([]);
  const [selectedSession, setSelectedSession] = useState<number|null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sessRes, userRes] = await Promise.all([
          axios.get('/api/cbt-sessions'),
          axios.get('/api/students'), // Assuming all users are students for now
        ]);
        setSessions(sessRes.data);
        setUsers(userRes.data);
      } catch {
        setError('Failed to fetch analytics data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectSession = async (sessionId: number) => {
    setSelectedSession(sessionId);
    setLoading(true);
    try {
      const res = await axios.get(`/api/cbt-results/session/${sessionId}`);
      setResults(res.data);
    } catch {
      setError('Failed to fetch session results');
    } finally {
      setLoading(false);
    }
  };

  const getUser = (userId: number) => users.find(u=>u.id===userId);
  const getScore = (sessionId: number) => results.filter(r=>r.sessionId===sessionId && r.correct).length;
  const getTotal = (sessionId: number) => results.filter(r=>r.sessionId===sessionId).length;

  return (
    <Layout title="CBT Analytics">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 my-8 max-w-5xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-blue-400 drop-shadow">
            CBT Results & Analytics
          </h1>
          {user && (
            <span className="text-sm text-gray-600 font-semibold ml-4">{user.name} ({user.role})</span>
          )}
        </div>
        {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full md:w-1/2 backdrop-blur-lg bg-white/60 border border-white/40 rounded-2xl shadow-xl p-6"
          >
            <h2 className="font-semibold text-blue-900 text-xl mb-3">Exam Sessions</h2>
            <ul className="space-y-4">
              {sessions.map(sess=>(
                <motion.li
                  key={sess.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * sess.id }}
                  className="rounded-xl px-4 py-3 shadow bg-white/80 border border-blue-100 hover:shadow-lg transition"
                >
                  <div><b>User:</b> {getUser(sess.userId)?.name || 'User ' + sess.userId}</div>
                  <div><b>Status:</b> {sess.status}</div>
                  <div><b>Duration:</b> {sess.duration} min</div>
                  <div><b>Started:</b> {new Date(sess.startedAt).toLocaleString()}</div>
                  <div><b>Completed:</b> {sess.completedAt ? new Date(sess.completedAt).toLocaleString() : '-'}</div>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-3 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow transition-transform"
                    onClick={()=>handleSelectSession(sess.id)}
                  >
                    View Results
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full md:w-1/2 backdrop-blur-lg bg-white/60 border border-white/40 rounded-2xl shadow-xl p-6"
          >
            {selectedSession && (
              <>
                <h2 className="font-semibold text-blue-900 text-xl mb-3">Session Results</h2>
                <div className="mb-2 font-semibold">Score: {getScore(selectedSession)}/{getTotal(selectedSession)}</div>
                <ul className="space-y-3">
                  {results.filter(r=>r.sessionId===selectedSession).map((r,i)=>(
                    <motion.li
                      key={r.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.08 * i }}
                      className={`rounded-xl px-4 py-3 shadow font-semibold ${r.correct ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                    >
                      Q: {r.question.text} <br/>
                      Your answer: {r.selected} <br/>
                      {r.correct ? 'Correct' : 'Incorrect'}
                    </motion.li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </Layout>
  );
}
