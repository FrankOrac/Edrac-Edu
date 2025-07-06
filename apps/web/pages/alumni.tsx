import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Alumni {
  id: number;
  name: string;
  graduationYear: number;
  email?: string;
  occupation?: string;
  bio?: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [name, setName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [email, setEmail] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchAlumni() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/alumni`);
      setAlumni(res.data);
    } catch {
      setError('Failed to fetch alumni');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAlumni(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/alumni`, {
        name, graduationYear: Number(graduationYear), email, occupation, bio
      });
      setSuccess('Alumni added');
      setName(''); setGraduationYear(''); setEmail(''); setOccupation(''); setBio('');
      fetchAlumni();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add alumni');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this alumni?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/alumni/${id}`);
      setSuccess('Alumni deleted');
      fetchAlumni();
    } catch {
      setError('Failed to delete alumni');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Alumni">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Alumni</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 w-32" type="number" min={1900} max={2100} placeholder="Graduation Year" value={graduationYear} onChange={e => setGraduationYear(e.target.value)} required />
          </div>
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Email (optional)" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="border p-2 flex-1" placeholder="Occupation (optional)" value={occupation} onChange={e => setOccupation(e.target.value)} />
          </div>
          <textarea className="border p-2" placeholder="Bio (optional)" value={bio} onChange={e => setBio(e.target.value)} rows={2} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-32 self-end" disabled={loading}>Add</button>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Name</th>
                <th className="text-left">Graduation Year</th>
                <th className="text-left">Email</th>
                <th className="text-left">Occupation</th>
                <th className="text-left">Bio</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {alumni.map(a => (
                <tr key={a.id} className="border-t">
                  <td>{a.name}</td>
                  <td>{a.graduationYear}</td>
                  <td>{a.email || '-'}</td>
                  <td>{a.occupation || '-'}</td>
                  <td>{a.bio || '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(a.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {alumni.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No alumni found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
