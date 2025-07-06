import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface AnalyticsReport {
  id: number;
  title: string;
  data: string;
  generatedAt: string;
  type: string;
}

export default function AnalyticsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [title, setTitle] = useState('');
  const [data, setData] = useState('');
  const [generatedAt, setGeneratedAt] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchReports() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/analytics`);
      setReports(res.data);
    } catch {
      setError('Failed to fetch analytics reports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchReports(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/analytics`, {
        title, data, generatedAt, type
      });
      setSuccess('Analytics report created');
      setTitle(''); setData(''); setGeneratedAt(''); setType('');
      fetchReports();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create analytics report');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this analytics report?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/analytics/${id}`);
      setSuccess('Analytics report deleted');
      fetchReports();
    } catch {
      setError('Failed to delete analytics report');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Analytics">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Analytics</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Type (e.g. Attendance, Grades)" value={type} onChange={e => setType(e.target.value)} required />
            <input className="border p-2 flex-1" type="datetime-local" value={generatedAt} onChange={e => setGeneratedAt(e.target.value)} required />
          </div>
          <textarea className="border p-2 mt-2" placeholder="Report Data (JSON or summary)" value={data} onChange={e => setData(e.target.value)} required rows={3} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-32 self-end" disabled={loading}>Add</button>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Type</th>
                <th className="text-left">Generated At</th>
                <th className="text-left">Data</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id} className="border-t">
                  <td>{report.title}</td>
                  <td>{report.type}</td>
                  <td>{report.generatedAt ? new Date(report.generatedAt).toLocaleString() : '-'}</td>
                  <td><pre className="whitespace-pre-wrap text-xs max-w-xs overflow-x-auto">{report.data}</pre></td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(report.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No analytics reports found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
