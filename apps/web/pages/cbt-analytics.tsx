import React, { useEffect, useState } from 'react';
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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">CBT Results & Analytics</h1>
        {user && (
          <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h2 className="font-semibold mb-2">Exam Sessions</h2>
          <ul>
            {sessions.map(sess=>(
              <li key={sess.id} className="mb-2 border p-2">
                <div><b>User:</b> {getUser(sess.userId)?.name || 'User ' + sess.userId}</div>
                <div><b>Status:</b> {sess.status}</div>
                <div><b>Duration:</b> {sess.duration} min</div>
                <div><b>Started:</b> {new Date(sess.startedAt).toLocaleString()}</div>
                <div><b>Completed:</b> {sess.completedAt ? new Date(sess.completedAt).toLocaleString() : '-'}</div>
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded" onClick={()=>handleSelectSession(sess.id)}>
                  View Results
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-1/2">
          {selectedSession && (
            <div>
              <h2 className="font-semibold mb-2">Session Results</h2>
              <div className="mb-2">Score: {getScore(selectedSession)}/{getTotal(selectedSession)}</div>
              <ul>
                {results.filter(r=>r.sessionId===selectedSession).map((r,i)=>(
                  <li key={r.id} className={r.correct?"text-green-700":"text-red-700"}>
                    Q: {r.question.text} <br/>
                    Your answer: {r.selected} <br/>
                    {r.correct ? 'Correct' : 'Incorrect'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
