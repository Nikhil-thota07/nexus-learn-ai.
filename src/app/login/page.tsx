'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Lock, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('nikhil@nexuslearn.ai');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    // Quick registration/login if user doesn't exist yet
    setLoading(true);
    setError(null);

    // Try login first
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nikhil@nexuslearn.ai', password: 'password123' }),
      });

      if (res.ok) {
        router.push('/dashboard');
        router.refresh();
        return;
      }
    } catch {}

    // If account not created yet, seed demo user
    try {
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Nikhil Sharma',
          email: 'nikhil@nexuslearn.ai',
          password: 'password123',
          age: 20,
          dob: '2004-05-14',
          educationLevel: 'B.Tech',
          qualification: 'Undergraduate',
          branch: 'Computer Science & Engineering',
          year: '3rd Year',
          semester: 'Semester 5',
          subjects: 'Data Structures, Operating Systems, Python, Algorithms',
          careerInterests: 'AI Systems Engineer',
          targetExam: 'GATE & Tech Placements',
        }),
      });

      if (signupRes.ok) {
        router.push('/dashboard');
        router.refresh();
      } else {
        const d = await signupRes.json();
        throw new Error(d.error || 'Quick demo setup failed');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-card border border-border p-8 sm:p-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-main tracking-tight">Nexus Learn AI</span>
          </Link>
          <h2 className="text-xl font-bold text-main">Welcome Back</h2>
          <p className="text-sm text-subtle mt-1">Sign in to your adaptive learning path</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nikhil@nexuslearn.ai"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-main uppercase tracking-wider">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 border border-border text-slate-700 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            <span>Instant 1-Click Demo Login (Nikhil Sharma)</span>
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-subtle">
            Don't have an account yet?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
