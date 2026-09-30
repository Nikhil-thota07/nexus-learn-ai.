'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [demoToken, setDemoToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setSubmitted(true);
      if (data.demoResetToken) {
        setDemoToken(data.demoResetToken);
      }
    } finally {
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
          <h2 className="text-xl font-bold text-main">Reset Password</h2>
          <p className="text-sm text-subtle mt-1">Enter your registered email address</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-main text-lg">Reset Instructions Sent</h3>
            <p className="text-xs text-subtle">
              If an account with {email} exists, password reset verification has been generated.
            </p>
            {demoToken && (
              <div className="p-3 bg-slate-50 border border-border rounded-lg text-left">
                <span className="text-[10px] text-subtle uppercase font-bold block mb-1">
                  Local Development Reset Token
                </span>
                <code className="text-xs text-primary font-mono select-all break-all">
                  {demoToken}
                </code>
                <div className="mt-2 text-right">
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}&token=${demoToken}`}
                    className="text-xs text-primary font-bold hover:underline"
                  >
                    Proceed to Reset &rarr;
                  </Link>
                </div>
              </div>
            )}
            <Link
              href="/login"
              className="inline-block pt-2 text-sm text-primary font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@nexuslearn.ai"
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
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center pt-4">
              <Link href="/login" className="text-xs text-subtle hover:text-main">
                Cancel and return to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
