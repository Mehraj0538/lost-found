'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  ecoPoints: number;
  tier: string;
  recycledCount: number;
  scanCount: number;
  joinedAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  awardPoints: (action: 'scan' | 'recycle', wasteType: string, predictionId?: string) => Promise<{ pointsAwarded?: number; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Login failed' };
    setUser(data.user);
    return {};
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Registration failed' };
    setUser(data.user);
    return {};
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout — clear local state regardless
    }
    setUser(null);
  };

  const awardPoints = async (action: 'scan' | 'recycle', wasteType: string, predictionId?: string) => {
    if (!user) return { error: 'Not logged in' };
    const res = await fetch('/api/eco-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, wasteType, predictionId }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error };
    // Update local user points/tier
    setUser((prev) => prev ? { ...prev, ecoPoints: data.totalPoints, tier: data.tier } : prev);
    return { pointsAwarded: data.pointsAwarded };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, awardPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
