
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  Shield,
  Monitor,
  MapPin,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Smartphone,
  Globe
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { isLoggedIn, getUser } from '../lib/auth';

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

interface DeviceInfo {
  deviceType: string;
  browser: string;
  os: string;
  screenResolution: string;
  timezone: string;
  language: string;
  userAgent: string;
  memory: string;
  cores: number;
  connection: string;
  battery?: string;
}

interface LocationInfo {
  ip: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
  timezone: string;
}

interface UserSession {
  id: string;
  userId: number;
  email: string;
  name: string;
  loginTime: string;
  deviceInfo: DeviceInfo;
  locationInfo: LocationInfo;
  isActive: boolean;
  riskScore: number;
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
  const [userSessions, setUserSessions] = useState<UserSession[]>([]);
  const [deviceStats, setDeviceStats] = useState<any>({});

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    setUser(getUser());
    collectDeviceInfo();
    fetchUserSessions();
  }, [router]);

  const collectDeviceInfo = async () => {
    try {
      // Get basic device info
      const deviceInfo: DeviceInfo = {
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        browser: navigator.userAgent.split(' ').slice(-1)[0] || 'Unknown',
        os: navigator.platform || 'Unknown',
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        userAgent: navigator.userAgent,
        memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
        cores: navigator.hardwareConcurrency || 1,
        connection: (navigator as any).connection?.effectiveType || 'Unknown',
      };

      // Get battery info if available
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        deviceInfo.battery = `${Math.round(battery.level * 100)}%`;
      }

      // Get location info (using IP geolocation)
      const locationResponse = await fetch('https://ipapi.co/json/');
      const locationInfo: LocationInfo = await locationResponse.json();

      // Create user session
      const session: UserSession = {
        id: Date.now().toString(),
        userId: user?.id || 1,
        email: user?.email || 'admin@eduai.com',
        name: user?.name || 'System Administrator',
        loginTime: new Date().toISOString(),
        deviceInfo,
        locationInfo,
        isActive: true,
        riskScore: calculateRiskScore(deviceInfo, locationInfo)
      };

      setUserSessions(prev => [session, ...prev.slice(0, 9)]);
      
    } catch (error) {
      console.error('Error collecting device info:', error);
    }
  };

  const calculateRiskScore = (device: DeviceInfo, location: LocationInfo): number => {
    let score = 0;
    
    // Check for suspicious patterns
    if (device.deviceType === 'Mobile' && device.screenResolution.includes('1920')) score += 20;
    if (location.country !== 'NG') score += 30; // Assuming Nigerian platform
    if (device.browser.includes('headless')) score += 50;
    if (device.userAgent.includes('bot')) score += 80;
    
    return Math.min(score, 100);
  };

  const fetchUserSessions = () => {
    // Mock data for user sessions
    const mockSessions: UserSession[] = [
      {
        id: '1',
        userId: 1,
        email: 'admin@eduai.com',
        name: 'System Administrator',
        loginTime: new Date().toISOString(),
        deviceInfo: {
          deviceType: 'Desktop',
          browser: 'Chrome/119.0',
          os: 'Windows 11',
          screenResolution: '1920x1080',
          timezone: 'Africa/Lagos',
          language: 'en-US',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          memory: '8GB',
          cores: 8,
          connection: '4g',
          battery: '85%'
        },
        locationInfo: {
          ip: '197.210.227.254',
          country: 'Nigeria',
          region: 'Lagos',
          city: 'Lagos',
          latitude: 6.5244,
          longitude: 3.3792,
          isp: 'MTN Nigeria',
          timezone: 'Africa/Lagos'
        },
        isActive: true,
        riskScore: 5
      }
    ];
    setUserSessions(mockSessions);
  };

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
    { month: 'Jan', revenue: 45000, subscriptions: 980, churn: 2.1 },
    { month: 'Feb', revenue: 52000, subscriptions: 1100, churn: 1.8 },
    { month: 'Mar', revenue: 48000, subscriptions: 1180, churn: 2.0 },
    { month: 'Apr', revenue: 55000, subscriptions: 1220, churn: 1.9 },
    { month: 'May', revenue: 62000, subscriptions: 1247, churn: 2.3 },
  ];

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' },
  ];

  const locationData = [
    { country: 'Nigeria', users: 8500, percentage: 68 },
    { country: 'Ghana', users: 1200, percentage: 9.6 },
    { country: 'Kenya', users: 1000, percentage: 8 },
    { country: 'South Africa', users: 800, percentage: 6.4 },
    { country: 'Others', users: 1000, percentage: 8 },
  ];

  const getRiskColor = (score: number) => {
    if (score < 20) return 'text-green-600 bg-green-100';
    if (score < 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                    <span className="font-semibold">Active Sessions: {userSessions.length}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₦{stats.revenue.toLocaleString()}</div>
                <div className="text-blue-100">Monthly Revenue</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <nav className="flex space-x-2">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Analytics', icon: Users },
              { id: 'security', label: 'Security & Sessions', icon: Shield },
              { id: 'revenue', label: 'Revenue', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Total Students', value: stats.totalStudents, icon: Users, color: 'blue', change: '+12%' },
              { title: 'Active Teachers', value: stats.totalTeachers, icon: BookOpen, color: 'green', change: '+8%' },
              { title: 'Monthly Revenue', value: `₦${stats.revenue.toLocaleString()}`, icon: DollarSign, color: 'purple', change: '+15%' },
              { title: 'Avg Grade', value: `${stats.avgGrade}%`, icon: TrendingUp, color: 'orange', change: '+5%' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <p className={`text-sm text-${stat.color}-600`}>{stat.change} from last month</p>
                    </div>
                    <div className={`bg-${stat.color}-100 p-3 rounded-xl`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Security & Sessions Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Monitor className="w-6 h-6 mr-2 text-blue-600" />
                  Device Distribution
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Geographic Distribution */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Globe className="w-6 h-6 mr-2 text-green-600" />
                  User Locations
                </h3>
                <div className="space-y-3">
                  {locationData.map((location, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{location.country}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{location.users}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${location.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-red-600" />
                Active User Sessions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">User</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Device</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Location</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">IP Address</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Risk Score</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Login Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-gray-900">{session.name}</div>
                            <div className="text-sm text-gray-500">{session.email}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {session.deviceInfo.deviceType === 'Mobile' ? 
                              <Smartphone className="w-4 h-4 mr-2 text-blue-500" /> : 
                              <Monitor className="w-4 h-4 mr-2 text-blue-500" />
                            }
                            <div>
                              <div className="text-sm font-medium">{session.deviceInfo.deviceType}</div>
                              <div className="text-xs text-gray-500">{session.deviceInfo.os}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-green-500" />
                            <div>
                              <div className="text-sm font-medium">{session.locationInfo.city}</div>
                              <div className="text-xs text-gray-500">{session.locationInfo.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-mono text-gray-600">{session.locationInfo.ip}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(session.riskScore)}`}>
                            {session.riskScore}% Risk
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(session.loginTime).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Revenue Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${value?.toLocaleString()}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Affordable Pricing Info */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-bold mb-4 text-green-800">Affordable Pricing Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-semibold text-green-700">Basic Plan</h4>
                  <div className="text-2xl font-bold text-green-600">₦2,500/month</div>
                  <p className="text-sm text-gray-600">Perfect for small schools (up to 100 students)</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-400">
                  <h4 className="font-semibold text-green-700">Standard Plan</h4>
                  <div className="text-2xl font-bold text-green-600">₦7,500/month</div>
                  <p className="text-sm text-gray-600">Ideal for medium schools (up to 500 students)</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h4 className="font-semibold text-green-700">Premium Plan</h4>
                  <div className="text-2xl font-bold text-green-600">₦15,000/month</div>
                  <p className="text-sm text-gray-600">Complete solution (unlimited students)</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
