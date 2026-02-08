import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import { Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface UploadSlot {
  key: 'students' | 'teachers' | 'timetable';
  label: string;
  description: string;
  columns: string;
}

const slots: UploadSlot[] = [
  { key: 'students', label: 'Students', description: 'Student registry', columns: 'RegisterNumber, Name, Email, Class' },
  { key: 'teachers', label: 'Teachers', description: 'Faculty registry', columns: 'TeacherID, Name, Email, Department' },
  { key: 'timetable', label: 'Timetable', description: 'Class-subject mapping', columns: 'Class, TeacherEmail, Subject' },
];

const AdminUpload = () => {
  const { uploadStudentsCSV, uploadTeachersCSV, uploadTimetableCSV, students, teachers, timetable } = useData();
  const [uploading, setUploading] = useState<string | null>(null);

  const counts = { students: students.length, teachers: teachers.length, timetable: timetable.length };
  const uploaders = { students: uploadStudentsCSV, teachers: uploadTeachersCSV, timetable: uploadTimetableCSV };

  const handleUpload = async (slot: UploadSlot, file: File) => {
    setUploading(slot.key);
    try {
      await uploaders[slot.key](file);
      toast.success(`${slot.label} data updated successfully!`);
    } catch {
      toast.error(`Failed to parse ${slot.label} CSV`);
    }
    setUploading(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Data Control Center</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload CSV files to configure system data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {slots.map(slot => (
            <motion.div
              key={slot.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo/15 text-indigo">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{slot.label}</h3>
                    <p className="text-xs text-muted-foreground">{slot.description}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-teal/15 text-teal font-medium">
                  {counts[slot.key]} records
                </span>
              </div>

              <div className="text-xs text-muted-foreground bg-secondary rounded-lg p-3 font-mono">
                {slot.columns}
              </div>

              <label className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-sm text-muted-foreground hover:text-foreground">
                <Upload className="w-4 h-4" />
                <span>{uploading === slot.key ? 'Uploading...' : 'Upload CSV'}</span>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(slot, file);
                    e.target.value = '';
                  }}
                />
              </label>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUpload;
