import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';

interface Attendance {
  id: number;
  studentId: number;
  date: string;
  status: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function fetchAttendance() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/attendance`);
      setAttendance(res.data);
    } catch {
      setError('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchAttendance(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/attendance`, {
        studentId: Number(studentId), date, status
      });
      setSuccess('Attendance recorded');
      setStudentId(''); setDate(''); setStatus('Present');
      fetchAttendance();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to record attendance');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this attendance record?')) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/attendance/${id}`);
      setSuccess('Attendance record deleted');
      fetchAttendance();
    } catch {
      setError('Failed to delete attendance record');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout title="Attendance">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Attendance</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-2 bg-white p-4 rounded shadow">
          <div className="flex gap-2">
            <input className="border p-2 flex-1" placeholder="Student ID" value={studentId} onChange={e => setStudentId(e.target.value)} required />
            <input className="border p-2 flex-1" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            <select className="border p-2 flex-1" value={status} onChange={e => setStatus(e.target.value)} required>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Add</button>
          </div>
        </form>
        <div className="bg-white rounded shadow p-4">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left">Student ID</th>
                <th className="text-left">Date</th>
                <th className="text-left">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attendance.map(a => (
                <tr key={a.id} className="border-t">
                  <td>{a.studentId}</td>
                  <td>{a.date && new Date(a.date).toLocaleDateString()}</td>
                  <td>{a.status}</td>
                  <td>
                    <button className="text-red-600 hover:underline" onClick={() => handleDelete(a.id)} disabled={loading}>Delete</button>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr><td colSpan={4} className="text-center text-gray-400">No attendance records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
