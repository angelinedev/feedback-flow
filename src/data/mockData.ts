import { Student, Teacher, TimetableEntry, FeedbackSubmission } from '@/types';

export const mockStudents: Student[] = [
  { registerNumber: 'CS2101', name: 'Arjun Kumar', email: 'arjuncse2021@college.ac.in', class: 'CSE-A' },
  { registerNumber: 'CS2102', name: 'Priya Sharma', email: 'priyacse2021@college.ac.in', class: 'CSE-A' },
  { registerNumber: 'CS2103', name: 'Rahul Verma', email: 'rahulcse2021@college.ac.in', class: 'CSE-A' },
  { registerNumber: 'CS2104', name: 'Sneha Reddy', email: 'snehacse2021@college.ac.in', class: 'CSE-A' },
  { registerNumber: 'CS2105', name: 'Vikram Singh', email: 'vikramcse2021@college.ac.in', class: 'CSE-B' },
  { registerNumber: 'CS2106', name: 'Ananya Patel', email: 'ananyacse2021@college.ac.in', class: 'CSE-B' },
  { registerNumber: 'EC2101', name: 'Karthik Nair', email: 'karthikece2021@college.ac.in', class: 'ECE-A' },
  { registerNumber: 'EC2102', name: 'Divya Menon', email: 'divyaece2021@college.ac.in', class: 'ECE-A' },
];

export const mockTeachers: Teacher[] = [
  { teacherId: 'T001', name: 'Dr. Rajesh Iyer', email: 'rajesh@college.ac.in', department: 'CSE' },
  { teacherId: 'T002', name: 'Prof. Meena Subramaniam', email: 'meena@college.ac.in', department: 'CSE' },
  { teacherId: 'T003', name: 'Dr. Suresh Babu', email: 'suresh@college.ac.in', department: 'CSE' },
  { teacherId: 'T004', name: 'Prof. Lakshmi Rao', email: 'lakshmi@college.ac.in', department: 'ECE' },
  { teacherId: 'T005', name: 'Dr. Anil Kapoor', email: 'anil@college.ac.in', department: 'ECE' },
];

export const mockTimetable: TimetableEntry[] = [
  { class: 'CSE-A', teacherEmail: 'rajesh@college.ac.in', subject: 'Data Structures' },
  { class: 'CSE-A', teacherEmail: 'meena@college.ac.in', subject: 'Operating Systems' },
  { class: 'CSE-A', teacherEmail: 'suresh@college.ac.in', subject: 'Database Systems' },
  { class: 'CSE-B', teacherEmail: 'rajesh@college.ac.in', subject: 'Data Structures' },
  { class: 'CSE-B', teacherEmail: 'meena@college.ac.in', subject: 'Computer Networks' },
  { class: 'ECE-A', teacherEmail: 'lakshmi@college.ac.in', subject: 'Signal Processing' },
  { class: 'ECE-A', teacherEmail: 'anil@college.ac.in', subject: 'VLSI Design' },
  { class: 'ECE-A', teacherEmail: 'suresh@college.ac.in', subject: 'Embedded Systems' },
];

export const mockFeedback: FeedbackSubmission[] = [
  {
    teacherEmail: 'rajesh@college.ac.in', subject: 'Data Structures', class: 'CSE-A',
    criteria: { clarity: 5, knowledge: 5, engagement: 4, punctuality: 5, materials: 4, approachability: 5 },
    comment: 'Excellent teaching methodology. Concepts are explained with real-world examples.', timestamp: Date.now() - 86400000,
  },
  {
    teacherEmail: 'rajesh@college.ac.in', subject: 'Data Structures', class: 'CSE-A',
    criteria: { clarity: 4, knowledge: 5, engagement: 4, punctuality: 4, materials: 3, approachability: 4 },
    comment: 'Very knowledgeable but could provide more practice problems.', timestamp: Date.now() - 172800000,
  },
  {
    teacherEmail: 'meena@college.ac.in', subject: 'Operating Systems', class: 'CSE-A',
    criteria: { clarity: 4, knowledge: 4, engagement: 5, punctuality: 5, materials: 5, approachability: 4 },
    comment: 'Interactive classes with great lab sessions.', timestamp: Date.now() - 100000000,
  },
  {
    teacherEmail: 'lakshmi@college.ac.in', subject: 'Signal Processing', class: 'ECE-A',
    criteria: { clarity: 3, knowledge: 5, engagement: 3, punctuality: 4, materials: 4, approachability: 3 },
    comment: 'Strong knowledge but pace is sometimes too fast.', timestamp: Date.now() - 200000000,
  },
];

export const ADMIN_EMAIL = 'admin@college.ac.in';
