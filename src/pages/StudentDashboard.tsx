import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { getClassSubjects, getSubmittedKeys } = useData();

  const subjects = user?.class ? getClassSubjects(user.class) : [];
  const submitted = getSubmittedKeys();
  const submittedCount = subjects.filter(s =>
    submitted.includes(`${user?.class}_${s.teacherEmail}_${s.subject}`)
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">Class: {user?.class} · Manage your feedback submissions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Subjects" value={subjects.length} icon={BookOpen} accent="indigo" />
          <StatCard title="Submitted" value={submittedCount} icon={CheckCircle} accent="teal" />
          <StatCard title="Pending" value={subjects.length - submittedCount} icon={Clock} accent="cyan" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Your Subjects</h2>
            <Link
              to="/student/feedback"
              className="text-sm px-4 py-2 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Give Feedback
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((s, i) => {
              const done = submitted.includes(`${user?.class}_${s.teacherEmail}_${s.subject}`);
              return (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${done ? 'bg-teal/5 border-teal/20' : 'bg-secondary border-border'}`}>
                  <div>
                    <p className="font-medium text-foreground text-sm">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.teacherName}</p>
                  </div>
                  {done ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-teal/15 text-teal font-medium">Submitted</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground font-medium">Pending</span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
