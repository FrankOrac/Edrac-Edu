import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface GamificationItem {
  id: number;
  name: string;
  points: number;
  type: string;
  awardedTo?: string;
  awardedAt?: string;
}

export default function GamificationPage() {
  const [items, setItems] = useState<GamificationItem[]>([]);
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');
  const [type, setType] = useState('');
  const [awardedTo, setAwardedTo] = useState('');
  const [awardedAt, setAwardedAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/gamification`);
      setItems(res.data);
    } catch {
      setError('Failed to fetch gamification items');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/gamification`, {
        name, points: Number(points), type, awardedTo, awardedAt
      });
      setSuccess('Gamification item created');
      setName(''); setPoints(''); setType(''); setAwardedTo(''); setAwardedAt('');
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create gamification item');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this gamification item?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/gamification/${id}`);
      setSuccess('Gamification item deleted');
      fetchItems();
    } catch {
      setError('Failed to delete gamification item');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Gamification">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Gamification</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 w-24" type="number" min={0} step={1} placeholder="Points" value={points} onChange={e => setPoints(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Type (e.g. Badge, XP)" value={type} onChange={e => setType(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Awarded To (optional)" value={awardedTo} onChange={e => setAwardedTo(e.target.value)} />
            <input className="border p-2 flex-1" type="datetime-local" value={awardedAt} onChange={e => setAwardedAt(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-32 self-end" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Points</th>
                <th className="text-left">Type</th>
                <th className="text-left">Awarded To</th>
                <th className="text-left">Awarded At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t">
                  <td>{item.name}</td>
                  <td>{item.points}</td>
                  <td>{item.type}</td>
                  <td>{item.awardedTo || '-'}</td>
                  <td>{item.awardedAt ? new Date(item.awardedAt).toLocaleString() : '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No gamification items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
