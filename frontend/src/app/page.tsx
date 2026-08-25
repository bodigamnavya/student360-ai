'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_ACCOUNTS, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  GraduationCap,
  Layers,
  Shield,
  CheckCircle2,
  TrendingUp,
  Brain,
  Target,
  FileText,
  Briefcase,
  Trophy,
  CalendarCheck,
  Compass,
  Zap,
  Globe
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { user, quickDemoLogin } = useAuth();

  const handleDemoClick = async (role: UserRole) => {
    await quickDemoLogin(role);
  };

  const lifecycleStages = [
    { title: 'Admission', desc: 'Centralized onboarding & digital identity setup' },
    { title: 'Academics', desc: 'Semester SGPA/CGPA & backlog analytics' },
    { title: 'Attendance', desc: 'Predictive shortage & detention risk warnings' },
    { title: 'Mentoring', desc: 'Action plans & proactive mentor alerts' },
    { title: 'Projects', desc: 'AI skill extraction & resume bullet generation' },
    { title: 'Internships', desc: 'Verified industry experience & recommendations' },
    { title: 'Certifications', desc: 'Automated OCR credential verification' },
    { title: 'Achievements', desc: 'Hackathons, research publications & awards' },
    { title: 'Skills Matrix', desc: 'Multidimensional proficiency benchmarking' },
    { title: 'Placement Prep', desc: 'ATS resume builder & job matching engine' },
    { title: 'Higher Ed', desc: 'University shortlisting & GRE/GATE study plans' },
    { title: 'Graduation', desc: 'Verified career outcomes & alumni portfolio' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-blue-500/20">
              360
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
                Student<span className="text-primary">360</span>
              </span>
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                AI
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => router.push(user.role === 'student' ? '/dashboard' : '/admin')} variant="gradient" size="sm">
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="gradient" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        {/* Background Glowing Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Badge variant="purple" className="px-4 py-1 text-xs rounded-full gap-2 inline-flex items-center shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Next-Generation AI Student Lifecycle & Digital Portfolio Engine
          </Badge>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            One Student. One Digital Journey.{' '}
            <span className="gradient-text">One AI-Powered Roadmap.</span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Student360 AI unifies academic performance, attendance forecasting, verified projects, mentor interventions, skill gap detection, and ATS resume generation into an intelligent centralized ecosystem.
          </p>

          {/* Quick Demo Access Grid */}
          <div className="max-w-4xl mx-auto pt-4">
            <div className="p-6 rounded-3xl border border-primary/20 bg-card/60 backdrop-blur-xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border/50 pb-3">
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Instant 1-Click Persona Demo Access
                  </p>
                  <p className="text-xs text-muted-foreground">Select a role to test live data, AI scoring & dashboards immediately:</p>
                </div>
                <Badge variant="success">20+ Realistic Students Seeded</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {(['student', 'faculty', 'placement_officer', 'admin'] as UserRole[]).map((r) => {
                  const demo = DEMO_ACCOUNTS[r];
                  return (
                    <button
                      key={r}
                      onClick={() => handleDemoClick(r)}
                      className="p-3.5 rounded-2xl border border-border/80 bg-background/60 hover:bg-primary/5 hover:border-primary/40 transition-all text-left group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          {r === 'student' && <UserCheck className="w-4 h-4 text-blue-500" />}
                          {r === 'faculty' && <GraduationCap className="w-4 h-4 text-indigo-500" />}
                          {r === 'placement_officer' && <Layers className="w-4 h-4 text-amber-500" />}
                          {r === 'admin' && <Shield className="w-4 h-4 text-purple-500" />}
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                            {r.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-foreground truncate">{demo.title.split('(')[0]}</p>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{demo.desc}</p>
                      </div>
                      <span className="text-[11px] font-bold text-primary flex items-center gap-1 mt-3 group-hover:translate-x-0.5 transition-transform">
                        Launch Persona →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-Stage Lifecycle Flow */}
      <section className="py-20 border-y border-border/60 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="blue">Full Lifecycle Coverage</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
              Tracking The Entire Student Trajectory
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              From first-day enrollment to capstone graduation, every milestone is structured, analyzed, and enhanced with AI.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {lifecycleStages.map((stage, idx) => (
              <Card key={idx} hover glass className="p-5 relative overflow-hidden group">
                <span className="absolute top-2 right-3 text-2xl font-heading font-extrabold text-foreground/5 group-hover:text-primary/10 transition-colors">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mb-3">
                  {idx + 1}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{stage.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{stage.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Core AI Engines Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="purple">AI Intelligence Core</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-foreground">
              Intelligent Decisions Powered by 8+ AI Engines
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Deterministic scoring pipelines combined with LLM generative assistance ensure zero hallucinations and maximum actionable intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Career Trajectory Engine</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Evaluates CGPA, projects, internships, and skill breadth to deliver ranked career recommendations with match percentages and missing competency roadmaps.
              </p>
            </Card>

            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Skill Gap & Learning Roadmap</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Benchmarks student skills against live industry job specifications (Software Engineer, AI/ML, Cloud, Data Analyst) and creates a 3-phase curriculum.
              </p>
            </Card>

            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Student Risk Prediction</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Multi-factor risk analysis tracking attendance shortfalls, backlog accumulation, and SGPA downward velocity with early mentor alert triggers.
              </p>
            </Card>

            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">ATS-Friendly Resume Builder</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                4 professional templates (Modern, Professional, Minimal, ATS-Friendly) with auto-extracted bullet points and 1-click printable PDF download.
              </p>
            </Card>

            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Job Compatibility Matcher</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Instantly calculates eligibility (CGPA, branch, backlogs) and skill match scores for active recruitment drives at Google, Microsoft, Amazon, etc.
              </p>
            </Card>

            <Card hover glass className="p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Public Digital Portfolio</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Customizable public portfolios (<code className="text-primary font-mono text-[11px]">/portfolio/aarav-sharma</code>) with privacy section toggles for recruiter sharing.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-10 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Student360 AI Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-foreground">Student Portal</Link>
            <Link href="/login" className="hover:text-foreground">Faculty Portal</Link>
            <Link href="/login" className="hover:text-foreground">Placement Cell</Link>
            <Link href="/login" className="hover:text-foreground">Admin Console</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
