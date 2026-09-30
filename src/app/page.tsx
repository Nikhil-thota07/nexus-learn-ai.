import React from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Compass,
  AlertTriangle,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Cpu,
  Layers,
  Flame,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary text-xs font-bold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Generation Personalized Learning Path Optimizer</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-main tracking-tight leading-[1.15]">
              Your learning path <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                should know you.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-subtle leading-relaxed font-normal">
              Nexus Learn AI continuously models what you know, what you don't know, what you misunderstand, and how confident you are. Real-time misconception detection, dynamic prerequisite gating, and targeted video remediation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-700 shadow-md hover:shadow-hover transition"
              >
                <span>Launch Student Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-border text-main font-semibold rounded-xl hover:bg-slate-50 transition shadow-subtle"
              >
                <span>Create Student Account</span>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-subtle font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> Light theme production UI
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> Persistent PostgreSQL state
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> YouTube v3 cached integration
              </span>
            </div>
          </div>

          {/* INTERACTIVE CASE STUDY SHOWCASE CARD */}
          <div className="mt-14 max-w-4xl mx-auto nexus-card border border-border shadow-card overflow-hidden">
            <div className="bg-slate-100/70 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono font-medium text-subtle">
                  Adaptive Feedback Loop in Action: Python Functions
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                Misconception Detected
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Traditional Generic EdTech */}
                <div className="p-5 rounded-xl border border-red-200 bg-red-50/30">
                  <div className="flex items-center gap-2 text-danger font-bold text-sm mb-2">
                    <span>❌ Traditional Generic EdTech</span>
                  </div>
                  <p className="text-xs text-subtle mb-3">
                    Observes 31% quiz score on Python Functions test.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-medium text-slate-800">
                    "Your Python is weak. Please rewatch all 12 hours of Python for Beginners."
                  </div>
                  <p className="text-[11px] text-red-600 mt-2">
                    Frustrating, demotivating, and wastes student study time.
                  </p>
                </div>

                {/* Nexus Learn AI Precision Feedback */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/30">
                  <div className="flex items-center gap-2 text-success font-bold text-sm mb-2">
                    <span>✨ Nexus Learn AI Precision Loop</span>
                  </div>
                  <p className="text-xs text-subtle mb-3">
                    Analyzes Return Values: 31% mastery, High confidence, Repeated error.
                  </p>
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs font-medium text-main">
                    "You understand how to define and call functions, but you are confusing <code className="bg-slate-100 px-1 py-0.5 rounded text-primary font-mono font-bold">return</code> with displaying output using <code className="bg-slate-100 px-1 py-0.5 rounded text-secondary font-mono font-bold">print()</code>."
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2 font-medium">
                    Explains the misconception &rarr; Curated video &rarr; Practice &rarr; Recalibrates roadmap in 8 minutes.
                  </p>
                </div>
              </div>

              {/* Step Flow Ribbon */}
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg border border-border">
                    <div className="text-xs font-bold text-primary">1. Pinpoint Error</div>
                    <div className="text-[11px] text-subtle">Distinguish gap from misconception</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-border">
                    <div className="text-xs font-bold text-secondary">2. YouTube Lesson</div>
                    <div className="text-[11px] text-subtle">Specific 12-min targeted lesson</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-border">
                    <div className="text-xs font-bold text-accent">3. Post-Assessment</div>
                    <div className="text-[11px] text-subtle">Confidence vs accuracy re-test</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-border">
                    <div className="text-xs font-bold text-success">4. Unlock Next</div>
                    <div className="text-[11px] text-subtle">Recalculate prerequisite DAG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-main">
            Built for Serious Commercial EdTech
          </h2>
          <p className="text-subtle text-sm mt-2 max-w-2xl mx-auto">
            Every feature is backed by real mathematical modeling, strict data persistence, and pedagogically sound algorithms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">Knowledge State Engine</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Models mastery score, attempt history, difficulty weighting, improvement rate, and Bayesian updates. Weaknesses are never inferred from a single noisy attempt.
            </p>
          </div>

          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">Metacognitive Calibration</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Students state their confidence after assessments. The system maps answers into the 4 Quadrants: Overconfidence, Underconfidence, Strong Mastery, or Genuine Gap.
            </p>
          </div>

          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">Prerequisite DAG Gating</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Strict topological prerequisite graph ensures learners never get lost in advanced concepts before cementing required foundations.
            </p>
          </div>

          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">JEE Preparation Mode</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Calibrated for JEE Main & Advanced Physics, Chemistry, and Mathematics with subtle trap questions on Newton's laws, rotational dynamics, and kinematics.
            </p>
          </div>

          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">B.Tech Engineering Mode</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Operating Systems, Data Structures, Paging, Deadlocks, Banker's Algorithm, and Distributed Architecture ready for technical placements and university exams.
            </p>
          </div>

          <div className="nexus-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <PlayCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-main text-base">Cached YouTube v3 Discovery</h3>
            <p className="text-xs text-subtle leading-relaxed">
              Calls YouTube Data API v3 strictly from the backend with server-side caching to respect API quotas while delivering the finest academic videos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary text-white rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-card">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to experience truly adaptive learning?
            </h3>
            <p className="text-primary-100 text-sm max-w-xl">
              Log in with our pre-configured demo account or create your custom student profile in 60 seconds.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-3 bg-white text-primary font-bold text-sm rounded-xl hover:bg-slate-100 shadow transition whitespace-nowrap"
            >
              Sign In to Demo
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-primary-700 text-white font-bold text-sm rounded-xl hover:bg-primary-800 border border-primary-500 transition whitespace-nowrap"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
