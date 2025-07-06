import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Transcript {
  id: number;
  studentId: number;
  year: number;
  gpa: number;
  remarks?: string;
}

export default function TranscriptsPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [studentId, setStudentId] = useState('');
  const [year, setYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchTranscripts() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transcripts`);
      setTranscripts(res.data);
    } catch {
      setError('Failed to fetch transcripts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTranscripts(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transcripts`, {
        studentId: Number(studentId), year: Number(year), gpa: Number(gpa), remarks
      });
      setSuccess('Transcript created');
      setStudentId(''); setYear(''); setGpa(''); setRemarks('');
      fetchTranscripts();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create transcript');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this transcript?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transcripts/${id}`);
      setSuccess('Transcript deleted');
      fetchTranscripts();
    } catch {
      setError('Failed to delete transcript');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Transcripts">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transcripts</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="GPA" type="number" step="0.01" value={gpa} onChange={e => setGpa(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Remarks (optional)" value={remarks} onChange={e => setRemarks(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Student ID</th>
                <th className="text-left">Year</th>
                <th className="text-left">GPA</th>
                <th className="text-left">Remarks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transcripts.map(t => (
                <tr key={t.id} className="border-t">
                  <td>{t.studentId}</td>
                  <td>{t.year}</td>
                  <td>{t.gpa}</td>
                  <td>{t.remarks || '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(t.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {transcripts.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No transcripts found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
