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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import {
  Shield,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Activity,
  AlertTriangle,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => {
      if (res.success && res.data) setStats(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const s = stats || {};

  const departmentData = s.departmentDistribution || [
    { name: 'CSE', value: 8 },
    { name: 'IT', value: 5 },
    { name: 'AI&DS', value: 4 },
    { name: 'ECE', value: 3 }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              Administration Console
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Platform-wide analytics, student cohort management, and institutional intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/students">
              <Button variant="outline" size="sm">
                <Users className="w-4 h-4 mr-1.5" /> Student Registry
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button variant="gradient" size="sm">
                <BarChart3 className="w-4 h-4 mr-1.5" /> Deep Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Total Students</span>
            <span className="text-3xl font-heading font-extrabold text-foreground">{s.totalStudents || 20}</span>
            <p className="text-[10px] text-muted-foreground">Across 4 departments</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Faculty Members</span>
            <span className="text-3xl font-heading font-extrabold text-indigo-600 dark:text-indigo-400">{s.totalFaculty || 4}</span>
            <p className="text-[10px] text-muted-foreground">Active mentors assigned</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Placement Rate</span>
            <span className="text-3xl font-heading font-extrabold text-emerald-600 dark:text-emerald-400">{s.placementRate || 88}%</span>
            <p className="text-[10px] text-muted-foreground">Current batch cohort</p>
          </Card>

          <Card glass className="p-5 space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">At-Risk Students</span>
            <span className="text-3xl font-heading font-extrabold text-amber-600 dark:text-amber-400">{s.atRiskCount || 3}</span>
            <p className="text-[10px] text-muted-foreground">Flagged by AI risk engine</p>
          </Card>
        </div>

        {/* Charts & Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department Distribution Pie Chart */}
          <Card glass className="p-6 space-y-4">
            <CardTitle className="text-sm">Department-wise Enrollment</CardTitle>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {departmentData.map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {departmentData.map((d: any, idx: number) => (
                <span key={idx} className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {d.name}: {d.value}
                </span>
              ))}
            </div>
          </Card>

          {/* AI Risk Alerts Panel */}
          <Card glass className="p-6 space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-sm">AI Student Risk Monitor & Alerts</CardTitle>
              </div>
              <Badge variant="purple">Live Engine</Badge>
            </div>

            <div className="space-y-3">
              {(s.riskAlerts || [
                { studentName: 'Sneha Reddy', rollNumber: '23IT103', riskLevel: 'High', reason: 'Attendance at 68% (below 75%), SGPA declined from 7.2 to 6.5', department: 'IT' },
                { studentName: 'Kunal Deshmukh', rollNumber: '23ECE102', riskLevel: 'Medium', reason: '2 active backlogs in semester 4, no mentoring sessions in 60 days', department: 'ECE' },
                { studentName: 'Priya Nair', rollNumber: '23CS108', riskLevel: 'Medium', reason: 'CGPA below 7.0 cutoff for Dream company eligibility, skill matrix incomplete', department: 'CSE' }
              ]).map((alert: any, idx: number) => (
                <div key={idx} className="p-4 rounded-2xl bg-background/60 border border-border/60 flex items-start gap-4 hover:bg-muted/40 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 ${alert.riskLevel === 'High' ? 'bg-red-500' : 'bg-amber-500'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-bold text-foreground">
                        {alert.studentName} <span className="font-mono text-muted-foreground ml-1">({alert.rollNumber})</span>
                      </span>
                      <Badge variant={alert.riskLevel === 'High' ? 'danger' : 'warning'}>{alert.riskLevel} Risk</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{alert.reason}</p>
                    <span className="text-[10px] text-primary font-semibold">{alert.department} Department</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/students">
            <Card glass hover className="p-5 space-y-2 group cursor-pointer">
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-blue-500" />
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Student Registry & Profiles</h3>
              <p className="text-xs text-muted-foreground">Manage student records, AI insights, and risk flags</p>
            </Card>
          </Link>

          <Link href="/admin/faculty">
            <Card glass hover className="p-5 space-y-2 group cursor-pointer">
              <div className="flex items-center justify-between">
                <GraduationCap className="w-5 h-5 text-indigo-500" />
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Faculty & Mentor Management</h3>
              <p className="text-xs text-muted-foreground">View faculty profiles, mentor assignments, and workload</p>
            </Card>
          </Link>

          <Link href="/admin/analytics">
            <Card glass hover className="p-5 space-y-2 group cursor-pointer">
              <div className="flex items-center justify-between">
                <Activity className="w-5 h-5 text-purple-500" />
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-bold text-foreground">Institutional Analytics Engine</h3>
              <p className="text-xs text-muted-foreground">CGPA distributions, placement funnels, skill trends</p>
            </Card>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
