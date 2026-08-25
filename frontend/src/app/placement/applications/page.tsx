'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Layers,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Send
} from 'lucide-react';

const STAGES = [
  'Applied',
  'Shortlisted',
  'Online Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Offer Accepted'
];

export default function ApplicationsTrackerPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/applications/my').then((res) => {
      if (res.success && res.data) {
        setApplications(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getStageIndex = (stage: string) => {
    return STAGES.indexOf(stage);
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground">Placement Application Stage Tracker</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time status updates, technical interview schedules, and offer letters</p>
        </div>

        {applications.length === 0 && !loading ? (
          <Card glass className="p-12 text-center space-y-4">
            <Layers className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-base font-bold text-foreground">No Applications Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Explore eligible campus drives and apply with your AI digital portfolio.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const currentIdx = getStageIndex(app.currentStage);
              const job = app.job || {};

              return (
                <Card key={app._id} glass className="p-6 sm:p-8 space-y-6 border-l-4 border-l-primary">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border/60 pb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-primary">{job.company || 'Corporate Drive'}</span>
                        <h3 className="text-lg font-bold text-foreground">{job.jobRole || 'Software Engineer'}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-3 pt-1">
                          <span>Applied: {formatDate(app.appliedDate)}</span>
                          <span className="font-bold text-emerald-600">CTC: ₹{job.salaryRange?.min} - ₹{job.salaryRange?.max} LPA</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="purple" className="gap-1 text-xs">
                        <Sparkles className="w-3 h-3" /> AI Match: {app.aiMatchScore || 90}%
                      </Badge>
                      <Badge variant={app.currentStage === 'Offer Accepted' || app.currentStage === 'Selected' ? 'success' : 'blue'} className="text-xs">
                        {app.currentStage}
                      </Badge>
                    </div>
                  </div>

                  {/* Visual Stage Progress Bar */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Recruitment Stage Funnel:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                      {STAGES.map((st, sIdx) => {
                        const isDone = sIdx < currentIdx;
                        const isCurrent = sIdx === currentIdx;

                        return (
                          <div
                            key={st}
                            className={`p-2.5 rounded-xl text-center text-xs font-semibold transition-all border ${
                              isDone
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                : isCurrent
                                ? 'bg-primary border-primary text-white shadow-md shadow-primary/30 font-bold'
                                : 'bg-muted/30 border-border/50 text-muted-foreground'
                            }`}
                          >
                            <span className="block text-[10px] opacity-75">Stage {sIdx + 1}</span>
                            <span className="truncate block mt-0.5">{st}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Notes & Scheduled Interviews */}
                  {app.stageHistory && app.stageHistory.length > 0 && (
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2 text-xs">
                      <span className="font-bold text-foreground">Latest Update / Stage Activity:</span>
                      {app.stageHistory.slice(-1).map((h: any, idx: number) => (
                        <div key={idx} className="space-y-1 text-muted-foreground">
                          <p className="font-medium text-foreground">{h.notes || 'Stage in progress'}</p>
                          <p className="text-[11px]">Updated on: {formatDate(h.updatedAt)}</p>
                          {h.scheduledTime && (
                            <p className="text-xs font-bold text-primary flex items-center gap-1.5 pt-1">
                              <Clock className="w-3.5 h-3.5" /> Scheduled Interview: {new Date(h.scheduledTime).toLocaleString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
