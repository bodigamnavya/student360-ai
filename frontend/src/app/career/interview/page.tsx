'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { api } from '@/lib/api';
import {
  Sparkles,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trophy,
  Award,
  ChevronRight,
  Send,
  Brain,
  MessageSquare
} from 'lucide-react';

export default function InterviewCoachPage() {
  const [role, setRole] = useState('Full Stack Developer');
  const [interviewType, setInterviewType] = useState('Comprehensive Mock');
  const [session, setSession] = useState<any>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [starting, setStarting] = useState(false);
  const [lastEval, setLastEval] = useState<any>(null);
  const [finalReport, setFinalReport] = useState<any>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const startInterview = async () => {
    setStarting(true);
    setFinalReport(null);
    setLastEval(null);
    try {
      const res = await api.post('/ai/interview/start', {
        role,
        interviewType,
        experienceLevel: 'Entry'
      });
      if (res.success && res.data) {
        setSession(res.data);
        setCurrentIdx(0);
        setStudentAnswer('');
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
    } finally {
      setStarting(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!session || !studentAnswer.trim()) return;
    setEvaluating(true);
    try {
      const currentQ = session.questions[currentIdx];
      const res = await api.post('/ai/interview/answer', {
        sessionId: session._id,
        questionNumber: currentQ.questionNumber,
        answer: studentAnswer
      });
      if (res.success && res.data) {
        setLastEval(res.data.evaluation);
        const updatedQuestions = [...session.questions];
        updatedQuestions[currentIdx].studentAnswer = studentAnswer;
        updatedQuestions[currentIdx].evaluation = res.data.evaluation;
        setSession({ ...session, questions: updatedQuestions });
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setLastEval(null);
    setStudentAnswer('');
    if (currentIdx + 1 < session.questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      generateReport();
    }
  };

  const generateReport = async () => {
    if (!session) return;
    setLoadingReport(true);
    try {
      const res = await api.post('/ai/interview/report', {
        sessionId: session._id
      });
      if (res.success && res.data) {
        setFinalReport(res.data.report || res.data);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoadingReport(false);
    }
  };

  const currentQ = session?.questions?.[currentIdx];
  const isLastQuestion = session && currentIdx === session.questions.length - 1;

  return (
    <AppLayout>
      <div className="space-y-8 pb-12 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Interview Intelligence</span>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">AI Evaluator</Badge>
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-foreground">AI Mock Interview Coach</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Practice real-time Technical, HR, Behavioral, and System Architecture interview simulations
            </p>
          </div>
          <Link href="/career">
            <Button variant="outline" size="sm">
              Back to Career Hub
            </Button>
          </Link>
        </div>

        {/* Setup Screen (When no active session) */}
        {!session && (
          <Card glass className="p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-heading font-bold text-foreground">Configure Mock Interview</h2>
              <p className="text-xs text-muted-foreground">Select your target engineering role and preferred interview format</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Target Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Backend Developer">Backend & Systems Engineer</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                  <option value="Data Analyst & BI Engineer">Data Analyst & BI Engineer</option>
                  <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                  <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Interview Format</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="Comprehensive Mock">Comprehensive Mock (Tech + HR + Behavioral + Project)</option>
                  <option value="Technical">Technical Deep Dive Only</option>
                  <option value="HR">HR & Culture Fit</option>
                  <option value="Behavioral">Behavioral (STAR Framework)</option>
                  <option value="Project-based">Project Architecture & Defense</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-start gap-3 text-xs text-muted-foreground">
              <Brain className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground font-semibold">How it works: </strong>
                The AI Interview Coach generates dynamic questions, analyzes your answers across 5 dimensions (Technical Accuracy, Communication, Clarity, Structure, Relevance), and produces an ATS-ready candidate evaluation report.
              </div>
            </div>

            <Button onClick={startInterview} disabled={starting} className="w-full sm:w-auto">
              <Sparkles className="w-4 h-4 mr-2" />
              {starting ? 'Generating Custom Interview Matrix...' : 'Start AI Mock Interview'}
            </Button>
          </Card>
        )}

        {/* Active Interview Session */}
        {session && !finalReport && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card glass className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {currentIdx + 1}/{session.questions.length}
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{session.role}</div>
                  <div className="text-[11px] text-muted-foreground">{currentQ?.category} Round</div>
                </div>
              </div>
              <div className="w-48 hidden sm:block">
                <Progress value={((currentIdx + (lastEval ? 1 : 0)) / session.questions.length) * 100} className="h-2" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSession(null)}>
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Exit
              </Button>
            </Card>

            {/* Question Card */}
            <Card glass className="p-6 sm:p-8 space-y-6 border-border/80 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{currentQ?.category}</Badge>
                    <span className="text-xs text-muted-foreground">Question {currentQ?.questionNumber}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-heading font-bold text-foreground leading-relaxed">
                    {currentQ?.question}
                  </h2>
                </div>
              </div>

              {/* Student Answer Input */}
              {!lastEval ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Your Answer</span>
                      <span className="text-[11px] text-muted-foreground">{studentAnswer.length} characters</span>
                    </label>
                    <textarea
                      rows={6}
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      placeholder="Type your structured answer here. Include architectural reasons, trade-offs, algorithms, or practical project experiences..."
                      className="w-full p-4 text-xs sm:text-sm bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={handleAnswerSubmit}
                      disabled={evaluating || !studentAnswer.trim()}
                      className="w-full sm:w-auto"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {evaluating ? 'AI Evaluating Answer...' : 'Submit Answer for AI Review'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* AI Feedback Section */
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <User className="w-3.5 h-3.5" />
                      <span>Your Submitted Answer</span>
                    </div>
                    <p className="text-xs text-foreground/90 whitespace-pre-wrap">{currentQ.studentAnswer}</p>
                  </div>

                  {/* Dimension Scores */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-xl bg-background border border-border/80 text-center">
                      <div className="text-[10px] text-muted-foreground font-medium">Technical</div>
                      <div className="text-base font-bold text-primary mt-0.5">{lastEval.technicalAccuracy}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background border border-border/80 text-center">
                      <div className="text-[10px] text-muted-foreground font-medium">Communication</div>
                      <div className="text-base font-bold text-primary mt-0.5">{lastEval.communication}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background border border-border/80 text-center">
                      <div className="text-[10px] text-muted-foreground font-medium">Clarity</div>
                      <div className="text-base font-bold text-primary mt-0.5">{lastEval.clarity}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background border border-border/80 text-center">
                      <div className="text-[10px] text-muted-foreground font-medium">Structure</div>
                      <div className="text-base font-bold text-primary mt-0.5">{lastEval.structure}%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-background border border-border/80 text-center col-span-2 sm:col-span-1">
                      <div className="text-[10px] text-muted-foreground font-medium">Relevance</div>
                      <div className="text-base font-bold text-emerald-500 mt-0.5">{lastEval.relevance}%</div>
                    </div>
                  </div>

                  {/* AI Feedback & Strengths */}
                  <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <h4 className="text-xs font-bold text-foreground">AI Coach Feedback</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{lastEval.feedback}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                        </div>
                        <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
                          {lastEval.strengths?.map((s: string, idx: number) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[11px] font-semibold text-amber-500 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> Improvement Areas
                        </div>
                        <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
                          {lastEval.improvements?.map((i: string, idx: number) => (
                            <li key={idx}>{i}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sample Ideal Answer */}
                  {lastEval.sampleIdealAnswer && (
                    <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
                      <h5 className="text-[11px] font-bold text-foreground uppercase tracking-wider">Sample Benchmark Framework</h5>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">{lastEval.sampleIdealAnswer}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button onClick={nextQuestion} className="w-full sm:w-auto">
                      {isLastQuestion ? 'Complete Interview & Generate Report' : 'Next Question'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Final Comprehensive Report */}
        {finalReport && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <Card glass className="p-6 sm:p-8 space-y-6 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                      Simulation Completed
                    </Badge>
                    <span className="text-xs text-muted-foreground">{session?.role}</span>
                  </div>
                  <h2 className="text-xl font-heading font-bold text-foreground">AI Mock Interview Performance Report</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground">Overall Score</div>
                    <div className="text-3xl font-heading font-extrabold text-primary">{finalReport.overallScore}%</div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Score breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-background border border-border/80 text-center">
                  <div className="text-xs text-muted-foreground font-medium">Technical Depth</div>
                  <div className="text-xl font-bold text-foreground mt-1">{finalReport.technicalScore}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border/80 text-center">
                  <div className="text-xs text-muted-foreground font-medium">Communication</div>
                  <div className="text-xl font-bold text-foreground mt-1">{finalReport.communicationScore}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border/80 text-center">
                  <div className="text-xs text-muted-foreground font-medium">Problem Solving</div>
                  <div className="text-xl font-bold text-foreground mt-1">{finalReport.problemSolvingScore}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-background border border-border/80 text-center">
                  <div className="text-xs text-muted-foreground font-medium">Clarity & Confidence</div>
                  <div className="text-xl font-bold text-emerald-500 mt-1">{finalReport.confidenceScore}%</div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
                <h4 className="text-xs font-bold text-foreground mb-1">Executive Assessment</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{finalReport.summary}</p>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Strong Competencies
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    {finalReport.strongAreas?.map((area: string, i: number) => (
                      <li key={i}>{area}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                  <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Recommended Revisions
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    {finalReport.recommendedTopics?.map((topic: string, i: number) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <Button variant="outline" onClick={() => setSession(null)}>
                  Take Another Interview
                </Button>
                <Link href="/career/skill-gap">
                  <Button>
                    View Skill Gap Analysis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
