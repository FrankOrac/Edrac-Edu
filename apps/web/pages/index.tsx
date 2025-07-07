import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: '🎓',
      title: 'Student Management',
      description: 'Comprehensive student profiles, enrollment tracking, and academic progress monitoring.',
      demo: '/students'
    },
    {
      icon: '👨‍🏫',
      title: 'Teacher Portal',
      description: 'Teacher profiles, class management, and student progress tracking tools.',
      demo: '/teachers'
    },
    {
      icon: '💻',
      title: 'CBT Testing',
      description: 'Computer-based testing with real-time analytics and automated grading.',
      demo: '/cbt-test'
    },
    {
      icon: '🤖',
      title: 'AI Integration',
      description: 'AI-powered question generation, chat assistance, and learning analytics.',
      demo: '/ai-chat'
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Real-time insights into student performance and institutional metrics.',
      demo: '/dashboard'
    },
    {
      icon: '📚',
      title: 'Learning Management',
      description: 'Course management, assignments, and educational resource organization.',
      demo: '/library'
    },
    {
      icon: '💳',
      title: 'Payment System',
      description: 'Integrated payment processing for fees, registrations, and services.',
      demo: '/payments'
    },
    {
      icon: '🎮',
      title: 'Gamification',
      description: 'Engagement through points, badges, and achievement systems.',
      demo: '/gamification'
    }
  ];

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
    { name: 'Demo', href: '#demo' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <Head>
        <title>EduAI Platform - Next Generation Education Management System</title>
        <meta name="description" content="Complete education management platform with AI integration, CBT testing, and comprehensive analytics." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Navigation Header */}
        <nav className="bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                  E
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">EduAI Platform</h1>
                  <p className="text-sm text-gray-600">Education Management</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-6 h-6 flex flex-col justify-center gap-1">
                  <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                  <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-200 bg-white"
              >
                <div className="px-4 py-4 space-y-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block text-gray-700 hover:text-blue-600 font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  <Link href="/login">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium mt-4">
                      Login
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Next Generation
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Education Platform
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive education management system with AI integration, computer-based testing, 
                and real-time analytics to transform your educational institution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:shadow-3xl transition-all"
                  >
                    Get Started Free
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:shadow-lg transition-all"
                  onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  View Demo
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Powerful Features
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage your educational institution efficiently and effectively.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all border border-white/20"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Link href={feature.demo}>
                    <button className="text-blue-600 hover:text-purple-600 font-semibold transition-colors">
                      Try Demo →
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-blue-400 drop-shadow mb-6">
            EduAI Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
            Revolutionizing education with AI-powered learning, comprehensive school management, and intelligent assessment tools
          </p>

          {/* CBT Demo Section */}
          <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl p-8 mb-8 border-2 border-blue-200">
            <h2 className="text-3xl font-bold text-blue-800 mb-4">Try Our CBT System Now!</h2>
            <p className="text-lg text-gray-700 mb-6">Experience our Computer-Based Testing platform with no registration required</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/cbt-test?demo=true')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                🎯 Start Demo Test
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
              >
                📚 Register for Full Access
              </button>
            </div>
          </div>
        </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    E
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">EduAI Platform</h3>
                    <p className="text-gray-400">Education Management System</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-6 max-w-md">
                  Transforming education through technology. Comprehensive management solutions 
                  for modern educational institutions.
                </p>
                <div className="flex space-x-4">
                  <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    📧
                  </button>
                  <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    📱
                  </button>
                  <button className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
                    🌐
                  </button>
                </div>
              </div>

              <div>
                <h4 className="font-bold mb-4">Features</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Student Management</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CBT Testing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AI Integration</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Analytics</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">
                © 2024 EduAI Platform. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;