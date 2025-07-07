

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { isLoggedIn } from '../lib/auth';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  class: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  parentName: string;
  parentPhone: string;
  profileImage?: string;
  bloodGroup: string;
  medicalInfo?: string;
}

interface AcademicRecord {
  subject: string;
  marks: number;
  grade: string;
  examType: string;
  date: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
}

const StudentProfile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [student, setStudent] = useState<Student | null>(null);
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'academic' | 'attendance' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setStudent({
        id: 1,
        name: 'John Doe',
        email: 'john.doe@school.edu',
        phone: '+1-234-567-8900',
        address: '123 Main St, City, State 12345',
        dateOfBirth: '2005-06-15',
        class: '10th Grade',
        section: 'A',
        rollNumber: '2023001',
        admissionDate: '2023-08-15',
        parentName: 'Robert Doe',
        parentPhone: '+1-234-567-8901',
        bloodGroup: 'O+',
        medicalInfo: 'No known allergies'
      });

      setAcademicRecords([
        { subject: 'Mathematics', marks: 92, grade: 'A', examType: 'Mid-term', date: '2024-01-15' },
        { subject: 'Physics', marks: 88, grade: 'B+', examType: 'Mid-term', date: '2024-01-16' },
        { subject: 'Chemistry', marks: 85, grade: 'B', examType: 'Mid-term', date: '2024-01-17' },
        { subject: 'English', marks: 90, grade: 'A', examType: 'Mid-term', date: '2024-01-18' },
        { subject: 'History', marks: 87, grade: 'B+', examType: 'Mid-term', date: '2024-01-19' },
      ]);

      setAttendance([
        { date: '2024-01-15', status: 'present' },
        { date: '2024-01-16', status: 'present' },
        { date: '2024-01-17', status: 'late' },
        { date: '2024-01-18', status: 'present' },
        { date: '2024-01-19', status: 'absent' },
      ]);

      setLoading(false);
    }, 1000);
  }, [router, id]);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B+': return 'text-blue-600 bg-blue-100';
      case 'B': return 'text-yellow-600 bg-yellow-100';
      case 'C': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'late': return 'text-yellow-600 bg-yellow-100';
      case 'absent': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <Layout title="Student Profile">
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout title="Student Profile">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h2>
          <p className="text-gray-600">The requested student profile could not be found.</p>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'academic', name: 'Academic Records', icon: '📚' },
    { id: 'attendance', name: 'Attendance', icon: '✅' },
    { id: 'profile', name: 'Profile Details', icon: '👤' },
  ];

  return (
    <Layout title={`${student.name} - Profile`}>
      <div className="space-y-6">
        {/* Student Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
              {student.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
              <div className="flex flex-wrap gap-4 text-blue-100">
                <span>Roll: {student.rollNumber}</span>
                <span>Class: {student.class} - {student.section}</span>
                <span>Email: {student.email}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">92%</div>
              <div className="text-blue-100">Overall Grade</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-4">Academic Performance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Average Score:</span>
                      <span className="font-bold">88.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Class Rank:</span>
                      <span className="font-bold">3rd</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subjects:</span>
                      <span className="font-bold">5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-blue-800 mb-4">Attendance</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Present Days:</span>
                      <span className="font-bold">145</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Days:</span>
                      <span className="font-bold">160</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className="font-bold text-green-600">90.6%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-purple-800 mb-4">Recent Activity</h3>
                  <div className="space-y-2 text-sm">
                    <div>✅ Submitted Physics Assignment</div>
                    <div>📝 Completed Math Quiz</div>
                    <div>📚 Borrowed Library Book</div>
                    <div>🎯 Achieved Excellence Badge</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Records</h3>
                <div className="overflow-x-auto">
                  <table className="w-full bg-white rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Subject</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Marks</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Grade</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Exam Type</th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-900">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {academicRecords.map((record, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">{record.subject}</td>
                          <td className="px-6 py-4 text-gray-900">{record.marks}%</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(record.grade)}`}>
                              {record.grade}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{record.examType}</td>
                          <td className="px-6 py-4 text-gray-600">{record.date}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Attendance Records</h3>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {attendance.map((record, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${getAttendanceColor(record.status)} border-opacity-50`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{new Date(record.date).toLocaleDateString()}</div>
                        <div className="text-sm capitalize mt-1">{record.status}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Full Name', value: student.name },
                      { label: 'Email', value: student.email },
                      { label: 'Phone', value: student.phone },
                      { label: 'Date of Birth', value: student.dateOfBirth },
                      { label: 'Blood Group', value: student.bloodGroup },
                      { label: 'Address', value: student.address },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-700">{item.label}:</span>
                        <span className="text-gray-900">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Information</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Roll Number', value: student.rollNumber },
                      { label: 'Class', value: student.class },
                      { label: 'Section', value: student.section },
                      { label: 'Admission Date', value: student.admissionDate },
                      { label: 'Parent Name', value: student.parentName },
                      { label: 'Parent Phone', value: student.parentPhone },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-700">{item.label}:</span>
                        <span className="text-gray-900">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;

