'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { api } from '@/lib/api';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await api.get('/assignments');
        if (res.data?.success) setAssignments(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Refresh</button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Assignments</CardTitle>
          <CardDescription>View and submit your subject assignments.</CardDescription>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <div className="text-muted-foreground text-sm">No assignments found.</div>
          ) : (
            <ul className="space-y-2">
              {assignments.map((a: any) => (
                <li key={a._id} className="p-3 border rounded-lg">
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground">{a.subject} • Due: {new Date(a.dueDate).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
