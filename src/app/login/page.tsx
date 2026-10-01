'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BrainCircuit,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    setError(null);

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
          year: '1st Year',
          semester: 'Semester 1',
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

  const highlights = [
    { icon: Brain, text: 'AI that models your exact knowledge state' },
    { icon: Target, text: 'Misconception detection & targeted remediation' },
    { icon: TrendingUp, text: 'Your syllabus, your branch, your path' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL (decorative) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-primary via-secondary to-indigo-800 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-24 translate-x-24" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white/5 translate-y-16 -translate-x-16" />
          <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-white/3 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-white text-lg leading-none tracking-tight">
              Nexus Learn AI
            </div>
            <div className="text-indigo-200 text-xs mt-0.5">Your learning path should know you.</div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              Adaptive learning that truly{' '}
              <span className="text-indigo-200 italic">understands you.</span>
            </h2>
            <p className="text-indigo-200 text-base leading-relaxed">
              Not just another EdTech platform. Nexus Learn AI models your misconceptions, calibrates
              your confidence, and recalculates your roadmap after every single answer.
            </p>
          </div>

          <div className="space-y-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-indigo-100 text-sm font-medium">{h.text}</p>
                </div>
              );
            })}
          </div>

          {/* Mini feedback loop card */}
          <div className="bg-white/10 border border-white/20 rounded-xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-200">Misconception Detected</span>
            </div>
            <p className="text-white text-sm font-medium leading-snug">
              "You understand how to define functions, but you're confusing{' '}
              <code className="bg-white/20 px-1 rounded text-xs font-mono">return</code> with{' '}
              <code className="bg-white/20 px-1 rounded text-xs font-mono">print()</code>."
            </p>
            <p className="text-indigo-200 text-xs mt-2">
              → Curated 12-min video → Practice → Roadmap recalibrated ✓
            </p>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative text-indigo-300 text-xs font-medium">
          Powered by Gemini AI · YouTube Data API v3 · Bayesian Knowledge Modeling
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden inline-flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-main tracking-tight">Nexus Learn AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-main tracking-tight">Welcome back</h1>
            <p className="text-subtle text-sm mt-2">
              Sign in to continue your personalized learning journey.
            </p>
          </div>

          {/* Demo banner */}
          <button
            type="button"
            onClick={handleQuickDemo}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition font-semibold text-sm disabled:opacity-50"
          >
            <KeyRound className="w-4 h-4 text-indigo-500" />
            <span>Quick Demo Login (1-click, no signup needed)</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs text-subtle">
              <span className="bg-white px-3 font-medium">or sign in with your account</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main placeholder:text-slate-400 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-main uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 text-sm bg-slate-50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main placeholder:text-slate-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to My Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { icon: CheckCircle2, label: 'Secure', color: 'text-success' },
              { icon: CheckCircle2, label: 'Private', color: 'text-success' },
              { icon: CheckCircle2, label: 'Ad-free', color: 'text-success' },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex items-center justify-center gap-1.5 text-xs text-subtle font-medium">
                  <Icon className={`w-3.5 h-3.5 ${b.color}`} />
                  {b.label}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <p className="text-sm text-subtle">
              New to Nexus Learn AI?{' '}
              <Link href="/signup" className="font-bold text-primary hover:underline">
                Create your free account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
