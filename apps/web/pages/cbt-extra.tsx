import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { isLoggedIn } from '../lib/auth';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import axios from 'axios';

interface CbtSubject {
  id: number;
  name: string;
}
interface CbtQuestion {
  id: number;
  subjectId: number;
  text: string;
  options: string[];
  answer: string;
  marks: number;
  explanation?: string;
}

export default function CbtExtraDashboard() {
  const [user, setUser] = useState<{name:string,role:string,email:string}|null>(null);
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    }
    // TODO: Fetch user info and check role (admin/teacher)
  }, []);

  // Edit state
  const [editingSubject, setEditingSubject] = useState<CbtSubject|null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<CbtQuestion|null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editOptions, setEditOptions] = useState<string[]>(['','','','']);
  const [editAnswer, setEditAnswer] = useState('');
  const [editMarks, setEditMarks] = useState(1);
  const [editExplanation, setEditExplanation] = useState('');

  // Edit subject handlers
  const handleEditSubject = (subj: CbtSubject) => {
    setEditingSubject(subj);
    setEditSubjectName(subj.name);
  };
  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingSubject) return;
    setLoading(true);
    try {
      await axios.put(`/api/cbt-subjects/${editingSubject.id}`, { name: editSubjectName });
      setEditingSubject(null);
      setEditSubjectName('');
      fetchSubjects();
      setSuccess('Subject updated');
    } catch {
      setError('Failed to update subject');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteSubject = async (id: number) => {
    if(!window.confirm('Delete this subject?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/cbt-subjects/${id}`);
      if(selectedSubject===id) setSelectedSubject(null);
      fetchSubjects();
      setSuccess('Subject deleted');
    } catch {
      setError('Failed to delete subject');
    } finally {
      setLoading(false);
    }
  };

  // Edit question handlers
  const handleEditQuestion = (q: CbtQuestion) => {
    setEditingQuestion(q);
    setEditQuestion(q.text);
    setEditOptions([...q.options]);
    setEditAnswer(q.answer);
    setEditMarks(q.marks);
    setEditExplanation(q.explanation || '');
  };
  const handleUpdateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!editingQuestion) return;
    setLoading(true);
    try {
      await axios.put(`/api/cbt-questions/${editingQuestion.id}`, {
        text: editQuestion,
        options: editOptions,
        answer: editAnswer,
        marks: editMarks,
        explanation: editExplanation,
      });
      setEditingQuestion(null);
      setEditQuestion('');
      setEditOptions(['','','','']);
      setEditAnswer('');
      setEditMarks(1);
      setEditExplanation('');
      if(selectedSubject) fetchQuestions(selectedSubject);
      setSuccess('Question updated');
    } catch {
      setError('Failed to update question');
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteQuestion = async (id: number) => {
    if(!window.confirm('Delete this question?')) return;
    setLoading(true);
    try {
      await axios.delete(`/api/cbt-questions/${id}`);
      if(selectedSubject) fetchQuestions(selectedSubject);
      setSuccess('Question deleted');
    } catch {
      setError('Failed to delete question');
    } finally {
      setLoading(false);
    }
  };

  const [subjects, setSubjects] = useState<CbtSubject[]>([]);
  const [questions, setQuestions] = useState<CbtQuestion[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number|null>(null);
  const [subjectName, setSubjectName] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<string[]>(['','','','']);
  const [answer, setAnswer] = useState('');
  const [marks, setMarks] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all subjects
  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cbt-subjects`);
      setSubjects(res.data);
    } catch {
      setError('Failed to fetch subjects');
    } finally {
      setLoading(false);
    }
  };
  // Fetch questions for selected subject
  const fetchQuestions = async (subjectId: number) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cbt-questions?subjectId=${subjectId}`);
      setQuestions(res.data.map((q: any) => ({...q, options: JSON.parse(q.options)})));
    } catch {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);
  useEffect(() => { if(selectedSubject) fetchQuestions(selectedSubject); }, [selectedSubject]);

  // Add new subject
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/cbt-subjects', { name: subjectName });
      setSubjectName('');
      fetchSubjects();
      setSuccess('Subject added');
    } catch {
      setError('Failed to add subject');
    } finally {
      setLoading(false);
    }
  };
  // Add new question
  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!selectedSubject) return setError('Select a subject');
    setLoading(true);
    try {
      await axios.post('/api/cbt-questions', {
        subjectId: selectedSubject,
        text: question,
        options,
        answer,
        marks,
        explanation,
      });
      setQuestion('');
      setOptions(['','','','']);
      setAnswer('');
      setExplanation('');
      fetchQuestions(selectedSubject);
      setSuccess('Question added');
    } catch {
      setError('Failed to add question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="CBT Extra Dashboard">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">CBT Extra Admin Dashboard</h1>
        {user && (
          <span className="text-sm text-gray-600">{user.name} ({user.role})</span>
        )}
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      {user && (user.role === 'admin' || user.role === 'teacher') ? (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h2 className="font-semibold text-blue-900 text-xl mb-3">Add Subject</h2>
          <form onSubmit={handleAddSubject} className="flex gap-2 my-2 items-center">
            <input value={subjectName} onChange={e=>setSubjectName(e.target.value)} required placeholder="Subject name" className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200 transition w-2/3"/>
            <button type="submit" className="px-6 py-2 bg-gradient-to-r from-blue-700 to-purple-700 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-semibold shadow transition-transform transform hover:scale-105">Add</button>
          </form>
        </motion.div>
      ) : user && (
        <div className="mb-8 text-center text-gray-500 font-semibold">You do not have permission to add subjects.</div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 mb-8"
      >
        <h2 className="font-semibold text-blue-900 text-xl mb-3">Subjects</h2>
        <ul className="mb-2 space-y-2">
          {subjects.map(subj => (
            <motion.li
              key={subj.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * subj.id }}
              className="flex items-center gap-2 bg-white/70 rounded-xl px-4 py-2 shadow hover:shadow-lg transition cursor-pointer"
            >
              {editingSubject && editingSubject.id===subj.id ? (
                user && (user.role === 'admin' || user.role === 'teacher') ? (
                  <form onSubmit={handleUpdateSubject} className="flex gap-2 items-center w-full">
                    <input value={editSubjectName} onChange={e=>setEditSubjectName(e.target.value)} className="border px-2 py-1 rounded-lg w-2/3" required />
                    <button type="submit" className="text-xs text-green-700 font-semibold">Save</button>
                    <button type="button" onClick={()=>setEditingSubject(null)} className="text-xs">Cancel</button>
                  </form>
                ) : (
                  <span className="text-gray-400 text-xs">No permission to edit.</span>
                )
              ) : (
                <>
                  <button
                    className={`underline ${selectedSubject===subj.id?'font-bold text-blue-700':''}`}
                    onClick={()=>setSelectedSubject(subj.id)}
                  >
                    {subj.name}
                  </button>
                  {user && (user.role === 'admin' || user.role === 'teacher') && (
                    <>
                      <button onClick={()=>handleEditSubject(subj)} className="text-xs text-green-700 font-semibold">Edit</button>
                      <button onClick={()=>handleDeleteSubject(subj.id)} className="text-xs text-red-600 font-semibold">Delete</button>
                    </>
                  )}
                </>
              )}
            </motion.li>
          ))}
        </ul>
      </motion.div>
      {selectedSubject && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 mb-8"
        >
          <h2 className="font-semibold text-blue-900 text-xl mb-3">Add Question</h2>
          {user && (user.role === 'admin' || user.role === 'teacher') ? (
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <input value={question} onChange={e=>setQuestion(e.target.value)} required placeholder="Question text" className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-200 transition w-full"/>
              <div className="flex flex-col gap-2">
                {options.map((opt,i)=>(
                  <input key={i} value={opt} onChange={e=>{
                    const newOpts = [...options]; newOpts[i]=e.target.value; setOptions(newOpts);
                  }} required placeholder={`Option ${i+1}`} className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-200 transition"/>
                ))}
              </div>
              <input value={answer} onChange={e=>setAnswer(e.target.value)} required placeholder="Correct answer" className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-200 transition w-full"/>
              <input type="number" value={marks} min={1} onChange={e=>setMarks(Number(e.target.value))} required placeholder="Marks" className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-200 transition w-full"/>
              <input value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Explanation (optional)" className="border px-4 py-2 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-100 transition w-full"/>
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-blue-600 hover:to-green-600 text-white rounded-xl font-semibold shadow transition-transform transform hover:scale-105">Add Question</button>
            </form>
          ) : (
            <div className="text-center text-gray-500 font-semibold">You do not have permission to add questions.</div>
          )}
        </motion.div>
      )}
      {selectedSubject && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="backdrop-blur-xl bg-white/40 border border-white/50 rounded-3xl shadow-2xl p-8 mb-8"
          >
            <h2 className="font-semibold text-blue-900 text-xl mb-3">Questions</h2>
            <ul className="space-y-4">
              {questions.map(q=>(
                <motion.li
                  key={q.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * q.id }}
                  className="bg-white/70 rounded-xl px-6 py-4 shadow hover:shadow-lg transition cursor-pointer"
                >
                  {editingQuestion && editingQuestion.id===q.id ? (
                    <form onSubmit={handleUpdateQuestion} className="space-y-2">
                      <input value={editQuestion} onChange={e=>setEditQuestion(e.target.value)} required className="border px-4 py-2 rounded-lg w-full"/>
                      <div className="flex flex-col gap-2">
                        {editOptions.map((opt,i)=>(
                          <input key={i} value={opt} onChange={e=>{
                            const newOpts = [...editOptions]; newOpts[i]=e.target.value; setEditOptions(newOpts);
                          }} required className="border px-4 py-2 rounded-lg"/>
                        ))}
                      </div>
                      <input value={editAnswer} onChange={e=>setEditAnswer(e.target.value)} required className="border px-4 py-2 rounded-lg w-full"/>
                      <input type="number" value={editMarks} min={1} onChange={e=>setEditMarks(Number(e.target.value))} required className="border px-4 py-2 rounded-lg w-full"/>
                      <input value={editExplanation} onChange={e=>setEditExplanation(e.target.value)} className="border px-4 py-2 rounded-lg w-full"/>
                      <button type="submit" className="text-xs text-green-700 font-bold mr-2">Save</button>
                      <button type="button" onClick={()=>setEditingQuestion(null)} className="text-xs">Cancel</button>
                    </form>
                  ) : (
                    <>
                      <div className="mb-1"><b>Q:</b> {q.text}</div>
                      <div className="mb-1"><b>Options:</b> {q.options.join(', ')}</div>
                      <div className="mb-1"><b>Answer:</b> {q.answer}</div>
                      <div className="mb-1"><b>Marks:</b> {q.marks}</div>
                      {q.explanation && <div className="mb-1"><b>Explanation:</b> {q.explanation}</div>}
                      {user && (user.role === 'admin' || user.role === 'teacher') && (
                        <>
                          <button onClick={()=>handleEditQuestion(q)} className="text-xs text-green-700 font-bold mr-2">Edit</button>
                          <button onClick={()=>handleDeleteQuestion(q.id)} className="text-xs text-red-600 font-bold">Delete</button>
                        </>
                      )}
                    </>
                  )}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
    </Layout>
  );
}
