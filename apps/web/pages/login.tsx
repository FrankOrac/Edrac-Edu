
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
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
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4"
          >
            <span className="text-3xl text-white">🎓</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your EDRAC account</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {showCredentials ? 'Hide' : 'Show'} Test Credentials
          </button>
        </div>

        {showCredentials && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-xl"
          >
            <h3 className="text-sm font-medium text-gray-700 mb-3">Test Accounts:</h3>
            <div className="space-y-2">
              {testCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillCredentials(cred.email, cred.password)}
                  className={`w-full text-left p-2 text-xs rounded border transition-colors ${
                    cred.highlight 
                      ? 'bg-green-50 border-green-300 hover:bg-green-100' 
                      : 'bg-white hover:bg-blue-50'
                  }`}
                >
                  <div className={`font-medium ${cred.highlight ? 'text-green-900' : 'text-gray-900'}`}>
                    {cred.role} {cred.highlight && '✨ (Works offline)'}
                  </div>
                  <div className={cred.highlight ? 'text-green-600' : 'text-gray-600'}>
                    {cred.email}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Register here
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
