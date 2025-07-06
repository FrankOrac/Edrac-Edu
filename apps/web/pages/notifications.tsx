import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Notification {
  id: number;
  title: string;
  message: string;
  recipientId?: number;
  type: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchNotifications() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/notifications`);
      setNotifications(res.data);
    } catch {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchNotifications(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/notifications`, {
        title, message, recipientId: recipientId ? Number(recipientId) : undefined, type
      });
      setSuccess('Notification created');
      setTitle(''); setMessage(''); setRecipientId(''); setType('');
      fetchNotifications();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create notification');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this notification?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/notifications/${id}`);
      setSuccess('Notification deleted');
      fetchNotifications();
    } catch {
      setError('Failed to delete notification');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Notifications">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Notifications</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} required />
            <input className="border p-2 w-32" placeholder="Recipient ID (optional)" value={recipientId} onChange={e => setRecipientId(e.target.value)} />
            <input className="border p-2 flex-1" placeholder="Type" value={type} onChange={e => setType(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Message</th>
                <th className="text-left">Recipient ID</th>
                <th className="text-left">Type</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {notifications.map(n => (
                <tr key={n.id} className="border-t">
                  <td>{n.title}</td>
                  <td>{n.message}</td>
                  <td>{n.recipientId || '-'}</td>
                  <td>{n.type}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(n.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No notifications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
