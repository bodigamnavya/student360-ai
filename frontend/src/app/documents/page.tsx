'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Vault</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Upload Document</button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>My Documents</CardTitle>
          <CardDescription>Securely store and manage your important files.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-sm">No documents found.</div>
        </CardContent>
      </Card>
    </div>
  );
}
