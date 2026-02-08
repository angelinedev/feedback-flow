import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { useData } from '@/contexts/DataContext';
import DataTable from '@/components/DataTable';
import { Upload, FileSpreadsheet, Users, GraduationCap, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Student, Teacher, TimetableEntry } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UploadSlot {
  key: 'students' | 'teachers' | 'timetable';
  label: string;
  description: string;
  columns: string;
  icon: React.ReactNode;
}

const slots: UploadSlot[] = [
  { key: 'students', label: 'Students', description: 'Student registry', columns: 'RegisterNumber, Name, Email, Class', icon: <GraduationCap className="w-5 h-5" /> },
  { key: 'teachers', label: 'Teachers', description: 'Faculty registry', columns: 'TeacherID, Name, Email, Department', icon: <Users className="w-5 h-5" /> },
  { key: 'timetable', label: 'Timetable', description: 'Class-subject mapping', columns: 'Class, TeacherEmail, Subject', icon: <Calendar className="w-5 h-5" /> },
];

const studentColumns = [
  { key: 'registerNumber' as const, label: 'Register No.' },
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
  { key: 'class' as const, label: 'Class' },
];

const teacherColumns = [
  { key: 'teacherId' as const, label: 'Teacher ID' },
  { key: 'name' as const, label: 'Name' },
  { key: 'email' as const, label: 'Email' },
  { key: 'department' as const, label: 'Department' },
];

const timetableColumns = [
  { key: 'class' as const, label: 'Class' },
  { key: 'teacherEmail' as const, label: 'Teacher Email' },
  { key: 'subject' as const, label: 'Subject' },
];

const AdminUpload = () => {
  const { uploadStudentsCSV, uploadTeachersCSV, uploadTimetableCSV, students, teachers, timetable, setStudents, setTeachers, setTimetable } = useData();
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
          <p className="text-muted-foreground text-sm mt-1">Upload CSV files or manually edit system data</p>
        </div>

        {/* Upload cards */}
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
                    {slot.icon}
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

        {/* Data tables */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="students" className="gap-1.5"><GraduationCap className="w-4 h-4" /> Students ({students.length})</TabsTrigger>
            <TabsTrigger value="teachers" className="gap-1.5"><Users className="w-4 h-4" /> Teachers ({teachers.length})</TabsTrigger>
            <TabsTrigger value="timetable" className="gap-1.5"><Calendar className="w-4 h-4" /> Timetable ({timetable.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
              <DataTable
                data={students as any}
                columns={studentColumns as any}
                onUpdate={(data) => setStudents(data as any)}
                emptyRow={{ registerNumber: '', name: '', email: '', class: '' } as any}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="teachers">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
              <DataTable
                data={teachers as any}
                columns={teacherColumns as any}
                onUpdate={(data) => setTeachers(data as any)}
                emptyRow={{ teacherId: '', name: '', email: '', department: '' } as any}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="timetable">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
              <DataTable
                data={timetable as any}
                columns={timetableColumns as any}
                onUpdate={(data) => setTimetable(data as any)}
                emptyRow={{ class: '', teacherEmail: '', subject: '' } as any}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminUpload;
