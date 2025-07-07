

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, logout, isLoggedIn } from '../lib/auth';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: number;
  subItems?: NavItem[];
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'EduAI Platform' }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    if (isLoggedIn()) {
      setUser(getUser());
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const navGroups = [
    {
      name: 'Dashboard',
      items: [
        { name: 'Overview', href: '/dashboard', icon: '📊' },
        { name: 'Analytics', href: '/analytics', icon: '📈' },
      ]
    },
    {
      name: 'Academic',
      items: [
        { name: 'Students', href: '/students', icon: '👥', badge: 12 },
        { name: 'Teachers', href: '/teachers', icon: '👨‍🏫' },
        { name: 'Parents', href: '/parents', icon: '👨‍👩‍👧‍👦' },
        { name: 'Classes', href: '/classes', icon: '🏫' },
        { name: 'Subjects', href: '/subjects', icon: '📚' },
      ]
    },
    {
      name: 'Assessment',
      items: [
        { name: 'Exams', href: '/exams', icon: '📝' },
        { name: 'CBT Tests', href: '/cbt-test', icon: '💻' },
        { name: 'CBT Analytics', href: '/cbt-analytics', icon: '📊' },
        { name: 'CBT Management', href: '/cbt-extra', icon: '⚙️' },
        { name: 'Results', href: '/results', icon: '🏆' },
        { name: 'Assignments', href: '/assignments', icon: '📋' },
      ]
    },
    {
      name: 'Operations',
      items: [
        { name: 'Attendance', href: '/attendance', icon: '✅' },
        { name: 'Events', href: '/events', icon: '📅' },
        { name: 'Transport', href: '/transport', icon: '🚌' },
        { name: 'Library', href: '/library', icon: '📖' },
        { name: 'Inventory', href: '/inventory', icon: '📦' },
      ]
    },
    {
      name: 'Communication',
      items: [
        { name: 'Notifications', href: '/notifications', icon: '🔔', badge: 5 },
        { name: 'Forums', href: '/forums', icon: '💬' },
        { name: 'AI Chat', href: '/ai-chat', icon: '🤖' },
        { name: 'AI Endpoints', href: '/ai-endpoints', icon: '🔗' },
      ]
    },
    {
      name: 'Management',
      items: [
        { name: 'Schools', href: '/schools', icon: '🏢' },
        { name: 'Payments', href: '/payments', icon: '💳' },
        { name: 'Certificates', href: '/certificates', icon: '🎓' },
        { name: 'Transcripts', href: '/transcripts', icon: '📄' },
        { name: 'Alumni', href: '/alumni', icon: '🎓' },
      ]
    },
    {
      name: 'System',
      items: [
        { name: 'Groups', href: '/groups', icon: '👥' },
        { name: 'Gamification', href: '/gamification', icon: '🎮' },
        { name: 'Plugins', href: '/plugins', icon: '🔌' },
      ]
    }
  ];

  const isActive = (href: string) => router.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <title>{title}</title>
      
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-white/95 backdrop-blur-xl border-r border-white/20 shadow-2xl lg:translate-x-0 transition-transform duration-300`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              E
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EduAI Platform</h1>
              <p className="text-sm text-gray-600">Management System</p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        {user && (
          <div className="p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {navGroups.map((group) => (
              <div key={group.name} className="mb-4">
                <button
                  onClick={() => toggleGroup(group.name)}
                  className="w-full flex items-center justify-between p-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span>{group.name}</span>
                  <motion.span
                    animate={{ rotate: expandedGroups.includes(group.name) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400"
                  >
                    ▶
                  </motion.span>
                </button>
                
                <AnimatePresence>
                  {expandedGroups.includes(group.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                        {group.items.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <motion.div
                              whileHover={{ x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                                isActive(item.href)
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="flex-1 font-medium">{item.name}</span>
                              {item.badge && (
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  isActive(item.href)
                                    ? 'bg-white/20 text-white'
                                    : 'bg-blue-100 text-blue-600'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="p-4 border-t border-gray-200/50">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 flex flex-col justify-center gap-1">
                    <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                    <div className="w-full h-0.5 bg-gray-600 rounded"></div>
                  </div>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">System Online</span>
                </div>
                {user && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Welcome, {user.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Layout;

