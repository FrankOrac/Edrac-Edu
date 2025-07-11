import React, { Suspense, lazy } from 'react';
import Head from 'next/head';
import Link from 'next/link';

// Lazy load heavy components
const Layout = lazy(() => import('../components/Layout'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
  </div>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>EduAI Platform - AI-Powered Education Management</title>
        <meta name="description" content="Complete school management system with AI integration" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Suspense fallback={<LoadingSpinner />}>
        <Layout>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    Welcome to <span className="text-blue-600">EduAI Platform</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    The ultimate AI-powered educational ecosystem for schools and learners. 
                    Manage everything from attendance to alumni networks with intelligent automation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/dashboard" 
                      className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Get Started
                    </Link>
                    <Link 
                      href="/login" 
                      className="border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Features */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                  Everything You Need for Modern Education
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-lg bg-blue-50">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Smart Learning</h3>
                    <p className="text-gray-600">AI-powered personalized learning paths and adaptive testing</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-green-50">
                    <div className="w-12 h-12 bg-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Complete Management</h3>
                    <p className="text-gray-600">From attendance to alumni networks, manage everything in one place</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-purple-50">
                    <div className="w-12 h-12 bg-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-gray-600">Predictive insights and performance tracking with AI</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Layout>
      </Suspense>
    </>
  );
}