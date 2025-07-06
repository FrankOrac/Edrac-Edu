import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Transport {
  id: number;
  route: string;
  driver: string;
  vehicle: string;
  capacity: number;
  available: boolean;
}

export default function TransportPage() {
  const [transports, setTransports] = useState<Transport[]>([]);
  const [route, setRoute] = useState('');
  const [driver, setDriver] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [capacity, setCapacity] = useState('');
  const [available, setAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchTransports() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transport`);
      setTransports(res.data);
    } catch {
      setError('Failed to fetch transports');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTransports(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transport`, {
        route, driver, vehicle, capacity: Number(capacity), available
      });
      setSuccess('Transport record created');
      setRoute(''); setDriver(''); setVehicle(''); setCapacity(''); setAvailable(true);
      fetchTransports();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create transport record');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this transport record?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/transport/${id}`);
      setSuccess('Transport record deleted');
      fetchTransports();
    } catch {
      setError('Failed to delete transport record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Transport">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transport</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Route" value={route} onChange={e => setRoute(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Driver" value={driver} onChange={e => setDriver(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Vehicle" value={vehicle} onChange={e => setVehicle(e.target.value)} required />
            <input className="border p-2 w-24" type="number" min={1} placeholder="Capacity" value={capacity} onChange={e => setCapacity(e.target.value)} required />
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
                <th className="text-left">Route</th>
                <th className="text-left">Driver</th>
                <th className="text-left">Vehicle</th>
                <th className="text-left">Capacity</th>
                <th className="text-left">Available</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {transports.map(t => (
                <tr key={t.id} className="border-t">
                  <td>{t.route}</td>
                  <td>{t.driver}</td>
                  <td>{t.vehicle}</td>
                  <td>{t.capacity}</td>
                  <td>{t.available ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(t.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {transports.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No transport records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
