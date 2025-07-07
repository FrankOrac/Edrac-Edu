import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart3, Brain, Star, Menu, X, Home, ArrowLeft, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: '🎓',
      title: 'CBT Testing System',
      description: 'Advanced computer-based testing with AI-powered question generation',
      href: '/cbt-test',
      demo: true
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time performance insights and comprehensive reporting',
      href: '/analytics',
      demo: true
    },
    {
      icon: '👥',
      title: 'Student Management',
      description: 'Complete student lifecycle management with profiles and tracking',
      href: '/students',
      demo: false
    },
    {
      icon: '👨‍🏫',
      title: 'Teacher Portal',
      description: 'Comprehensive teaching tools and resource management',
      href: '/teachers',
      demo: false
    },
    {
      icon: '🤖',
      title: 'AI Assistant',
      description: 'Intelligent tutoring and automated question generation',
      href: '/ai-chat',
      demo: true
    },
    {
      icon: '📈',
      title: 'Performance Dashboard',
      description: 'Interactive dashboards with modern visualizations',
      href: '/dashboard',
      demo: false
    }
  ];

  const stats = [
    { label: 'Active Students', value: '10,000+' },
    { label: 'Teachers', value: '500+' },
    { label: 'Tests Completed', value: '50,000+' },
    { label: 'Success Rate', value: '95%' }
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
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <button className="hidden md:block bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                    Sign In
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </Link>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4">
                <div className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      {item.name}
                    </a>
                  ))}
                  <Link href="/login">
                    <button className="text-left text-gray-700 hover:text-blue-600 font-medium">
                      Sign In
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                Next Generation
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                  Education Platform
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                Revolutionize education with AI-powered learning, comprehensive management tools, 
                and advanced analytics for students, teachers, and institutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cbt-test">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
                    Try Demo CBT Test
                  </button>
                </Link>
                <Link href="/register">
                  <button className="bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold border border-gray-300 hover:bg-gray-50 transition-all">
                    Start Free Trial
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plans Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your <span className="text-blue-600">Perfect Plan</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Scale your educational institution with our flexible pricing options
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  name: 'Starter',
                  price: 29,
                  features: ['Basic Analytics', 'Email Support', 'Core Features', '5GB Storage', 'Up to 100 Users'],
                  popular: false,
                  description: 'Perfect for small schools'
                },
                {
                  name: 'Professional',
                  price: 99,
                  features: ['Advanced Analytics', 'Priority Support', 'All Features', '50GB Storage', 'API Access', 'Up to 500 Users'],
                  popular: true,
                  description: 'Ideal for medium institutions'
                },
                {
                  name: 'Enterprise',
                  price: 299,
                  features: ['Custom Analytics', '24/7 Support', 'White Label', 'Unlimited Storage', 'Custom Integrations', 'Up to 2000 Users'],
                  popular: false,
                  description: 'Comprehensive enterprise solution'
                }
              ].map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 ${
                    plan.popular ? 'border-purple-500 scale-105' : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-gray-600">
                          <CheckCircle className="mr-2 text-green-600" size={16} />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push('/register')}
                      className={`w-full py-3 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                      }`}
                    >
                      Get Started
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Education
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our comprehensive suite of tools designed to enhance learning 
                and streamline educational management.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border border-gray-100"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <Link href={feature.href}>
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                      {feature.demo ? 'Try Demo' : 'Learn More'}
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Experience the Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Take a guided tour of our most popular features with interactive demos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  🎯 CBT Testing System
                </h3>
                <p className="text-gray-600 mb-6">
                  Experience our advanced computer-based testing platform with real-time 
                  feedback, AI-generated questions, and comprehensive analytics.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Instant results and feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">AI-powered question generation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Adaptive difficulty levels</span>
                  </li>
                </ul>
                <Link href="/cbt-test">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Start Demo Test
                  </button>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-20 bg-blue-50 rounded border-2 border-dashed border-blue-300"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-blue-600 rounded w-20"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Transform Education?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of educators and students already using our platform 
                to achieve better learning outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105">
                    Start Free Trial
                  </button>
                </Link>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
                  Schedule Demo
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <span className="text-xl font-bold">EduAI Platform</span>
                </div>
                <p className="text-gray-400">
                  Next generation education management platform with AI integration.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <div className="space-y-2">
                  <Link href="/cbt-test" className="block text-gray-400 hover:text-white transition-colors">
                    CBT Testing
                  </Link>
                  <Link href="/ai-chat" className="block text-gray-400 hover:text-white transition-colors">
                    AI Assistant
                  </Link>
                  <Link href="/analytics" className="block text-gray-400 hover:text-white transition-colors">
                    Analytics
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <div className="space-y-2">
                  <a href="#about" className="block text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                  <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                  <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 EduAI Platform. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;