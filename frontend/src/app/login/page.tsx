'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth, DEMO_ACCOUNTS, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Sparkles, UserCheck, GraduationCap, Layers, Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleDemo = async (role: UserRole) => {
    setError('');
    await quickDemoLogin(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

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
          <h1 className="text-2xl font-heading font-bold text-foreground">Welcome back</h1>
          <p className="text-xs text-muted-foreground">Sign in to your unified academic & career dashboard</p>
        </div>

        <Card glass className="p-6 sm:p-8 space-y-6 border-border/80 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. student@student360.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Password</label>
                <Link href="/forgot-password" className="text-[11px] font-semibold text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          {/* Quick Demo Logins */}
          <div className="space-y-3 pt-2 border-t border-border/60">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              1-Click Demo Login Switcher
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="p-2.5 rounded-xl border border-border/80 hover:border-blue-500/40 bg-background/60 hover:bg-blue-500/5 text-left text-xs transition-colors flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="font-bold truncate text-foreground">Student</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('faculty')}
                className="p-2.5 rounded-xl border border-border/80 hover:border-indigo-500/40 bg-background/60 hover:bg-indigo-500/5 text-left text-xs transition-colors flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
                <span className="font-bold truncate text-foreground">Faculty</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('placement_officer')}
                className="p-2.5 rounded-xl border border-border/80 hover:border-amber-500/40 bg-background/60 hover:bg-amber-500/5 text-left text-xs transition-colors flex items-center gap-2"
              >
                <Layers className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold truncate text-foreground">Placement</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="p-2.5 rounded-xl border border-border/80 hover:border-purple-500/40 bg-background/60 hover:bg-purple-500/5 text-left text-xs transition-colors flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="font-bold truncate text-foreground">Admin</span>
              </button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Register new account
          </Link>
        </p>
      </div>
    </div>
  );
}
