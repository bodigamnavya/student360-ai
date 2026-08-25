'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';
import {
  Cpu,
  Plus,
  Sparkles,
  CheckCircle2,
  Trash2,
  Layers,
  Code2,
  Database,
  Cloud,
  Brain,
  Wrench,
  HeartHandshake
} from 'lucide-react';

export default function SkillsPage() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Programming');
  const [proficiency, setProficiency] = useState('Advanced');
  const [experienceMonths, setExperienceMonths] = useState(24);
  const [isTopSkill, setIsTopSkill] = useState(true);

  const loadSkills = async () => {
    setLoading(true);
    const res = await api.get('/skills');
    if (res.success && res.data) setSkills(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/skills', {
      name,
      category,
      proficiency,
      experienceMonths,
      isTopSkill,
      verified: true
    });

    if (res.success) {
      setShowModal(false);
      setName('');
      await loadSkills();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this skill?')) {
      await api.delete(`/skills/${id}`);
      await loadSkills();
    }
  };

  // Group skills by category
  const categories = [
    { title: 'Programming', icon: Code2 },
    { title: 'Web Development', icon: Layers },
    { title: 'Database', icon: Database },
    { title: 'Cloud & DevOps', icon: Cloud },
    { title: 'AI / Machine Learning', icon: Brain },
    { title: 'Core CS / Tools', icon: Wrench },
    { title: 'Soft Skills', icon: HeartHandshake }
  ];

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Verified Technical & Core Skill Matrix</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Categorized proficiency assessment, years of experience, and project evidence mapping</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Skill to Matrix
          </Button>
        </div>

        {/* Skill Matrix Categorized Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, cIdx) => {
            const Icon = cat.icon;
            const categorySkills = skills.filter((s) => s.category === cat.title || (!s.category && cat.title === 'Programming'));

            return (
              <Card key={cIdx} glass className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-sm">{cat.title}</CardTitle>
                  </div>
                  <Badge variant="outline">{categorySkills.length} Skills</Badge>
                </div>

                {categorySkills.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic py-2">No skills recorded in this category yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill._id}
                        className="p-3 rounded-xl bg-background/60 border border-border/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{skill.name}</span>
                            {skill.isTopSkill && (
                              <Badge variant="purple" className="text-[9px] px-1.5 py-0">Top Skill</Badge>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {skill.experienceMonths ? `${Math.round(skill.experienceMonths / 12 * 10) / 10} yrs experience` : 'Verified competency'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              skill.proficiency === 'Expert'
                                ? 'success'
                                : skill.proficiency === 'Advanced'
                                ? 'purple'
                                : skill.proficiency === 'Intermediate'
                                ? 'blue'
                                : 'secondary'
                            }
                            className="text-[10px]"
                          >
                            {skill.proficiency}
                          </Badge>
                          <button onClick={() => handleDelete(skill._id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Skill Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Skill to Digital Portfolio">
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Skill Name"
            placeholder="e.g. TypeScript, Docker, Redis, PyTorch"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase">Category</label>
              <select
                className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Programming">Programming</option>
                <option value="Web Development">Web Development</option>
                <option value="Database">Database</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Core CS / Tools">Core CS / Tools</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/80 uppercase">Proficiency Level</label>
              <select
                className="w-full h-10 rounded-xl border border-input bg-background/50 px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
              >
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Intermediate">Intermediate (Project Experience)</option>
                <option value="Advanced">Advanced (Production Experience)</option>
                <option value="Expert">Expert (Architecture Level)</option>
              </select>
            </div>
          </div>

          <Input
            label="Experience in Months"
            type="number"
            min="1"
            max="120"
            value={experienceMonths}
            onChange={(e) => setExperienceMonths(parseInt(e.target.value, 10))}
          />

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isTopSkill}
              onChange={(e) => setIsTopSkill(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary"
            />
            <span className="text-xs font-bold text-foreground">Feature as Top Skill on Resume & Portfolio</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Save Skill</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
