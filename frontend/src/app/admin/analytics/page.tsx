'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  GraduationCap,
  Target,
  Activity
} from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics').then((res) => {
      if (res.success && res.data) setAnalytics(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const a = analytics || {};

  const cgpaDistribution = a.cgpaDistribution || [
    { range: '9.0-10.0', count: 4 },
    { range: '8.0-8.9', count: 7 },
    { range: '7.0-7.9', count: 5 },
    { range: '6.0-6.9', count: 3 },
    { range: '<6.0', count: 1 }
  ];

  const skillTrends = a.topSkills || [
    { skill: 'JavaScript', count: 16 },
    { skill: 'Python', count: 14 },
    { skill: 'React', count: 13 },
    { skill: 'Node.js', count: 12 },
    { skill: 'TypeScript', count: 11 },
    { skill: 'Docker', count: 8 },
    { skill: 'AWS', count: 7 },
    { skill: 'MongoDB', count: 10 }
  ];

  const readinessDistribution = a.readinessDistribution || [
    { name: 'Super Dream (85%+)', value: 6 },
    { name: 'Dream (70-84%)', value: 8 },
    { name: 'Standard (50-69%)', value: 4 },
    { name: 'Developing (<50%)', value: 2 }
  ];

  const batchTrend = a.batchTrend || [
    { year: '2023', avgCgpa: 7.8, placementRate: 82 },
    { year: '2024', avgCgpa: 8.1, placementRate: 85 },
    { year: '2025', avgCgpa: 8.3, placementRate: 88 },
    { year: '2026', avgCgpa: 8.5, placementRate: 91 }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Institutional Analytics Engine
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Cohort-level CGPA distributions, skill ecosystem mapping, and placement funnel analytics</p>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Avg. Cohort CGPA</span>
            <span className="text-3xl font-heading font-extrabold text-foreground">{a.avgCgpa || 8.42}</span>
            <Progress value={(a.avgCgpa || 8.42) * 10} color="primary" />
          </Card>
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Avg. Attendance</span>
            <span className="text-3xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">{a.avgAttendance || 83.2}%</span>
            <Progress value={a.avgAttendance || 83.2} color="success" />
          </Card>
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Avg. Readiness Score</span>
            <span className="text-3xl font-heading font-extrabold text-purple-600 dark:text-purple-400">{a.avgReadiness || 76}%</span>
            <Progress value={a.avgReadiness || 76} color="gradient" />
          </Card>
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Total Unique Skills</span>
            <span className="text-3xl font-heading font-extrabold text-blue-600 dark:text-blue-400">{a.totalSkills || 42}</span>
            <p className="text-[10px] text-muted-foreground">Across the student cohort</p>
          </Card>
        </div>

        {/* Charts Row 1: CGPA Distribution & Skill Ecosystem */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CGPA Distribution Bar Chart */}
          <Card glass className="p-6 space-y-4">
            <CardTitle>CGPA Distribution Across Cohort</CardTitle>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cgpaDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Top Skills Horizontal Bar Chart */}
          <Card glass className="p-6 space-y-4">
            <CardTitle>Most Common Technical Skills in Portfolios</CardTitle>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillTrends} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="skill" type="category" stroke="#94a3b8" fontSize={11} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 8, 8, 0]} name="Students with Skill" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Charts Row 2: Placement Readiness Pie & Year-over-Year Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Readiness Tier Distribution */}
          <Card glass className="p-6 space-y-4">
            <CardTitle>Placement Readiness Tier Distribution</CardTitle>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={readinessDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value">
                    {readinessDistribution.map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {readinessDistribution.map((d: any, idx: number) => (
                <span key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          </Card>

          {/* Year-over-Year Trend Line */}
          <Card glass className="p-6 space-y-4">
            <CardTitle>Year-over-Year Performance Trend</CardTitle>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={batchTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                  <Line type="monotone" dataKey="avgCgpa" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 5 }} name="Avg CGPA" />
                  <Line type="monotone" dataKey="placementRate" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} name="Placement Rate %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
