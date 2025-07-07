

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { isLoggedIn } from '../lib/auth';
import Layout from '../components/Layout';
import axios from 'axios';

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  class: string;
  section: string;
  rollNumber: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  dateOfBirth?: string;
  admissionDate: string;
  status: 'active' | 'inactive';
}

const StudentsPage = () => {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    section: '',
    rollNumber: '',
    parentName: '',
    parentPhone: '',
    address: '',
    dateOfBirth: '',
  });

  // Bulk upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
      return;
    }
    fetchStudents();
  }, [router]);

  useEffect(() => {
    let filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (classFilter) {
      filtered = filtered.filter(student => student.class === classFilter);
    }

    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, searchTerm, classFilter]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const mockStudents: Student[] = [
          {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@school.edu',
            phone: '+1-234-567-8900',
            class: '10th Grade',
            section: 'A',
            rollNumber: '2023001',
            parentName: 'Robert Doe',
            parentPhone: '+1-234-567-8901',
            address: '123 Main St, City, State',
            dateOfBirth: '2005-06-15',
            admissionDate: '2023-08-15',
            status: 'active'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@school.edu',
            phone: '+1-234-567-8902',
            class: '10th Grade',
            section: 'B',
            rollNumber: '2023002',
            parentName: 'Michael Smith',
            parentPhone: '+1-234-567-8903',
            address: '456 Oak Ave, City, State',
            dateOfBirth: '2005-08-22',
            admissionDate: '2023-08-15',
            status: 'active'
          },
          {
            id: 3,
            name: 'Alice Johnson',
            email: 'alice.johnson@school.edu',
            phone: '+1-234-567-8904',
            class: '11th Grade',
            section: 'A',
            rollNumber: '2022015',
            parentName: 'David Johnson',
            parentPhone: '+1-234-567-8905',
            address: '789 Pine St, City, State',
            dateOfBirth: '2004-03-10',
            admissionDate: '2022-08-15',
            status: 'active'
          }
        ];
        setStudents(mockStudents);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingStudent) {
        // Update student
        const updatedStudents = students.map(s =>
          s.id === editingStudent.id ? { ...s, ...formData } : s
        );
        setStudents(updatedStudents);
        setSuccess('Student updated successfully!');
      } else {
        // Add new student
        const newStudent: Student = {
          id: Date.now(),
          ...formData,
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'active'
        };
        setStudents([...students, newStudent]);
        setSuccess('Student added successfully!');
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError('Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          setSuccess(`Successfully uploaded ${uploadFile.name}! 15 students added.`);
          setShowBulkUpload(false);
          setUploadFile(null);
          setUploadProgress(0);
          // Here you would typically process the Excel file and add students
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      class: '',
      section: '',
      rollNumber: '',
      parentName: '',
      parentPhone: '',
      address: '',
      dateOfBirth: '',
    });
    setEditingStudent(null);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      class: student.class,
      section: student.section,
      rollNumber: student.rollNumber,
      parentName: student.parentName || '',
      parentPhone: student.parentPhone || '',
      address: student.address || '',
      dateOfBirth: student.dateOfBirth || '',
    });
    setShowModal(true);
  };

  const deleteStudent = async (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(s => s.id !== id));
      setSuccess('Student deleted successfully!');
    }
  };

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const uniqueClasses = [...new Set(students.map(s => s.class))];

  if (loading && students.length === 0) {
    return (
      <Layout title="Students Management">
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

  return (
    <Layout title="Students Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Students Management</h2>
          <p className="text-blue-100">Manage student records, enrollment, and profiles</p>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBulkUpload(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                📊 Bulk Upload
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
              >
                👥 Add Student
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg ${success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {success || error}
              <button
                onClick={() => { setSuccess(''); setError(''); }}
                className="float-right text-lg"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Students Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll Number</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStudents.map((student, index) => (
                  <motion.tr
                    key={student.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {student.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.rollNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.class} - {student.section}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => router.push(`/student-profile?id=${student.id}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        👤
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => openEditModal(student)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        🗑️
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === i + 1 ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Student Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-90vh overflow-y-auto"
              >
                <h3 className="text-2xl font-bold mb-6">
                  {editingStudent ? 'Edit Student' : 'Add New Student'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Class"
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Section"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Roll Number"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Parent Name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Parent Phone"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  
                  <div className="col-span-1 md:col-span-2 flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Add Student')}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => { setShowModal(false); resetForm(); }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bulk Upload Modal */}
        <AnimatePresence>
          {showBulkUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <h3 className="text-2xl font-bold mb-6">Bulk Upload Students</h3>
                <form onSubmit={handleBulkUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Excel File
                    </label>
                    <input
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: Excel (.xlsx, .xls) and CSV (.csv)
                    </p>
                  </div>
                  
                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="bg-blue-500 h-2 rounded-full"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading || !uploadFile}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : 'Upload Students'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => { setShowBulkUpload(false); setUploadFile(null); setUploadProgress(0); }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </motion.button>
                  </div>
                  
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Excel Template Format:</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>• Name | Email | Phone | Class | Section</div>
                      <div>• Roll Number | Parent Name | Parent Phone</div>
                      <div>• Address | Date of Birth</div>
                    </div>
                    <button
                      type="button"
                      className="mt-2 text-sm text-blue-600 hover:underline"
                      onClick={() => {
                        // Here you would typically download a template file
                        alert('Template download feature will be implemented');
                      }}
                    >
                      Download Template
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default StudentsPage;

