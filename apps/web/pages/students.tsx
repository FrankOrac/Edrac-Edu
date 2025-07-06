import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Student {
  id: number;
  name: string;
  email: string;
  classId: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchStudents() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/students`);
      setStudents(res.data);
    } catch {
      setError('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchStudents(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/students`, {
        name, email, classId: Number(classId)
      });
      setSuccess('Student created');
      setName(''); setEmail(''); setClassId('');
      fetchStudents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this student?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/students/${id}`);
      setSuccess('Student deleted');
      fetchStudents();
    } catch {
      setError('Failed to delete student');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Students">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Students</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <input className="border p-2 w-24" placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Email</th>
                <th className="text-left">Class ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-t">
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.classId}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(s.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
