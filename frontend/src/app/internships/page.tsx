'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Briefcase,
  Sparkles,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';

export default function InternshipsPage() {
  const [internships, setInternships] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('Bengaluru');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stipend, setStipend] = useState('₹40,000 / mo');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('Node.js, TypeScript, Go');

  const loadData = async () => {
    setLoading(true);
    const [intRes, recRes] = await Promise.all([
      api.get('/internships'),
      api.get('/internships/recommendations')
    ]);

    if (intRes.success && intRes.data) setInternships(intRes.data);
    if (recRes.success && recRes.data) setRecommendations(recRes.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const res = await api.post('/internships', {
      company,
      role,
      location,
      startDate: startDate || new Date(),
      endDate: endDate || new Date(),
      stipend,
      description,
      technologies: techArray,
      skillsAcquired: techArray,
      verified: true
    });

    if (res.success) {
      setShowModal(false);
      setCompany('');
      setRole('');
      setDescription('');
      await loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this internship record?')) {
      await api.delete(`/internships/${id}`);
      await loadData();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Industry Internships & Experience</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Verified work experience, acquired technical competencies, and AI recommendations</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Internship Record
          </Button>
        </div>

        {/* AI Recommendations Banner */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h2 className="text-sm font-bold text-foreground">AI Recommended Internship Profiles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec: any, idx: number) => (
                <Card key={idx} glass className="p-5 border-t-4 border-t-primary space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{rec.role}</h4>
                      <p className="text-xs text-muted-foreground">{rec.companyType}</p>
                    </div>
                    <Badge variant="purple">{rec.matchScore}% Match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.why}</p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.matchingSkills?.map((s: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Internships List */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-extrabold text-foreground">Recorded Work Experience</h2>
          <div className="space-y-4">
            {internships.map((intern) => (
              <Card key={intern._id} glass className="p-6 space-y-3">
                <div className="flex items-start justify-between flex-wrap gap-3 border-b border-border/60 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-foreground">{intern.role}</h3>
                    <p className="text-xs text-primary font-bold">{intern.company} • {intern.location} ({intern.locationType})</p>
                    <p className="text-[11px] text-muted-foreground">
                      {formatDate(intern.startDate)} — {intern.isCurrent ? 'Present' : formatDate(intern.endDate)}
                      {intern.stipend && <span className="ml-2 font-semibold">• Stipend: {intern.stipend}</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Verified by Mentor</Badge>
                    <button onClick={() => handleDelete(intern._id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{intern.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {intern.technologies?.map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Add Internship Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Verified Industry Internship" maxWidth="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              placeholder="e.g. Razorpay Software"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <Input
              label="Job Role"
              placeholder="e.g. Backend Engineering Intern"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Location"
              placeholder="e.g. Bengaluru, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              label="Stipend Amount"
              placeholder="e.g. ₹45,000 / month"
              value={stipend}
              onChange={(e) => setStipend(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Input
            label="Technologies & Tools Used (comma separated)"
            placeholder="Node.js, Go, MySQL, Docker, Kafka"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase">Key Responsibilities & Deliverables</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-input bg-background/50 p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe microservices built, latency improvements, team collaboration..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Save Internship</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
