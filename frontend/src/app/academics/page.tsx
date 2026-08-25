'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  GraduationCap,
  Sparkles,
  Plus,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Award
} from 'lucide-react';

export default function AcademicsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [selectedSem, setSelectedSem] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Record Form State
  const [newSem, setNewSem] = useState(6);
  const [subjectsList, setSubjectsList] = useState<any[]>([
    { subjectCode: 'CS601', subjectName: 'Distributed Systems', credits: 4, internalMarks: 28, externalMarks: 64, totalMarks: 92, grade: 'A+', gradePoints: 9, status: 'Pass' },
    { subjectCode: 'CS602', subjectName: 'Cloud Microservices', credits: 4, internalMarks: 29, externalMarks: 65, totalMarks: 94, grade: 'O', gradePoints: 10, status: 'Pass' }
  ]);

  const loadAcademics = async () => {
    setLoading(true);
    const [recRes, insRes] = await Promise.all([
      api.get('/academics'),
      api.get('/academics/insights')
    ]);

    if (recRes.success && recRes.data) {
      setRecords(recRes.data);
      if (recRes.data.length > 0) {
        setSelectedSem(recRes.data[recRes.data.length - 1].semester);
        setNewSem(recRes.data.length + 1);
      }
    }
    if (insRes.success && insRes.data) {
      setInsights(insRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAcademics();
  }, []);

  const handleAddSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/academics', {
      semester: newSem,
      subjects: subjectsList
    });
    if (res.success) {
      setShowAddModal(false);
      await loadAcademics();
    } else {
      alert(res.message || 'Failed to save academic record');
    }
  };

  const currentRecord = records.find((r) => r.semester === selectedSem) || records[0];

  const chartData = records.map((r) => ({
    semester: `Sem ${r.semester}`,
    sgpa: r.sgpa,
    cgpa: r.cgpaAfterSemester
  }));

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Academic Performance & Transcripts</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Semester-wise grade progression, subject marks, and AI academic diagnosis</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Semester Marks
          </Button>
        </div>

        {/* Top Analytics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glass className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Cumulative GPA</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-foreground">
                {insights?.cgpa ? insights.cgpa.toFixed(2) : '8.84'}
              </span>
              <span className="text-xs font-bold text-emerald-600">First Class with Distinction</span>
            </div>
            <p className="text-xs text-muted-foreground">Calculated across {records.length} completed semesters</p>
          </Card>

          <Card glass className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Latest Semester SGPA</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-primary">
                {insights?.latestSgpa ? insights.latestSgpa.toFixed(2) : '9.00'}
              </span>
              <Badge variant="success">Consistent</Badge>
            </div>
            <p className="text-xs text-muted-foreground">0 pending backlogs</p>
          </Card>

          <Card glass className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Academic Velocity Status</span>
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-foreground">Upward Momentum</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground">{insights?.trendMessage || 'Steady performance with no decline detected.'}</p>
          </Card>
        </div>

        {/* Progression Chart */}
        {chartData.length > 0 && (
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Semester SGPA & CGPA Trend</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Historical GPA curve across all completed evaluation terms</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> SGPA
                </span>
                <span className="flex items-center gap-1.5 text-purple-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> CGPA
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sgpaGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="cgpaGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[6, 10]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="sgpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#sgpaGrad2)" name="SGPA" />
                  <Area type="monotone" dataKey="cgpa" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#cgpaGrad2)" name="CGPA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Semester Marks Table & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Semester Marks Detail */}
          <div className="lg:col-span-2 space-y-4">
            {/* Semester Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {records.map((r) => (
                <button
                  key={r.semester}
                  onClick={() => setSelectedSem(r.semester)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedSem === r.semester
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                      : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Semester {r.semester} (SGPA: {r.sgpa})
                </button>
              ))}
            </div>

            {currentRecord ? (
              <Card glass className="overflow-hidden">
                <div className="p-4 bg-muted/30 border-b border-border/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    Semester {currentRecord.semester} Marks Breakdown ({currentRecord.academicYear})
                  </span>
                  <Badge variant="blue">SGPA: {currentRecord.sgpa}</Badge>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="p-3.5">Code</th>
                        <th className="p-3.5">Subject Name</th>
                        <th className="p-3.5 text-center">Credits</th>
                        <th className="p-3.5 text-center">Internal (30)</th>
                        <th className="p-3.5 text-center">External (70)</th>
                        <th className="p-3.5 text-center">Total (100)</th>
                        <th className="p-3.5 text-center">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {currentRecord.subjects?.map((sub: any, idx: number) => (
                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-foreground">{sub.subjectCode}</td>
                          <td className="p-3.5 font-medium text-foreground">{sub.subjectName}</td>
                          <td className="p-3.5 text-center">{sub.credits}</td>
                          <td className="p-3.5 text-center">{sub.internalMarks}</td>
                          <td className="p-3.5 text-center">{sub.externalMarks}</td>
                          <td className="p-3.5 text-center font-bold text-foreground">{sub.totalMarks}</td>
                          <td className="p-3.5 text-center">
                            <span className="font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                              {sub.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ) : (
              <Card glass className="p-8 text-center text-xs text-muted-foreground">
                No academic records uploaded yet. Click &quot;Add Semester Marks&quot; to begin.
              </Card>
            )}
          </div>

          {/* AI Academic Diagnostics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="text-base font-bold text-foreground">AI Academic Analysis</h3>
            </div>

            <Card glass className="p-5 space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Key Academic Strengths</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(insights?.strongSubjects || ['Design & Analysis of Algorithms', 'Cloud Computing', 'DBMS']).map((s: string, i: number) => (
                    <Badge key={i} variant="success" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Focus Areas & Recommendations</span>
                <div className="space-y-2 mt-2">
                  {(insights?.recommendations || [
                    'Maintain problem-solving frequency on high-credit analytical courses.',
                    'Form peer study groups for upcoming distributed systems examinations.'
                  ]).map((rec: string, i: number) => (
                    <div key={i} className="p-2.5 rounded-xl bg-muted/40 text-xs font-medium text-foreground leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Add Semester Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Semester Examination Marks">
        <form onSubmit={handleAddSemester} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Semester"
              type="number"
              min="1"
              max="8"
              value={newSem}
              onChange={(e) => setNewSem(parseInt(e.target.value, 10))}
              required
            />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Academic Year</label>
              <input
                className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                defaultValue="2025-2026"
              />
            </div>
          </div>

          <div className="space-y-3 border-t border-border/60 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">Subjects ({subjectsList.length})</span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setSubjectsList([
                    ...subjectsList,
                    { subjectCode: `CS60${subjectsList.length + 1}`, subjectName: 'New Subject Course', credits: 3, internalMarks: 25, externalMarks: 60, totalMarks: 85, grade: 'A', gradePoints: 8, status: 'Pass' }
                  ])
                }
              >
                + Add Subject
              </Button>
            </div>

            {subjectsList.map((sub, i) => (
              <div key={i} className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    placeholder="Subject Code (e.g. CS601)"
                    value={sub.subjectCode}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].subjectCode = e.target.value;
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs"
                    required
                  />
                  <input
                    placeholder="Subject Name"
                    value={sub.subjectName}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].subjectName = e.target.value;
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="number"
                    placeholder="Credits"
                    value={sub.credits}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].credits = parseInt(e.target.value, 10);
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs text-center"
                  />
                  <input
                    type="number"
                    placeholder="Internal"
                    value={sub.internalMarks}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].internalMarks = parseInt(e.target.value, 10);
                      updated[i].totalMarks = (updated[i].internalMarks || 0) + (updated[i].externalMarks || 0);
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs text-center"
                  />
                  <input
                    type="number"
                    placeholder="External"
                    value={sub.externalMarks}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].externalMarks = parseInt(e.target.value, 10);
                      updated[i].totalMarks = (updated[i].internalMarks || 0) + (updated[i].externalMarks || 0);
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs text-center"
                  />
                  <input
                    placeholder="Grade (e.g. A+)"
                    value={sub.grade}
                    onChange={(e) => {
                      const updated = [...subjectsList];
                      updated[i].grade = e.target.value;
                      setSubjectsList(updated);
                    }}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs text-center font-bold"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Save Semester Record</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
