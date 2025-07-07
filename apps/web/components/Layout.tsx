
import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/students', label: 'Students', icon: '👥' },
  { href: '/teachers', label: 'Teachers', icon: '👨‍🏫' },
  { href: '/parents', label: 'Parents', icon: '👨‍👩‍👧‍👦' },
  { href: '/attendance', label: 'Attendance', icon: '✅' },
  { href: '/exams', label: 'Exams', icon: '📝' },
  { href: '/cbt-test', label: 'CBT Test', icon: '💻' },
  { href: '/cbt-extra', label: 'CBT Extra', icon: '🎯' },
  { href: '/cbt-analytics', label: 'CBT Analytics', icon: '📈' },
  { href: '/results', label: 'Results', icon: '🏆' },
  { href: '/assignments', label: 'Assignments', icon: '📋' },
  { href: '/transcripts', label: 'Transcripts', icon: '📜' },
  { href: '/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/events', label: 'Events', icon: '📅' },
  { href: '/transport', label: 'Transport', icon: '🚌' },
  { href: '/inventory', label: 'Inventory', icon: '📦' },
  { href: '/library', label: 'Library', icon: '📚' },
  { href: '/forums', label: 'Forums', icon: '💬' },
  { href: '/payments', label: 'Payments', icon: '💳' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/gamification', label: 'Gamification', icon: '🎮' },
  { href: '/certificates', label: 'Certificates', icon: '🎓' },
  { href: '/alumni', label: 'Alumni', icon: '🎓' },
  { href: '/groups', label: 'Groups', icon: '👥' },
  { href: '/plugins', label: 'Plugins', icon: '🔌' },
  { href: '/ai-chat', label: 'AI Chat', icon: '🤖' },
];

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLinks = navLinks.filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white shadow-2xl lg:relative lg:translate-x-0"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-blue-700/50">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent"
                >
                  Edu AI Platform
                </motion.div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-blue-700/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Search */}
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-blue-800/50 border border-blue-600 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto px-4 pb-4">
                <ul className="space-y-1">
                  {filteredLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link href={link.href} legacyBehavior>
                        <a
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                            router.pathname === link.href
                              ? 'bg-blue-600 text-white shadow-lg'
                              : 'text-blue-100 hover:bg-blue-700/50 hover:text-white'
                          }`}
                        >
                          <span className="text-lg group-hover:scale-110 transition-transform">
                            {link.icon}
                          </span>
                          <span className="font-medium">{link.label}</span>
                        </a>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>

              {/* User section */}
              <div className="p-4 border-t border-blue-700/50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-blue-200 hover:text-white hover:bg-red-600/20 rounded-lg transition-colors"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
