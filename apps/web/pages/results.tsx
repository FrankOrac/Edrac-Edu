import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Result {
  id: number;
  studentId: number;
  examId: number;
  score: number;
  grade: string;
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [studentId, setStudentId] = useState('');
  const [examId, setExamId] = useState('');
  const [score, setScore] = useState('');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchResults() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/results`);
      setResults(res.data);
    } catch {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchResults(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/results`, {
        studentId: Number(studentId), examId: Number(examId), score: Number(score), grade
      });
      setSuccess('Result recorded');
      setStudentId(''); setExamId(''); setScore(''); setGrade('');
      fetchResults();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record result');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this result?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/results/${id}`);
      setSuccess('Result deleted');
      fetchResults();
    } catch {
      setError('Failed to delete result');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Results">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Results</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Exam ID" value={examId} onChange={e => setExamId(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Score" type="number" value={score} onChange={e => setScore(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Student ID</th>
                <th className="text-left">Exam ID</th>
                <th className="text-left">Score</th>
                <th className="text-left">Grade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.id} className="border-t">
                  <td>{r.studentId}</td>
                  <td>{r.examId}</td>
                  <td>{r.score}</td>
                  <td>{r.grade}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(r.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No results found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
