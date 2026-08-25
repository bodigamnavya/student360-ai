'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import {
  SearchCheck,
  Building2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Send,
  Check
} from 'lucide-react';

export default function JobMatchingPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    const res = await api.get('/jobs');
    if (res.success && res.data) {
      setJobs(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleApply = async (jobId: string) => {
    setApplyingId(jobId);
    const res = await api.post(`/jobs/${jobId}/apply`, {});
    if (res.success) {
      alert('Application submitted successfully with AI matching profile!');
      await loadJobs();
    } else {
      alert(res.message || 'Failed to submit application');
    }
    setApplyingId(null);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI Placement Job Matching Engine</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Real-time match scoring and eligibility verification for campus recruitment drives</p>
          </div>
          <Badge variant="purple" className="gap-1.5 py-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Compatibility Scoring
          </Badge>
        </div>

        {/* Jobs with AI Matching Scores */}
        <div className="space-y-6">
          {jobs.map((job) => {
            const match = job.aiMatch || { matchScore: 75, isEligible: true, strengths: [], gaps: [] };

            return (
              <Card key={job._id} glass className="p-6 sm:p-8 space-y-6 border-l-4 border-l-primary">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center text-foreground font-extrabold text-xl shrink-0 p-2">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-foreground">{job.jobRole}</h3>
                        <Badge variant="blue">{job.company}</Badge>
                        <Badge variant={job.jobType === 'Full-time' ? 'success' : 'purple'}>
                          {job.jobType}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-4 flex-wrap pt-1">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {job.location}
                        </span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          CTC: {job.salaryRange?.min} - {job.salaryRange?.max} {job.salaryRange?.currency || 'LPA'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> Deadline: {formatDate(job.applicationDeadline)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Match Score Badge */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-2xl font-heading font-extrabold text-primary">
                        {match.matchScore}%
                      </span>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">AI Match Score</p>
                    </div>
                    <div className="w-16 hidden sm:block">
                      <Progress value={match.matchScore} color="gradient" />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{job.description}</p>

                {/* Match Strengths & Gaps Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Strengths */}
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Your Matching Strengths
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {match.strengths?.map((st: string, i: number) => (
                        <Badge key={i} variant="success" className="text-[10px]">{st}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4" /> Potential Gaps / Preferred Tech
                    </span>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {match.gaps?.length > 0 ? (
                        match.gaps.map((gp: string, i: number) => (
                          <Badge key={i} variant="warning" className="text-[10px]">{gp}</Badge>
                        ))
                      ) : (
                        <span className="text-[11px] text-muted-foreground">All required skills matched!</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Eligibility Check & Apply */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs">
                    {match.isEligible ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Fully Eligible (CGPA &gt; {job.minCgpa}, Branch Criteria Met)
                      </span>
                    ) : (
                      <span className="text-destructive font-bold flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Ineligible: {match.ineligibilityReasons?.join(', ')}
                      </span>
                    )}
                  </div>

                  {job.hasApplied ? (
                    <Button variant="secondary" size="sm" disabled className="gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500" /> Applied
                    </Button>
                  ) : (
                    <Button
                      variant="gradient"
                      size="sm"
                      disabled={!match.isEligible}
                      isLoading={applyingId === job._id}
                      onClick={() => handleApply(job._id)}
                      className="gap-1.5 shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" /> 1-Click Apply with AI Profile
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
