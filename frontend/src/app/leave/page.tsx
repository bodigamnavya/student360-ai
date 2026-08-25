'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LeavePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Leave Management</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Apply Leave</button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>Track your past and pending leave requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No leave records found.</div>
        </CardContent>
      </Card>
    </div>
  );
}
