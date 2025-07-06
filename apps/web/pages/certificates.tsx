import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Certificate {
  id: number;
  recipient: string;
  type: string;
  issuedAt: string;
  description?: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [recipient, setRecipient] = useState('');
  const [type, setType] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchCertificates() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates`);
      setCertificates(res.data);
    } catch {
      setError('Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchCertificates(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates`, {
        recipient, type, issuedAt, description
      });
      setSuccess('Certificate issued');
      setRecipient(''); setType(''); setIssuedAt(''); setDescription('');
      fetchCertificates();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this certificate?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/certificates/${id}`);
      setSuccess('Certificate deleted');
      fetchCertificates();
    } catch {
      setError('Failed to delete certificate');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Certificates">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Certificates</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Recipient" value={recipient} onChange={e => setRecipient(e.target.value)} required />
            <input className="border p-2 flex-1" placeholder="Type (e.g. Diploma, Award)" value={type} onChange={e => setType(e.target.value)} required />
            <input className="border p-2 flex-1" type="datetime-local" value={issuedAt} onChange={e => setIssuedAt(e.target.value)} required />
          </div>
          <input className="border p-2" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-32 self-end" disabled={loading}>Issue</button>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Recipient</th>
                <th className="text-left">Type</th>
                <th className="text-left">Issued At</th>
                <th className="text-left">Description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {certificates.map(certificate => (
                <tr key={certificate.id} className="border-t">
                  <td>{certificate.recipient}</td>
                  <td>{certificate.type}</td>
                  <td>{certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleString() : '-'}</td>
                  <td>{certificate.description || '-'}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(certificate.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {certificates.length === 0 && (
                <tr><td colSpan={5} className="text-center text-gray-400">No certificates found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
