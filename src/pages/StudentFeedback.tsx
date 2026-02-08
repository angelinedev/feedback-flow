import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import DashboardLayout from '@/components/DashboardLayout';
import StarRating from '@/components/StarRating';
import { CRITERIA_LABELS, FeedbackCriteria } from '@/types';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const emptyCriteria: FeedbackCriteria = { clarity: 0, knowledge: 0, engagement: 0, punctuality: 0, materials: 0, approachability: 0 };

const StudentFeedback = () => {
  const { user } = useAuth();
  const { getClassSubjects, getSubmittedKeys, submitFeedback } = useData();
  const [criteria, setCriteria] = useState<FeedbackCriteria>({ ...emptyCriteria });
  const [comment, setComment] = useState('');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submittedKeys, setSubmittedKeys] = useState(getSubmittedKeys());

  const subjects = user?.class ? getClassSubjects(user.class) : [];
  const selected = selectedIdx !== null ? subjects[selectedIdx] : null;

  const handleSubmit = () => {
    if (!selected || !user?.class) return;
    if (Object.values(criteria).some(v => v === 0)) {
      toast.error('Please rate all criteria');
      return;
    }
    submitFeedback({
      teacherEmail: selected.teacherEmail,
      subject: selected.subject,
      class: user.class,
      criteria,
      comment,
      timestamp: Date.now(),
    });
    const key = `${user.class}_${selected.teacherEmail}_${selected.subject}`;
    setSubmittedKeys([...submittedKeys, key]);
    setCriteria({ ...emptyCriteria });
    setComment('');
    setSelectedIdx(null);
    toast.success('Feedback submitted anonymously!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submit Feedback</h1>
          <p className="text-muted-foreground text-sm mt-1">Your feedback is completely anonymous</p>
        </div>

        {/* Subject List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {subjects.map((s, i) => {
            const key = `${user?.class}_${s.teacherEmail}_${s.subject}`;
            const done = submittedKeys.includes(key);
            return (
              <button
                key={i}
                disabled={done}
                onClick={() => { setSelectedIdx(i); setCriteria({ ...emptyCriteria }); setComment(''); }}
                className={`text-left p-4 rounded-xl border transition-all ${
                  done ? 'bg-teal/5 border-teal/20 opacity-60 cursor-not-allowed'
                    : selectedIdx === i ? 'bg-primary/10 border-primary glow-indigo'
                    : 'bg-secondary border-border hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{s.subject}</p>
                    <p className="text-xs text-muted-foreground">{s.teacherName}</p>
                  </div>
                  {done && <CheckCircle className="w-5 h-5 text-teal" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Form */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold text-foreground">{selected.subject}</h2>
                <p className="text-sm text-muted-foreground">Faculty: {selected.teacherName}</p>
              </div>

              <div className="space-y-4">
                {(Object.keys(CRITERIA_LABELS) as (keyof FeedbackCriteria)[]).map(key => (
                  <div key={key} className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-sm text-foreground">{CRITERIA_LABELS[key]}</label>
                    <StarRating value={criteria[key]} onChange={v => setCriteria(prev => ({ ...prev, [key]: v }))} />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Anonymous Comment (optional)</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity glow-indigo"
              >
                <Send className="w-4 h-4" /> Submit Feedback
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default StudentFeedback;
