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
  Compass,
  Sparkles,
  Target,
  ArrowRight,
  TrendingUp,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CareerTrajectoryPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/careers/recommendations').then((res) => {
      if (res.success && res.data) {
        setRecommendations(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI Career Trajectory & Pathways</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Comprehensive career suitability ranking calculated from academic grades, technical projects, and skills</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/career/skill-gap">
              <Button variant="outline" size="sm">
                <Target className="w-4 h-4 mr-1.5" />
                Skill Gap Analyzer
              </Button>
            </Link>
            <Link href="/career/assistant">
              <Button variant="gradient" size="sm">
                <Sparkles className="w-4 h-4 mr-1.5" />
                Chat with Career Coach
              </Button>
            </Link>
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
          {recommendations.map((rec, idx) => (
            <Card key={idx} glass className="p-6 sm:p-8 space-y-6 border-l-4 border-l-primary">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-foreground">{rec.role}</h3>
                    <Badge variant="purple">{rec.domain}</Badge>
                    <Badge variant="success">Market Demand: {rec.marketDemand}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-2xl font-heading font-extrabold text-primary">{rec.matchScore}%</span>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Role Compatibility</p>
                  </div>
                  <div className="w-20">
                    <Progress value={rec.matchScore} color="gradient" />
                  </div>
                </div>
              </div>

              {/* Strengths & Missing Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Strengths */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Matching Skills in Portfolio
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.strengths?.map((s: string, i: number) => (
                      <Badge key={i} variant="success" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Recommended Skills to Acquire
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.missingSkills?.map((s: string, i: number) => (
                      <Badge key={i} variant="warning" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggested Courses & Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-2">
                <div className="space-y-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-500" /> Recommended Learning Modules
                  </span>
                  <div className="space-y-1.5">
                    {rec.recommendedCourses?.map((c: string, i: number) => (
                      <p key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-primary font-bold">•</span>
                        <span>{c}</span>
                      </p>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <FolderGit2 className="w-4 h-4 text-purple-500" /> High-Impact Suggested Projects
                  </span>
                  <div className="space-y-1.5">
                    {rec.suggestedProjects?.map((p: string, i: number) => (
                      <p key={i} className="text-muted-foreground flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs">
                <span className="text-muted-foreground">
                  Average Fresher / Early-Career CTC: <strong className="text-foreground">{rec.averageSalaryRange}</strong>
                </span>
                <Link
                  href={`/career/skill-gap?role=${encodeURIComponent(rec.role)}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  View Step-by-Step Learning Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
