import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchGroups() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/groups`);
      setGroups(res.data);
    } catch {
      setError('Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchGroups(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/groups`, {
        name, description, createdAt
      });
      setSuccess('Group created');
      setName(''); setDescription(''); setCreatedAt('');
      fetchGroups();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this group?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/groups/${id}`);
      setSuccess('Group deleted');
      fetchGroups();
    } catch {
      setError('Failed to delete group');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Groups">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Groups</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="border p-2 flex-1" type="datetime-local" value={createdAt} onChange={e => setCreatedAt(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Description</th>
                <th className="text-left">Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {groups.map(group => (
                <tr key={group.id} className="border-t">
                  <td>{group.name}</td>
                  <td>{group.description || '-'}</td>
                  <td>{group.createdAt ? new Date(group.createdAt).toLocaleString() : '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(group.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No groups found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
