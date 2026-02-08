import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, Teacher, TimetableEntry, FeedbackSubmission } from '@/types';
import { mockStudents, mockTeachers, mockTimetable, mockFeedback } from '@/data/mockData';
import Papa from 'papaparse';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  timetable: TimetableEntry[];
  feedback: FeedbackSubmission[];
  uploadStudentsCSV: (file: File) => Promise<void>;
  uploadTeachersCSV: (file: File) => Promise<void>;
  uploadTimetableCSV: (file: File) => Promise<void>;
  submitFeedback: (fb: FeedbackSubmission) => void;
  getSubmittedKeys: () => string[];
  getTeacherSubjects: (teacherEmail: string) => TimetableEntry[];
  getClassSubjects: (className: string) => (TimetableEntry & { teacherName: string })[];
  getTeacherFeedback: (teacherEmail: string) => FeedbackSubmission[];
  getStudentCountByClass: (className: string) => number;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be inside DataProvider');
  return ctx;
};

function loadFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(() => loadFromStorage('feedloop_students', mockStudents));
  const [teachers, setTeachers] = useState<Teacher[]>(() => loadFromStorage('feedloop_teachers', mockTeachers));
  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => loadFromStorage('feedloop_timetable', mockTimetable));
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>(() => loadFromStorage('feedloop_feedback', mockFeedback));

  useEffect(() => { localStorage.setItem('feedloop_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('feedloop_teachers', JSON.stringify(teachers)); }, [teachers]);
  useEffect(() => { localStorage.setItem('feedloop_timetable', JSON.stringify(timetable)); }, [timetable]);
  useEffect(() => { localStorage.setItem('feedloop_feedback', JSON.stringify(feedback)); }, [feedback]);

  const parseCSV = <T,>(file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (h: string) => h.trim(),
        complete: (results) => {
          const cleaned = results.data.filter((row: any) =>
            Object.values(row).some(v => v !== null && v !== undefined && String(v).trim() !== '')
          ) as T[];
          resolve(cleaned);
        },
        error: (err: any) => reject(err),
      });
    });
  };

  const uploadStudentsCSV = async (file: File) => {
    const data = await parseCSV<any>(file);
    const mapped: Student[] = data.map(r => ({
      registerNumber: r.RegisterNumber || r.registerNumber || '',
      name: r.Name || r.name || '',
      email: (r.Email || r.email || '').trim().toLowerCase(),
      class: r.Class || r.class || '',
    })).filter(s => s.email && s.name);
    setStudents(mapped);
  };

  const uploadTeachersCSV = async (file: File) => {
    const data = await parseCSV<any>(file);
    const mapped: Teacher[] = data.map(r => ({
      teacherId: r.TeacherID || r.teacherId || '',
      name: r.Name || r.name || '',
      email: (r.Email || r.email || '').trim().toLowerCase(),
      department: r.Department || r.department || '',
    })).filter(t => t.email && t.name);
    setTeachers(mapped);
  };

  const uploadTimetableCSV = async (file: File) => {
    const data = await parseCSV<any>(file);
    const mapped: TimetableEntry[] = data.map(r => ({
      class: r.Class || r.class || '',
      teacherEmail: (r.TeacherEmail || r.teacherEmail || '').trim().toLowerCase(),
      subject: r.Subject || r.subject || '',
    })).filter(t => t.class && t.teacherEmail && t.subject);
    setTimetable(mapped);
  };

  const submitFeedback = (fb: FeedbackSubmission) => {
    setFeedback(prev => [...prev, fb]);
    const keys = JSON.parse(localStorage.getItem('feedloop_submitted') || '[]');
    keys.push(`${fb.class}_${fb.teacherEmail}_${fb.subject}`);
    localStorage.setItem('feedloop_submitted', JSON.stringify(keys));
  };

  const getSubmittedKeys = (): string[] => {
    try { return JSON.parse(localStorage.getItem('feedloop_submitted') || '[]'); } catch { return []; }
  };

  const getTeacherSubjects = (teacherEmail: string) =>
    timetable.filter(t => t.teacherEmail.toLowerCase() === teacherEmail.toLowerCase());

  const getClassSubjects = (className: string) =>
    timetable
      .filter(t => t.class === className)
      .map(t => ({
        ...t,
        teacherName: teachers.find(tc => tc.email.toLowerCase() === t.teacherEmail.toLowerCase())?.name || 'Unknown',
      }));

  const getTeacherFeedback = (teacherEmail: string) =>
    feedback.filter(f => f.teacherEmail.toLowerCase() === teacherEmail.toLowerCase());

  const getStudentCountByClass = (className: string) =>
    students.filter(s => s.class === className).length;

  return (
    <DataContext.Provider value={{
      students, teachers, timetable, feedback,
      uploadStudentsCSV, uploadTeachersCSV, uploadTimetableCSV,
      submitFeedback, getSubmittedKeys, getTeacherSubjects, getClassSubjects,
      getTeacherFeedback, getStudentCountByClass,
    }}>
      {children}
    </DataContext.Provider>
  );
};
