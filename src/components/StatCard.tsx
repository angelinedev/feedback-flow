import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: 'indigo' | 'teal' | 'cyan';
}

const accentMap = {
  indigo: 'bg-indigo/15 text-indigo',
  teal: 'bg-teal/15 text-teal',
  cyan: 'bg-cyan/15 text-cyan',
};

const StatCard = ({ title, value, subtitle, icon: Icon, accent = 'indigo' }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass rounded-2xl p-6"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${accentMap[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
