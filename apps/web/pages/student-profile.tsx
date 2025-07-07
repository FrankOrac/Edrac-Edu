import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookOpen, Award, TrendingUp, Calendar, Bell, Target, Brain, Clock, Star } from 'lucide-react';

interface StudentStats {
  gpa: number;
  completedCourses: number;
  totalCredits: number;
  attendanceRate: number;
  rank: number;
  totalStudents: number;
  certificates: number;
  studyHours: number;
}

const StudentProfile = () => {
  const [stats, setStats] = useState<StudentStats>({
    gpa: 0,
    completedCourses: 0,
    totalCredits: 0,
    attendanceRate: 0,
    rank: 0,
    totalStudents: 0,
    certificates: 0,
    studyHours: 0,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        gpa: 3.85,
        completedCourses: 24,
        totalCredits: 78,
        attendanceRate: 94.5,
        rank: 15,
        totalStudents: 250,
        certificates: 5,
        studyHours: 145,
      });
      setLoading(false);
    }, 1000);
  }, []);

  const courses = [
    { name: 'Advanced Mathematics', progress: 85, grade: 'A-', color: 'from-blue-500 to-blue-600' },
    { name: 'Computer Science', progress: 92, grade: 'A+', color: 'from-green-500 to-green-600' },
    { name: 'Physics', progress: 78, grade: 'B+', color: 'from-purple-500 to-purple-600' },
    { name: 'Literature', progress: 88, grade: 'A', color: 'from-orange-500 to-orange-600' },
  ];

  const achievements = [
    { title: 'Dean\'s List', date: '2024-01', icon: '🏆', color: 'from-yellow-400 to-yellow-600' },
    { title: 'Perfect Attendance', date: '2023-12', icon: '📅', color: 'from-green-400 to-green-600' },
    { title: 'Math Competition Winner', date: '2023-11', icon: '🧮', color: 'from-blue-400 to-blue-600' },
    { title: 'Science Fair 1st Place', date: '2023-10', icon: '🔬', color: 'from-purple-400 to-purple-600' },
  ];

  const upcomingAssignments = [
    { title: 'Physics Lab Report', dueDate: '2024-02-20', subject: 'Physics', priority: 'high' },
    { title: 'Literature Essay', dueDate: '2024-02-22', subject: 'Literature', priority: 'medium' },
    { title: 'Math Problem Set', dueDate: '2024-02-25', subject: 'Mathematics', priority: 'low' },
  ];

  const StatCard = ({ title, value, subtitle, icon: Icon, color, suffix = '' }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full transform translate-x-16 -translate-y-16`}></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} text-white shadow-lg`}>
            <Icon size={24} />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}{suffix}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <Layout title="Student Profile">
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Student Dashboard">
      <div className="space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full transform translate-x-48 -translate-y-48"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full transform -translate-x-32 translate-y-32"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <User size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, John!</h1>
                <p className="text-blue-100 text-lg mb-4">Computer Science Major • Class of 2025</p>
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-semibold">GPA: {stats.gpa}</span>
                  </div>
                  <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    <span className="font-semibold">Rank: #{stats.rank}/{stats.totalStudents}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Current GPA"
            value={stats.gpa}
            subtitle="Excellent standing"
            icon={TrendingUp}
            color="from-green-500 to-green-600"
          />
          <StatCard
            title="Completed Courses"
            value={stats.completedCourses}
            subtitle={`${stats.totalCredits} credits earned`}
            icon={BookOpen}
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Attendance Rate"
            value={stats.attendanceRate}
            suffix="%"
            subtitle="Above average"
            icon={Calendar}
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            title="Study Hours"
            value={stats.studyHours}
            subtitle="This semester"
            icon={Clock}
            color="from-orange-500 to-orange-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Courses</h3>
            <div className="space-y-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{course.name}</h4>
                      <p className="text-gray-600">Current Grade: {course.grade}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">{course.progress}%</p>
                      <p className="text-sm text-gray-500">Complete</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-3 rounded-full bg-gradient-to-r ${course.color}`}
                    ></motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Assignments</h3>
            <div className="space-y-4">
              {upcomingAssignments.map((assignment, index) => (
                <motion.div
                  key={assignment.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    assignment.priority === 'high' ? 'border-red-500 bg-red-50' :
                    assignment.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-green-500 bg-green-50'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                  <p className="text-sm text-gray-600">{assignment.subject}</p>
                  <p className="text-sm text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`p-6 rounded-xl bg-gradient-to-r ${achievement.color} text-white text-center hover:shadow-lg transition-all`}
              >
                <div className="text-4xl mb-3">{achievement.icon}</div>
                <h4 className="font-semibold mb-2">{achievement.title}</h4>
                <p className="text-sm opacity-90">{achievement.date}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Take Assessment', icon: '📝', href: '/cbt-test', color: 'from-blue-500 to-blue-600' },
            { name: 'Study Materials', icon: '📚', href: '/library', color: 'from-green-500 to-green-600' },
            { name: 'AI Tutor', icon: '🤖', href: '/ai-chat', color: 'from-purple-500 to-purple-600' },
            { name: 'Grades & Reports', icon: '📊', href: '/results', color: 'from-orange-500 to-orange-600' },
          ].map((action, index) => (
            <motion.a
              key={action.name}
              href={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white hover:shadow-xl transition-all group`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</div>
              <h3 className="font-semibold text-lg">{action.name}</h3>
            </motion.a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;