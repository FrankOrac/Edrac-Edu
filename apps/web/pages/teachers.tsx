import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchTeachers() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/teachers`);
      setTeachers(res.data);
    } catch {
      setError('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTeachers(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/teachers`, {
        name, email, subject
      });
      setSuccess('Teacher created');
      setName(''); setEmail(''); setSubject('');
      fetchTeachers();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create teacher');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this teacher?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/teachers/${id}`);
      setSuccess('Teacher deleted');
      fetchTeachers();
    } catch {
      setError('Failed to delete teacher');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Teachers">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Teachers</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Subject</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id} className="border-t">
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.subject}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(t.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No teachers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
