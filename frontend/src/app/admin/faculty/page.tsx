'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import {
  GraduationCap,
  Users,
  Mail,
  BookOpen
} from 'lucide-react';

export default function AdminFacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/faculty').then((res) => {
      if (res.success && res.data) setFaculty(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground">Faculty & Mentor Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">View faculty profiles, mentor-student assignments, and department workloads</p>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faculty.map((fac) => (
            <Card key={fac._id} glass hover className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0">
                  {fac.name ? fac.name.charAt(0) : 'F'}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-foreground">{fac.name}</h3>
                  <p className="text-xs text-primary font-semibold">{fac.department}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {fac.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-border/60">
                <div className="p-2.5 rounded-xl bg-muted/40 text-center space-y-0.5">
                  <Users className="w-4 h-4 text-blue-500 mx-auto" />
                  <span className="text-lg font-heading font-extrabold text-foreground">{fac.assignedStudents || 5}</span>
                  <p className="text-[10px] text-muted-foreground">Mentees</p>
                </div>
                <div className="p-2.5 rounded-xl bg-muted/40 text-center space-y-0.5">
                  <BookOpen className="w-4 h-4 text-purple-500 mx-auto" />
                  <span className="text-lg font-heading font-extrabold text-foreground">{fac.totalSessions || 12}</span>
                  <p className="text-[10px] text-muted-foreground">Sessions</p>
                </div>
              </div>

              <Badge variant="success" className="w-full justify-center">Active Mentor</Badge>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
