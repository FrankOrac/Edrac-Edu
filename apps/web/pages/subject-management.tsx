
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'core' | 'elective' | 'vocational' | 'trade';
  level: 'primary' | 'secondary' | 'tertiary';
  examType: 'WAEC' | 'NECO' | 'JAMB' | 'NABTEB' | 'Primary' | 'All';
  isCustom?: boolean;
}

const SubjectManagement = () => {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [filters, setFilters] = useState({
    level: '',
    category: '',
    examType: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    category: 'core' as const,
    level: 'secondary' as const,
    examType: 'All' as const
  });

  useEffect(() => {
    fetchSubjects();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.level) queryParams.append('level', filters.level);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.examType) queryParams.append('examType', filters.examType);

      const response = await fetch(`/api/cbt-subjects?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.subjects);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSubject ? `/api/cbt-subjects/${editingSubject.id}` : '/api/cbt-subjects';
      const method = editingSubject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowForm(false);
        setEditingSubject(null);
        resetForm();
        fetchSubjects();
      }
    } catch (error) {
      console.error('Error saving subject:', error);
    }
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description,
      category: subject.category,
      level: subject.level,
      examType: subject.examType
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        const response = await fetch(`/api/cbt-subjects/${id}`, {
          method: 'DELETE',
        });

        const data = await response.json();
        
        if (data.success) {
          fetchSubjects();
        }
      } catch (error) {
        console.error('Error deleting subject:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      category: 'core',
      level: 'secondary',
      examType: 'All'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return 'bg-blue-100 text-blue-800';
      case 'elective': return 'bg-green-100 text-green-800';
      case 'vocational': return 'bg-purple-100 text-purple-800';
      case 'trade': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'primary': return 'bg-yellow-100 text-yellow-800';
      case 'secondary': return 'bg-indigo-100 text-indigo-800';
      case 'tertiary': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
            <p className="text-gray-600 mt-2">Manage Nigeria curriculum subjects and add custom subjects</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingSubject(null);
              resetForm();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New Subject
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Filter Subjects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={filters.level}
                onChange={(e) => setFilters({...filters, level: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
                <option value="tertiary">Tertiary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                <option value="core">Core</option>
                <option value="elective">Elective</option>
                <option value="vocational">Vocational</option>
                <option value="trade">Trade</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
              <select
                value={filters.examType}
                onChange={(e) => setFilters({...filters, examType: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Exam Types</option>
                <option value="WAEC">WAEC</option>
                <option value="NECO">NECO</option>
                <option value="JAMB">JAMB</option>
                <option value="NABTEB">NABTEB</option>
                <option value="Primary">Primary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{subject.name}</h3>
                  <p className="text-sm text-gray-600">{subject.code}</p>
                </div>
                {subject.isCustom && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    Custom
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">{subject.description}</p>
              
              <div className="space-y-2 mb-4">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(subject.category)}`}>
                  {subject.category}
                </span>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 ${getLevelColor(subject.level)}`}>
                  {subject.level}
                </span>
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium ml-2 bg-gray-100 text-gray-800">
                  {subject.examType}
                </span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Edit
                </button>
                {subject.isCustom && (
                  <button
                    onClick={() => handleDelete(subject.id)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="core">Core</option>
                      <option value="elective">Elective</option>
                      <option value="vocational">Vocational</option>
                      <option value="trade">Trade</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({...formData, level: e.target.value as any})}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="primary">Primary</option>
                      <option value="secondary">Secondary</option>
                      <option value="tertiary">Tertiary</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="JAMB">JAMB</option>
                    <option value="NABTEB">NABTEB</option>
                    <option value="Primary">Primary</option>
                  </select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingSubject ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubjectManagement;
