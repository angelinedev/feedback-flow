export interface Student {
  registerNumber: string;
  name: string;
  email: string;
  class: string;
}

export interface Teacher {
  teacherId: string;
  name: string;
  email: string;
  department: string;
}

export interface TimetableEntry {
  class: string;
  teacherEmail: string;
  subject: string;
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  class?: string;
  department?: string;
}

export interface FeedbackCriteria {
  clarity: number;
  knowledge: number;
  engagement: number;
  punctuality: number;
  materials: number;
  approachability: number;
}

export interface FeedbackSubmission {
  teacherEmail: string;
  subject: string;
  class: string;
  criteria: FeedbackCriteria;
  comment: string;
  timestamp: number;
}

export const CRITERIA_LABELS: Record<keyof FeedbackCriteria, string> = {
  clarity: 'Clarity of Teaching',
  knowledge: 'Subject Knowledge',
  engagement: 'Student Engagement',
  punctuality: 'Punctuality',
  materials: 'Quality of Materials',
  approachability: 'Approachability',
};
