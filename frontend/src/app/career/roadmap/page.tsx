'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  Sparkles,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight,
  FolderGit2,
  BookOpen,
  Calendar,
  Layers,
  Flame,
  CheckSquare,
  Square
} from 'lucide-react';

export default function LearningRoadmapPage() {
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRoadmap = async (role: string) => {
    setLoading(true);
    try {
      const res = await api.post('/ai/learning-roadmap', { targetRole: role });
      if (res.success && res.data) {
        setRoadmap(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap(targetRole);
  }, [targetRole]);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Career Trajectory</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">AI Generated</Badge>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Personalized Learning Roadmap</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Targeted month-by-month technical milestones and project-based assignments to bridge skill gaps
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/career/interview">
              <Button variant="outline" size="sm">
                AI Interview Coach
              </Button>
            </Link>
            <Link href="/career/weekly-plan">
              <Button size="sm">
                Weekly Action Plan
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Selector & Overview Card */}
        <Card glass className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Select Target Role</label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full sm:w-72 h-10 px-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Backend Developer">Backend & Systems Engineer</option>
                <option value="Frontend Engineer">Frontend Engineer</option>
                <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                <option value="Data Analyst & BI Engineer">Data Analyst & BI Engineer</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
              </select>
            </div>

            {roadmap && (
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Current Readiness</div>
                  <div className="text-2xl font-heading font-bold text-primary">{roadmap.overallReadiness || 72}%</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground">Total Milestones</div>
                  <div className="text-2xl font-heading font-bold text-foreground">{roadmap.steps?.length || 4} Months</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Timeline Steps */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-muted/60" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {roadmap?.steps?.map((step: any, idx: number) => (
              <Card glass key={idx} className="p-6 sm:p-8 space-y-5 border-border/80 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-base flex-shrink-0">
                      M{step.month}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px]">{step.difficulty || 'Intermediate'}</Badge>
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/10 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {step.estimatedDuration || '4 weeks'}
                        </Badge>
                      </div>
                      <h3 className="text-base sm:text-lg font-heading font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{step.learningObjective}</p>
                    </div>
                  </div>
                </div>

                {/* Practice Tasks */}
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2.5">
                  <div className="text-xs font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span>Practice Exercises & Study Topics</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {step.practiceTasks?.map((task: string, tIdx: number) => (
                      <div key={tIdx} className="p-2.5 rounded-xl bg-background border border-border/60 text-xs text-muted-foreground flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capstone Project Task */}
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3">
                  <FolderGit2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground">Monthly Capstone Deliverable</div>
                    <p className="text-xs text-muted-foreground">{step.projectTask}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
