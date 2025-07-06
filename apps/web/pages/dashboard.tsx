import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const roleWidgets: Record<string, JSX.Element[]> = {
  admin: [
    <a key="students" href="/students" className="dashboard-link">Manage Students</a>,
    <a key="teachers" href="/teachers" className="dashboard-link">Manage Teachers</a>,
    <a key="analytics" href="/analytics" className="dashboard-link">View Analytics</a>,
    <a key="payments" href="/payments" className="dashboard-link">Payments</a>,
  ],
  teacher: [
    <a key="classes" href="/groups" className="dashboard-link">My Classes</a>,
    <a key="assignments" href="/assignments" className="dashboard-link">Assignments</a>,
    <a key="attendance" href="/attendance" className="dashboard-link">Attendance</a>,
    <a key="results" href="/results" className="dashboard-link">Results</a>,
  ],
  student: [
    <a key="my-assignments" href="/assignments" className="dashboard-link">My Assignments</a>,
    <a key="my-results" href="/results" className="dashboard-link">My Results</a>,
    <a key="library" href="/library" className="dashboard-link">Library</a>,
    <a key="ai-chat" href="/ai-chat" className="dashboard-link">AI Chat</a>,
  ],
  parent: [
    <a key="child-progress" href="/results" className="dashboard-link">Child Progress</a>,
    <a key="attendance" href="/attendance" className="dashboard-link">Attendance</a>,
    <a key="notifications" href="/notifications" className="dashboard-link">Notifications</a>,
  ],
  alumni: [
    <a key="alumni-forum" href="/forums" className="dashboard-link">Alumni Forum</a>,
    <a key="certificates" href="/certificates" className="dashboard-link">Certificates</a>,
    <a key="groups" href="/groups" className="dashboard-link">Groups</a>,
  ]
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return router.push('/login');
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, []);

  if (error) return <Layout title="Dashboard"><div className="text-red-500">{error}</div></Layout>;
  if (!user) return <Layout title="Dashboard"><div>Loading...</div></Layout>;

  const widgets = roleWidgets[user.role] || [<span key="default">No widgets for this role.</span>];

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name || user.email}!</h1>
        <p className="mb-2">Role: {user.role}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 w-full max-w-xl">
          {widgets.map((widget, i) => (
            <div key={i} className="bg-white rounded shadow p-6 text-center hover:bg-blue-50 transition-colors">
              {widget}
            </div>
          ))}
        </div>
        <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>Logout</button>
      </div>
    </Layout>
  );
}
