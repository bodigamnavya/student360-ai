'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await api.post('/auth/forgot-password', { email });
    setMessage(res.message || 'If registered, password reset instructions have been dispatched.');
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background relative">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-extrabold text-xl shadow-md">
              360
            </div>
            <span className="font-heading font-extrabold text-2xl text-foreground">
              Student<span className="text-primary">360</span> AI
            </span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-foreground">Reset Password</h1>
          <p className="text-xs text-muted-foreground">Enter your verified email to receive a recovery link</p>
        </div>

        <Card glass className="p-6 sm:p-8 space-y-6 border-border/80 shadow-2xl">
          {message && (
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="e.g. student@student360.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
              Send Recovery Instructions
            </Button>
          </form>

          <div className="text-center">
            <Link href="/login" className="text-xs font-bold text-primary hover:underline">
              ← Return to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
