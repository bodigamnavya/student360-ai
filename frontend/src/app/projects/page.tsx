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
  FolderGit2,
  Sparkles,
  Plus,
  Github,
  ExternalLink,
  Trash2,
  Edit,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Folder,
  FolderPlus,
  Paperclip,
  FileText,
  Upload,
  Download,
  AlertCircle,
  Brain,
  Tag
} from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedProjectForFile, setSelectedProjectForFile] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New Project Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Full Stack Web Development');
  const [technologies, setTechnologies] = useState('React, Next.js, Node.js, TypeScript, MongoDB');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [projectFolderId, setProjectFolderId] = useState('');
  const [aiPreview, setAiPreview] = useState<any>(null);

  // New Folder Form
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#6366f1');

  // File Upload State
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, foldRes] = await Promise.all([
        api.get('/projects'),
        api.get('/projects/folders/all')
      ]);
      if (projRes.success && projRes.data) setProjects(projRes.data);
      if (foldRes.success && foldRes.data) setFolders(foldRes.data);
    } catch (err) {
      console.error('Failed to load project telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAiAnalysis = async () => {
    if (!title || !description) {
      showToast('Please enter a project title and description to run AI analysis.', 'error');
      return;
    }
    setIsAnalyzing(true);
    const techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const res = await api.post('/projects/analyze', { title, description, technologies: techArray });
    if (res.success && res.data) {
      setAiPreview(res.data);
      if (res.data.detectedSkills?.length > 0) {
        setTechnologies(res.data.detectedSkills.join(', '));
      }
      if (res.data.domain) {
        setDomain(res.data.domain);
      }
      showToast('AI Project Analysis completed successfully!');
    }
    setIsAnalyzing(false);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    const folderObj = folders.find((f) => f._id === projectFolderId);

    const res = await api.post('/projects', {
      title,
      description,
      domain,
      technologies: techArray,
      githubUrl,
      liveUrl,
      folder: projectFolderId || undefined,
      folderName: folderObj ? folderObj.name : 'General',
      status: 'Completed',
      featured: true
    });

    if (res.success) {
      setShowModal(false);
      setTitle('');
      setDescription('');
      setGithubUrl('');
      setLiveUrl('');
      setAiPreview(null);
      setProjectFolderId('');
      showToast('Project added and indexed in your digital portfolio!');
      await loadData();
    } else {
      showToast(res.message || 'Failed to save project', 'error');
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const res = await api.post('/projects/folders', {
      name: newFolderName.trim(),
      color: newFolderColor
    });

    if (res.success) {
      setShowFolderModal(false);
      setNewFolderName('');
      showToast(`Folder "${res.data.name}" created!`);
      await loadData();
    } else {
      showToast(res.message || 'Failed to create folder', 'error');
    }
  };

  const handleDeleteFolder = async (folderId: string, folderName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Delete folder "${folderName}"? (Projects inside will be kept in General)`)) {
      await api.delete(`/projects/folders/${folderId}`);
      if (selectedFolder === folderId) setSelectedFolder('ALL');
      showToast(`Folder "${folderName}" removed.`);
      await loadData();
    }
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload || !selectedProjectForFile) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('projectId', selectedProjectForFile._id);

    try {
      const res = await api.post('/projects/files/upload', formData);
      if (res.success) {
        setShowFileModal(false);
        setFileToUpload(null);
        showToast(`File "${fileToUpload.name}" attached to project!`);
        await loadData();
      } else {
        showToast(res.message || 'Upload failed', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'File upload failed', 'error');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await api.delete(`/projects/${id}`);
      showToast('Project removed from portfolio.');
      await loadData();
    }
  };

  const filteredProjects =
    selectedFolder === 'ALL'
      ? projects
      : projects.filter((p) => p.folder?._id === selectedFolder || p.folder === selectedFolder);

  return (
    <AppLayout>
      <div className="space-y-8 pb-12">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-5 duration-300 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-500/30'
                : 'bg-rose-950 text-rose-100 border-rose-500/30'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Engineering Portfolio</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                Folders & Cloud Files Enabled
              </Badge>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">Projects & Architecture Hub</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Organize full-stack builds, AI models, and repositories into structured domain folders
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowFolderModal(true)}>
              <FolderPlus className="w-4 h-4 mr-1.5" />
              New Folder
            </Button>
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Project
            </Button>
          </div>
        </div>

        {/* Folder Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
          <button
            onClick={() => setSelectedFolder('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              selectedFolder === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Projects</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/20">{projects.length}</span>
          </button>

          {folders.map((f) => {
            const count = projects.filter((p) => p.folder?._id === f._id || p.folder === f._id).length;
            return (
              <div
                key={f._id}
                onClick={() => setSelectedFolder(f._id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                  selectedFolder === f._id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: f.color || '#6366f1' }} />
                <span>{f.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-background/20">{count}</span>
                <button
                  onClick={(e) => handleDeleteFolder(f._id, f.name, e)}
                  className="text-muted-foreground hover:text-destructive ml-1"
                  title="Delete Folder"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card glass className="p-12 text-center space-y-4 max-w-lg mx-auto border-dashed border-border/80">
            <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <FolderGit2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground">No projects in this folder</h3>
              <p className="text-xs text-muted-foreground">
                Add your engineering projects, attach source documents, and run AI skill extraction.
              </p>
            </div>
            <Button size="sm" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Project
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                glass
                key={project._id}
                className="p-6 flex flex-col justify-between space-y-5 border-border/80 hover:border-primary/40 hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Folder & Domain */}
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20 flex items-center gap-1">
                      <Folder className="w-3 h-3" /> {project.folder?.name || project.folderName || 'General'}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{project.domain}</span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 4).map((tech: string, tIdx: number) => (
                      <span key={tIdx} className="px-2 py-0.5 rounded-lg bg-muted text-[10px] font-medium text-foreground/80">
                        {tech}
                      </span>
                    ))}
                    {project.technologies?.length > 4 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Attached Files List */}
                  {project.files && project.files.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Paperclip className="w-3 h-3" /> Attached Files ({project.files.length})
                      </div>
                      <div className="space-y-1 max-h-24 overflow-y-auto">
                        {project.files.map((file: any, fIdx: number) => (
                          <div key={fIdx} className="flex items-center justify-between text-[11px] text-foreground bg-background/80 p-1.5 rounded-lg border border-border/40">
                            <span className="truncate max-w-[150px]">{file.fileName}</span>
                            <a href={file.storageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-0.5 text-[10px]">
                              <Download className="w-3 h-3" /> Download
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Bullet Point */}
                  {project.aiAnalysis?.resumeBullets?.[0] && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-[11px] text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1 text-primary font-bold text-[10px] uppercase">
                        <Sparkles className="w-3 h-3" /> ATS Resume Bullet
                      </div>
                      <p className="italic">{project.aiAnalysis.resumeBullets[0]}</p>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                        title="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedProjectForFile(project);
                        setShowFileModal(true);
                      }}
                      className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                      title="Attach Document / Code File"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-xl bg-muted/60 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Project Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record New Engineering Project">
          <form onSubmit={handleSaveProject} className="space-y-4">
            <Input
              label="Project Title"
              placeholder="e.g. Distributed Rate Limiter & Token Bucket API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Project Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the architectural motivation, algorithms, throughput metrics, and database design..."
                className="w-full p-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Assign Folder</label>
                <select
                  value={projectFolderId}
                  onChange={(e) => setProjectFolderId(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">General (No Folder)</option>
                  {folders.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            <Input
              label="Technologies (comma-separated)"
              placeholder="e.g. Node.js, Redis, Docker, TypeScript, Jest"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="GitHub Repository URL"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
              <Input
                label="Live Demo URL"
                placeholder="https://demo.app"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
              />
            </div>

            {/* AI Analysis Preview */}
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">AI Project Analyzer</span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleRunAiAnalysis}
                  disabled={isAnalyzing}
                  className="text-xs h-8"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
                </Button>
              </div>

              {aiPreview && (
                <div className="space-y-2 text-xs text-muted-foreground pt-1">
                  <div><strong>Domain:</strong> {aiPreview.domain} | <strong>Complexity:</strong> {aiPreview.complexityLevel}</div>
                  <div><strong>Extracted Skills:</strong> {aiPreview.detectedSkills?.join(', ')}</div>
                  {aiPreview.resumeBullets?.[0] && (
                    <div className="p-2 rounded-xl bg-background/80 border border-border/40 text-[11px] italic">
                      {aiPreview.resumeBullets[0]}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Project to Portfolio</Button>
            </div>
          </form>
        </Modal>

        {/* New Folder Modal */}
        <Modal isOpen={showFolderModal} onClose={() => setShowFolderModal(false)} title="Create Project Category Folder">
          <form onSubmit={handleCreateFolder} className="space-y-4">
            <Input
              label="Folder Name"
              placeholder="e.g. AI & Computer Vision, Distributed Systems, Web Apps"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              required
            />

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Folder Color Tag</label>
              <div className="flex items-center gap-3">
                {['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6', '#8b5cf6'].map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setNewFolderColor(color)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      newFolderColor === color ? 'scale-125 ring-2 ring-primary ring-offset-2' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowFolderModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Folder</Button>
            </div>
          </form>
        </Modal>

        {/* Attach File Modal */}
        <Modal
          isOpen={showFileModal}
          onClose={() => {
            setShowFileModal(false);
            setFileToUpload(null);
          }}
          title={`Attach Document to "${selectedProjectForFile?.title}"`}
        >
          <form onSubmit={handleUploadFile} className="space-y-4">
            <div className="p-6 rounded-2xl border-2 border-dashed border-border/80 text-center space-y-3 bg-muted/20">
              <Upload className="w-8 h-8 text-primary mx-auto" />
              <div className="space-y-1">
                <div className="text-xs font-semibold text-foreground">
                  {fileToUpload ? fileToUpload.name : 'Choose a file to attach'}
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Supported: PDF, DOCX, ZIP, PPTX, PNG, JPG (Max 10 MB)
                </p>
              </div>
              <input
                type="file"
                onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                className="text-xs"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setShowFileModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingFile || !fileToUpload}>
                {uploadingFile ? 'Uploading File...' : 'Upload & Attach'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppLayout>
  );
}
