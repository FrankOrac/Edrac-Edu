import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location?: string;
  available: boolean;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchItems() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inventory`);
      setItems(res.data);
    } catch {
      setError('Failed to fetch inventory items');
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
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inventory`, {
        name, category, quantity: Number(quantity), location, available
      });
      setSuccess('Inventory item added');
      setName(''); setCategory(''); setQuantity(''); setLocation(''); setAvailable(true);
      fetchItems();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add inventory item');
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
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/inventory/${id}`);
      setSuccess('Inventory item deleted');
      fetchItems();
    } catch {
      setError('Failed to delete inventory item');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Inventory">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Inventory</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} required />
            <input className="border p-2 w-24" type="number" min={1} placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Location (optional)" value={location} onChange={e => setLocation(e.target.value)} />
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
                <th className="text-left">Name</th>
                <th className="text-left">Category</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Location</th>
                <th className="text-left">Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-t">
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.location || '-'}</td>
                  <td>{item.available ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(item.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No inventory items found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
