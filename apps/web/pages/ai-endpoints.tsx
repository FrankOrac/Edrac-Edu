import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface AIEndpoint {
  id: number;
  name: string;
  type: string;
  url: string;
  enabled: boolean;
}

export default function AIEndpointsPage() {
  const [endpoints, setEndpoints] = useState<AIEndpoint[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [url, setUrl] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchEndpoints() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/aiendpoints`);
      setEndpoints(res.data);
    } catch {
      setError('Failed to fetch AI endpoints');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchEndpoints(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/aiendpoints`, {
        name, type, url, enabled
      });
      setSuccess('AI endpoint created');
      setName(''); setType(''); setUrl(''); setEnabled(true);
      fetchEndpoints();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create endpoint');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this AI endpoint?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/aiendpoints/${id}`);
      setSuccess('AI endpoint deleted');
      fetchEndpoints();
    } catch {
      setError('Failed to delete endpoint');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="AI Endpoints">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI Endpoints</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2 items-center">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Type (e.g. openai, custom)" value={type} onChange={e => setType(e.target.value)} required />
          </div>
          <div className="flex gap-2 items-center">
            <input className="border p-2 flex-1" placeholder="URL" value={url} onChange={e => setUrl(e.target.value)} required />
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
              Enabled
            </label>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Type</th>
                <th className="text-left">URL</th>
                <th className="text-left">Enabled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(ep => (
                <tr key={ep.id} className="border-t">
                  <td>{ep.name}</td>
                  <td>{ep.type}</td>
                  <td>{ep.url}</td>
                  <td>{ep.enabled ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(ep.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {endpoints.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No AI endpoints found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
