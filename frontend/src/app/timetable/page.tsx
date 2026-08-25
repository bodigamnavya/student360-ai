'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TimetablePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Class Timetable</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Your classes for the current semester.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">Timetable data not available.</div>
        </CardContent>
      </Card>
    </div>
  );
}
