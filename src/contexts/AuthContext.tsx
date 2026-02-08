import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Student, Teacher } from '@/types';
import { useData } from './DataContext';
import { ADMIN_EMAIL } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string) => { success: boolean; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { students, teachers } = useData();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('feedloop_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string): { success: boolean; error?: string } => {
    const trimmed = email.trim().toLowerCase();

    if (trimmed === ADMIN_EMAIL) {
      const u: User = { email: trimmed, name: 'Administrator', role: 'admin' };
      setUser(u);
      localStorage.setItem('feedloop_user', JSON.stringify(u));
      return { success: true };
    }

    const student = students.find(s => s.email.toLowerCase() === trimmed);
    if (student) {
      const u: User = { email: trimmed, name: student.name, role: 'student', class: student.class };
      setUser(u);
      localStorage.setItem('feedloop_user', JSON.stringify(u));
      return { success: true };
    }

    const teacher = teachers.find(t => t.email.toLowerCase() === trimmed);
    if (teacher) {
      const u: User = { email: trimmed, name: teacher.name, role: 'faculty', department: teacher.department };
      setUser(u);
      localStorage.setItem('feedloop_user', JSON.stringify(u));
      return { success: true };
    }

    return { success: false, error: 'Email not found in the system. Please check your credentials.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('feedloop_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
