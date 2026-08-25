'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Settings,
  Lock,
  Bell,
  Palette,
  Shield,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [aiInsightNotifs, setAiInsightNotifs] = useState(true);
  const [placementNotifs, setPlacementNotifs] = useState(true);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMsg('Passwords do not match');
      return;
    }
    setSaving(true);
    const res = await api.put('/auth/change-password', { currentPassword, newPassword });
    setPasswordMsg(res.message || (res.success ? 'Password updated successfully!' : 'Failed to update password'));
    setSaving(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleThemeChange = (t: 'light' | 'dark' | 'system') => {
    setTheme(t);
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (t === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-foreground flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" />
            Account Settings
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Security, visual preferences, notification controls, and account management
          </p>
        </div>

        {/* Theme Preferences */}
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Palette className="w-4 h-4 text-purple-500" />
            <CardTitle className="text-base">Visual Appearance</CardTitle>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all ${
                theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 text-foreground hover:border-primary/40'
              }`}
            >
              <Sun className="w-5 h-5 mx-auto mb-1.5" />
              Light Mode
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all ${
                theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 text-foreground hover:border-primary/40'
              }`}
            >
              <Moon className="w-5 h-5 mx-auto mb-1.5" />
              Dark Mode
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`p-4 rounded-2xl border text-center text-xs font-bold transition-all ${
                theme === 'system' ? 'border-primary bg-primary/10 text-primary' : 'border-border/60 text-foreground hover:border-primary/40'
              }`}
            >
              <Monitor className="w-5 h-5 mx-auto mb-1.5" />
              System Default
            </button>
          </div>
        </Card>

        {/* Password Update */}
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Lock className="w-4 h-4 text-rose-500" />
            <CardTitle className="text-base">Change Password</CardTitle>
          </div>

          {passwordMsg && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${passwordMsg.includes('success') ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600' : 'bg-destructive/10 border border-destructive/20 text-destructive'}`}>
              {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3">
            <Input label="Current Password" type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
            <Input label="New Password" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <Input label="Confirm New Password" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            <div className="flex justify-end">
              <Button type="submit" variant="gradient" isLoading={saving}>Update Password</Button>
            </div>
          </form>
        </Card>

        {/* Notification Preferences */}
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Bell className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-base">Notification Preferences</CardTitle>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-foreground">Email Notifications</span>
                <p className="text-[10px] text-muted-foreground">Receive email alerts for placement & deadline reminders</p>
              </div>
              <input type="checkbox" checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-foreground">AI Insight Alerts</span>
                <p className="text-[10px] text-muted-foreground">Proactive AI risk alerts & skill gap notifications</p>
              </div>
              <input type="checkbox" checked={aiInsightNotifs} onChange={(e) => setAiInsightNotifs(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
              <div>
                <span className="text-xs font-bold text-foreground">Placement Drive Alerts</span>
                <p className="text-[10px] text-muted-foreground">New campus recruitment postings & application deadlines</p>
              </div>
              <input type="checkbox" checked={placementNotifs} onChange={(e) => setPlacementNotifs(e.target.checked)} className="w-4 h-4 rounded text-primary focus:ring-primary" />
            </label>
          </div>
        </Card>

        {/* Account Info */}
        <Card glass className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <CardTitle className="text-base">Account Information</CardTitle>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Email</span>
              <p className="font-semibold text-foreground">{user?.email}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Role</span>
              <p className="font-semibold text-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Department</span>
              <p className="font-semibold text-foreground">{user?.department || 'Computer Science'}</p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-0.5">
              <span className="text-[10px] text-muted-foreground uppercase font-bold">Platform Version</span>
              <p className="font-semibold text-foreground">Student360 AI v1.0</p>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60">
            <Button onClick={logout} variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Sign Out of Account
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
