'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
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
  GraduationCap,
  Atom,
  Binary,
  Layers,
  FileText,
} from 'lucide-react';
import { PreparationMode } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const fetchDashboard = (yr?: number, sem?: number) => {
    setLoading(true);
    const targetYr = yr ?? selectedYear;
    const targetSem = sem ?? selectedSemester;

    fetch(`/api/dashboard?year=${targetYr}&semester=${targetSem}`)
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
          if (json.profile?.year) {
            const rawYr = Number(String(json.profile.year).replace(/\D/g, '')) || 1;
            setSelectedYear(rawYr);
          }
          if (json.profile?.semester) {
            const rawSem = Number(String(json.profile.semester).replace(/\D/g, '')) || 1;
            setSelectedSemester(rawSem);
          }
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const storedYr = typeof window !== 'undefined' ? localStorage.getItem('nexus_selected_year') : null;
    const storedSem = typeof window !== 'undefined' ? localStorage.getItem('nexus_selected_semester') : null;
    const initialYr = storedYr ? parseInt(storedYr) : 1;
    const initialSem = storedSem ? parseInt(storedSem) : 1;
    setSelectedYear(initialYr);
    setSelectedSemester(initialSem);
    fetchDashboard(initialYr, initialSem);
  }, []);

  const handleSemesterSwitch = async (yr: number, sem: number) => {
    setSelectedYear(yr);
    setSelectedSemester(sem);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_selected_year', String(yr));
      localStorage.setItem('nexus_selected_semester', String(sem));
    }

    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: `${yr}${yr === 1 ? 'st' : yr === 2 ? 'nd' : yr === 3 ? 'rd' : 'th'} Year`,
          semester: `Semester ${sem}`,
        }),
      });
    } catch {}

    fetchDashboard(yr, sem);
  };

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
    preparationMode,
    profile,
    engineeringSyllabus,
    continueLearning,
    learningHealth,
    todaysPlan,
    aiInsight,
    weakAreas,
    recommendedVideos,
    roadmap,
    activeMisconceptions,
  } = data;

  // Title by Mode (Section 46 Requirement)
  const dashboardTitle =
    preparationMode === 'JEE'
      ? 'Your JEE Learning Path'
      : preparationMode === 'ENGINEERING'
      ? 'Your Engineering Learning Path'
      : preparationMode === 'SCHOOL'
      ? 'Your School Learning Path'
      : 'Your Skill Learning Path';

  const modeBadge =
    preparationMode === 'JEE'
      ? { label: '🎯 JEE Preparation', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
      : preparationMode === 'ENGINEERING'
      ? { label: '🎓 B.Tech Engineering', color: 'bg-blue-50 text-blue-800 border-blue-200' }
      : preparationMode === 'SCHOOL'
      ? { label: '📚 School Learning', color: 'bg-purple-50 text-purple-800 border-purple-200' }
      : { label: '💻 Skill Development', color: 'bg-amber-50 text-amber-800 border-amber-200' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. TOP GREETING & MODE BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${modeBadge.color}`}>
              {modeBadge.label}
            </span>
            <Link
              href="/profile"
              className="text-xs text-primary font-semibold hover:underline"
            >
              Change Mode
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main tracking-tight">
            {dashboardTitle} &bull; {greeting}
          </h1>
          <p className="text-sm text-subtle mt-1">
            {preparationMode === 'ENGINEERING' && profile ? (
              <span>
                Enrolled at <strong>{profile.college}</strong> ({profile.university}) &bull;{' '}
                <strong>{profile.branch}</strong> ({profile.regulation}) &bull; {profile.year}, {profile.semester}
              </span>
            ) : preparationMode === 'JEE' ? (
              <span>
                Targeting <strong>{profile.targetExam}</strong> &bull; Class: {profile.currentClass}
              </span>
            ) : (
              <span>
                "Your learning path should know you." Here is your dynamic mastery status today.
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/tutor"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-700 shadow-subtle transition"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Academic Tutor</span>
          </Link>
          <button
            type="button"
            onClick={() => fetchDashboard()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-subtle hover:text-main bg-white border border-border rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recalibrate</span>
          </button>
        </div>
      </div>

      {/* 2. MODE-SPECIFIC HIGHLIGHT CARDS */}
      {/* 2A: ENGINEERING OFFICIAL SYLLABUS SUBJECTS */}
      {preparationMode === 'ENGINEERING' && (
        <div className="nexus-card p-6 space-y-4 border-indigo-100 bg-gradient-to-r from-slate-50 via-indigo-50/20 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-main text-base">
                Official Syllabus Subjects &bull; Year {selectedYear}, Semester {selectedSemester}
              </h3>
            </div>
            
            {/* Interactive Year & Semester Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-subtle uppercase">Semester:</span>
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                  const y = Math.ceil(s / 2);
                  const isCurrent = selectedSemester === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSemesterSwitch(y, s)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                        isCurrent
                          ? 'bg-primary text-white shadow-subtle'
                          : 'text-subtle hover:text-main hover:bg-slate-100'
                      }`}
                    >
                      S{s}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {engineeringSyllabus && engineeringSyllabus.subjects && engineeringSyllabus.subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {engineeringSyllabus.subjects.map((sub: any) => (
                <div
                  key={sub.id}
                  className="p-4 bg-white rounded-xl border border-border shadow-subtle flex flex-col justify-between hover:border-primary/40 transition"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-subtle">{sub.code}</span>
                      <span className="text-[10px] font-semibold text-primary bg-primary-50 px-1.5 py-0.5 rounded">
                        {sub.credits} Credits
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-main line-clamp-1">{sub.name}</h4>
                    <p className="text-xs text-subtle mt-1">
                      Category: {sub.category}
                      {sub.programmingLanguage && (
                        <span className="ml-1 text-indigo-600 font-semibold">
                          ({sub.programmingLanguage})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      {sub.units?.length || 5} Units Active
                    </span>
                    <Link
                      href={`/syllabus`}
                      className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-border space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-bold text-main">
                No syllabus data available for Year {selectedYear} — Semester {selectedSemester}.
              </p>
              <p className="text-xs text-subtle max-w-sm mx-auto">
                Upload your official college syllabus PDF to extract and view subjects for Semester {selectedSemester}.
              </p>
              <Link
                href="/engineering"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
              >
                <span>Upload Syllabus PDF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* 2B: JEE THREE-PILLAR TRACKER */}
      {preparationMode === 'JEE' && (
        <div className="nexus-card p-6 space-y-4 bg-gradient-to-r from-emerald-50/30 via-white to-blue-50/30 border-emerald-200">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-main text-base">
                JEE Main & Advanced Subject Mastery
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
              Official NTA Syllabus
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Atom className="w-4 h-4 text-primary" />
                  <span>Physics (Mechanics & Electrodynamics)</span>
                </span>
                <span className="text-xs font-mono font-bold text-primary">68%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full" style={{ width: '68%' }} />
              </div>
              <p className="text-[11px] text-subtle">Target: Kinematics 2D & Newton's 3rd Law FBD</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Binary className="w-4 h-4 text-emerald-600" />
                  <span>Mathematics (Calculus & Algebra)</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-600">74%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '74%' }} />
              </div>
              <p className="text-[11px] text-subtle">Target: Quadratic Equations & Sequences</p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-border space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Layers className="w-4 h-4 text-secondary" />
                  <span>Chemistry (Physical & Organic)</span>
                </span>
                <span className="text-xs font-mono font-bold text-secondary">55%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '55%' }} />
              </div>
              <p className="text-[11px] text-subtle">Target: Mole Concept & Chemical Bonding</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTINUE LEARNING HERO CARD */}
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

      {/* 4. LEARNING HEALTH METRICS (6 Grid Items) */}
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
              Assessment Accuracy
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

          <div className="nexus-card p-4 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Confidence Calibration
            </span>
            <div className="text-xs font-bold text-primary truncate" title={learningHealth.confidenceCalibration}>
              {learningHealth.confidenceCalibration}
            </div>
            <p className="text-[10px] text-subtle mt-1.5">Metacognition Matrix</p>
          </div>

          <Link
            href="/misconceptions"
            className="nexus-card p-4 hover:border-rose-300 hover:shadow-subtle transition block group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
                Misconception Radar
              </span>
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-extrabold text-rose-700 font-mono flex items-center gap-1.5">
              <span>{activeMisconceptions?.length ?? 1}</span>
              <span className="text-xs font-semibold text-subtle">Flagged</span>
            </div>
            <p className="text-[10px] text-rose-600 font-medium mt-1 group-hover:underline">
              {activeMisconceptions && activeMisconceptions.length > 0
                ? 'Resolve diagnostic traps →'
                : 'All mental models verified ✓'}
            </p>
          </Link>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Mastered
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono">
              {learningHealth.conceptsMastered}
            </div>
            <p className="text-[10px] text-subtle mt-1">Concepts &gt; 75%</p>
          </div>

          <div className="nexus-card p-4">
            <span className="text-[11px] font-semibold text-subtle uppercase tracking-wider block mb-1">
              Needs Attention
            </span>
            <div className="text-2xl font-extrabold text-amber-600 font-mono">
              {learningHealth.conceptsNeedingAttention}
            </div>
            <p className="text-[10px] text-subtle mt-1">Review Flagged</p>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S PLAN & DYNAMIC AI INSIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="nexus-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-main text-base">Today's Adaptive Plan</h3>
            </div>
            <span className="text-xs text-subtle">Calibrated to 90 min daily goal</span>
          </div>

          <div className="space-y-3">
            {todaysPlan.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.completed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-primary-50 text-primary border border-primary/20'
                    }`}
                  >
                    {item.completed ? <Check className="w-3.5 h-3.5" /> : item.id}
                  </div>
                  <span
                    className={`text-sm ${
                      item.completed ? 'line-through text-subtle' : 'font-medium text-main'
                    }`}
                  >
                    {item.title}
                  </span>
                </div>
                <Link
                  href={item.link}
                  className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Start</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="nexus-card p-6 bg-gradient-to-br from-indigo-50/50 to-blue-50/30 border-secondary/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-secondary">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-base">AI Pedagogical Insight</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{aiInsight}"
            </p>
          </div>

          <div className="pt-6 border-t border-secondary/10 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-subtle">
              Engine: Nexus Cognitive Graph
            </span>
            <Link
              href="/tutor"
              className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
            >
              <span>Consult AI Tutor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. WEAK AREAS & RECOMMENDED YOUTUBE LESSONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Precise Weak Areas */}
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-main text-base">Specific Learning Gaps</h3>
            </div>
            <span className="text-xs text-subtle">Prioritized by Bayesian uncertainty</span>
          </div>

          <div className="space-y-3">
            {weakAreas.length > 0 ? (
              weakAreas.map((area: any) => (
                <div
                  key={area.conceptId}
                  className="p-3.5 rounded-xl border border-border bg-white flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-main">{area.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                        {area.masteryScore}% Mastery
                      </span>
                    </div>
                    <p className="text-xs text-subtle">
                      Accuracy: {area.accuracy}% &bull; Confidence: {area.confidence}% &bull;{' '}
                      {area.status}
                    </p>
                  </div>
                  <Link
                    href={`/learn/${area.conceptId}`}
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Remediate</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-subtle p-4 text-center">
                All attempted concepts currently exceed your target mastery threshold!
              </p>
            )}
          </div>
        </div>

        {/* Recommended YouTube Lessons (Mode-Aware) */}
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-danger" />
              <h3 className="font-bold text-main text-base">Recommended Educational Videos</h3>
            </div>
            <span className="text-xs text-subtle font-mono">Server-side Cached Integration</span>
          </div>

          <div className="space-y-3">
            {recommendedVideos.slice(0, 3).map((vid: any) => (
              <div
                key={vid.id}
                className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-slate-50 transition group"
              >
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-24 h-16 object-cover rounded-lg bg-slate-900 flex-shrink-0"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <a
                    href={`https://www.youtube.com/watch?v=${vid.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-xs text-main hover:text-primary transition line-clamp-1 block"
                  >
                    {vid.title}
                  </a>
                  <p className="text-[11px] text-subtle line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-subtle pt-1">
                    <span>{vid.channelTitle}</span>
                    <a
                      href={`https://www.youtube.com/watch?v=${vid.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Watch</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
