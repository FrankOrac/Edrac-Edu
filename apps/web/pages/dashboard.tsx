

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn, getUser } from '../lib/auth';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  attendanceRate: number;
  upcomingExams: number;
  pendingAssignments: number;
  activeClasses: number;
  completedTests: number;
  avgGrade: number;
  monthlyGrowth: number;
}

interface ChartData {
  month: string;
  students: number;
  attendance: number;
  performance: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    attendanceRate: 0,
    upcomingExams: 0,
    pendingAssignments: 0,
    activeClasses: 0,
    completedTests: 0,
    avgGrade: 0,
    monthlyGrowth: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState<'performance' | 'attendance' | 'growth'>('performance');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
  }, [router]);

  useEffect(() => {
    // Simulate API call with realistic data
    setTimeout(() => {
      setStats({
        totalStudents: 1247,
        totalTeachers: 86,
        totalParents: 1156,
        attendanceRate: 94.2,
        upcomingExams: 5,
        pendingAssignments: 23,
        activeClasses: 42,
        completedTests: 156,
        avgGrade: 87.3,
        monthlyGrowth: 12.5,
      });
      
      setChartData([
        { month: 'Jan', students: 950, attendance: 92, performance: 85 },
        { month: 'Feb', students: 1020, attendance: 94, performance: 87 },
        { month: 'Mar', students: 1150, attendance: 91, performance: 86 },
        { month: 'Apr', students: 1200, attendance: 95, performance: 89 },
        { month: 'May', students: 1247, attendance: 94, performance: 87 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const quickActions = [
    { name: 'Add Student', icon: '👥', href: '/students', color: 'from-blue-500 to-blue-600', description: 'Register new students' },
    { name: 'Create Exam', icon: '📝', href: '/exams', color: 'from-green-500 to-green-600', description: 'Schedule assessments' },
    { name: 'CBT Test', icon: '💻', href: '/cbt-test', color: 'from-purple-500 to-purple-600', description: 'Computer-based testing' },
    { name: 'Analytics', icon: '📊', href: '/analytics', color: 'from-orange-500 to-orange-600', description: 'Performance insights' },
    { name: 'AI Chat', icon: '🤖', href: '/ai-chat', color: 'from-indigo-500 to-indigo-600', description: 'AI assistant' },
    { name: 'Reports', icon: '📈', href: '/reports', color: 'from-red-500 to-red-600', description: 'Generate reports' },
  ];

  const recentActivities = [
    { action: 'New student John Doe registered', time: '2 minutes ago', icon: '👤', type: 'success' },
    { action: 'Mathematics exam results published', time: '15 minutes ago', icon: '📊', type: 'info' },
    { action: 'Physics assignment submitted by Class 10A', time: '1 hour ago', icon: '📋', type: 'warning' },
    { action: 'Parent-teacher meeting scheduled', time: '2 hours ago', icon: '📅', type: 'info' },
    { action: 'CBT session completed by 45 students', time: '3 hours ago', icon: '💻', type: 'success' },
  ];

  const renderChart = () => {
    const maxValue = Math.max(...chartData.map(d => d[activeChart]));
    
    return (
      <div className="h-64 flex items-end justify-between px-4 pb-4">
        {chartData.map((data, index) => {
          const height = (data[activeChart] / maxValue) * 200;
          const colors = {
            performance: 'from-blue-400 to-blue-600',
            attendance: 'from-green-400 to-green-600',
            growth: 'from-purple-400 to-purple-600'
          };
          
          return (
            <motion.div
              key={data.month}
              initial={{ height: 0 }}
              animate={{ height }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`w-12 bg-gradient-to-t ${colors[activeChart]} rounded-t-lg mx-1 relative group cursor-pointer`}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {data[activeChart]}
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium">
                {data.month}
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-blue-100 text-lg">Here's your comprehensive school management overview.</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">Role: {user?.role || 'Admin'}</span>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                <span className="text-sm font-semibold">Growth: +{stats.monthlyGrowth}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {[
            { label: 'Total Students', value: stats.totalStudents.toLocaleString(), icon: '👥', color: 'from-blue-500 to-blue-600', change: '+12%' },
            { label: 'Active Teachers', value: stats.totalTeachers, icon: '👨‍🏫', color: 'from-green-500 to-green-600', change: '+5%' },
            { label: 'Attendance Rate', value: `${stats.attendanceRate}%`, icon: '✅', color: 'from-orange-500 to-orange-600', change: '+2.1%' },
            { label: 'Avg Performance', value: `${stats.avgGrade}%`, icon: '📊', color: 'from-purple-500 to-purple-600', change: '+4.3%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}>
                  <span className="text-xl">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm text-green-600 font-semibold">{stat.change}</div>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Analytics and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enhanced Chart Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Performance Analytics</h3>
              <div className="flex gap-2">
                {(['performance', 'attendance', 'growth'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveChart(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeChart === type
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChart}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderChart()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.name}
                  href={action.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-gradient-to-r ${action.color} p-4 rounded-xl text-white hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{action.name}</div>
                      <div className="text-sm opacity-90">{action.description}</div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activities and Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activities</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:shadow-md ${
                    activity.type === 'success' ? 'bg-green-50 border border-green-200' :
                    activity.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">System Overview</h3>
            <div className="space-y-4">
              {[
                { label: 'Active Classes', value: stats.activeClasses, max: 50, color: 'bg-blue-500' },
                { label: 'Completed Tests', value: stats.completedTests, max: 200, color: 'bg-green-500' },
                { label: 'Pending Tasks', value: stats.pendingAssignments, max: 50, color: 'bg-orange-500' },
                { label: 'Upcoming Exams', value: stats.upcomingExams, max: 10, color: 'bg-purple-500' },
              ].map((metric, index) => (
                <div key={metric.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metric.value / metric.max) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                      className={`h-2 rounded-full ${metric.color}`}
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

