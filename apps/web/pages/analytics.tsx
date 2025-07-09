
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface AnalyticsReport {
  id: number;
  title: string;
  data: string;
  generatedAt: string;
  type: string;
}

interface ChartData {
  name: string;
  value: number;
  students?: number;
  teachers?: number;
  performance?: number;
  attendance?: number;
  completion?: number;
}

export default function AnalyticsPage() {
  const [reports, setReports] = useState<AnalyticsReport[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'engagement' | 'trends'>('overview');
  const [loading, setLoading] = useState(false);

  // Mock data for analytics
  const performanceData: ChartData[] = [
    { name: 'Jan', value: 85, performance: 85, attendance: 92, completion: 78 },
    { name: 'Feb', value: 88, performance: 88, attendance: 89, completion: 82 },
    { name: 'Mar', value: 92, performance: 92, attendance: 94, completion: 87 },
    { name: 'Apr', value: 89, performance: 89, attendance: 91, completion: 85 },
    { name: 'May', value: 94, performance: 94, attendance: 96, completion: 91 },
    { name: 'Jun', value: 91, performance: 91, attendance: 93, completion: 88 },
  ];

  const subjectData: ChartData[] = [
    { name: 'Mathematics', value: 92, students: 250 },
    { name: 'Science', value: 87, students: 180 },
    { name: 'English', value: 89, students: 300 },
    { name: 'History', value: 84, students: 120 },
    { name: 'Geography', value: 86, students: 95 },
  ];

  const engagementData: ChartData[] = [
    { name: 'Active Users', value: 1250 },
    { name: 'Weekly Logins', value: 3400 },
    { name: 'Tests Completed', value: 850 },
    { name: 'AI Interactions', value: 2100 },
  ];

  const gradeDistribution = [
    { name: 'A', value: 35, color: '#10B981' },
    { name: 'B', value: 28, color: '#3B82F6' },
    { name: 'C', value: 22, color: '#F59E0B' },
    { name: 'D', value: 10, color: '#EF4444' },
    { name: 'F', value: 5, color: '#6B7280' },
  ];

  const mockReports: AnalyticsReport[] = [
    {
      id: 1,
      title: 'Student Performance Summary',
      data: JSON.stringify({ avgScore: 87.5, totalTests: 245, passRate: 92 }),
      generatedAt: new Date().toISOString(),
      type: 'Performance'
    },
    {
      id: 2,
      title: 'Attendance Analysis',
      data: JSON.stringify({ avgAttendance: 94.2, totalClasses: 180, absenteeism: 5.8 }),
      generatedAt: new Date().toISOString(),
      type: 'Attendance'
    },
    {
      id: 3,
      title: 'AI Usage Report',
      data: JSON.stringify({ totalQueries: 1250, avgResponseTime: 1.2, satisfactionRate: 4.6 }),
      generatedAt: new Date().toISOString(),
      type: 'AI Analytics'
    }
  ];

  useEffect(() => {
    setReports(mockReports);
  }, []);

  const StatCard = ({ title, value, change, icon, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
            </p>
          )}
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'performance', name: 'Performance', icon: '📈' },
    { id: 'engagement', name: 'Engagement', icon: '👥' },
    { id: 'trends', name: 'Trends', icon: '📉' },
  ];

  return (
    <Layout title="Advanced Analytics Dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600">Comprehensive insights into educational performance and engagement</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 bg-white rounded-2xl p-2 shadow-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Students"
                value="1,250"
                change={8.2}
                icon="👥"
                color="border-blue-500"
              />
              <StatCard
                title="Average Performance"
                value="87.5%"
                change={3.1}
                icon="📈"
                color="border-green-500"
              />
              <StatCard
                title="Attendance Rate"
                value="94.2%"
                change={-1.2}
                icon="✅"
                color="border-yellow-500"
              />
              <StatCard
                title="Tests Completed"
                value="2,450"
                change={12.5}
                icon="📝"
                color="border-purple-500"
              />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Trends */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="performance"
                      stroke="#3B82F6"
                      fillOpacity={1}
                      fill="url(#colorPerformance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Grade Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Grade Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject Performance */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Subject Performance</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Multi-Metric Comparison */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Performance vs Attendance</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="performance"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        )}

        {/* Engagement Tab */}
        {activeTab === 'engagement' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {engagementData.map((item, index) => (
                <StatCard
                  key={item.name}
                  title={item.name}
                  value={item.value.toLocaleString()}
                  change={Math.random() > 0.5 ? 5.2 : -2.1}
                  icon={['👤', '🔄', '✅', '🤖'][index]}
                  color={['border-blue-500', 'border-green-500', 'border-yellow-500', 'border-purple-500'][index]}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-6">6-Month Trend Analysis</h3>
              <ResponsiveContainer width="100%" height={500}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="performance"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Performance"
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Attendance"
                  />
                  <Line
                    type="monotone"
                    dataKey="completion"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    name="Completion Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Reports Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Generated Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{report.title}</h4>
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {report.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Generated: {new Date(report.generatedAt).toLocaleDateString()}
                </p>
                <div className="text-xs bg-gray-50 p-3 rounded-lg">
                  <pre className="whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(JSON.parse(report.data), null, 2)}
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
