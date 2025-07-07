
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

interface Student {
  id: number;
  name: string;
  email: string;
  classId?: number;
  class?: { name: string };
  user?: { name: string; email: string };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    classId: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ name: '', email: '', classId: '' });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Format data for API
        const studentsData = jsonData.map((row: any) => ({
          name: row.Name || row.name,
          email: row.Email || row.email,
          classId: row.ClassId || row.classId || row['Class ID'],
          schoolId: 1 // Default school ID
        }));

        setUploadProgress(50);
        
        const token = localStorage.getItem('token');
        const response = await axios.post('/api/students/bulk-upload', 
          { students: studentsData },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUploadProgress(100);
        alert(`Upload completed! Created: ${response.data.created}, Errors: ${response.data.errors}`);
        fetchStudents();
        setShowBulkUpload(false);
        setUploadProgress(0);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Error processing file. Please check the format.');
        setUploadProgress(0);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const downloadTemplate = () => {
    const template = [
      { Name: 'John Doe', Email: 'john@example.com', ClassId: 1 },
      { Name: 'Jane Smith', Email: 'jane@example.com', ClassId: 2 }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_template.xlsx');
  };

  if (loading) {
    return (
      <Layout title="Students">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Students">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowBulkUpload(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📊 Bulk Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Add Student Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg border"
          >
            <h3 className="text-xl font-semibold mb-4">Add New Student</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Student Name"
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
                type="number"
                placeholder="Class ID"
                value={formData.classId}
                onChange={(e) => setFormData({...formData, classId: e.target.value})}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="md:col-span-3 flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Student
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

        {/* Bulk Upload Modal */}
        {showBulkUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4">Bulk Upload Students</h3>
              <div className="space-y-4">
                <div>
                  <button
                    onClick={downloadTemplate}
                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    📥 Download Excel Template
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Upload Excel File</label>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBulkUpload(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {student.user?.name?.charAt(0) || student.name?.charAt(0) || '?'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {student.user?.name || student.name || 'Unknown'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {student.user?.email || student.email || 'No email'}
                  </p>
                  {student.class && (
                    <p className="text-xs text-blue-600">Class: {student.class.name}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No students found</p>
            <p className="text-gray-400">Add your first student to get started</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
