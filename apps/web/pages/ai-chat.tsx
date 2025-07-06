import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function AiChat() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/ai/chat`, { prompt }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data.result);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'AI error');
      setResult('');
    }
  }

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-2xl font-bold mb-4">AI Chat Demo</h1>
      <form onSubmit={handleChat} className="mb-6 flex gap-2">
        <input className="border p-2 w-80" placeholder="Ask anything..." value={prompt} onChange={e => setPrompt(e.target.value)} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Send</button>
      </form>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {result && <div className="bg-gray-100 p-4 rounded w-full max-w-lg">{result}</div>}
    </main>
  );
}
