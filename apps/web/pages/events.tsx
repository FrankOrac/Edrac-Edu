import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchEvents() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/events`);
      setEvents(res.data);
    } catch {
      setError('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEvents(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/events`, {
        title, description, date, location
      });
      setSuccess('Event created');
      setTitle(''); setDescription(''); setDate(''); setLocation('');
      fetchEvents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this event?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/events/${id}`);
      setSuccess('Event deleted');
      fetchEvents();
    } catch {
      setError('Failed to delete event');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Events">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Events</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
            <input className="border p-2 flex-1" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Date</th>
                <th className="text-left">Location</th>
                <th className="text-left">Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-t">
                  <td>{e.title}</td>
                  <td>{e.date ? new Date(e.date).toLocaleString() : '-'}</td>
                  <td>{e.location}</td>
                  <td>{e.description}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(e.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No events found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
