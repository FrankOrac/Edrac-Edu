import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface LibraryItem {
  id: number;
  title: string;
  author: string;
  isbn: string;
  type: string;
  available: boolean;
}

export default function LibraryPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [type, setType] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/library`);
      setItems(res.data);
    } catch {
      setError('Failed to fetch library items');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/library`, {
        title, author, isbn, type, available
      });
      setSuccess('Library item added');
      setTitle(''); setAuthor(''); setIsbn(''); setType(''); setAvailable(true);
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add library item');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this item?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/library/${id}`);
      setSuccess('Library item deleted');
      fetchItems();
    } catch {
      setError('Failed to delete library item');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Library">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Library</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Author" value={author} onChange={e => setAuthor(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Type (e.g. Book, Journal)" value={type} onChange={e => setType(e.target.value)} required />
            <label className="flex items-center ml-2">
              <input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="mr-1" />Available
            </label>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-left">Author</th>
                <th className="text-left">ISBN</th>
                <th className="text-left">Type</th>
                <th className="text-left">Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t">
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>{item.isbn}</td>
                  <td>{item.type}</td>
                  <td>{item.available ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No library items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
