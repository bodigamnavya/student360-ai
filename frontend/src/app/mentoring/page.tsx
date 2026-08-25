'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Users,
  Sparkles,
  Calendar,
  CheckSquare,
  Square,
  AlertTriangle,
  MessageSquare,
  Plus,
  Mail,
  GraduationCap
} from 'lucide-react';

export default function MentoringPage() {
  const { user, profile } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New session state
  const [discussions, setDiscussions] = useState('');
  const [feedback, setFeedback] = useState('');
  const [academicIssues, setAcademicIssues] = useState('');
  const [careerIssues, setCareerIssues] = useState('');
  const [actionItemText, setActionItemText] = useState('');

  const loadMentoring = async () => {
    setLoading(true);
    const res = await api.get('/mentoring');
    if (res.success && res.data) {
      setRecords(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMentoring();
  }, []);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/mentoring', {
      studentId: user?.id,
      discussions,
      feedback,
      academicIssues,
      careerIssues,
      actionItems: actionItemText ? [{ task: actionItemText, completed: false }] : []
    });

    if (res.success) {
      setShowAddModal(false);
      setDiscussions('');
      setFeedback('');
      setAcademicIssues('');
      setCareerIssues('');
      setActionItemText('');
      await loadMentoring();
    }
  };

  const mentor = profile?.mentor || {
    name: 'Dr. Rajesh Sharma',
    email: 'faculty@student360.ai',
    department: 'Computer Science and Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Faculty Mentoring & Counseling</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Assigned academic mentor, scheduled reviews, and remedial action tracking</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Log Mentoring Session
          </Button>
        </div>

        {/* Mentor Info Card & AI Mentor Alert */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Mentor Profile Card */}
          <Card glass className="p-6 space-y-4 md:col-span-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Faculty Mentor</span>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0">
                {mentor.name ? mentor.name.charAt(0) : 'R'}
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground">{mentor.name}</h3>
                <p className="text-xs text-primary font-semibold">{mentor.department}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {mentor.email}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 text-xs text-muted-foreground space-y-1 border border-border/50">
              <p className="font-semibold text-foreground">Office Hours:</p>
              <p>Mon, Wed, Fri • 3:00 PM - 5:00 PM (Room CS-304)</p>
            </div>
          </Card>

          {/* AI Mentor Risk Alert */}
          <Card glass className="p-6 md:col-span-2 border-l-4 border-l-purple-500 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h3 className="text-sm font-bold text-foreground">AI Mentor Assistant Diagnostics</h3>
              </div>
              <Badge variant="purple">Low Risk Profile</Badge>
            </div>
            <p className="text-xs text-foreground font-medium leading-relaxed">
              Student exhibits strong academic consistency (CGPA 8.84) with 0 backlogs and active competitive programming projects.
            </p>
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 space-y-1">
              <p className="font-bold">Suggested Mentor Guidance:</p>
              <p>• Recommend participation in ACM-ICPC Regionals and Open-Source Summer Fellowships.</p>
              <p>• Review System Design preparation for Tier-1 Super-Dream campus recruitment.</p>
            </div>
          </Card>
        </div>

        {/* Meeting Log History */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-extrabold text-foreground">Mentoring Meeting Log & Action Plans</h2>
          <div className="space-y-4">
            {records.map((rec: any) => (
              <Card key={rec._id} glass className="p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Meeting Date: {formatDate(rec.meetingDate)}</span>
                    {rec.followUpDate && (
                      <span className="text-muted-foreground font-normal">
                        (Next Follow-up: {formatDate(rec.followUpDate)})
                      </span>
                    )}
                  </div>
                  <Badge variant={rec.status === 'Completed' ? 'success' : 'warning'}>
                    {rec.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-bold text-foreground">Discussion Points:</span>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">{rec.discussions}</p>
                  </div>
                  {rec.feedback && (
                    <div>
                      <span className="font-bold text-primary">Mentor Feedback:</span>
                      <p className="text-muted-foreground mt-0.5 leading-relaxed">{rec.feedback}</p>
                    </div>
                  )}
                </div>

                {/* Action Items */}
                {rec.actionItems && rec.actionItems.length > 0 && (
                  <div className="pt-2 border-t border-border/50 space-y-2">
                    <span className="text-xs font-bold text-foreground">Assigned Action Items:</span>
                    <div className="space-y-1.5">
                      {rec.actionItems.map((action: any, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-2 text-xs text-foreground p-2 rounded-xl bg-background/50 border border-border/40">
                          {action.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                          )}
                          <span className={action.completed ? 'line-through text-muted-foreground' : 'font-medium'}>
                            {action.task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Session Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Log Mentoring Counseling Session">
        <form onSubmit={handleCreateSession} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase">Discussion Summary</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-input bg-background/50 p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={discussions}
              onChange={(e) => setDiscussions(e.target.value)}
              placeholder="Outline what was discussed during the mentoring session..."
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase">Mentor Advice / Feedback</label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-input bg-background/50 p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Actionable suggestions given to the student..."
            />
          </div>

          <Input
            label="Action Item (Task to Complete)"
            placeholder="e.g. Complete 20 LeetCode Medium problems on Trees"
            value={actionItemText}
            onChange={(e) => setActionItemText(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Save Mentoring Record</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
