'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  TrendingUp,
  Target,
  Clock,
  Compass,
  Check,
  ChevronRight,
  BookOpen,
  Award,
  BarChart2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setLoading(true);
    fetch('/api/dashboard')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load dashboard data');
        return res.json();
      })
      .then((json) => {
        if (json) {
          setData(json);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-subtle">
            Synthesizing your adaptive knowledge model...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="nexus-card p-8 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-main">Session Expired or Inactive</h2>
          <p className="text-xs text-subtle">Please sign in to view your learning dashboard.</p>
          <Link
            href="/login"
            className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  const {
    greeting,
    userName,
    continueLearning,
    learningHealth,
    todaysPlan,
    aiInsight,
    weakAreas,
    recommendedVideos,
    roadmap,
    activeMisconceptions,
  } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP GREETING & STATUS BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            {greeting}
          </h1>
          <p className="text-sm text-subtle mt-1">
            "Your learning path should know you." Here is your dynamic mastery status today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-subtle hover:text-main bg-white border border-border rounded-lg hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalibrate Engine</span>
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span>Model Active: Bayesian DKT</span>
          </div>
        </div>
      </div>

      {/* 2. CONTINUE LEARNING HERO CARD */}
      <div className="nexus-card p-6 sm:p-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white border-primary/20 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-100/60 px-2.5 py-0.5 rounded-full">
                Continue Learning
              </span>
              <span className="text-xs text-subtle font-medium">
                {continueLearning.module}
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-main">
              {continueLearning.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {continueLearning.hasActiveMisconception ? (
                <span className="text-amber-900 font-medium">
                  Misconception Alert: You understand how to define and call functions, but you are confusing{' '}
                  <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">return</code>{' '}
                  with displaying output using{' '}
                  <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono font-bold">print()</code>.
                </span>
              ) : (
                'Strengthen this core concept through targeted practice and video walkthroughs.'
              )}
            </p>

            {/* Mastery Progression Indicator */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-main mb-1.5">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Mastery Progression</span>
                </span>
                <span className="font-mono text-primary">
                  {continueLearning.currentMastery}% &rarr; {continueLearning.projectedMastery}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${continueLearning.currentMastery}%` }}
                />
                <div
                  className="bg-primary-300 h-full transition-all duration-500 opacity-60"
                  style={{
                    width: `${continueLearning.projectedMastery - continueLearning.currentMastery}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <Link
              href={continueLearning.actionUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary-700 shadow-md hover:shadow-hover transition text-center"
            >
              <span>Continue Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/misconceptions"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-border text-subtle hover:text-main font-semibold text-xs rounded-xl hover:bg-slate-50 transition text-center"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Inspect Misconceptions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. LEARNING HEALTH METRICS (6 Grid Items) */}
      <div>
        <h3 className="text-base font-bold text-main mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span>Learning Health & Metacognitive Calibration</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Overall Mastery
            </span>
            <div className="text-2xl font-extrabold text-main font-mono">
              {learningHealth.overallMastery}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-primary h-full"
                style={{ width: `${learningHealth.overallMastery}%` }}
              />
            </div>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Accuracy
            </span>
            <div className="text-2xl font-extrabold text-main font-mono">
              {learningHealth.accuracy}%
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${learningHealth.accuracy}%` }}
              />
            </div>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Calibration
            </span>
            <div className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded mt-1 truncate">
              {learningHealth.confidenceCalibration}
            </div>
            <span className="text-[10px] text-subtle block mt-2">
              Accuracy vs Confidence
            </span>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Current Streak
            </span>
            <div className="text-2xl font-extrabold text-amber-600 flex items-center gap-1">
              <Flame className="w-5 h-5 fill-amber-500" />
              <span>{learningHealth.currentStreakDays} Days</span>
            </div>
            <span className="text-[10px] text-subtle block mt-1">Consistent Daily Study</span>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Mastered
            </span>
            <div className="text-2xl font-extrabold text-success font-mono">
              {learningHealth.conceptsMastered}
            </div>
            <span className="text-[10px] text-subtle block mt-1">Concepts &gt; 75% threshold</span>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Need Attention
            </span>
            <div className="text-2xl font-extrabold text-amber-600 font-mono">
              {learningHealth.conceptsNeedingAttention}
            </div>
            <span className="text-[10px] text-subtle block mt-1">Active review flags</span>
          </div>
        </div>
      </div>

      {/* 4. TODAY'S PLAN & AI INSIGHT (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan */}
        <div className="lg:col-span-2 nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-main text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span>Today's Plan (Dynamic Action Queue)</span>
            </h3>
            <span className="text-xs font-semibold text-subtle">
              {todaysPlan.filter((p: any) => p.completed).length} of {todaysPlan.length} completed
            </span>
          </div>

          <div className="space-y-2.5">
            {todaysPlan.map((item: any) => (
              <Link
                key={item.id}
                href={item.link}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                  item.completed
                    ? 'bg-slate-50 border-slate-200 text-subtle'
                    : 'bg-white border-border hover:border-primary/50 text-main shadow-subtle'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      item.completed
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'border border-slate-300 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span
                      className={`text-sm font-semibold ${
                        item.completed ? 'line-through text-subtle' : 'text-main'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="block text-[11px] text-subtle uppercase tracking-wider font-bold">
                      {item.type}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="nexus-card p-6 flex flex-col justify-between bg-gradient-to-b from-indigo-50/50 to-white border-secondary/20">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-main text-sm">AI Pedagogical Insight</h4>
                <span className="text-[10px] text-subtle font-mono">Cognitive Diagnosis</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-secondary/20 shadow-subtle text-xs sm:text-sm text-main leading-relaxed mb-4">
              "{aiInsight}"
            </div>

            <p className="text-xs text-subtle leading-relaxed">
              Nexus Learn AI detects false confidence before it propagates into downstream dependencies like Variable Scope and Recursion.
            </p>
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <Link
              href="/misconceptions"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary-700 transition"
            >
              <span>Resolve Active Misconception</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. WEAK AREAS (Precise percentage breakdown) */}
      <div className="nexus-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-main text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Precise Weak Areas (Targeted Remediation Queue)</span>
            </h3>
            <p className="text-xs text-subtle mt-0.5">
              Identified through multiple diagnostic signals, not single question noise.
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-xs font-bold text-primary hover:underline"
          >
            View Full Calibration Matrix &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weakAreas.length > 0 ? (
            weakAreas.map((weak: any) => (
              <div
                key={weak.conceptId}
                className="p-4 rounded-xl border border-border bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-main truncate max-w-[150px]">
                    {weak.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {weak.masteryScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      weak.masteryScore < 35
                        ? 'bg-red-500'
                        : weak.masteryScore < 50
                        ? 'bg-amber-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${weak.masteryScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-subtle pt-1">
                  <span>Accuracy: {weak.accuracy}%</span>
                  <span>Confidence: {weak.confidence}%</span>
                </div>
                <Link
                  href={`/learn/${weak.conceptId}`}
                  className="block text-center text-xs font-bold text-primary hover:underline pt-2 border-t border-border/60"
                >
                  Targeted Practice &rarr;
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-center py-6 text-xs text-subtle">
              No critical weak areas identified! All attempted concepts maintain mastery above threshold.
            </div>
          )}
        </div>
      </div>

      {/* 6. RECOMMENDED EDUCATIONAL VIDEOS (Real YouTube Integration) */}
      <div className="nexus-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-main text-base flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-danger" />
              <span>Recommended Educational Videos (YouTube Data API v3)</span>
            </h3>
            <p className="text-xs text-subtle mt-0.5">
              Aggressively cached server-side to conserve quota. Curated specifically for weak areas.
            </p>
          </div>
          <span className="text-[11px] font-mono text-subtle bg-slate-100 px-2.5 py-1 rounded">
            Region: IN | Lang: EN
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedVideos.map((video: any) => (
            <div
              key={video.id}
              className="rounded-xl border border-border overflow-hidden bg-white hover:shadow-card transition flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900 group">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-bold text-main text-sm line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                  <p className="text-xs text-subtle line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-border/50 flex items-center justify-between text-xs text-subtle">
                <span className="font-semibold text-slate-700">{video.channelTitle}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. LEARNING ROADMAP (Prerequisite DAG Snapshot) */}
      <div className="nexus-card p-6">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
          <div>
            <h3 className="font-bold text-main text-base flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>Current Learning Roadmap</span>
            </h3>
            <p className="text-xs text-subtle mt-0.5">
              Prerequisite progression graph. Advanced topics unlock only when foundations are verified.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="text-xs font-bold text-primary hover:underline"
          >
            Explore Full Interactive DAG Graph &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {roadmap.map((item: any, idx: number) => {
            const isMastered = item.status === 'MASTERED';
            const isNeedsReview = item.status === 'NEEDS_REVIEW';
            const isLearning = item.status === 'LEARNING';
            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border relative transition ${
                  isNeedsReview
                    ? 'border-amber-300 bg-amber-50/30'
                    : isMastered
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : isLearning
                    ? 'border-primary/40 bg-blue-50/20'
                    : 'border-border bg-slate-50/40 text-subtle'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-subtle">
                    STEP {item.order}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isNeedsReview
                        ? 'bg-amber-100 text-amber-800'
                        : isMastered
                        ? 'bg-emerald-100 text-emerald-800'
                        : isLearning
                        ? 'bg-primary-100 text-primary-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-main text-sm mb-2">{item.title}</h4>
                <div className="flex items-center justify-between text-xs text-subtle mb-1">
                  <span>Mastery</span>
                  <span className="font-mono font-bold text-main">{item.masteryScore}%</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      isNeedsReview ? 'bg-amber-500' : isMastered ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${item.masteryScore}%` }}
                  />
                </div>
                <div className="mt-3 text-right">
                  <Link
                    href={`/learn/${item.id}`}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Open &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
