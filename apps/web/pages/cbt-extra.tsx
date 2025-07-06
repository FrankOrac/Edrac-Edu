import React, { useEffect, useState } from 'react';
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
      <div className="mb-8">
        <h2 className="font-semibold">Add Subject</h2>
        <form onSubmit={handleAddSubject} className="flex gap-2 my-2">
          <input value={subjectName} onChange={e=>setSubjectName(e.target.value)} required placeholder="Subject name" className="border px-2 py-1"/>
          <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Add</button>
        </form>
      </div>
      <div className="mb-8">
        <h2 className="font-semibold">Subjects</h2>
        <ul className="mb-2">
          {subjects.map(subj => (
            <li key={subj.id} className="flex items-center gap-2">
              {editingSubject && editingSubject.id===subj.id ? (
                <form onSubmit={handleUpdateSubject} className="flex gap-2 items-center">
                  <input value={editSubjectName} onChange={e=>setEditSubjectName(e.target.value)} className="border px-2 py-1" required />
                  <button type="submit" className="text-xs text-green-700">Save</button>
                  <button type="button" onClick={()=>setEditingSubject(null)} className="text-xs">Cancel</button>
                </form>
              ) : (
                <>
                  <button
                    className={`underline ${selectedSubject===subj.id?'font-bold text-blue-700':''}`}
                    onClick={()=>setSelectedSubject(subj.id)}>
                    {subj.name}
                  </button>
                  <button onClick={()=>handleEditSubject(subj)} className="text-xs text-green-700">Edit</button>
                  <button onClick={()=>handleDeleteSubject(subj.id)} className="text-xs text-red-600">Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {selectedSubject && (
        <div className="mb-8">
          <h2 className="font-semibold">Add Question</h2>
          <form onSubmit={handleAddQuestion} className="space-y-2">
            <input value={question} onChange={e=>setQuestion(e.target.value)} required placeholder="Question text" className="border px-2 py-1 w-full"/>
            <div className="flex flex-col gap-1">
              {options.map((opt,i)=>(
                <input key={i} value={opt} onChange={e=>{
                  const newOpts = [...options]; newOpts[i]=e.target.value; setOptions(newOpts);
                }} required placeholder={`Option ${i+1}`} className="border px-2 py-1"/>
              ))}
            </div>
            <input value={answer} onChange={e=>setAnswer(e.target.value)} required placeholder="Correct answer" className="border px-2 py-1 w-full"/>
            <input type="number" value={marks} min={1} onChange={e=>setMarks(Number(e.target.value))} required placeholder="Marks" className="border px-2 py-1 w-full"/>
            <input value={explanation} onChange={e=>setExplanation(e.target.value)} placeholder="Explanation (optional)" className="border px-2 py-1 w-full"/>
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded">Add Question</button>
          </form>
        </div>
      )}
      {selectedSubject && (
        <div>
          <h2 className="font-semibold">Questions</h2>
          <ul>
            {questions.map(q=>(
  <li key={q.id} className="mb-2 border p-2">
    {editingQuestion && editingQuestion.id===q.id ? (
      <form onSubmit={handleUpdateQuestion} className="space-y-2">
        <input value={editQuestion} onChange={e=>setEditQuestion(e.target.value)} required className="border px-2 py-1 w-full"/>
        <div className="flex flex-col gap-1">
          {editOptions.map((opt,i)=>(
            <input key={i} value={opt} onChange={e=>{
              const newOpts = [...editOptions]; newOpts[i]=e.target.value; setEditOptions(newOpts);
            }} required className="border px-2 py-1"/>
          ))}
        </div>
        <input value={editAnswer} onChange={e=>setEditAnswer(e.target.value)} required className="border px-2 py-1 w-full"/>
        <input type="number" value={editMarks} min={1} onChange={e=>setEditMarks(Number(e.target.value))} required className="border px-2 py-1 w-full"/>
        <input value={editExplanation} onChange={e=>setEditExplanation(e.target.value)} className="border px-2 py-1 w-full"/>
        <button type="submit" className="text-xs text-green-700 mr-2">Save</button>
        <button type="button" onClick={()=>setEditingQuestion(null)} className="text-xs">Cancel</button>
      </form>
    ) : (
      <>
        <div><b>Q:</b> {q.text}</div>
        <div><b>Options:</b> {q.options.join(', ')}</div>
        <div><b>Answer:</b> {q.answer}</div>
        <div><b>Marks:</b> {q.marks}</div>
        {q.explanation && <div><b>Explanation:</b> {q.explanation}</div>}
        <button onClick={()=>handleEditQuestion(q)} className="text-xs text-green-700 mr-2">Edit</button>
        <button onClick={()=>handleDeleteQuestion(q.id)} className="text-xs text-red-600">Delete</button>
      </>
    )}
  </li>
))}
          </ul>
        </div>
      )}
    </Layout>
  );
}
