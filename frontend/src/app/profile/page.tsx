'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import {
  User,
  Globe,
  Share2,
  Check,
  Linkedin,
  Github,
  Award,
  BookOpen,
  Briefcase,
  FolderGit2,
  Sparkles,
  Lock,
  Eye
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<any>({
    name: user?.name || '',
    phone: '',
    department: 'Computer Science and Engineering',
    degree: 'B.Tech',
    batch: '2023-2027',
    currentYear: 3,
    currentSemester: 6,
    careerObjective: '',
    targetRole: 'Full Stack Developer',
    socialLinks: { linkedin: '', github: '', portfolio: '', leetcode: '' },
    isPublicPortfolio: true,
    publicSections: {
      about: true,
      academics: true,
      skills: true,
      projects: true,
      internships: true,
      certifications: true,
      achievements: true,
      contact: true
    }
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user?.name || '',
        phone: (profile as any).phone || '+91 98765 43210',
        department: profile.department || 'Computer Science and Engineering',
        degree: profile.degree || 'B.Tech',
        batch: profile.batch || '2023-2027',
        currentYear: profile.currentYear || 3,
        currentSemester: profile.currentSemester || 6,
        careerObjective: (profile as any).careerObjective || 'Aspiring Full Stack Engineer passionate about building resilient distributed systems.',
        targetRole: profile.targetRole || 'Full Stack Developer',
        socialLinks: profile.socialLinks || { linkedin: '', github: '', portfolio: '', leetcode: '' },
        isPublicPortfolio: profile.isPublicPortfolio !== false,
        publicSections: (profile as any).publicSections || {
          about: true,
          academics: true,
          skills: true,
          projects: true,
          internships: true,
          certifications: true,
          achievements: true,
          contact: true
        }
      });
    }
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    const res = await api.put('/students/profile', formData);
    if (res.success) {
      setSaveSuccess(true);
      await refreshProfile();
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    setSaving(false);
  };

  const publicUrl = profile?.publicSlug ? `${typeof window !== 'undefined' ? window.location.origin : ''}/portfolio/${profile.publicSlug}` : '';

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Digital Profile & Portfolio</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your central identity, credentials, and recruiter visibility</p>
          </div>

          {profile?.publicSlug && (
            <a
              href={`/portfolio/${profile.publicSlug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              Preview Public Portfolio
            </a>
          )}
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Digital profile and public portfolio preferences saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Personal & Academic Information */}
          <Card glass className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <User className="w-4 h-4 text-primary" />
              <CardTitle className="text-base">Personal & Academic Identification</CardTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <Input
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />

              <Input
                label="Target Career Goal / Role"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                required
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Batch Year</label>
                <input
                  className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Current Year</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: parseInt(e.target.value, 10) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    value={formData.currentSemester}
                    onChange={(e) => setFormData({ ...formData, currentSemester: parseInt(e.target.value, 10) })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 tracking-wide uppercase">Professional Career Summary</label>
              <textarea
                rows={3}
                className="w-full rounded-xl border border-input bg-background/50 px-3.5 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                value={formData.careerObjective}
                onChange={(e) => setFormData({ ...formData, careerObjective: e.target.value })}
                placeholder="Highlight your key technical focus and aspirations..."
              />
            </div>
          </Card>

          {/* Social Profiles & Developer Links */}
          <Card glass className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/60 pb-3">
              <Globe className="w-4 h-4 text-blue-500" />
              <CardTitle className="text-base">Professional & Coding Profiles</CardTitle>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LinkedIn Profile URL"
                placeholder="https://linkedin.com/in/username"
                value={formData.socialLinks?.linkedin || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })
                }
              />

              <Input
                label="GitHub Profile URL"
                placeholder="https://github.com/username"
                value={formData.socialLinks?.github || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, github: e.target.value }
                  })
                }
              />

              <Input
                label="Personal Portfolio Website"
                placeholder="https://yourportfolio.dev"
                value={formData.socialLinks?.portfolio || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, portfolio: e.target.value }
                  })
                }
              />

              <Input
                label="LeetCode / HackerRank Profile"
                placeholder="https://leetcode.com/username"
                value={formData.socialLinks?.leetcode || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, leetcode: e.target.value }
                  })
                }
              />
            </div>
          </Card>

          {/* Public Portfolio Visibility Controls */}
          <Card glass className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <Share2 className="w-4 h-4 text-purple-500" />
                <CardTitle className="text-base">Recruiter & Public Sharing Controls</CardTitle>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublicPortfolio}
                  onChange={(e) => setFormData({ ...formData, isPublicPortfolio: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <span className="text-xs font-bold text-foreground">Enable Public Portfolio Link</span>
              </label>
            </div>

            {publicUrl && (
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-3 flex-wrap">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your Public Shareable URL:</span>
                  <p className="text-xs font-mono font-bold text-primary truncate">{publicUrl}</p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(publicUrl);
                    alert('Copied portfolio link to clipboard!');
                  }}
                >
                  Copy Link
                </Button>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground">Toggle sections visible on your public portfolio:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.keys(formData.publicSections || {}).map((sectionKey) => (
                  <label
                    key={sectionKey}
                    className="p-3 rounded-xl border border-border/60 bg-background/50 hover:bg-muted/50 cursor-pointer flex items-center justify-between text-xs capitalize font-medium transition-colors"
                  >
                    <span>{sectionKey}</span>
                    <input
                      type="checkbox"
                      checked={formData.publicSections[sectionKey]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          publicSections: {
                            ...formData.publicSections,
                            [sectionKey]: e.target.checked
                          }
                        })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                  </label>
                ))}
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="gradient" size="lg" isLoading={saving}>
              Save Profile & Preferences
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
