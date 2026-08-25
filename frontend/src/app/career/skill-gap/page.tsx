'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FolderGit2,
  Award,
  ArrowRight,
  Clock
} from 'lucide-react';

const AVAILABLE_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'AI / Machine Learning Engineer',
  'Data Analyst'
];

function SkillGapContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') || 'Full Stack Developer';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadGapAnalysis = async (role: string) => {
    setLoading(true);
    const res = await api.get(`/careers/skill-gap?role=${encodeURIComponent(role)}`);
    if (res.success && res.data) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGapAnalysis(selectedRole);
  }, [selectedRole]);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI Skill Gap Analysis & Learning Roadmap</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Benchmark your verified competencies against industry hiring benchmarks for specific roles</p>
          </div>

          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground hidden sm:inline">Target Role:</span>
            <select
              className="h-10 rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {data && (
          <>
            {/* Readiness Score Banner */}
            <div className="p-6 sm:p-8 rounded-3xl gradient-bg text-white shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Role Readiness Gauge</span>
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                    {data.readinessScore}% Match for {selectedRole}
                  </h2>
                  <p className="text-xs text-blue-100 max-w-xl">
                    You have verified {data.matchedSkills?.length || 0} core competencies. Completing the remaining {data.missingSkills?.length || 0} skills can elevate your profile match by approximately +{100 - data.readinessScore}%.
                  </p>
                </div>

                <div className="w-full sm:w-60 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-md space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Overall Readiness</span>
                    <span>{data.readinessScore}%</span>
                  </div>
                  <Progress value={data.readinessScore} color="gradient" />
                </div>
              </div>
            </div>

            {/* Required vs Acquired Skills Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <Card glass className="p-6 space-y-4 border-t-4 border-t-emerald-500">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <CardTitle className="text-sm text-emerald-600 dark:text-emerald-400">
                      Acquired & Verified Skills ({data.matchedSkills?.length || 0})
                    </CardTitle>
                  </div>
                  <Badge variant="success">In Portfolio</Badge>
                </div>

                <div className="space-y-2.5">
                  {data.matchedSkills?.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="font-bold text-foreground">{s.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{s.proficiency}</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Missing Skills */}
              <Card glass className="p-6 space-y-4 border-t-4 border-t-amber-500">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <CardTitle className="text-sm text-amber-600 dark:text-amber-400">
                      Missing Career Skills ({data.missingSkills?.length || 0})
                    </CardTitle>
                  </div>
                  <Badge variant="warning">Action Needed</Badge>
                </div>

                <div className="space-y-2.5">
                  {data.missingSkills?.map((s: any, i: number) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-bold text-foreground">{s.name}</span>
                        </div>
                        <Badge variant="danger" className="text-[10px]">{s.importance}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-amber-500/20">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Est. Time: {s.estimatedTimeToLearn}
                        </span>
                        <span className="font-medium text-primary">Resources available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 3-Phase Personalized Learning Roadmap */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-heading font-extrabold text-foreground">
                  Personalized 3-Phase Learning Roadmap
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {data.learningRoadmap?.map((phase: any) => (
                  <Card key={phase.step} glass className="p-6 space-y-4 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-md shadow-primary/30">
                          {phase.step}
                        </span>
                        <Badge variant="blue">{phase.duration}</Badge>
                      </div>

                      <h3 className="text-sm font-bold text-foreground leading-snug">{phase.phaseName}</h3>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Key Skills to Master:</span>
                        <div className="flex flex-wrap gap-1">
                          {phase.skillsToAcquire?.map((sk: string, sIdx: number) => (
                            <Badge key={sIdx} variant="secondary" className="text-[10px]">{sk}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-border/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action Checklist:</span>
                        <div className="space-y-1.5">
                          {phase.actionItems?.map((act: string, aIdx: number) => (
                            <p key={aIdx} className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-1.5">
                              <span className="text-primary font-bold">→</span>
                              <span>{act}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommended Projects & Certifications */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <Card glass className="p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <FolderGit2 className="w-5 h-5 text-indigo-500" />
                  <CardTitle className="text-sm">High-Yield Capstone Project Ideas</CardTitle>
                </div>
                <div className="space-y-2 text-xs">
                  {data.projectSuggestions?.map((p: string, i: number) => (
                    <p key={i} className="text-muted-foreground p-2 rounded-xl bg-background/50 border border-border/40">
                      💡 {p}
                    </p>
                  ))}
                </div>
              </Card>

              <Card glass className="p-6 space-y-3">
                <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                  <Award className="w-5 h-5 text-rose-500" />
                  <CardTitle className="text-sm">Recommended Industry Certifications</CardTitle>
                </div>
                <div className="space-y-2 text-xs">
                  {data.certificationsToPursue?.map((c: string, i: number) => (
                    <p key={i} className="text-muted-foreground p-2 rounded-xl bg-background/50 border border-border/40">
                      🏆 {c}
                    </p>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default function SkillGapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs font-semibold text-muted-foreground animate-pulse">Loading Skill Gap Analysis...</p>
      </div>
    }>
      <SkillGapContent />
    </Suspense>
  );
}

