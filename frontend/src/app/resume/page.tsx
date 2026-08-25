'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  FileText,
  Sparkles,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  Palette,
  LayoutTemplate,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Cpu,
  Trophy,
  RefreshCw
} from 'lucide-react';

const TEMPLATES = [
  { id: 'modern', name: 'Modern', desc: 'Clean gradient header with icons' },
  { id: 'professional', name: 'Professional', desc: 'Classic serif with formal layout' },
  { id: 'minimal', name: 'Minimal', desc: 'Ultra clean whitespace focused' },
  { id: 'ats-friendly', name: 'ATS-Friendly', desc: 'Optimized for Applicant Tracking Systems' }
];

const SECTIONS = [
  { key: 'summary', label: 'Professional Summary', icon: FileText },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Technical Skills', icon: Cpu },
  { key: 'projects', label: 'Projects', icon: FolderGit2 },
  { key: 'internships', label: 'Work Experience', icon: Briefcase },
  { key: 'certifications', label: 'Certifications', icon: Award },
  { key: 'achievements', label: 'Achievements', icon: Trophy }
];

export default function ResumeBuilderPage() {
  const { user, profile } = useAuth();
  const [resumeData, setResumeData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [enabledSections, setEnabledSections] = useState<Record<string, boolean>>({
    summary: true,
    education: true,
    skills: true,
    projects: true,
    internships: true,
    certifications: true,
    achievements: true
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const generateResume = async () => {
    setGenerating(true);
    const res = await api.post('/resume/generate', {
      template: selectedTemplate,
      sections: Object.keys(enabledSections).filter((k) => enabledSections[k])
    });
    if (res.success && res.data) {
      setResumeData(res.data);
    }
    setGenerating(false);
    setLoading(false);
  };

  useEffect(() => {
    generateResume();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const toggleSection = (key: string) => {
    setEnabledSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const rd = resumeData || {};
  const personal = rd.personal || {};
  const education = rd.education || {};

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI-Powered ATS Resume Builder</h1>
            <p className="text-xs text-muted-foreground mt-0.5">4 professional templates with auto-generated impact bullets from your verified portfolio</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={generateResume} variant="outline" size="sm" isLoading={generating}>
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Regenerate
            </Button>
            <Button onClick={handlePrint} variant="gradient" size="sm">
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Export PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Controls */}
          <div className="space-y-4 lg:col-span-1">
            {/* Template Selector */}
            <Card glass className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <LayoutTemplate className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">Resume Template</span>
              </div>
              <div className="space-y-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className={`w-full p-3 rounded-xl text-left text-xs transition-all border ${
                      selectedTemplate === t.id
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border/60 bg-background/50 text-foreground hover:border-primary/40'
                    }`}
                  >
                    <span className="block font-bold">{t.name}</span>
                    <span className="block text-[10px] text-muted-foreground mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Section Toggle Controls */}
            <Card glass className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-2">
                <Palette className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-foreground">Section Visibility</span>
              </div>
              <div className="space-y-1.5">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <label
                      key={sec.key}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        {sec.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={enabledSections[sec.key]}
                        onChange={() => toggleSection(sec.key)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                    </label>
                  );
                })}
              </div>

              <Button onClick={generateResume} variant="gradient" size="sm" className="w-full mt-2" isLoading={generating}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Rebuild with Selected Sections
              </Button>
            </Card>
          </div>

          {/* Resume Preview Panel */}
          <div className="lg:col-span-3">
            <div
              ref={printRef}
              id="resume-print-area"
              className="bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden print:shadow-none print:border-none print:rounded-none"
            >
              {/* Resume Header */}
              <div
                className={`p-8 ${
                  selectedTemplate === 'modern'
                    ? 'bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white'
                    : selectedTemplate === 'professional'
                    ? 'bg-gray-900 text-white'
                    : selectedTemplate === 'minimal'
                    ? 'bg-white text-gray-900 border-b-2 border-gray-200'
                    : 'bg-white text-gray-900 border-b border-gray-300'
                }`}
              >
                <h1
                  className={`text-2xl font-extrabold tracking-tight ${
                    selectedTemplate === 'minimal' || selectedTemplate === 'ats-friendly'
                      ? 'text-gray-900'
                      : 'text-white'
                  }`}
                >
                  {personal.name || user?.name || 'Aarav Sharma'}
                </h1>
                <p
                  className={`text-sm font-semibold mt-1 ${
                    selectedTemplate === 'minimal' || selectedTemplate === 'ats-friendly'
                      ? 'text-blue-700'
                      : 'text-blue-200'
                  }`}
                >
                  {personal.targetRole || profile?.targetRole || 'Full Stack Developer'}
                </p>
                <div
                  className={`flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs ${
                    selectedTemplate === 'minimal' || selectedTemplate === 'ats-friendly'
                      ? 'text-gray-600'
                      : 'text-blue-100'
                  }`}
                >
                  <span>{personal.email || user?.email || 'aarav.sharma@university.edu'}</span>
                  <span>{personal.phone || '+91 98765 43210'}</span>
                  {personal.github && <span>GitHub: {personal.github}</span>}
                  {personal.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
                </div>
              </div>

              {/* Resume Body Sections */}
              <div className="p-8 space-y-6 text-xs leading-relaxed">
                {/* Summary */}
                {enabledSections.summary && rd.summary && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Professional Summary
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{rd.summary}</p>
                  </section>
                )}

                {/* Education */}
                {enabledSections.education && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Education
                    </h2>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">
                          {education.degree || 'B.Tech'} in {education.department || 'Computer Science and Engineering'}
                        </span>
                        <span className="text-gray-500">{education.batch || '2023-2027'}</span>
                      </div>
                      <p className="text-gray-600">{education.university || 'National Institute of Technology'}</p>
                      <p className="text-gray-700 font-semibold">CGPA: {education.cgpa || '8.84'} / 10.0</p>
                    </div>
                  </section>
                )}

                {/* Skills */}
                {enabledSections.skills && rd.skills && rd.skills.length > 0 && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Technical Skills
                    </h2>
                    <div className="space-y-1.5">
                      {rd.skillsByCategory
                        ? Object.entries(rd.skillsByCategory).map(([cat, skills]: [string, any]) => (
                            <div key={cat} className="flex gap-2">
                              <span className="font-bold text-gray-900 min-w-[140px]">{cat}:</span>
                              <span className="text-gray-700">{(skills as string[]).join(', ')}</span>
                            </div>
                          ))
                        : (
                          <p className="text-gray-700">{rd.skills.map((s: any) => s.name || s).join(', ')}</p>
                        )}
                    </div>
                  </section>
                )}

                {/* Projects */}
                {enabledSections.projects && rd.projects && rd.projects.length > 0 && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Technical Projects
                    </h2>
                    <div className="space-y-4">
                      {rd.projects.map((proj: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex items-baseline justify-between">
                            <span className="font-bold text-gray-900">
                              {proj.title}{' '}
                              {proj.technologies && (
                                <span className="font-normal text-gray-500">
                                  | {(proj.technologies || []).join(', ')}
                                </span>
                              )}
                            </span>
                            {proj.githubUrl && (
                              <span className="text-blue-700 text-[10px] font-medium">[GitHub]</span>
                            )}
                          </div>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
                            {(proj.bullets || [proj.description]).map((b: string, bIdx: number) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Internships / Work Experience */}
                {enabledSections.internships && rd.internships && rd.internships.length > 0 && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Work Experience
                    </h2>
                    <div className="space-y-4">
                      {rd.internships.map((intern: any, idx: number) => (
                        <div key={idx}>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">{intern.role}</span>
                            <span className="text-gray-500">{intern.duration}</span>
                          </div>
                          <p className="text-blue-700 font-semibold">{intern.company} — {intern.location}</p>
                          <ul className="list-disc list-inside mt-1 space-y-0.5 text-gray-700">
                            {(intern.bullets || [intern.description]).map((b: string, bIdx: number) => (
                              <li key={bIdx}>{b}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Certifications */}
                {enabledSections.certifications && rd.certifications && rd.certifications.length > 0 && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Certifications
                    </h2>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {rd.certifications.map((c: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-semibold text-gray-900">{c.title}</span> — {c.issuer}
                          {c.credentialId && <span className="text-gray-500 ml-1">(ID: {c.credentialId})</span>}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Achievements */}
                {enabledSections.achievements && rd.achievements && rd.achievements.length > 0 && (
                  <section>
                    <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
                      Achievements & Awards
                    </h2>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {rd.achievements.map((a: any, idx: number) => (
                        <li key={idx}>
                          <span className="font-semibold text-gray-900">{a.title}</span>
                          {a.position && <span> — {a.position}</span>}
                          {a.issuerOrg && <span className="text-gray-500 ml-1">({a.issuerOrg})</span>}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
