'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: 'Computer Science and Engineering',
    rollNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (!res.success) {
      setError(res.message);
    }
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Create Student Account</h1>
          <p className="text-xs text-muted-foreground">Start building your digital portfolio & AI career roadmap</p>
        </div>

        <Card glass className="p-6 sm:p-8 space-y-6 border-border/80 shadow-2xl">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs font-semibold text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Navya Verma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="College Email"
              type="email"
              placeholder="e.g. navya@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Roll Number / Student ID"
              placeholder="e.g. 23CS155"
              value={formData.rollNumber}
              onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Department</label>
              <select
                className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                <option value="Electronics & Communication Engineering">Electronics & Communication Engineering</option>
              </select>
            </div>

            <Input
              label="Password (min. 6 characters)"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button type="submit" variant="gradient" className="w-full" isLoading={isLoading}>
              Complete Registration
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
