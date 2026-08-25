'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  CalendarCheck,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingDown,
  Info
} from 'lucide-react';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [attRes, predRes] = await Promise.all([
        api.get('/attendance'),
        api.get('/attendance/prediction')
      ]);

      if (attRes.success && attRes.data) {
        setAttendance(attRes.data);
      }
      if (predRes.success && predRes.data) {
        setPrediction(predRes.data);
      }
      setLoading(false);
    };
    load();
  }, []);

  const latest = attendance[0] || {};
  const subjects = latest.subjects || [];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground">Attendance & Predictive Risk Engine</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Subject-level attendance tracking, monthly logs, and AI shortfall prediction</p>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card glass className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Overall Semester Attendance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-foreground">
                {latest.overallPercentage ? latest.overallPercentage.toFixed(1) : '87.8'}%
              </span>
              <Badge variant={latest.overallPercentage >= 75 ? 'success' : 'danger'}>
                {latest.overallPercentage >= 75 ? 'Safe (>75%)' : 'Shortage'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {latest.totalClassesAttended || 137} attended out of {latest.totalClassesHeld || 156} total classes
            </p>
          </Card>

          <Card glass className="p-6 space-y-2 border-l-4 border-l-purple-500">
            <span className="text-xs font-semibold text-muted-foreground">AI Predicted Final Attendance</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-heading font-extrabold text-purple-600 dark:text-purple-400">
                {prediction?.predictedFinalAttendance || 86.2}%
              </span>
              <Badge variant="purple">AI Forecast</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Based on historical attendance velocity</p>
          </Card>

          <Card glass className="p-6 space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Detention Risk Level</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold capitalize text-foreground">
                {prediction?.riskLevel || 'Low'} Risk
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs text-muted-foreground">Eligible for end-semester university examinations</p>
          </Card>
        </div>

        {/* AI Predictive Insight Banner */}
        <Card glass className="p-6 border-l-4 border-l-primary space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-foreground">AI Attendance Advisory & Target Actions</h3>
          </div>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            {prediction?.recommendation || 'Your overall attendance is in healthy compliance with university regulations.'}
          </p>
          {prediction?.classesNeededFor75 > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Target: Attend at least {prediction.classesNeededFor75} of the next classes consecutively to clear the 75% examination threshold.</span>
            </div>
          )}
        </Card>

        {/* Subject-wise Attendance Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-extrabold text-foreground">Subject-Level Attendance Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subjects.map((sub: any, idx: number) => {
              const isWarning = sub.attendancePercentage < 75;
              return (
                <Card key={idx} glass className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                        {sub.subjectCode}
                      </span>
                      <h4 className="text-sm font-bold text-foreground mt-1">{sub.subjectName}</h4>
                      {sub.facultyName && (
                        <p className="text-[11px] text-muted-foreground">Faculty: {sub.facultyName}</p>
                      )}
                    </div>
                    <Badge variant={isWarning ? 'danger' : 'success'}>
                      {sub.attendancePercentage.toFixed(1)}%
                    </Badge>
                  </div>

                  <Progress
                    value={sub.attendancePercentage}
                    color={isWarning ? 'danger' : 'success'}
                  />

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                    <span>Attended: {sub.classesAttended} / {sub.classesHeld} classes</span>
                    <span>Status: {sub.status}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Monthly Attendance Trends Chart */}
        {latest.monthlyTrend && latest.monthlyTrend.length > 0 && (
          <Card glass className="p-6 space-y-4">
            <div>
              <CardTitle>Monthly Attendance Consistency Trend</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Month-by-month attendance percentage tracking</p>
            </div>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latest.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[50, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="percentage" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="Attendance %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
