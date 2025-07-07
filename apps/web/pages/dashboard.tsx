
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  attendanceRate: number;
  upcomingExams: number;
  pendingAssignments: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    attendanceRate: 0,
    upcomingExams: 0,
    pendingAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalStudents: 1247,
        totalTeachers: 86,
        totalParents: 1156,
        attendanceRate: 94.2,
        upcomingExams: 5,
        pendingAssignments: 23,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    { name: 'Add Student', icon: '👥', href: '/students', color: 'bg-blue-500' },
    { name: 'Create Exam', icon: '📝', href: '/exams', color: 'bg-green-500' },
    { name: 'CBT Test', icon: '💻', href: '/cbt-test', color: 'bg-purple-500' },
    { name: 'View Analytics', icon: '📊', href: '/analytics', color: 'bg-orange-500' },
    { name: 'Send Notification', icon: '🔔', href: '/notifications', color: 'bg-red-500' },
    { name: 'AI Chat', icon: '🤖', href: '/ai-chat', color: 'bg-indigo-500' },
  ];

  const recentActivities = [
    { action: 'New student registered', time: '2 minutes ago', icon: '👤' },
    { action: 'Exam results published', time: '15 minutes ago', icon: '📊' },
    { action: 'Assignment submitted', time: '1 hour ago', icon: '📋' },
    { action: 'Parent meeting scheduled', time: '2 hours ago', icon: '📅' },
  ];

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-blue-100">Here's what's happening at your school today.</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {[
            { label: 'Total Students', value: stats.totalStudents, icon: '👥', color: 'bg-blue-500' },
            { label: 'Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: 'bg-green-500' },
            { label: 'Parents', value: stats.totalParents, icon: '👨‍👩‍👧‍👦', color: 'bg-purple-500' },
            { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: '✅', color: 'bg-orange-500' },
            { label: 'Upcoming Exams', value: stats.upcomingExams, icon: '📝', color: 'bg-red-500' },
            { label: 'Pending Tasks', value: stats.pendingAssignments, icon: '📋', color: 'bg-indigo-500' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white text-xl`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, index) => (
              <motion.a
                key={action.name}
                href={action.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${action.color} p-4 rounded-lg text-white text-center hover:opacity-90 transition-opacity`}
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium">{action.name}</div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities and Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p className="text-gray-600">Chart visualization coming soon</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
