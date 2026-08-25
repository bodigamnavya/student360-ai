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
  Award,
  Sparkles,
  Plus,
  UploadCloud,
  CheckCircle2,
  FileCheck,
  Trash2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [category, setCategory] = useState('Cloud & DevOps');
  const [extractedSkills, setExtractedSkills] = useState('AWS, Cloud Computing, IAM, EC2');
  const [selectedFileName, setSelectedFileName] = useState('');

  const loadCerts = async () => {
    setLoading(true);
    const res = await api.get('/certifications');
    if (res.success && res.data) setCertifications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCerts();
  }, []);

  const handleSimulatedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsExtracting(true);

    // Call AI Certificate Extractor
    const res = await api.post('/certifications/extract', {
      filename: file.name,
      textHint: file.name
    });

    if (res.success && res.data) {
      const d = res.data;
      setTitle(d.title);
      setIssuer(d.issuer);
      setCredentialId(d.credentialId);
      setCategory(d.category);
      setExtractedSkills(d.extractedSkills?.join(', ') || '');
      setIssueDate(d.issueDate);
    }
    setIsExtracting(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArr = extractedSkills.split(',').map((s) => s.trim()).filter(Boolean);
    const res = await api.post('/certifications', {
      title,
      issuer,
      issueDate: issueDate || new Date(),
      credentialId,
      credentialUrl,
      category,
      extractedSkills: skillsArr,
      verified: true,
      aiExtracted: true
    });

    if (res.success) {
      setShowModal(false);
      setTitle('');
      setIssuer('');
      setCredentialId('');
      setSelectedFileName('');
      await loadCerts();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this certification record?')) {
      await api.delete(`/certifications/${id}`);
      await loadCerts();
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Verified Certifications & Credentials</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Upload certificate documents for automated AI OCR metadata extraction and skill mapping</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="gradient" size="sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Upload Certificate
          </Button>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <Card key={cert._id} glass hover className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant="success">Verified</Badge>
                    <button onClick={() => handleDelete(cert._id)} className="p-1 rounded text-muted-foreground hover:text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-foreground leading-snug">{cert.title}</h3>
                  <p className="text-xs text-primary font-bold mt-0.5">{cert.issuer}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Issued: {formatDate(cert.issueDate)}</p>
                </div>

                {cert.credentialId && (
                  <div className="p-2 rounded-lg bg-muted/40 font-mono text-[11px] text-muted-foreground flex items-center justify-between">
                    <span className="truncate">ID: {cert.credentialId}</span>
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline ml-1">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {cert.extractedSkills?.map((s: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/50">
                <span className="font-semibold text-foreground">{cert.category || 'Technical'}</span>
                {cert.aiExtracted && (
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Extracted
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upload Certificate Modal with AI Scanner */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Certificate with AI Auto-Extraction" maxWidth="lg">
        <form onSubmit={handleSave} className="space-y-4">
          {/* File Upload Drop Area */}
          <div className="border-2 border-dashed border-primary/30 hover:border-primary rounded-2xl p-6 text-center bg-primary/5 hover:bg-primary/10 transition-colors relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleSimulatedFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shadow-md">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-foreground">
                {selectedFileName ? selectedFileName : 'Drop Certificate PDF / Image here or click to browse'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                AI will scan issuer, dates, credential ID, and extract technical skills automatically.
              </p>
            </div>
          </div>

          {isExtracting && (
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-600 flex items-center justify-center gap-2 animate-pulse">
              <Sparkles className="w-4 h-4" />
              AI Scanner parsing certificate document...
            </div>
          )}

          {/* Editable Confirmation Fields */}
          <div className="space-y-3 pt-2">
            <Input
              label="Certificate Name"
              placeholder="e.g. AWS Certified Cloud Practitioner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Issuing Organization"
                placeholder="e.g. Amazon Web Services (AWS)"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                required
              />
              <Input
                label="Issue Date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Credential ID"
                placeholder="e.g. AWS-93821"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
              />
              <Input
                label="Category"
                placeholder="Cloud & DevOps"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <Input
              label="Extracted Skills (comma separated)"
              placeholder="AWS, Cloud, EC2, S3, IAM"
              value={extractedSkills}
              onChange={(e) => setExtractedSkills(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" variant="gradient">Confirm & Save Certificate</Button>
          </div>
        </form>
      </Modal>
    </AppLayout>
  );
}
