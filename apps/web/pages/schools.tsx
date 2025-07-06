import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Schools() {
  const [schools, setSchools] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/schools`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSchools(res.data))
      .catch(() => setError('Could not load schools'));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/schools`, { name, domain }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName(''); setDomain('');
      // reload schools
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/schools`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchools(res.data);
    } catch {
      setError('Create failed');
    }
  }

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">Schools</h1>
      <form onSubmit={handleCreate} className="mb-6 flex gap-2">
        <input className="border p-2" placeholder="School Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border p-2" placeholder="Domain" value={domain} onChange={e => setDomain(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul className="w-full max-w-lg">
        {schools.map(s => (
          <li key={s.id} className="border-b py-2">{s.name} <span className="text-gray-400">({s.domain})</span></li>
        ))}
      </ul>
    </main>
  );
}
