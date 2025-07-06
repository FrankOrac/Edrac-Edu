import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/register`, { email, password, name });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="border p-2 w-full mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 w-full mb-2" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Register</button>
      </form>
    </main>
  );
}
