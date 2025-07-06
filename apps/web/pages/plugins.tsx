import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Plugin {
  id: number;
  name: string;
  description?: string;
  enabled: boolean;
}

export default function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchPlugins() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/plugins`);
      setPlugins(res.data);
    } catch {
      setError('Failed to fetch plugins');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPlugins(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/plugins`, {
        name, description, enabled
      });
      setSuccess('Plugin created');
      setName(''); setDescription(''); setEnabled(false);
      fetchPlugins();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create plugin');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this plugin?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/plugins/${id}`);
      setSuccess('Plugin deleted');
      fetchPlugins();
    } catch {
      setError('Failed to delete plugin');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: number) {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/plugins/${id}/toggle`);
      setSuccess('Plugin toggled');
      fetchPlugins();
    } catch {
      setError('Failed to toggle plugin');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Plugins">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Plugins</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2 items-center">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
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
                <th className="text-left">Description</th>
                <th className="text-left">Enabled</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {plugins.map(plugin => (
                <tr key={plugin.id} className="border-t">
                  <td>{plugin.name}</td>
                  <td>{plugin.description || '-'}</td>
                  <td>
                    <button onClick={() => handleToggle(plugin.id)} className={plugin.enabled ? 'text-green-600' : 'text-gray-400'} disabled={loading}>
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(plugin.id)} disabled={loading}>Delete</button>
                  </td>
                  <td></td>
                </tr>
              ))}
              {plugins.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No plugins found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
