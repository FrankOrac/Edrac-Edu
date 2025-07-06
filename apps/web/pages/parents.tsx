import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Parent {
  id: number;
  name: string;
  email: string;
  studentId: number;
}

export default function ParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchParents() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/parents`);
      setParents(res.data);
    } catch {
      setError('Failed to fetch parents');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchParents(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/parents`, {
        name, email, studentId: Number(studentId)
      });
      setSuccess('Parent created');
      setName(''); setEmail(''); setStudentId('');
      fetchParents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create parent');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this parent?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/parents/${id}`);
      setSuccess('Parent deleted');
      fetchParents();
    } catch {
      setError('Failed to delete parent');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Parents">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Parents</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="border p-2 w-24" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Student ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {parents.map(p => (
                <tr key={p.id} className="border-t">
                  <td>{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.studentId}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {parents.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No parents found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
