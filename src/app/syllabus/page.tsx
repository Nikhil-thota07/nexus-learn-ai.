'use client';

import React, { useState } from 'react';
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
  Terminal,
} from 'lucide-react';

export default function SyllabusPage() {
  const [subject, setSubject] = useState('Modern Python & Distributed Systems');
  const [targetGoal, setTargetGoal] = useState('Big Tech SDE Placement & Production Readiness');
  const [weeks, setWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/curriculum', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, targetGoal, weeks }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate curriculum');
      setCurriculum(data.curriculum);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Syllabus Intelligence Engine
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Generate customized, milestone-driven curriculums with prerequisite dependency trees and checkpoint projects.
          </p>
        </div>
      </div>

      {/* Generator Form Card */}
      <div className="nexus-card p-6 sm:p-8 bg-white border-primary/20 shadow-card">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Topic / Subject Domain
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border border-border rounded-lg text-main"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Target Goal / Milestone
              </label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border border-border rounded-lg text-main"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Timeline (Weeks)
              </label>
              <select
                value={weeks}
                onChange={(e) => setWeeks(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/60 border border-border rounded-lg text-main"
              >
                <option value={2}>2 Weeks (Accelerated Bootcamp)</option>
                <option value={4}>4 Weeks (Standard Comprehensive)</option>
                <option value={8}>8 Weeks (Deep Dive Semester Mode)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Adaptive Syllabus...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Syllabus Intelligence</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Generated Curriculum Display */}
      {curriculum && (
        <div className="space-y-6">
          <div className="nexus-card p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-primary/20">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Optimized Curriculum
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-1">
              {curriculum.title}
            </h2>
            <p className="text-xs sm:text-sm text-subtle mt-1">{curriculum.description}</p>

            {curriculum.prerequisites && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-700 mr-1">Prerequisites:</span>
                {curriculum.prerequisites.map((p: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-800 font-medium">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {curriculum.modules.map((m: any, idx: number) => (
              <div key={idx} className="nexus-card p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-primary">
                      WEEK {m.week}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Checkpoint Ready
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-main">{m.title}</h3>

                  <div className="mt-3 space-y-1.5">
                    <span className="text-xs font-semibold text-slate-700 block">Topics Covered:</span>
                    <ul className="text-xs text-subtle space-y-1 pl-4 list-disc">
                      {m.topics.map((t: string, ti: number) => (
                        <li key={ti}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-border bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-xl">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-subtle block">
                    Capstone Project
                  </span>
                  <div className="text-xs font-bold text-main mt-0.5 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-secondary" />
                    <span>{m.checkpointProject}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
