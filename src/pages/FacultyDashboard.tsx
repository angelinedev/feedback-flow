import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { CRITERIA_LABELS, FeedbackCriteria } from '@/types';
import { Users, BarChart3, MessageSquare, Star } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const { getTeacherSubjects, getTeacherFeedback, getStudentCountByClass } = useData();

  const subjects = getTeacherSubjects(user?.email || '');
  const allFeedback = getTeacherFeedback(user?.email || '');

  const totalStudents = [...new Set(subjects.map(s => s.class))].reduce(
    (sum, cls) => sum + getStudentCountByClass(cls), 0
  );

  const criteriaAvg = (Object.keys(CRITERIA_LABELS) as (keyof FeedbackCriteria)[]).map(key => ({
    criterion: CRITERIA_LABELS[key].split(' ').slice(0, 2).join(' '),
    avg: allFeedback.length
      ? +(allFeedback.reduce((s, f) => s + f.criteria[key], 0) / allFeedback.length).toFixed(2)
      : 0,
  }));

  const overallAvg = allFeedback.length
    ? (criteriaAvg.reduce((s, c) => s + c.avg, 0) / criteriaAvg.length).toFixed(2)
    : '—';

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{user?.department} Department</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Subjects" value={subjects.length} icon={BarChart3} accent="indigo" />
          <StatCard title="Total Students" value={totalStudents} icon={Users} accent="teal" />
          <StatCard title="Responses" value={allFeedback.length} icon={MessageSquare} accent="cyan" />
          <StatCard title="Overall Rating" value={overallAvg} icon={Star} accent="indigo" subtitle="/5.00" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Criteria Breakdown</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={criteriaAvg}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                  <XAxis dataKey="criterion" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                  <YAxis domain={[0, 5]} tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', borderRadius: 12, color: 'hsl(210 40% 96%)' }} />
                  <Bar dataKey="avg" radius={[6, 6, 0, 0]} fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Performance Radar</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={criteriaAvg}>
                  <PolarGrid stroke="hsl(222 30% 18%)" />
                  <PolarAngleAxis dataKey="criterion" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 5]} tick={{ fill: 'hsl(215 20% 55%)', fontSize: 10 }} />
                  <Radar dataKey="avg" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Response Rate */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Response Rate by Class</h2>
          <div className="space-y-3">
            {subjects.map((s, i) => {
              const classFb = allFeedback.filter(f => f.class === s.class && f.subject === s.subject).length;
              const total = getStudentCountByClass(s.class);
              const rate = total > 0 ? Math.round((classFb / total) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-sm text-foreground truncate">{s.subject}</div>
                  <div className="w-16 text-xs text-muted-foreground">{s.class}</div>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${rate}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full gradient-primary"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">{rate}%</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Anonymous Comments */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal" /> Anonymous Comments
          </h2>
          <div className="space-y-2">
            {allFeedback.filter(f => f.comment).sort(() => Math.random() - 0.5).map((f, i) => (
              <div key={i} className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground">
                <span className="text-xs text-muted-foreground mr-2">{f.subject} ·</span>
                "{f.comment}"
              </div>
            ))}
            {allFeedback.filter(f => f.comment).length === 0 && (
              <p className="text-muted-foreground text-sm">No comments yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default FacultyDashboard;
