'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export default function ActivitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Extracurricular Activities</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Add Activity</button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Activities</CardTitle>
          <CardDescription>Clubs, sports, volunteering, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No activities recorded.</div>
        </CardContent>
      </Card>
    </div>
  );
}
