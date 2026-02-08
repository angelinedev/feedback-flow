import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { CRITERIA_LABELS, FeedbackCriteria } from '@/types';
import { Download, Star, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { toast } from 'sonner';

const CHART_COLORS = ['#6366f1', '#14b8a6', '#22d3ee', '#a78bfa', '#2dd4bf', '#67e8f9'];

const AdminReports = () => {
  const { teachers, feedback } = useData();
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async (teacherName: string) => {
    try {
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const el = document.getElementById(`report-${teacherName}`);
      if (!el) return;

      const canvas = await html2canvas(el, { backgroundColor: '#0d1526', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`FeedLoop_Report_${teacherName.replace(/\s/g, '_')}.pdf`);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">Detailed performance reports with PDF export</p>
        </div>

        {teachers.map(teacher => {
          const fbs = feedback.filter(f => f.teacherEmail.toLowerCase() === teacher.email.toLowerCase());
          if (fbs.length === 0) return null;

          const criteriaAvg = (Object.keys(CRITERIA_LABELS) as (keyof FeedbackCriteria)[]).map(key => ({
            criterion: CRITERIA_LABELS[key].split(' ').slice(0, 2).join(' '),
            fullLabel: CRITERIA_LABELS[key],
            avg: +(fbs.reduce((s, f) => s + f.criteria[key], 0) / fbs.length).toFixed(2),
          }));

          const overallAvg = (criteriaAvg.reduce((s, c) => s + c.avg, 0) / criteriaAvg.length).toFixed(2);

          return (
            <motion.div
              key={teacher.email}
              id={`report-${teacher.name}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{teacher.name}</h2>
                  <p className="text-sm text-muted-foreground">{teacher.department} · {fbs.length} responses · Avg: {overallAvg}/5</p>
                </div>
                <button
                  onClick={() => handleExportPDF(teacher.name)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" /> Export PDF
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              </div>

              {/* Comments */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Anonymous Comments
                </h3>
                <div className="space-y-2">
                  {fbs.filter(f => f.comment).sort(() => Math.random() - 0.5).map((f, i) => (
                    <div key={i} className="bg-secondary rounded-xl px-4 py-3 text-sm text-foreground">
                      "{f.comment}"
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
