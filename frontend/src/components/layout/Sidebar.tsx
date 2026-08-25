'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  CalendarCheck,
  Users,
  FolderGit2,
  Briefcase,
  Award,
  Trophy,
  Cpu,
  Target,
  Sparkles,
  Compass,
  FileText,
  Building2,
  BookOpen,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  ShieldAlert,
  BarChart3,
  SearchCheck,
  TrendingUp,
  Layers
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  const role = user?.role || 'student';

  const studentNavItems: NavGroup[] = [
    { title: 'Overview', items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Digital Profile', href: '/profile', icon: User },
    ]},
    { title: 'Academics & Mentoring', items: [
      { name: 'Academics', href: '/academics', icon: GraduationCap },
      { name: 'Attendance', href: '/attendance', icon: CalendarCheck },
      { name: 'Timetable', href: '/timetable', icon: CalendarCheck },
      { name: 'Exams', href: '/exams', icon: ClipboardList },
      { name: 'Assignments', href: '/assignments', icon: FileText },
      { name: 'Leave', href: '/leave', icon: CalendarCheck },
      { name: 'Mentoring', href: '/mentoring', icon: Users },
      { name: 'Early Warning', href: '/early-warning', icon: ShieldAlert, badge: 'AI' },
    ]},
    { title: 'Portfolio & Skills', items: [
      { name: 'Projects', href: '/projects', icon: FolderGit2 },
      { name: 'Internships', href: '/internships', icon: Briefcase },
      { name: 'Certifications', href: '/certifications', icon: Award },
      { name: 'Achievements', href: '/achievements', icon: Trophy },
      { name: 'Activities', href: '/activities', icon: Users },
      { name: 'Skills Matrix', href: '/skills', icon: Cpu },
      { name: 'Goals', href: '/goals', icon: Target },
      { name: 'Documents', href: '/documents', icon: FileText },
    ]},
    { title: 'AI Career Center', items: [
      { name: 'Career Trajectory', href: '/career', icon: Compass },
      { name: 'Skill Gap Analysis', href: '/career/skill-gap', icon: Target },
      { name: 'Learning Roadmap', href: '/career/roadmap', icon: Layers, badge: 'NEW' },
      { name: 'Weekly Action Plan', href: '/career/weekly-plan', icon: CalendarCheck, badge: 'AI' },
      { name: 'Mock Interview Coach', href: '/career/interview', icon: Sparkles, badge: 'AI' },
      { name: 'Job Matching', href: '/career/job-matching', icon: SearchCheck },
      { name: 'AI Career Assistant', href: '/career/assistant', icon: Sparkles, badge: 'AI' },
      { name: 'Resume Builder', href: '/resume', icon: FileText, badge: 'ATS' },
    ]},
    { title: 'Career & Higher Ed', items: [
      { name: 'Campus Placements', href: '/placement', icon: Building2 },
      { name: 'Higher Education', href: '/higher-education', icon: BookOpen },
      { name: 'Competitive Exams', href: '/competitive-exams', icon: ClipboardList },
    ]},
    { title: 'Account', items: [
      { name: 'Notifications', href: '/notifications', icon: Bell },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]}
  ];

  const adminNavItems: NavGroup[] = [
    { title: 'Institutional Control', items: [
      { name: 'Admin Dashboard', href: '/admin', icon: BarChart3 },
      { name: 'Students Directory', href: '/admin/students', icon: Users },
      { name: 'Faculty & Mentors', href: '/admin/faculty', icon: GraduationCap },
      { name: 'Campus Placements', href: '/placement', icon: Building2 },
      { name: 'Analytics & Cohorts', href: '/admin/analytics', icon: TrendingUp },
      { name: 'System Settings', href: '/settings', icon: Settings },
    ]}
  ];

  const facultyNavItems: NavGroup[] = [
    { title: 'Faculty Portal', items: [
      { name: 'Faculty Dashboard', href: '/admin', icon: BarChart3 },
      { name: 'Assigned Mentees', href: '/admin/students', icon: Users },
      { name: 'Mentoring Sessions', href: '/mentoring', icon: Users },
      { name: 'Academics Review', href: '/academics', icon: GraduationCap },
      { name: 'Risk Alerts & Attendance', href: '/attendance', icon: ShieldAlert },
    ]}
  ];

  const placementNavItems: NavGroup[] = [
    { title: 'Placement Portal', items: [
      { name: 'Placement Analytics', href: '/placement', icon: BarChart3 },
      { name: 'Job Drives', href: '/placement/jobs', icon: Building2 },
      { name: 'Applications & Stages', href: '/placement/applications', icon: Layers },
      { name: 'Student Eligibility', href: '/admin/students', icon: Users },
    ]}
  ];

  const navGroups =
    role === 'admin'
      ? adminNavItems
      : role === 'faculty'
      ? facultyNavItems
      : role === 'placement_officer'
      ? placementNavItems
      : studentNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-72 border-r bg-card/95 backdrop-blur-xl transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/60">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              360
            </div>
            <div>
              <div className="font-heading font-extrabold text-lg text-foreground tracking-tight flex items-center gap-1.5">
                Student<span className="text-primary font-bold">360</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                Lifecycle & Portfolio Platform
              </p>
            </div>
          </Link>
        </div>

        {/* User Mini Profile Badge */}
        <div className="px-4 py-3 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-background/60 border border-border/50">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-foreground truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[11px] text-muted-foreground capitalize font-medium truncate">
                {role.replace('_', ' ')} • {user?.department?.split(' ')[0] || 'Campus'}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <h4 className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">
                {group.title}
              </h4>
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && item.href !== '/admin' && item.href !== '/placement' && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-muted-foreground group-hover:text-primary')} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'text-[9px] font-extrabold px-1.5 py-0.5 rounded-md tracking-wider uppercase',
                          isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-border/60 bg-muted/10 space-y-2">
          {role === 'student' && profile?.publicSlug && (
            <Link
              href={`/portfolio/${profile.publicSlug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-xl border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View Public Portfolio</span>
            </Link>
          )}

          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 text-xs font-semibold rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
