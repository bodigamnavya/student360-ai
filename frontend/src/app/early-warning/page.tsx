'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ShieldAlert } from 'lucide-react';

export default function EarlyWarningPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-8 h-8 text-destructive" />
          AI Early Warning System
        </h1>
      </div>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Risk Assessment</CardTitle>
          <CardDescription>AI-driven analysis of your academic and attendance status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">Scanning your profile for risks... You are currently in the SAFE zone.</div>
        </CardContent>
      </Card>
    </div>
  );
}
