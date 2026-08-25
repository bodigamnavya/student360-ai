'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Calendar,
  Send,
  Check,
  Briefcase,
  Users
} from 'lucide-react';

export default function PlacementJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State for Placement Officer
  const [company, setCompany] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('Data Structures, Algorithms, C++, Java');
  const [minCgpa, setMinCgpa] = useState(7.0);
  const [salaryMin, setSalaryMin] = useState(12);
  const [salaryMax, setSalaryMax] = useState(22);
  const [deadline, setDeadline] = useState('');
  const [location, setLocation] = useState('Bengaluru / Hyderabad');

  const loadJobs = async () => {
    setLoading(true);
    const res = await api.get(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    if (res.success && res.data) setJobs(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, [searchQuery]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArr = requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await api.post('/jobs', {
      company,
      jobRole,
      jobType,
      description,
      requiredSkills: skillsArr,
      minCgpa,
      salaryRange: { min: salaryMin, max: salaryMax, currency: 'LPA' },
      location,
      applicationDeadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    });

    if (res.success) {
      setShowCreateModal(false);
      setCompany('');
      setJobRole('');
      setDescription('');
      await loadJobs();
    } else {
      alert(res.message || 'Failed to create job');
    }
  };

  const isPlacementOfficerOrAdmin = user?.role === 'placement_officer' || user?.role === 'admin';

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Campus Recruitment Job Drives</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Explore active corporate recruitment opportunities, CTC packages, and eligibility cutoffs</p>
          </div>
          {isPlacementOfficerOrAdmin && (
            <Button onClick={() => setShowCreateModal(true)} variant="gradient" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              Post New Campus Drive
            </Button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by company, role or required skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 text-xs rounded-xl bg-card border border-input focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm"
          />
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job._id} glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-primary">{job.company}</span>
                      <h3 className="text-base font-bold text-foreground leading-tight">{job.jobRole}</h3>
                    </div>
                  </div>
                  <Badge variant={job.jobType === 'Full-time' ? 'success' : 'purple'}>
                    {job.jobType}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{job.description}</p>

                <div className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-muted-foreground">CTC Package:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ₹{job.salaryRange?.min} - ₹{job.salaryRange?.max} {job.salaryRange?.currency || 'LPA'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Minimum CGPA:</span>
                    <span className="font-bold text-foreground">{job.minCgpa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{job.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {job.requiredSkills?.map((sk: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{sk}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-border/50">
                <span className="text-muted-foreground">Deadline: {formatDate(job.applicationDeadline)}</span>
                <span className="text-primary font-bold">{job.totalApplicants || 0} Applied</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Job Modal for Placement Officer / Admin */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Post New Campus Recruitment Drive" maxWidth="lg">
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Company Name"
              placeholder="e.g. Oracle"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
            <Input
              label="Job Role Title"
              placeholder="e.g. Cloud Engineer"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase">Job Type</label>
              <select
                className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Internship + PPO">Internship + PPO</option>
              </select>
            </div>
            <Input
              label="Location"
              placeholder="e.g. Bengaluru / Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Min CTC (LPA)"
              type="number"
              value={salaryMin}
              onChange={(e) => setSalaryMin(parseFloat(e.target.value))}
            />
            <Input
              label="Max CTC (LPA)"
              type="number"
              value={salaryMax}
              onChange={(e) => setSalaryMax(parseFloat(e.target.value))}
            />
            <Input
              label="Min CGPA"
              type="number"
              step="0.1"
              value={minCgpa}
              onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
            />
          </div>

          <Input
            label="Required Skills (comma separated)"
            placeholder="Java, Spring Boot, SQL, AWS, Docker"
            value={requiredSkills}
            onChange={(e) => setRequiredSkills(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/80 uppercase">Job Description & Responsibilities</label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-input bg-background/50 p-3 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline role responsibilities, eligibility criteria, and interview stages..."
              required
            />
          </div>

          <Input
            label="Application Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Publish Campus Drive</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
