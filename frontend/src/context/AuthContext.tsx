'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export type UserRole = 'student' | 'faculty' | 'placement_officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface StudentProfileData {
  _id: string;
  rollNumber: string;
  college: string;
  department: string;
  degree: string;
  batch: string;
  currentYear: number;
  currentSemester: number;
  section?: string;
  cgpa: number;
  totalBacklogs: number;
  activeBacklogs: number;
  placementStatus: string;
  placementReadinessScore: number;
  riskScore: number;
  riskLevel: string;
  targetRole?: string;
  publicSlug?: string;
  isPublicPortfolio: boolean;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    leetcode?: string;
  };
  mentor?: {
    name: string;
    email: string;
    department: string;
    avatar?: string;
  };
}

interface AuthContextType {
  user: User | null;
  profile: StudentProfileData | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  quickDemoLogin: (role: UserRole) => Promise<void>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_ACCOUNTS: Record<UserRole, { email: string; pass: string; title: string; desc: string }> = {
  student: {
    email: 'student@student360.ai',
    pass: 'Student@123456',
    title: 'Aarav Sharma (Student)',
    desc: '3rd Year B.Tech CSE • CGPA 8.84 • Full Portfolio'
  },
  faculty: {
    email: 'faculty@student360.ai',
    pass: 'Faculty@123456',
    title: 'Dr. Rajesh Sharma (Faculty/Mentor)',
    desc: 'Senior Mentor • Student Monitoring & Interventions'
  },
  placement_officer: {
    email: 'placement@student360.ai',
    pass: 'Placement@123456',
    title: 'Prof. Priya Nair (Placement Officer)',
    desc: 'Placement Cell Head • Drives, Matching & Analytics'
  },
  admin: {
    email: 'admin@student360.ai',
    pass: 'Admin@123456',
    title: 'Dr. Suresh Varma (Dean/Admin)',
    desc: 'System Administrator • Institutional AI Intelligence'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchCurrentUser = async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile || null);
        setToken(savedToken);
      } else {
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error('Failed to load authenticated user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setProfile(res.data.profile || null);

        // Redirect based on role
        if (res.data.user.role === 'admin' || res.data.user.role === 'faculty') {
          router.push('/admin');
        } else if (res.data.user.role === 'placement_officer') {
          router.push('/placement');
        } else {
          router.push('/dashboard');
        }

        return { success: true, message: 'Login successful' };
      } else {
        return { success: false, message: res.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const quickDemoLogin = async (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    if (demo) {
      await login(demo.email, demo.pass);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      if (res.success && res.data) {
        localStorage.setItem('token', res.data.accessToken);
        setToken(res.data.accessToken);
        setUser(res.data.user);
        router.push('/dashboard');
        return { success: true, message: 'Account created successfully' };
      } else {
        return { success: false, message: res.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('token');
    setUser(null);
    setProfile(null);
    setToken(null);
    router.push('/login');
  };

  const refreshProfile = async () => {
    if (user?.role === 'student') {
      const res = await api.get('/students/profile');
      if (res.success && res.data) {
        setProfile(res.data);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        isLoading,
        login,
        quickDemoLogin,
        register,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
