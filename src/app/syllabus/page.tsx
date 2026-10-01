'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Loader2,
  Clock,
  Target,
  AlertTriangle,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { StructuredStudyPlan, PriorityTopic } from '@/services/syllabus/StudyPlannerService';

export default function SyllabusPage() {
  const [context, setContext] = useState<any>(null);
  const [loadingContext, setLoadingContext] = useState(true);

  // Form State
  const [subject, setSubject] = useState('Matrices and Calculus');
  const [topic, setTopic] = useState('Matrices & Linear Systems');
  const [target, setTarget] = useState('9 CGPA');
  const [weeks, setWeeks] = useState(2);
  const [dailyHours, setDailyHours] = useState(3);
  const [examDate, setExamDate] = useState('2026-05-20');
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<StructuredStudyPlan | null>(null);

  // Active Tab in Plan
  const [activeWeekTab, setActiveWeekTab] = useState<1 | 2>(1);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Load student context on mount
  useEffect(() => {
    fetch('/api/syllabus/plan')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.context) {
          setContext(data.context);
          if (data.context.subjects && data.context.subjects.length > 0) {
            setSubject(data.context.subjects[0].name);
          }
          if (data.context.target) {
            setTarget(data.context.target);
          }
          if (data.context.availableTime) {
            setDailyHours(Math.max(1, Math.round(data.context.availableTime / 60)));
          }
        }
      })
      .finally(() => setLoadingContext(false));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    try {
      const res = await fetch('/api/syllabus/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          topic,
          target,
          weeks: Number(weeks),
          dailyHours: Number(dailyHours),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate study plan');
      setPlan(data.plan);
    } catch (err: any) {
      alert(err.message || 'Error generating syllabus plan');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── 1. HEADER & ACADEMIC CONTEXT ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              📚 Syllabus AI & Two-Week Target Planner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            Syllabus Intelligence & Topic Prioritizer
          </h1>
          <p className="text-xs sm:text-sm text-subtle mt-1">
            {context ? (
              <span>
                Personalized for <strong>{context.university} {context.regulation}</strong> &bull; {context.branchName} &bull; {context.year}, {context.semester}
              </span>
            ) : (
              'University regulation-grounded topic prioritization and milestone planning.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/engineering"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-border rounded-xl hover:bg-slate-50 transition shadow-subtle"
          >
            <Layers className="w-4 h-4 text-primary" />
            <span>Enrolled Subjects</span>
          </Link>
          <Link
            href="/tutor"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-700 shadow-subtle transition"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* ── 2. INPUT FORM (Requirement 3) ── */}
      <div className="nexus-card p-6 sm:p-8 bg-white border-primary/20 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-main flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span>Configure Study Goal & Target Exam Parameters</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authoritative Context Locked</span>
          </span>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                Target Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {context?.subjects && context.subjects.length > 0 ? (
                  context.subjects.map((s: any) => (
                    <option key={s.id} value={s.name}>
                      {s.code} - {s.name}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Matrices and Calculus">MA101BS - Matrices and Calculus</option>
                    <option value="Programming for Problem Solving">CS102ES - Programming for Problem Solving</option>
                    <option value="Applied Engineering Physics">PH103BS - Applied Engineering Physics</option>
                    <option value="Basic Electrical Engineering">EE104ES - Basic Electrical Engineering</option>
                  </>
                )}
              </select>
            </div>

            {/* Topic / Unit Focus */}
            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                Focus Unit / Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Matrices & Linear Systems"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Target Score */}
            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                Target Objective
              </label>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. 9 CGPA"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Time Available */}
            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                Timeline (Weeks)
              </label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value={1}>1 Week (Emergency Exam Sprint)</option>
                <option value={2}>2 Weeks (Recommended Two-Week Planner)</option>
                <option value={4}>4 Weeks (Deep Concept Consolidation)</option>
                <option value={8}>8 Weeks (Full Semester Progression)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                Daily Study Workload (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                University Exam Target Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 px-4 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Prioritizing Syllabus Topics...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Structured Study Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ── 3. STRUCTURED RESULT DISPLAY (Requirements 4, 5, 6) ── */}
      {plan && (
        <div className="space-y-8 animate-fade-in">
          {/* A. Plan Header Card */}
          <div className="nexus-card p-6 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 border-primary/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary/20">
                  {plan.subject.code} &bull; {plan.subject.university} {plan.subject.regulation}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-1.5">
                  {plan.goal.durationWeeks}-Week Plan: {plan.subject.name}
                </h2>
                <p className="text-xs text-subtle mt-0.5">
                  Grounded in authoritative syllabus &bull; Calibrated for <strong>{plan.goal.target}</strong> ({plan.goal.durationDays} Days &bull; {plan.goal.dailyHours} hrs/day)
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-white rounded-xl border border-border shadow-subtle">
                  <div className="text-xs font-bold text-subtle">Total Hours</div>
                  <div className="text-lg font-extrabold text-main">{plan.metrics.totalAvailableHours} hrs</div>
                </div>
                <div className="text-center px-4 py-2 bg-white rounded-xl border border-border shadow-subtle">
                  <div className="text-xs font-bold text-subtle">Est. Readiness</div>
                  <div className="text-lg font-extrabold text-primary">{plan.metrics.estimatedReadiness}%</div>
                </div>
              </div>
            </div>

            {/* Realistic Readiness Disclaimer Banner (Requirement 6) */}
            <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Objective Evaluation: </span>
                <span>{plan.metrics.readinessNote}</span>
              </div>
            </div>

            {/* Metrics Breakdown Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Coverage Rate</span>
                <span className="text-sm font-extrabold text-emerald-700">{plan.metrics.coveragePercentage}%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Required Hours</span>
                <span className="text-sm font-extrabold text-main">{plan.metrics.requiredEstimatedHours} hrs</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Recommended Workload</span>
                <span className="text-sm font-extrabold text-primary">{plan.metrics.recommendedDailyWorkload} hrs/day</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Risk Areas Flagged</span>
                <span className="text-sm font-extrabold text-red-600">{plan.metrics.riskAreas.length} Topics</span>
              </div>
            </div>
          </div>

          {/* B. Priority Topics Table (Requirements 4, 5) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-main flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>Topic Prioritization Engine ({plan.priorityTopics.length} Topics Analyzed)</span>
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  Normalized priority: Syllabus Weight + Prerequisite Urgency + Student Weakness + Exam Relevance
                </p>
              </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-border shadow-subtle">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border text-subtle font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-4">Topic & Unit</th>
                    <th className="py-3 px-3">Importance</th>
                    <th className="py-3 px-3">Current Mastery</th>
                    <th className="py-3 px-4">Exam Relevance</th>
                    <th className="py-3 px-3">Est. Time</th>
                    <th className="py-3 px-3">Priority</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {plan.priorityTopics.map((pt) => {
                    const isExpanded = expandedTopic === pt.topic;
                    return (
                      <React.Fragment key={pt.topic}>
                        <tr className="hover:bg-slate-50/70 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-main">{pt.topic}</div>
                            <div className="text-[10px] text-subtle">
                              Unit {pt.unitNumber}: {pt.unitTitle}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                pt.importance === 'High'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {pt.importance}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    pt.currentMastery >= 75
                                      ? 'bg-success'
                                      : pt.currentMastery >= 50
                                      ? 'bg-primary'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${pt.currentMastery}%` }}
                                />
                              </div>
                              <span className="font-bold text-main">{pt.currentMastery}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-subtle text-[11px] max-w-xs">
                            {pt.examRelevance}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-main">
                            {pt.estimatedHours} hrs
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                pt.priority === 'High'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : pt.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {pt.priority}
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                pt.status === 'Mastered'
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : pt.status === 'In Progress'
                                  ? 'bg-blue-50 text-blue-800'
                                  : 'bg-red-50 text-red-800'
                              }`}
                            >
                              {pt.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => setExpandedTopic(isExpanded ? null : pt.topic)}
                              className="text-primary hover:text-primary-700 text-xs font-bold flex items-center gap-1"
                            >
                              <span>{isExpanded ? 'Hide' : 'Details'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-slate-50/50">
                            <td colSpan={8} className="p-4 border-t border-border">
                              <div className="bg-white p-3.5 rounded-xl border border-border text-xs space-y-2">
                                <div className="font-bold text-main flex items-center gap-2">
                                  <span>Recommended Pedagogical Action:</span>
                                </div>
                                <p className="text-subtle">{pt.recommendedAction}</p>
                                <div className="flex items-center gap-3 pt-1 text-[11px] text-subtle">
                                  <span><strong>Prerequisites:</strong> {pt.prerequisites.join(', ')}</span>
                                  <span>&bull;</span>
                                  <span><strong>Calculated Priority Score:</strong> {pt.priorityScore}/100</span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* C. Two-Week Target Planner Timeline (Requirement 6) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-base text-main flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Two-Week Milestone Breakdown & Daily Schedule</span>
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  Week 1 cements foundations and resolves misconceptions; Week 2 drills examination questions and timed mock tests.
                </p>
              </div>

              {/* Week Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveWeekTab(1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeWeekTab === 1
                      ? 'bg-white text-primary shadow-subtle'
                      : 'text-subtle hover:text-main'
                  }`}
                >
                  Week 1: Foundations & Gaps
                </button>
                <button
                  type="button"
                  onClick={() => setActiveWeekTab(2)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    activeWeekTab === 2
                      ? 'bg-white text-primary shadow-subtle'
                      : 'text-subtle hover:text-main'
                  }`}
                >
                  Week 2: PYQs & Mocks
                </button>
              </div>
            </div>

            {/* Days Grid */}
            {plan.weeks
              .filter((w) => w.weekNumber === activeWeekTab)
              .map((w) => (
                <div key={w.weekNumber} className="space-y-4">
                  <div className="p-4 bg-primary-50/50 rounded-xl border border-primary/20 text-xs text-main flex items-center justify-between">
                    <div>
                      <strong className="text-primary">{w.title}: </strong>
                      <span>{w.summary}</span>
                    </div>
                    <span className="font-bold text-primary whitespace-nowrap ml-3">
                      🎯 Milestone: {w.weeklyMilestone}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {w.days.map((d) => (
                      <div
                        key={d.day}
                        className="nexus-card p-5 space-y-3 flex flex-col justify-between hover:border-primary/40 transition"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[11px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                              DAY 0{d.day}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                d.focus === 'Foundation'
                                  ? 'bg-blue-50 text-blue-700'
                                  : d.focus === 'Weak Concepts'
                                  ? 'bg-red-50 text-red-700'
                                  : d.focus === 'Practice & PYQs'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-purple-50 text-purple-700'
                              }`}
                            >
                              {d.focus}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-main">{d.title}</h4>

                          <div className="text-xs text-subtle space-y-1">
                            <div className="font-medium text-slate-700">Topics covered:</div>
                            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                              {d.topics.map((t, idx) => (
                                <li key={idx}>{t}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 border-t border-border text-[11px] space-y-1">
                            <div className="font-bold text-slate-700">Tasks:</div>
                            {d.practiceTasks.map((task, idx) => (
                              <div key={idx} className="flex items-start gap-1.5 text-subtle">
                                <span className="text-primary font-bold">&bull;</span>
                                <span>{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border mt-2">
                          <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            ✓ Checkpoint: {d.checkpoint}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
