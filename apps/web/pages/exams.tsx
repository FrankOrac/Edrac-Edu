import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Exam {
  id: number;
  title: string;
  date: string;
  subject: string;
  classId: number;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchExams() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exams`);
      setExams(res.data);
    } catch {
      setError('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchExams(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exams`, {
        title, date, subject, classId: Number(classId)
      });
      setSuccess('Exam created');
      setTitle(''); setDate(''); setSubject(''); setClassId('');
      fetchExams();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this exam?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/exams/${id}`);
      setSuccess('Exam deleted');
      fetchExams();
    } catch {
      setError('Failed to delete exam');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Exams">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Exams</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
            <input className="border p-2 w-24" placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Date</th>
                <th className="text-left">Subject</th>
                <th className="text-left">Class ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams.map(e => (
                <tr key={e.id} className="border-t">
                  <td>{e.title}</td>
                  <td>{e.date && new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.subject}</td>
                  <td>{e.classId}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(e.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {exams.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No exams found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
