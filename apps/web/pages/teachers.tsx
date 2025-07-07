
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Teacher {
  id: number;
  name: string;
  email: string;
  department?: string;
  subjects?: string[];
}

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    subjects: ''
  });

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setTeachers([
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@school.edu',
          department: 'Mathematics',
          subjects: ['Algebra', 'Calculus', 'Statistics']
        },
        {
          id: 2,
          name: 'Prof. Michael Chen',
          email: 'michael.chen@school.edu',
          department: 'Science',
          subjects: ['Physics', 'Chemistry', 'Biology']
        },
        {
          id: 3,
          name: 'Ms. Emily Rodriguez',
          email: 'emily.rodriguez@school.edu',
          department: 'English',
          subjects: ['Literature', 'Writing', 'Grammar']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newTeacher = {
        id: teachers.length + 1,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        subjects: formData.subjects.split(',').map(s => s.trim())
      };
      setTeachers([...teachers, newTeacher]);
      setFormData({ name: '', email: '', department: '', subjects: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  if (loading) {
    return (
      <Layout title="Teachers">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Teachers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Teacher
          </button>
        </div>

        {/* Add Teacher Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg border"
          >
            <h3 className="text-xl font-semibold mb-4">Add New Teacher</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Teacher Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Subjects (comma-separated)"
                value={formData.subjects}
                onChange={(e) => setFormData({...formData, subjects: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                  <p className="text-sm text-gray-600">{teacher.email}</p>
                  <p className="text-xs text-purple-600">{teacher.department}</p>
                </div>
              </div>
              
              {teacher.subjects && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Subjects:</p>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
