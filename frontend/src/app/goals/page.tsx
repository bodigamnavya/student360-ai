'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function GoalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Goals & Milestones</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Create Goal</button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active Goals</CardTitle>
          <CardDescription>Track your short-term and long-term objectives.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No active goals. Time to set some!</div>
        </CardContent>
      </Card>
    </div>
  );
}
