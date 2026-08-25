'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth, DEMO_ACCOUNTS, UserRole } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  Menu,
  Bell,
  Search,
  Moon,
  Sun,
  Sparkles,
  ChevronDown,
  UserCheck,
  Check,
  Shield,
  Layers,
  GraduationCap
} from 'lucide-react';

export const Header: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const { user, profile, quickDemoLogin, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Detect system dark mode
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      let isDarkMode = false;
      
      if (savedTheme) {
        isDarkMode = savedTheme === 'dark';
      } else {
        isDarkMode = document.documentElement.classList.contains('dark') ||
          window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    // Fetch notifications
    api.get('/notifications').then((res) => {
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    }).catch(() => {});
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleRoleSwitch = async (role: UserRole) => {
    setShowRoleSwitcher(false);
    await quickDemoLogin(role);
  };

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
      {/* Left: Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, skills, jobs, records..."
            className="w-full h-9 pl-9 pr-4 text-xs rounded-xl bg-muted/50 border border-input/60 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Demo Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Role Switcher:</span>
            <span className="capitalize">{user?.role?.replace('_', ' ') || 'Student'}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 animate-slide-up">
              <div className="px-3 py-2 border-b border-border/50">
                <p className="text-xs font-bold text-foreground">Instant Demo Account Switcher</p>
                <p className="text-[10px] text-muted-foreground">Select a persona to test role-specific workflows:</p>
              </div>
              <div className="p-1 space-y-1">
                {(['student', 'faculty', 'placement_officer', 'admin'] as UserRole[]).map((r) => {
                  const demo = DEMO_ACCOUNTS[r];
                  const isCurrent = user?.role === r;

                  return (
                    <button
                      key={r}
                      onClick={() => handleRoleSwitch(r)}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                        isCurrent ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div>
                        <div className="font-semibold flex items-center gap-1.5">
                          {r === 'student' && <UserCheck className="w-3.5 h-3.5 text-blue-500" />}
                          {r === 'faculty' && <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />}
                          {r === 'placement_officer' && <Layers className="w-3.5 h-3.5 text-amber-500" />}
                          {r === 'admin' && <Shield className="w-3.5 h-3.5 text-purple-500" />}
                          <span>{demo.title}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{demo.desc}</p>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-primary shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-card border border-border shadow-2xl p-2 z-50 animate-slide-up">
              <div className="flex items-center justify-between px-3 py-2 border-b border-border/50">
                <span className="text-xs font-bold text-foreground">Notifications ({unreadCount} unread)</span>
                <Link
                  href="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] text-primary font-semibold hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="max-h-72 overflow-y-auto p-1 space-y-1">
                {notifications.length === 0 ? (
                  <p className="p-4 text-xs text-center text-muted-foreground">No recent notifications</p>
                ) : (
                  notifications.slice(0, 4).map((n) => (
                    <div key={n._id} className="p-2.5 rounded-xl hover:bg-muted/60 text-xs transition-colors">
                      <p className="font-bold text-foreground">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 pl-2 border-l border-border/60 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold leading-none text-foreground">{user?.name || 'Aarav Sharma'}</p>
            <p className="text-[10px] text-muted-foreground capitalize mt-0.5">{user?.role || 'Student'}</p>
          </div>
        </Link>
      </div>
    </header>
  );
};
