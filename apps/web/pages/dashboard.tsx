import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';

const roleWidgets: Record<string, { text: string; href: string }[]> = {
  admin: [
    { text: 'Manage Students', href: '/students' },
    { text: 'Manage Teachers', href: '/teachers' },
    { text: 'View Analytics', href: '/cbt-analytics' },
    { text: 'CBT Content', href: '/cbt-extra' },
  ],
  teacher: [
    { text: 'My Classes', href: '/groups' },
    { text: 'Assignments', href: '/assignments' },
    { text: 'Attendance', href: '/attendance' },
    { text: 'Results', href: '/results' },
  ],
  student: [
    { text: 'Take CBT Test', href: '/cbt-test' },
    { text: 'My Results', href: '/cbt-analytics' },
    { text: 'Library', href: '/library' },
    { text: 'AI Chat', href: '/ai-chat' },
  ],
  parent: [
    { text: 'Child Progress', href: '/results' },
    { text: 'Attendance', href: '/attendance' },
    { text: 'Notifications', href: '/notifications' },
  ],
  alumni: [
    { text: 'Alumni Forum', href: '/forums' },
    { text: 'Certificates', href: '/certificates' },
    { text: 'Groups', href: '/groups' },
  ]
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(() => {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        router.push('/login');
      });
  }, [router]);

  if (error) return <Layout title="Dashboard"><div className="text-red-500 p-8 text-center">{error}</div></Layout>;
  if (!user) return <Layout title="Dashboard"><div className="p-8 text-center">Loading dashboard...</div></Layout>;

  const widgets = roleWidgets[user.role.toLowerCase()] || [];

  return (
    <Layout title="Dashboard">
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-700 via-gray-900 to-black mb-4 text-center"
        >
          Welcome, {user.name || user.email}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-2 text-lg text-gray-600 font-semibold"
        >
          Role: <span className="font-bold uppercase tracking-wider">{user.role}</span>
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 w-full max-w-4xl">
          {widgets.length > 0 ? (
            widgets.map((widget, i) => (
              <Link href={widget.href} key={i} passHref>
                <motion.a
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)" }}
                  className="block backdrop-blur-md bg-slate-100/30 border border-slate-200/50 rounded-2xl shadow-lg p-6 flex items-center justify-center text-center cursor-pointer transition-all hover:bg-slate-50/50 hover:shadow-xl h-36 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  <span className="text-xl font-semibold text-gray-800">{widget.text}</span>
                </motion.a>
              </Link>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="md:col-span-2 text-center text-gray-500 font-semibold p-8 bg-white/20 rounded-3xl"
            >
              No widgets available for your role.
            </motion.div>
          )}
        </div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-slate-600 to-slate-800 hover:from-slate-700 hover:to-slate-900 text-white rounded-xl font-bold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300"
          onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}
        >
          Logout
        </motion.button>
      </div>
    </Layout>
  );
}
