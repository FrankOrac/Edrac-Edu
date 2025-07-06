import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Payment {
  id: number;
  payer: string;
  amount: number;
  date: string;
  method: string;
  reference?: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [method, setMethod] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchPayments() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/payments`);
      setPayments(res.data);
    } catch {
      setError('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPayments(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/payments`, {
        payer, amount: Number(amount), date, method, reference
      });
      setSuccess('Payment recorded');
      setPayer(''); setAmount(''); setDate(''); setMethod(''); setReference('');
      fetchPayments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this payment?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/payments/${id}`);
      setSuccess('Payment deleted');
      fetchPayments();
    } catch {
      setError('Failed to delete payment');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Payments">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Payments</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Payer" value={payer} onChange={e => setPayer(e.target.value)} required />
            <input className="border p-2 w-24" type="number" min={0} step={0.01} placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} required />
            <input className="border p-2 flex-1" type="datetime-local" value={date} onChange={e => setDate(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Method (e.g. Cash, Card)" value={method} onChange={e => setMethod(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Reference (optional)" value={reference} onChange={e => setReference(e.target.value)} />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Payer</th>
                <th className="text-left">Amount</th>
                <th className="text-left">Date</th>
                <th className="text-left">Method</th>
                <th className="text-left">Reference</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id} className="border-t">
                  <td>{payment.payer}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.date ? new Date(payment.date).toLocaleString() : '-'}</td>
                  <td>{payment.method}</td>
                  <td>{payment.reference || '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(payment.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr><td colSpan={6} className="text-center text-gray-400">No payments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
