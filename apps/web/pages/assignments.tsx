import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Assignment {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  classId: number;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [classId, setClassId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchAssignments() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/assignments`);
      setAssignments(res.data);
    } catch {
      setError('Failed to fetch assignments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAssignments(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/assignments`, {
        title, description, dueDate, classId: Number(classId)
      });
      setSuccess('Assignment created');
      setTitle(''); setDescription(''); setDueDate(''); setClassId('');
      fetchAssignments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this assignment?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/assignments/${id}`);
      setSuccess('Assignment deleted');
      fetchAssignments();
    } catch {
      setError('Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Assignments">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Assignments</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="border p-2 flex-1" type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            <input className="border p-2 w-24" placeholder="Class ID" value={classId} onChange={e => setClassId(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Due Date</th>
                <th className="text-left">Description</th>
                <th className="text-left">Class ID</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id} className="border-t">
                  <td>{a.title}</td>
                  <td>{a.dueDate ? new Date(a.dueDate).toLocaleString() : 'No due date'}</td>
                  <td>{a.description}</td>
                  <td>{a.classId}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(a.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {assignments.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No assignments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
