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
  Calendar,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  Brain,
  Layers
} from 'lucide-react';

export default function WeeklyActionPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    api.post('/ai/weekly-plan', {}).then((res) => {
      if (res.success && res.data) {
        setPlan(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleTask = (taskId: string) => {
    if (!plan) return;
    const updatedTasks = plan.tasks.map((t: any) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter((t: any) => t.completed).length;
    const completionRate = Math.round((completedCount / updatedTasks.length) * 100);

    setPlan({
      ...plan,
      tasks: updatedTasks,
      completionRate
    });
  };

  const tasks = plan?.tasks || [];
  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter((t: any) => t.category === filter);
  const completedCount = tasks.filter((t: any) => t.completed).length;

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Sprint Velocity</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">AI Prioritized</Badge>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI Weekly Action Plan</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              High-leverage weekly tasks aligned with your active skill gaps, projects, and target placement goals
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/career/interview">
              <Button variant="outline" size="sm">
                Mock Interview
              </Button>
            </Link>
            <Link href="/career/roadmap">
              <Button size="sm">
                Learning Roadmap
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Progress & AI Feedback Overview */}
        {loading ? (
          <div className="h-44 rounded-3xl bg-muted/60 animate-pulse" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card glass className="p-6 md:col-span-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Week Progress</span>
                <span className="text-xs font-bold text-primary">{completedCount}/{tasks.length} Completed</span>
              </div>
              <div className="text-3xl font-heading font-extrabold text-foreground">
                {plan?.completionRate || 0}%
              </div>
              <Progress value={plan?.completionRate || 0} className="h-2.5" />
              <p className="text-[11px] text-muted-foreground">
                Complete at least 80% of weekly sprint goals to maintain top placement velocity.
              </p>
            </Card>

            <Card glass className="p-6 md:col-span-2 space-y-3 bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">AI Coach Sprint Insights</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {plan?.aiFeedback || 'Consistent weekly execution across DSA and project development increases placement conversion by 4.2x.'}
              </p>
              <div className="flex items-center gap-4 pt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-500" /> 3 Week Streak</span>
                <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-primary" /> Target: Tier 1 Product Placement</span>
              </div>
            </Card>
          </div>
        )}

        {/* Task Filter & List */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['ALL', 'DSA', 'Development', 'Resume', 'Interview', 'Core CS'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filter === cat
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task: any) => (
              <Card
                glass
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 sm:p-5 flex items-start gap-4 cursor-pointer transition-all border-border/80 hover:border-primary/40 ${
                  task.completed ? 'opacity-70 bg-muted/20' : 'hover:shadow-md'
                }`}
              >
                <button className="mt-0.5 flex-shrink-0 text-primary">
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {task.category}
                    </Badge>
                  </div>
                  <div
                    className={`text-xs sm:text-sm font-semibold text-foreground ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
