import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const featureCards = [
  {
    icon: (
      <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20l9 2-7-9 7-9-9 2-9-2 7 9-7 9z" /></svg>
    ),
    title: 'AI-Powered Dashboard',
    desc: 'Personalized insights and analytics for every user role.',
    features: ['Real-time analytics', 'Predictive modeling', 'Smart notifications']
  },
  {
    icon: (
      <svg className="w-14 h-14 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
    ),
    title: 'CBT Extra',
    desc: 'Advanced computer-based testing with time limits and analytics.',
    features: ['Timed assessments', 'Auto-grading', 'Performance tracking']
  },
  {
    icon: (
      <svg className="w-14 h-14 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M8 21h8" /></svg>
    ),
    title: 'Seamless Management',
    desc: 'Effortlessly manage students, teachers, and school operations.',
    features: ['Bulk Excel uploads', 'Automated workflows', 'Role-based access']
  },
  {
    icon: (
      <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /></svg>
    ),
    title: 'Smart Attendance',
    desc: 'Automated attendance tracking with QR codes and analytics.',
    features: ['QR code scanning', 'Biometric integration', 'Parent notifications']
  },
  {
    icon: (
      <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14,2 14,8 20,8" /></svg>
    ),
    title: 'Digital Transcripts',
    desc: 'Secure, blockchain-verified academic records and certificates.',
    features: ['Blockchain security', 'Instant verification', 'Digital signatures']
  },
  {
    icon: (
      <svg className="w-14 h-14 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM9 9h6v6H9z" /></svg>
    ),
    title: 'Gamification',
    desc: 'Engage students with points, badges, and achievement systems.',
    features: ['Achievement badges', 'Leaderboards', 'Reward systems']
  }
];

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-purple-600 to-blue-300 overflow-hidden font-sans">
      {/* Glassmorphic Card */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 mt-20 mb-8 w-full max-w-3xl px-6"
      >
        <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl shadow-2xl p-12 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-purple-700 to-blue-400 drop-shadow mb-4"
          >
            Edu AI Platform
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-2xl md:text-3xl text-blue-900/90 mb-8 font-medium"
          >
            The future of education. AI-powered, beautiful, and interactive.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link href="/login" legacyBehavior>
              <a className="px-10 py-4 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl text-xl font-bold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200">Get Started</a>
            </Link>
            <Link href="/cbt-extra" legacyBehavior>
              <a className="px-10 py-4 bg-gradient-to-r from-purple-700 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl text-xl font-bold shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-200">Try CBT Extra</a>
            </Link>
          </motion.div>
        </div>
      </motion.section>
      {/* Feature Cards */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.25 } } }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full px-8 mb-24"
      >
        {featureCards.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 + idx * 0.2 }}
            className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-blue-900">{feature.title}</h3>
            <p className="text-blue-700/80 text-lg mb-4">{feature.desc}</p>
            <ul className="space-y-2 text-sm text-blue-600">
              {feature.features.map((item, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.section>
      {/* Decorative Premium SVG Illustration */}
      <motion.img
        src="https://cdn.jsdelivr.net/gh/edent/SuperTinyIcons/images/svg/graduation-cap.svg"
        alt="Premium Education Illustration"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 1.5, delay: 1.2 }}
        className="absolute bottom-10 right-10 w-40 md:w-60 z-0 select-none drop-shadow-2xl opacity-80"
      />
      {/* Animated Gradient Blobs for Depth */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.18 }}
        transition={{ duration: 1.8, delay: 0.2 }}
        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-purple-400 via-blue-300 to-blue-100 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.13 }}
        transition={{ duration: 2.2, delay: 0.5 }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-blue-300 via-purple-200 to-blue-50 rounded-full blur-2xl z-0"
      />
    </main>
  );
}
