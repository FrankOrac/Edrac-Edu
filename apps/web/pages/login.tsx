import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { login, isLoggedIn } from '../lib/auth';

interface TestCredential {
  role: string;
  email: string;
  password: string;
  highlight?: boolean;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Collect device information
      const deviceInfo = {
        deviceType: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
        browser: navigator.userAgent.split(' ').slice(-1)[0] || 'Unknown',
        os: navigator.platform || 'Unknown',
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : 'Unknown',
        cores: navigator.hardwareConcurrency || 1,
        connection: (navigator as any).connection?.effectiveType || 'Unknown',
      };

      // Get location info
      let locationInfo = {};
      try {
        const locationResponse = await fetch('https://ipapi.co/json/');
        locationInfo = await locationResponse.json();
      } catch (e) {
        console.log('Could not get location info');
      }

      const success = await login(formData.email, formData.password);
      if (success) {
        // Log device access for security monitoring
        try {
          await fetch('/api/device-tracking/log-access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              deviceInfo,
              locationInfo,
              userAgent: navigator.userAgent
            })
          });
        } catch (e) {
          console.log('Device tracking failed, but continuing...');
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const testCredentials: TestCredential[] = [
    { role: 'Guest Demo', email: 'guest@demo.com', password: 'demo', highlight: true },
    { role: 'Admin', email: 'admin@edrac.edu', password: 'password123' },
    { role: 'Teacher', email: 'teacher@edrac.edu', password: 'password123' },
    { role: 'Student', email: 'student@edrac.edu', password: 'password123' },
    { role: 'Parent', email: 'parent@edrac.edu', password: 'password123' },
    { role: 'Super Admin', email: 'superadmin@edrac.edu', password: 'password123' }
  ];

  const fillCredentials = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="text-white text-xl font-bold">EduAI Platform</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" className="text-white hover:text-blue-200 transition-colors">
                Home
              </Link>
              <Link href="/register" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center min-h-[600px]">
            {/* Welcome Section - Left side on large screens, top on mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white space-y-6 order-2 lg:order-1 lg:col-span-2"
            >
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-4">
                  Welcome Back to
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    EduAI Platform
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-blue-100 mb-6">
                  Your comprehensive education management system powered by AI
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm lg:text-base">Advanced CBT Testing System</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm lg:text-base">AI-Powered Learning Analytics</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm lg:text-base">Comprehensive Student Management</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-blue-100 text-sm lg:text-base">Real-time Performance Tracking</span>
                </div>
              </div>

              <div className="p-4 lg:p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <h3 className="text-base lg:text-lg font-semibold mb-2">🚀 What's New</h3>
                <p className="text-blue-100 text-sm">
                  Experience our latest AI-powered question generation and advanced analytics dashboard
                </p>
              </div>
            </motion.div>

            {/* Login Form - Right side on large screens, bottom on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 order-1 lg:order-2 w-full max-w-md mx-auto lg:mx-0"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-3"
                >
                  <span className="text-2xl text-white">🎓</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign In</h2>
                <p className="text-gray-600 text-sm">Access your account to continue</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowCredentials(!showCredentials)}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showCredentials ? 'Hide' : 'Show'} Test Credentials
                </button>
              </div>

              {showCredentials && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto"
                >
                  <h3 className="text-xs font-medium text-gray-700 mb-2">Test Accounts:</h3>
                  <div className="space-y-1">
                    {testCredentials.map((cred, index) => (
                      <button
                        key={index}
                        onClick={() => fillCredentials(cred.email, cred.password)}
                        className={`w-full text-left p-1.5 text-xs rounded border transition-colors ${
                          cred.highlight 
                            ? 'bg-green-50 border-green-300 hover:bg-green-100' 
                            : 'bg-white hover:bg-blue-50'
                        }`}
                      >
                        <div className={`font-medium ${cred.highlight ? 'text-green-900' : 'text-gray-900'}`}>
                          {cred.role} {cred.highlight && '✨'}
                        </div>
                        <div className={`truncate ${cred.highlight ? 'text-green-600' : 'text-gray-600'}`}>
                          {cred.email}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    Register here
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  E
                </div>
                <span className="font-bold text-white">EduAI Platform</span>
              </div>
              <p className="text-sm text-blue-100">
                Next generation education management platform powered by AI.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/cbt-test" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  CBT Test
                </Link>
                <Link href="/register" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  Register
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  Documentation
                </a>
                <a href="#" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-sm text-blue-100 hover:text-white transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">System Status</h4>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-blue-100">All systems operational</span>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm text-blue-100">
            <p>&copy; 2024 EduAI Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;