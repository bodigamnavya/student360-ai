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
  Building2,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function PlacementAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [anaRes, readRes] = await Promise.all([
        api.get('/placements/analytics'),
        api.get('/placements/readiness')
      ]);

      if (anaRes.success && anaRes.data) setAnalytics(anaRes.data);
      if (readRes.success && readRes.data) setReadiness(readRes.data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Campus Placement Intelligence</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Recruitment drive analytics, company-wise selections, and student readiness metrics</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/placement/jobs">
              <Button variant="gradient" size="sm">
                <Building2 className="w-4 h-4 mr-1.5" />
                Active Job Drives
              </Button>
            </Link>
            <Link href="/placement/applications">
              <Button variant="outline" size="sm">
                <Layers className="w-4 h-4 mr-1.5" />
                My Applications
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Placement Rate</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-foreground">
                {analytics?.placementRate || 88.4}%
              </span>
              <Badge variant="success">High</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">Eligible batch cohort</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Highest Package</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-purple-600 dark:text-purple-400">
                ₹{analytics?.highestPackage || 28.5}
              </span>
              <span className="text-xs font-bold text-muted-foreground">LPA</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Google SDE Offer</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Average CTC</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-blue-600 dark:text-blue-400">
                ₹{analytics?.averagePackage || 9.2}
              </span>
              <span className="text-xs font-bold text-muted-foreground">LPA</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Across tech & core sectors</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Placed Students</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-foreground">
                {analytics?.totalPlaced || 18} / {analytics?.totalEligible || 20}
              </span>
              <Badge variant="blue">Ongoing</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">Campus drives active</p>
          </Card>
        </div>

        {/* Placement Readiness Breakdown */}
        {readiness && (
          <Card glass className="p-6 sm:p-8 space-y-6 border-l-4 border-l-purple-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> AI Placement Readiness Score
                </span>
                <h3 className="text-xl font-bold text-foreground">
                  Your Overall Readiness: <span className="text-purple-600 dark:text-purple-400">{readiness.overallScore}%</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Eligibility Status: <strong className="text-foreground">{readiness.tierEligibility}</strong>
                </p>
              </div>

              <div className="w-full sm:w-60 space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span>Score Index</span>
                  <span>{readiness.overallScore}/100</span>
                </div>
                <Progress value={readiness.overallScore} color="gradient" />
              </div>
            </div>

            {/* Category Dimension Scores */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(readiness.categoryScores || {}).map(([cat, val]: [string, any]) => (
                <div key={cat} className="p-3 rounded-2xl bg-muted/40 border border-border/50 text-center space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate block capitalize">
                    {cat.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="text-lg font-heading font-extrabold text-foreground">{val}%</span>
                  <Progress value={val} color="primary" />
                </div>
              ))}
            </div>

            {/* Action Plan */}
            <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
              <span className="font-bold text-foreground">Placement Cell Action Plan:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {readiness.actionPlan?.map((act: string, i: number) => (
                  <div key={i} className="p-2.5 rounded-xl bg-background/60 border border-border/40 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Top Recruiting Companies & Department Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Companies */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm">Top Hiring Companies</CardTitle>
              </div>
              <Badge variant="outline">2026 Season</Badge>
            </div>
            <div className="space-y-3">
              {analytics?.topCompanies?.map((comp: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {comp.company.charAt(0)}
                    </div>
                    <span className="font-bold text-foreground">{comp.company}</span>
                  </div>
                  <Badge variant="blue">{comp.count} Offers</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Department Placement Statistics */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-sm">Department-wise Selections</CardTitle>
              </div>
              <Badge variant="outline">Branch Breakdown</Badge>
            </div>
            <div className="space-y-3">
              {analytics?.departmentStats?.map((dept: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-background/50 border border-border/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground truncate max-w-[200px]">{dept.department}</span>
                    <span className="font-bold text-primary">{dept.percentage}% Placed</span>
                  </div>
                  <Progress value={dept.percentage} color="gradient" />
                  <p className="text-[10px] text-muted-foreground">{dept.placed} placed out of {dept.eligible} eligible</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
