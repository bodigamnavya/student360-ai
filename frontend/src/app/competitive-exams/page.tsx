'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  BookOpen,
  Sparkles,
  Target,
  CheckCircle2,
  Calendar,
  Brain,
  Clock,
  Trophy
} from 'lucide-react';

const EXAMS = [
  { id: 'GATE', name: 'GATE (CS)', desc: 'Graduate Aptitude Test in Engineering — Computer Science' },
  { id: 'GRE', name: 'GRE General', desc: 'Graduate Record Examinations for US/Global MS admissions' },
  { id: 'CAT', name: 'CAT / MBA', desc: 'Common Admission Test for IIM & Top MBA programs' }
];

export default function CompetitiveExamsPage() {
  const [selectedExam, setSelectedExam] = useState('GATE');
  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadPlan = async (exam: string) => {
    setLoading(true);
    const res = await api.get(`/exams/study-plan?exam=${encodeURIComponent(exam)}`);
    if (res.success && res.data) {
      setStudyPlan(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlan(selectedExam);
  }, [selectedExam]);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Competitive Exam Preparation Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5">AI-generated study plans for GATE, GRE, and CAT with weekly milestones</p>
          </div>
          <Badge variant="purple" className="gap-1.5 py-1">
            <Brain className="w-3.5 h-3.5" />
            AI Study Planner
          </Badge>
        </div>

        {/* Exam Selector Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {EXAMS.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExam(ex.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border shrink-0 ${
                selectedExam === ex.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                  : 'bg-card border-border/80 text-foreground hover:border-primary/40'
              }`}
            >
              <span className="block">{ex.name}</span>
              <span className={`block text-[10px] font-medium mt-0.5 ${selectedExam === ex.id ? 'text-white/80' : 'text-muted-foreground'}`}>
                {ex.desc}
              </span>
            </button>
          ))}
        </div>

        {studyPlan && (
          <>
            {/* Study Plan Overview Banner */}
            <Card glass className="p-6 sm:p-8 space-y-4 border-l-4 border-l-primary">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-foreground">
                    {studyPlan.examName} — Personalized AI Study Blueprint
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Total Duration: <strong className="text-foreground">{studyPlan.totalDuration}</strong> •
                    Target Score: <strong className="text-foreground">{studyPlan.targetScore}</strong>
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-2xl font-heading font-extrabold text-primary">{studyPlan.readinessScore}%</span>
                  <p className="text-[10px] font-bold uppercase text-muted-foreground">Baseline Readiness</p>
                  <Progress value={studyPlan.readinessScore} color="gradient" />
                </div>
              </div>

              {/* Strong & Weak Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Subjects (from Academics)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {studyPlan.strongAreas?.map((s: string, i: number) => (
                      <Badge key={i} variant="success" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Target className="w-4 h-4" /> Focus Areas Needing Improvement
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {studyPlan.weakAreas?.map((s: string, i: number) => (
                      <Badge key={i} variant="warning" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Weekly Study Plan Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg font-heading font-extrabold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Weekly Study Schedule & Milestones
              </h2>

              <div className="space-y-4">
                {studyPlan.weeklyPlan?.map((week: any, wIdx: number) => (
                  <Card key={wIdx} glass className="p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shadow-md">
                          W{week.week}
                        </span>
                        <span className="text-sm font-bold text-foreground">{week.focus}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{week.hoursPerDay} hrs/day</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs">
                      {week.tasks?.map((task: any, tIdx: number) => (
                        <div key={tIdx} className="flex items-start gap-2 p-2.5 rounded-xl bg-background/60 border border-border/40">
                          <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-medium text-foreground">{task.title}</span>
                            {task.resource && (
                              <p className="text-[10px] text-muted-foreground">Resource: {task.resource}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {week.milestone && (
                      <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs font-semibold text-primary flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Milestone: {week.milestone}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommended Resources */}
            {studyPlan.resources && studyPlan.resources.length > 0 && (
              <Card glass className="p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <CardTitle className="text-sm">AI Recommended Study Resources</CardTitle>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {studyPlan.resources.map((r: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-background/60 border border-border/50 space-y-1">
                      <span className="font-bold text-foreground">{r.title}</span>
                      <p className="text-[11px] text-muted-foreground">{r.type} • {r.provider}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
