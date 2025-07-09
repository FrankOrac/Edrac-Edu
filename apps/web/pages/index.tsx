import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, Users, BarChart3, Brain, Star, Menu, X, Home, ArrowLeft, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Learning",
      description: "Intelligent tutoring system that adapts to each student's learning style and pace."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "CBT Testing Platform",
      description: "Comprehensive computer-based testing with real-time analytics and automated grading."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "School Management",
      description: "Complete management system for students, teachers, parents, and administrators."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Detailed insights and performance tracking for informed decision making."
    }
  ];

  const plans = [
    {
      name: "Basic",
      price: "$49",
      period: "/month",
      description: "Perfect for small schools",
      features: [
        "Up to 500 students",
        "Basic CBT testing",
        "Student management",
        "Email support",
        "Standard analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      description: "Ideal for growing institutions",
      features: [
        "Up to 2,000 students",
        "Advanced AI features",
        "Parent portal",
        "Priority support",
        "Advanced analytics",
        "Custom branding"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$399",
      period: "/month",
      description: "For large educational institutions",
      features: [
        "Unlimited students",
        "Full AI suite",
        "Multi-campus support",
        "24/7 dedicated support",
        "Custom integrations",
        "White-label solution"
      ],
      popular: false
    }
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
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">EduAI</span>
              </div>

              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#features" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                  <a href="#pricing" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">Pricing</a>
                  <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</a>
                  <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Sign In
                  </Link>
                </div>
              </div>

              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-gray-900 p-2"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-t border-gray-200"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Features</a>
                  <a href="#pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">Pricing</a>
                  <a href="#about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">About</a>
                  <Link href="/login" className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-lg mx-3 text-center">
                    Sign In
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                The Future of <span className="text-blue-600">Education</span> is Here
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              >
                Comprehensive education management platform powered by AI. Streamline operations, enhance learning outcomes, and empower educators with cutting-edge technology.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 flex items-center justify-center gap-2">
                  Try Demo <Brain className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Powerful Features for Modern Education
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to manage, teach, and learn in one comprehensive platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-blue-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Flexible pricing options to suit institutions of all sizes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`rounded-2xl p-8 shadow-lg ${
                    plan.popular 
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200 scale-105' 
                      : 'bg-white text-gray-900'
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-white text-blue-600 text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-green-500'}`} />
                        <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-gray-100'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Get Started
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-blue-400" />
                  <span className="ml-2 text-xl font-bold">EduAI</span>
                </div>
                <p className="text-gray-400">
                  Revolutionizing education through AI-powered technology and comprehensive management solutions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                  <li><Link href="/login" className="hover:text-white">Login</Link></li>
                  <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white">Documentation</a></li>
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Status</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#about" className="hover:text-white">About</a></li>
                  <li><a href="#" className="hover:text-white">Privacy</a></li>
                  <li><a href="#" className="hover:text-white">Terms</a></li>
                  <li><a href="#" className="hover:text-white">Careers</a></li>
                </ul>
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
}