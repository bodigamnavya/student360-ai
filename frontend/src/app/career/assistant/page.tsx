'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Sparkles,
  Send,
  User,
  Bot,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export default function CareerAssistantChatPage() {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'How can I improve my placement readiness score to reach 90%+?',
    'What skills should I learn for my target role?',
    'Which high-impact projects should I build next?',
    'What are my current academic and attendance risk factors?'
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial welcome message
    const welcome: ChatMessage = {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello ${user?.name || 'Student'}! 👋 I am your **Student360 AI Career Coach & Assistant**.

I am connected to your live student record:
• **Department**: ${user?.department || 'Computer Science and Engineering'}
• **Current CGPA**: ${profile?.cgpa ? profile.cgpa.toFixed(2) : '8.84'}
• **Target Goal**: ${profile?.targetRole || 'Full Stack Developer'}
• **Placement Readiness**: ${profile?.placementReadinessScore || 88}%

How can I help you today? Ask me anything about interview preparation, skill gap roadmaps, project ideas, or resume tuning!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([welcome]);
  }, [user, profile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text || text.trim() === '' || isSending) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    const res = await api.post('/careers/chat', {
      userPrompt: text,
      messages: messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    });

    if (res.success && res.data) {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: res.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
      if (res.data.suggestedQuestions?.length > 0) {
        setSuggestedQuestions(res.data.suggestedQuestions);
      }
    } else {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'I encountered an issue analyzing your request. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    }

    setIsSending(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Chatbot Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-extrabold text-foreground flex items-center gap-2">
                Student360 AI Career Assistant
                <Badge variant="purple">Context-Aware</Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Personalized 1-on-1 career coach reading your live academic, project, and attendance records
              </p>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <Card glass className="flex flex-col h-[600px] rounded-3xl overflow-hidden border-border/80 shadow-xl">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md ${
                      isUser ? 'bg-primary' : 'gradient-bg'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      isUser
                        ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                        : 'bg-card border border-border/80 text-foreground rounded-tl-none shadow-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    <span
                      className={`block text-[9px] text-right font-medium ${
                        isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            {isSending && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white text-xs shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border text-xs text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  AI Coach is analyzing your student profile...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-4 py-2.5 bg-muted/20 border-t border-border/50 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase text-muted-foreground shrink-0 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-primary" /> Suggestions:
            </span>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="px-3 py-1 rounded-xl bg-background border border-border/80 hover:border-primary/40 hover:bg-primary/5 text-[11px] font-medium text-foreground whitespace-nowrap transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-background/80 border-t border-border/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about placement preparation, projects, interview tips..."
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                disabled={isSending}
                className="flex-1 h-11 px-4 text-xs rounded-xl bg-muted/50 border border-input focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium"
              />
              <Button type="submit" variant="gradient" disabled={isSending || !inputPrompt.trim()}>
                <Send className="w-4 h-4 mr-1" />
                Send
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
