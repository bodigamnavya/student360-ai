'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  GraduationCap,
  CalendarCheck,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  Target,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass,
  FileText,
  MessageSquare
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not student, redirect to appropriate role portal
    if (user && user.role !== 'student') {
      if (user.role === 'placement_officer') router.push('/placement');
      else router.push('/admin');
      return;
    }

    api.get('/students/dashboard').then((res) => {
      if (res.success && res.data) {
        setData(res.data);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, router]);

  if (loading || !data) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-36 rounded-3xl bg-muted/60" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-muted/60" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-72 rounded-2xl bg-muted/60" />
            <div className="h-72 rounded-2xl bg-muted/60" />
          </div>
        </div>
      </AppLayout>
    );
  }

  const s = data.summary || {};
  const readiness = data.readinessDetails || {};
  const risk = data.riskDetails || {};

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Profile Summary Hero Card */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 text-white shadow-2xl border border-white/10">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shrink-0 border-2 border-white/20">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    {user?.name || 'Aarav Sharma'}
                  </h1>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-white/15 text-white/90 border border-white/20">
                    {data.profile?.rollNumber || '23CS101'}
                  </span>
                  <Badge variant={risk.riskLevel === 'High' ? 'danger' : risk.riskLevel === 'Medium' ? 'warning' : 'success'}>
                    Risk: {risk.riskLevel || 'Low'}
                  </Badge>
                </div>
                <p className="text-xs text-blue-100/80 font-medium">
                  {data.profile?.degree || 'B.Tech'} in {data.profile?.department || 'CSE'} • Year {data.profile?.currentYear || 3}, Sem {data.profile?.currentSemester || 6}
                </p>
                <p className="text-xs text-blue-200/90 font-semibold flex items-center gap-1.5 pt-1">
                  <Target className="w-3.5 h-3.5 text-amber-300" />
                  Target Goal: <span className="text-white font-bold">{data.profile?.targetRole || 'Full Stack Developer'}</span>
                  {data.profile?.mentor && (
                    <span className="text-blue-200/70 ml-2 hidden sm:inline">
                      • Mentor: {data.profile.mentor.name}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Link href="/career/assistant">
                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-300" />
                  AI Career Coach
                </Button>
              </Link>
              <Link href="/resume">
                <Button variant="primary" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Resume Builder
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 8 Metric KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Cumulative GPA</span>
              <GraduationCap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.cgpa ? s.cgpa.toFixed(2) : '8.84'}</span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">/ 10.0</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">0 active backlogs</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Attendance</span>
              <CalendarCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.attendance ? s.attendance.toFixed(1) : '87.8'}%</span>
              <span className="text-[10px] font-bold text-emerald-600">Safe (&gt;75%)</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Pred. Final: {data.attendanceOverview?.predictedFinalPercentage || 86}%</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Placement Readiness</span>
              <Target className="w-4 h-4 text-purple-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400">{s.placementReadiness || 88}%</span>
              <Badge variant="purple" className="text-[9px]">Tier-1</Badge>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Super Dream Eligible</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Projects Built</span>
              <FolderGit2 className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.projectsCount || 3}</span>
              <span className="text-[10px] text-primary font-bold">2 Featured</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">AI analyzed & tagged</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Internships</span>
              <Briefcase className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.internshipsCount || 2}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Razorpay, Swiggy</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Certifications</span>
              <Award className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.certificationsCount || 3}</span>
              <span className="text-[10px] text-blue-600 font-bold">AWS + Meta</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">OCR scanned & verified</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Achievements</span>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.achievementsCount || 2}</span>
              <span className="text-[10px] text-amber-600 font-bold">SIH 1st</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Hackathons & Research</p>
          </Card>

          <Card hover glass className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Verified Skills</span>
              <Sparkles className="w-4 h-4 text-teal-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-heading font-extrabold text-foreground">{s.skillsCount || 11}</span>
              <span className="text-[10px] text-teal-600 font-bold">7 Expert</span>
            </div>
            <p className="text-[10px] text-muted-foreground font-medium">Mapped to job matrix</p>
          </Card>
        </div>

        {/* Charts: Semester Academic Progress & Subject-wise Attendance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Progression Recharts Area */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Academic Progression (SGPA vs CGPA)</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Semester-wise semester GPA and cumulative trend</p>
              </div>
              <Link href="/academics" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                View Marks <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.academicTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[6, 10]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="sgpa" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#sgpaGrad)" name="SGPA" />
                  <Area type="monotone" dataKey="cgpa" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#cgpaGrad)" name="CGPA" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Subject Attendance Breakdown Bar Chart */}
          <Card glass className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Subject-wise Attendance Distribution</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">Current semester subject attendance vs 75% cutoff</p>
              </div>
              <Link href="/attendance" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.attendanceOverview?.subjects || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="subjectCode" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="attendancePercentage" fill="#10b981" radius={[8, 8, 0, 0]} name="Attendance %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* AI Insights Banner Feed & Recommended Next Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="text-base font-bold text-foreground">AI Intelligence & Proactive Insights</h3>
              </div>
              <Badge variant="purple">Live Heuristic + AI</Badge>
            </div>

            <div className="space-y-3">
              {(data.insights || []).map((ins: any) => (
                <Card key={ins._id} glass className="p-4 border-l-4 border-l-primary space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      {ins.title}
                    </span>
                    {ins.score && <Badge variant="blue">{ins.score}% Score</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{ins.summary}</p>
                  {ins.recommendations && ins.recommendations.length > 0 && (
                    <div className="pt-2 border-t border-border/40 space-y-1">
                      {ins.recommendations.map((rec: string, i: number) => (
                        <p key={i} className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {rec}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Action Station */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-500" />
              Career Navigation Hub
            </h3>

            <Card glass className="p-5 space-y-3">
              <Link href="/career/skill-gap" className="block p-3 rounded-xl bg-background/60 hover:bg-muted/80 border border-border transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Skill Gap Analysis</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Benchmark against target software engineering roles.</p>
              </Link>

              <Link href="/placement/jobs" className="block p-3 rounded-xl bg-background/60 hover:bg-muted/80 border border-border transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Campus Job Drives</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Explore matching recruitment drives with Google & Microsoft.</p>
              </Link>

              <Link href="/resume" className="block p-3 rounded-xl bg-background/60 hover:bg-muted/80 border border-border transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Generate ATS Resume</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">Export 1-click ATS-ready resume in PDF format.</p>
              </Link>

              <Link href="/career/assistant" className="block p-3 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat with AI Assistant
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-primary/80 mt-1">Get 1-on-1 personalized guidance on interview prep.</p>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
