'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import {
  User,
  GraduationCap,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  Cpu,
  Linkedin,
  Github,
  Globe,
  Mail,
  ExternalLink,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export default function PublicPortfolioPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      api.get(`/students/public/${slug}`).then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      }).catch(() => {
        setNotFound(true);
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs font-semibold text-muted-foreground animate-pulse">Loading verified digital portfolio...</p>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center space-y-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">Digital Portfolio Not Found</h1>
        <p className="text-xs text-muted-foreground max-w-md">
          This portfolio does not exist or has been set to private by the student.
        </p>
        <Link href="/">
          <Button variant="outline" size="sm">Back to Home</Button>
        </Link>
      </div>
    );
  }

  const p = data.profile || {};
  const u = p.user || {};
  const sec = p.publicSections || {};

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Portfolio Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-heading font-extrabold text-lg text-foreground">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white text-sm font-bold shadow-sm">
              360
            </div>
            <span>Student360 <span className="text-primary">Portfolio</span></span>
          </Link>

          <Badge variant="success" className="gap-1.5 py-1">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Student Profile
          </Badge>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Card */}
        <div className="p-8 sm:p-10 rounded-3xl gradient-bg text-white shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shrink-0">
                {u.name ? u.name.charAt(0) : 'S'}
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-white">
                  {u.name || 'Student Name'}
                </h1>
                <p className="text-sm text-blue-100 font-semibold">
                  {p.targetRole || 'Full Stack Engineer'}
                </p>
                <p className="text-xs text-blue-200/80">
                  {p.degree || 'B.Tech'} in {p.department} • Batch {p.batch}
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {p.socialLinks?.github && (
                <a
                  href={p.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {p.socialLinks?.linkedin && (
                <a
                  href={p.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {p.socialLinks?.portfolio && (
                <a
                  href={p.socialLinks.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {p.careerObjective && (
            <p className="text-xs sm:text-sm text-blue-50/90 max-w-3xl leading-relaxed border-t border-white/15 pt-4">
              &ldquo;{p.careerObjective}&rdquo;
            </p>
          )}
        </div>

        {/* Skills Section */}
        {sec.skills && data.skills && data.skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Cpu className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-heading font-extrabold text-foreground">Verified Technical & Core Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((s: any) => (
                <div
                  key={s._id}
                  className="px-3.5 py-1.5 rounded-xl border border-border/80 bg-card/60 backdrop-blur-sm text-xs font-semibold text-foreground flex items-center gap-2 shadow-sm"
                >
                  <span>{s.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                    {s.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {sec.projects && data.projects && data.projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <FolderGit2 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-heading font-extrabold text-foreground">Featured Technical Projects</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map((proj: any) => (
                <Card key={proj._id} hover glass className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{proj.title}</h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{proj.domain}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {proj.githubUrl && (
                        <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {proj.technologies?.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Internships Section */}
        {sec.internships && data.internships && data.internships.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Briefcase className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-heading font-extrabold text-foreground">Industry Internships & Experience</h2>
            </div>
            <div className="space-y-4">
              {data.internships.map((intern: any) => (
                <Card key={intern._id} glass className="p-6 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold text-foreground">{intern.role}</h3>
                      <p className="text-xs text-primary font-bold">{intern.company} • {intern.location}</p>
                    </div>
                    <Badge variant="success">Verified Internship</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2">{intern.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {intern.technologies?.map((t: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{t}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sec.certifications && data.certifications && data.certifications.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Award className="w-5 h-5 text-rose-500" />
                <h2 className="text-lg font-heading font-extrabold text-foreground">Certifications</h2>
              </div>
              <div className="space-y-3">
                {data.certifications.map((c: any) => (
                  <Card key={c._id} glass className="p-4 space-y-1">
                    <h4 className="text-xs font-bold text-foreground">{c.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{c.issuer}</p>
                    {c.credentialId && (
                      <p className="text-[10px] font-mono text-primary pt-1">Credential: {c.credentialId}</p>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {sec.achievements && data.achievements && data.achievements.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-heading font-extrabold text-foreground">Achievements & Honors</h2>
              </div>
              <div className="space-y-3">
                {data.achievements.map((a: any) => (
                  <Card key={a._id} glass className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{a.title}</h4>
                        <p className="text-[11px] text-primary font-bold">{a.issuerOrg || a.position}</p>
                      </div>
                      <Badge variant="purple" className="text-[9px]">{a.category}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{a.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {a.aiAnalysis?.impactLevel && (
                        <Badge variant="purple" className="text-[9px]">
                          ⭐ {a.aiAnalysis.impactLevel} Level
                        </Badge>
                      )}
                      {a.aiAnalysis?.confidence && (
                        <Badge variant="success" className="text-[9px]">
                          🤖 AI Verified: {Math.round(a.aiAnalysis.confidence * 100)}%
                        </Badge>
                      )}
                      {a.skillsDemonstrated?.map((s: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-[9px]">{s}</Badge>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
