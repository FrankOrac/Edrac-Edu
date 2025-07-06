import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { setToken } from '../lib/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/login`, { email, password });
      setToken(res.data.token);
      // Fetch user info and redirect based on role
      try {
        const userRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/user/me`, {
          headers: { Authorization: 'Bearer ' + res.data.token }
        });
        router.push('/dashboard');
      } catch (e) {
        setError('Login succeeded but failed to fetch user info');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input className="border p-2 w-full mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">Login</button>
      </form>
    </main>
  );
}
