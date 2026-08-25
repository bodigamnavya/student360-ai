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
  GraduationCap,
  Plus,
  Globe,
  BookOpen,
  Search,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink,
  Trash2,
  TrendingUp
} from 'lucide-react';

export default function HigherEducationPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [university, setUniversity] = useState('');
  const [program, setProgram] = useState('M.Tech in Computer Science');
  const [country, setCountry] = useState('India');
  const [status, setStatus] = useState('Researching');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  const loadRecords = async () => {
    setLoading(true);
    const res = await api.get('/higher-education');
    if (res.success && res.data) setRecords(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/higher-education', {
      university,
      program,
      country,
      status,
      applicationDeadline: deadline || undefined,
      notes
    });
    if (res.success) {
      setShowModal(false);
      setUniversity('');
      setNotes('');
      await loadRecords();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Remove this university record?')) {
      await api.delete(`/higher-education/${id}`);
      await loadRecords();
    }
  };

  const statusColors: Record<string, string> = {
    Researching: 'blue',
    Shortlisted: 'purple',
    Applied: 'warning',
    Accepted: 'success',
    Rejected: 'danger',
    Enrolled: 'success'
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Higher Education & University Shortlisting</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Track graduate school applications, deadlines, and AI university recommendations</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add University
          </Button>
        </div>

        {/* AI Recommendations Banner */}
        <Card glass className="p-6 border-l-4 border-l-purple-500 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-bold text-foreground">AI University Shortlisting Guidance</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Based on your CGPA (8.84), project portfolio, and research publications, you are a strong candidate for:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-background/60 border border-border/60 text-xs space-y-0.5">
              <span className="font-bold text-foreground">IIT Bombay / IISc Bangalore</span>
              <p className="text-[11px] text-muted-foreground">M.Tech CS / AI — GATE Score Required</p>
              <Badge variant="success" className="text-[9px] mt-1">High Admit Probability</Badge>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/60 text-xs space-y-0.5">
              <span className="font-bold text-foreground">CMU / Georgia Tech (USA)</span>
              <p className="text-[11px] text-muted-foreground">MS CS — GRE 320+ Recommended</p>
              <Badge variant="purple" className="text-[9px] mt-1">Ambitious Target</Badge>
            </div>
            <div className="p-3 rounded-xl bg-background/60 border border-border/60 text-xs space-y-0.5">
              <span className="font-bold text-foreground">TU Munich / ETH Zurich (Europe)</span>
              <p className="text-[11px] text-muted-foreground">MSc Informatics — No Tuition Fees</p>
              <Badge variant="blue" className="text-[9px] mt-1">Safe Application</Badge>
            </div>
          </div>
        </Card>

        {/* University Tracker Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {records.map((rec) => (
            <Card key={rec._id} glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">{rec.university}</h3>
                      <p className="text-xs text-primary font-semibold">{rec.program}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={(statusColors[rec.status] as any) || 'outline'}>{rec.status}</Badge>
                    <button onClick={() => handleDelete(rec._id)} className="p-1 text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {rec.country}
                  </span>
                  {rec.applicationDeadline && (
                    <span>Deadline: {new Date(rec.applicationDeadline).toLocaleDateString()}</span>
                  )}
                </div>

                {rec.notes && (
                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/40 rounded-xl p-3 border border-border/40">
                    {rec.notes}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add University Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Track University Application">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="University Name" placeholder="e.g. IIT Bombay" value={university} onChange={(e) => setUniversity(e.target.value)} required />
          <Input label="Program" placeholder="e.g. M.Tech in AI & ML" value={program} onChange={(e) => setProgram(e.target.value)} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Country" placeholder="India" value={country} onChange={(e) => setCountry(e.target.value)} />
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase">Application Status</label>
              <select className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Researching">Researching</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Applied">Applied</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Enrolled">Enrolled</option>
              </select>
            </div>
          </div>
          <Input label="Application Deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase">Notes & Reminders</label>
            <textarea rows={2} className="w-full rounded-xl border border-input bg-background/50 p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Requirements, test scores needed, scholarship info..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Save University Record</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
