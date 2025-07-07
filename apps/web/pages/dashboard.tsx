
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn, getUser } from '../lib/auth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, BookOpen, DollarSign, Award, Calendar, Bell, Settings, Download, Filter, Eye, ChevronRight } from 'lucide-react';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  attendanceRate: number;
  revenue: number;
  activeSubscriptions: number;
  completedAssessments: number;
  avgGrade: number;
  monthlyGrowth: number;
  churnRate: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    attendanceRate: 0,
    revenue: 0,
    activeSubscriptions: 0,
    completedAssessments: 0,
    avgGrade: 0,
    monthlyGrowth: 0,
    churnRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalStudents: 12847,
        totalTeachers: 486,
        totalParents: 11456,
        attendanceRate: 94.2,
        revenue: 284750,
        activeSubscriptions: 1247,
        completedAssessments: 8956,
        avgGrade: 87.3,
        monthlyGrowth: 18.5,
        churnRate: 2.3,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const revenueData = [
    { month: 'Jan', revenue: 185000, subscriptions: 980, churn: 2.1 },
    { month: 'Feb', revenue: 220000, subscriptions: 1100, churn: 1.8 },
    { month: 'Mar', revenue: 245000, subscriptions: 1180, churn: 2.0 },
    { month: 'Apr', revenue: 260000, subscriptions: 1220, churn: 1.9 },
    { month: 'May', revenue: 284750, subscriptions: 1247, churn: 2.3 },
  ];

  const performanceData = [
    { subject: 'Mathematics', score: 89, students: 1200 },
    { subject: 'Science', score: 85, students: 1150 },
    { subject: 'English', score: 92, students: 1300 },
    { subject: 'History', score: 78, students: 980 },
    { subject: 'Geography', score: 83, students: 890 },
  ];

  const userDistribution = [
    { name: 'Students', value: 12847, color: '#3B82F6' },
    { name: 'Teachers', value: 486, color: '#10B981' },
    { name: 'Parents', value: 11456, color: '#F59E0B' },
    { name: 'Alumni', value: 2340, color: '#8B5CF6' },
  ];

  const StatCard = ({ title, value, change, icon: Icon, color, prefix = '', suffix = '' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
            <Icon size={24} />
          </div>
          {change && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={16} className={change < 0 ? 'rotate-180' : ''} />
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'revenue', name: 'Revenue', icon: DollarSign },
    { id: 'performance', name: 'Performance', icon: Award },
    { id: 'users', name: 'Users', icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Revenue Analytics</h3>
                <select className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500">
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="url(#revenueGradient)" strokeWidth={3} />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'performance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Subject Performance</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="subject" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="score" fill="url(#performanceGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">User Distribution</h3>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value={stats.revenue} 
              change={stats.monthlyGrowth} 
              icon={DollarSign} 
              color="from-green-500 to-green-600" 
              prefix="$" 
            />
            <StatCard 
              title="Active Subscriptions" 
              value={stats.activeSubscriptions} 
              change={12.5} 
              icon={Users} 
              color="from-blue-500 to-blue-600" 
            />
            <StatCard 
              title="Completed Assessments" 
              value={stats.completedAssessments} 
              change={8.2} 
              icon={BookOpen} 
              color="from-purple-500 to-purple-600" 
            />
            <StatCard 
              title="Churn Rate" 
              value={stats.churnRate} 
              change={-0.5} 
              icon={TrendingUp} 
              color="from-red-500 to-red-600" 
              suffix="%" 
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full transform translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-32 translate-y-32"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name || 'Administrator'}!</h1>
                <p className="text-blue-100 text-lg mb-4">Here's your comprehensive platform overview</p>
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                    <span className="font-semibold">Role: {user?.role || 'Super Admin'}</span>
                  </div>
                  <div className="bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
                    <span className="font-semibold">Growth: +{stats.monthlyGrowth}% this month</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <Download size={20} />
                </button>
                <button className="bg-white/20 p-3 rounded-xl backdrop-blur-sm hover:bg-white/30 transition-colors">
                  <Settings size={20} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents} 
            change={stats.monthlyGrowth} 
            icon={Users} 
            color="from-blue-500 to-blue-600" 
          />
          <StatCard 
            title="Active Teachers" 
            value={stats.totalTeachers} 
            change={5.2} 
            icon={BookOpen} 
            color="from-green-500 to-green-600" 
          />
          <StatCard 
            title="Monthly Revenue" 
            value={stats.revenue} 
            change={stats.monthlyGrowth} 
            icon={DollarSign} 
            color="from-purple-500 to-purple-600" 
            prefix="$" 
          />
          <StatCard 
            title="Attendance Rate" 
            value={stats.attendanceRate} 
            change={2.1} 
            icon={Award} 
            color="from-orange-500 to-orange-600" 
            suffix="%" 
          />
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex gap-1 p-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Manage Subscriptions', icon: '💳', href: '/payments', color: 'from-green-500 to-green-600', description: 'Billing & payments' },
            { name: 'SaaS Analytics', icon: '📊', href: '/analytics', color: 'from-blue-500 to-blue-600', description: 'Platform metrics' },
            { name: 'User Management', icon: '👥', href: '/students', color: 'from-purple-500 to-purple-600', description: 'Manage all users' },
            { name: 'AI Features', icon: '🤖', href: '/ai-chat', color: 'from-indigo-500 to-indigo-600', description: 'AI capabilities' },
            { name: 'System Settings', icon: '⚙️', href: '/schools', color: 'from-orange-500 to-orange-600', description: 'Platform config' },
            { name: 'Reports & Export', icon: '📈', href: '/reports', color: 'from-red-500 to-red-600', description: 'Data insights' },
          ].map((action, index) => (
            <motion.a
              key={action.name}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white hover:shadow-2xl transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">{action.icon}</div>
                  <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-xl font-bold mb-2">{action.name}</h3>
                <p className="text-white/80">{action.description}</p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
