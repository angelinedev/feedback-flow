import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Users, BookOpen, GraduationCap, BarChart3, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CRITERIA_LABELS, FeedbackCriteria } from '@/types';

const CHART_COLORS = ['#6366f1', '#14b8a6', '#22d3ee', '#a78bfa', '#2dd4bf', '#67e8f9'];

const AdminDashboard = () => {
  const { teachers, students, timetable, feedback } = useData();

  const avgByTeacher = teachers.map(t => {
    const fbs = feedback.filter(f => f.teacherEmail.toLowerCase() === t.email.toLowerCase());
    const avg = fbs.length > 0
      ? fbs.reduce((sum, f) => sum + Object.values(f.criteria).reduce((a, b) => a + b, 0) / 6, 0) / fbs.length
      : 0;
    return { name: t.name.split(' ').slice(-1)[0], fullName: t.name, avg: +avg.toFixed(2), count: fbs.length };
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of system data and feedback analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Students" value={students.length} icon={GraduationCap} accent="indigo" />
          <StatCard title="Total Faculty" value={teachers.length} icon={Users} accent="teal" />
          <StatCard title="Subjects Mapped" value={timetable.length} icon={BookOpen} accent="cyan" />
          <StatCard title="Feedback Received" value={feedback.length} icon={BarChart3} accent="indigo" />
        </div>

        {/* Teacher Performance Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Faculty Performance Overview</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgByTeacher}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
                <XAxis dataKey="name" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                <YAxis domain={[0, 5]} tick={{ fill: 'hsl(215 20% 55%)', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: 'hsl(222 47% 9%)', border: '1px solid hsl(222 30% 18%)', borderRadius: 12, color: 'hsl(210 40% 96%)' }}
                  formatter={(value: number) => [value.toFixed(2), 'Avg Rating']}
                  labelFormatter={(label) => avgByTeacher.find(t => t.name === label)?.fullName || label}
                />
                <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                  {avgByTeacher.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Teacher Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Faculty Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Department</th>
                  <th className="text-left py-3 px-4">Responses</th>
                  <th className="text-left py-3 px-4">Avg Rating</th>
                </tr>
              </thead>
              <tbody>
                {avgByTeacher.map((t, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">{t.fullName}</td>
                    <td className="py-3 px-4 text-muted-foreground">{teachers[i]?.department}</td>
                    <td className="py-3 px-4 text-muted-foreground">{t.count}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-foreground font-medium">{t.avg || '—'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
