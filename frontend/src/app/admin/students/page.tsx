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
  Users,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowUpDown
} from 'lucide-react';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const loadStudents = async () => {
    setLoading(true);
    const res = await api.get(`/admin/students?search=${encodeURIComponent(searchQuery)}&department=${encodeURIComponent(filterDept)}`);
    if (res.success && res.data) {
      const list = Array.isArray(res.data) ? res.data : (res.data.students || []);
      setStudents(list);
    } else {
      setStudents([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
  }, [searchQuery, filterDept]);

  const studentList = Array.isArray(students) ? students : [];

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Student Master Registry</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Complete student cohort data with CGPA, readiness scores, and AI risk flags</p>
          </div>
          <Badge variant="blue">{studentList.length} Students</Badge>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, roll number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            />
          </div>
          <select
            className="h-10 rounded-xl border border-input bg-card px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="Computer Science and Engineering">CSE</option>
            <option value="Information Technology">IT</option>
            <option value="Artificial Intelligence & Data Science">AI&DS</option>
            <option value="Electronics & Communication Engineering">ECE</option>
          </select>
        </div>

        {/* Students Table */}
        <Card glass className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-3.5">Student</th>
                  <th className="p-3.5">Roll No.</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5 text-center">CGPA</th>
                  <th className="p-3.5 text-center">Attendance</th>
                  <th className="p-3.5 text-center">Readiness</th>
                  <th className="p-3.5 text-center">Risk</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {studentList.map((stu) => {
                  const name = stu.user?.name || stu.name || 'Student';
                  const email = stu.user?.email || stu.email || '';
                  const attendanceVal = stu.overallAttendancePercentage ?? stu.attendance ?? 85;
                  const readinessVal = stu.placementReadinessScore ?? stu.placementReadiness ?? 75;
                  const risk = stu.riskLevel || 'Low';

                  return (
                    <tr key={stu._id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {name ? name.charAt(0) : 'S'}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">{name}</span>
                            <span className="text-[10px] text-muted-foreground">{email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-foreground">{stu.rollNumber || 'N/A'}</td>
                      <td className="p-3.5 text-muted-foreground truncate max-w-[150px]">{stu.department}</td>
                      <td className="p-3.5 text-center">
                        <span className="font-bold text-foreground">{stu.cgpa ? Number(stu.cgpa).toFixed(2) : 'N/A'}</span>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className={`font-bold ${attendanceVal >= 75 ? 'text-emerald-600' : 'text-destructive'}`}>
                          {Number(attendanceVal).toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="font-bold text-primary">{readinessVal}%</span>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <Badge variant={risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'success'} className="text-[9px]">
                          {risk}
                        </Badge>
                      </td>
                      <td className="p-3.5 text-center">
                        <Link href={`/profile`}>
                          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors" title="View Profile">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
