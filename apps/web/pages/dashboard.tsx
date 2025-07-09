import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  Users, BookOpen, DollarSign, TrendingUp, AlertTriangle, 
  Shield, Activity, Globe, Zap, Calendar, MessageSquare,
  BarChart3, PieChart, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, RefreshCw, Settings,
  Download, Filter, Search, Bell, Eye, Edit, Trash2
} from 'lucide-react';
import SecurityMonitor from '../components/SecurityMonitor';

interface DashboardStats {
  totalUsers: number;
  activeStudents: number;
  totalRevenue: number;
  monthlyGrowth: number;
  testsCompleted: number;
  averageScore: number;
  systemUptime: number;
  activeTeachers: number;
}

interface RecentActivity {
  id: string;
  type: 'user_registration' | 'test_completion' | 'payment' | 'login' | 'system_alert';
  message: string;
  timestamp: string;
  severity?: 'low' | 'medium' | 'high';
  user?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeStudents: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    testsCompleted: 0,
    averageScore: 0,
    systemUptime: 99.9,
    activeTeachers: 0
  });

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);

      // Simulate API calls with realistic data
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats({
        totalUsers: 12543,
        activeStudents: 8921,
        totalRevenue: 284750,
        monthlyGrowth: 23.5,
        testsCompleted: 45623,
        averageScore: 78.2,
        systemUptime: 99.97,
        activeTeachers: 342
      });

      const mockActivity: RecentActivity[] = [
        {
          id: '1',
          type: 'user_registration',
          message: 'New student registered: John Doe',
          timestamp: new Date().toISOString(),
          user: 'John Doe'
        },
        {
          id: '2',
          type: 'test_completion',
          message: 'Mathematics test completed by class 10A',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user: 'Class 10A'
        },
        {
          id: '3',
          type: 'payment',
          message: 'Payment received: $149 (Professional Plan)',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user: 'Springfield Academy'
        },
        {
          id: '4',
          type: 'system_alert',
          message: 'High server load detected - Auto-scaling initiated',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          severity: 'medium'
        }
      ];

      setRecentActivity(mockActivity);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration': return <Users className="w-4 h-4" />;
      case 'test_completion': return <BookOpen className="w-4 h-4" />;
      case 'payment': return <DollarSign className="w-4 h-4" />;
      case 'login': return <Shield className="w-4 h-4" />;
      case 'system_alert': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      change: `+${stats.monthlyGrowth}%`,
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-600 to-emerald-600',
      description: 'Monthly recurring revenue'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents.toLocaleString(),
      change: '+12.3%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-600 to-cyan-600',
      description: 'Students active this month'
    },
    {
      title: 'Tests Completed',
      value: stats.testsCompleted.toLocaleString(),
      change: '+8.7%',
      trend: 'up',
      icon: BookOpen,
      color: 'from-purple-600 to-violet-600',
      description: 'Total assessments taken'
    },
    {
      title: 'Average Score',
      value: `${stats.averageScore}%`,
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-600 to-red-600',
      description: 'Platform-wide performance'
    },
    {
      title: 'System Uptime',
      value: `${stats.systemUptime}%`,
      change: '99.9%',
      trend: 'stable',
      icon: Activity,
      color: 'from-teal-600 to-green-600',
      description: 'Service availability'
    },
    {
      title: 'Active Teachers',
      value: stats.activeTeachers.toLocaleString(),
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'from-indigo-600 to-purple-600',
      description: 'Educators on platform'
    }
  ];

  if (loading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xl font-semibold text-gray-700">Loading Dashboard...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-8 pb-8">
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Super Admin Dashboard</h1>
                <p className="text-blue-100 text-lg">Comprehensive platform oversight and management</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={fetchDashboardData}
                  disabled={refreshing}
                  className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value)}
                  className="bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white font-semibold"
                >
                  <option value="24h" className="text-gray-900">Last 24 Hours</option>
                  <option value="7d" className="text-gray-900">Last 7 Days</option>
                  <option value="30d" className="text-gray-900">Last 30 Days</option>
                  <option value="90d" className="text-gray-900">Last 90 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Globe className="w-8 h-8" />
                  <span className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</span>
                </div>
                <h3 className="text-lg font-semibold">Total Platform Users</h3>
                <p className="text-blue-100">Across all institutions</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Zap className="w-8 h-8" />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold">Live</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">System Status</h3>
                <p className="text-blue-100">All services operational</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8" />
                  <span className="text-2xl font-bold">{new Date().toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold">Today's Date</h3>
                <p className="text-blue-100">Platform time: UTC</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpiCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.color}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-1">
                    {card.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : card.trend === 'down' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-4 h-4" />
                    )}
                    <span className={`text-sm font-semibold ${
                      card.trend === 'up' ? 'text-green-600' : 
                      card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {card.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{card.value}</h3>
                <p className="text-gray-700 font-semibold mb-1">{card.title}</p>
                <p className="text-gray-500 text-sm">{card.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-blue-600" />
                  Real-time Activity Monitor
                </h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.message}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleTimeString()}
                        </span>
                        {activity.user && (
                          <span className="text-sm text-blue-600 font-medium">{activity.user}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Monitor */}
          <div>
            <SecurityMonitor />
          </div>
        </div>

        {/* Advanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
              Performance Analytics
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Server Response Time</span>
                  <span className="text-sm text-gray-500">125ms avg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Database Performance</span>
                  <span className="text-sm text-gray-500">98.2% optimal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">CDN Cache Hit Rate</span>
                  <span className="text-sm text-gray-500">96.7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '97%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">API Success Rate</span>
                  <span className="text-sm text-gray-500">99.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '99%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2 text-blue-600" />
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'User Management', icon: Users, href: '/students' },
                { label: 'System Settings', icon: Settings, href: '/admin-settings' },
                { label: 'Analytics', icon: BarChart3, href: '/analytics' },
                { label: 'Notifications', icon: Bell, href: '/notifications' },
                { label: 'Reports', icon: Download, href: '/reports' },
                { label: 'AI Config', icon: Zap, href: '/ai-endpoints' }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-blue-50 hover:to-blue-100 transition-all duration-200 text-left border border-gray-200 hover:border-blue-300"
                  >
                    <Icon className="w-6 h-6 text-gray-700 mb-2" />
                    <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* System Health Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            System Health Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: 'Web Server', status: 'operational', uptime: '99.97%', color: 'green' },
              { label: 'Database', status: 'operational', uptime: '99.95%', color: 'green' },
              { label: 'AI Services', status: 'operational', uptime: '99.92%', color: 'green' },
              { label: 'CDN', status: 'operational', uptime: '99.99%', color: 'green' }
            ].map((service) => (
              <div key={service.label} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <div className={`w-3 h-3 rounded-full bg-${service.color}-500 mr-2`}></div>
                  <CheckCircle className={`w-5 h-5 text-${service.color}-600`} />
                </div>
                <h4 className="font-semibold text-gray-900">{service.label}</h4>
                <p className="text-sm text-gray-600 capitalize">{service.status}</p>
                <p className="text-xs text-gray-500">{service.uptime} uptime</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}