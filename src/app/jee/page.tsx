'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  PlayCircle,
  CheckCircle2,
  HelpCircle,
  ChevronRight,
} from 'lucide-react';
import { CONCEPTS, DIAGNOSTIC_QUESTIONS } from '@/data/curriculum';

export default function JeePrepPage() {
  const [selectedSubject, setSelectedSubject] = useState<'physics' | 'chemistry' | 'maths'>('physics');

  const jeeConcepts = CONCEPTS.filter((c) => c.track === 'jee-physics');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              JEE Preparation Mode (Main & Advanced)
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Specialized syllabus intelligence targeting high-weightage conceptual traps and multi-concept problems.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          {(['physics', 'chemistry', 'maths'] as const).map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                selectedSubject === sub
                  ? 'bg-white text-primary shadow-subtle'
                  : 'text-subtle hover:text-main'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* JEE Diagnostic Highlight */}
      <div className="nexus-card p-6 sm:p-8 bg-gradient-to-r from-blue-50/60 to-indigo-50/40 border-primary/20 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-100 px-2.5 py-0.5 rounded-full">
              High-Frequency JEE Trap
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-main">
              Apex Trajectory Acceleration & Pseudo Force Frames
            </h2>
            <p className="text-xs sm:text-sm text-subtle leading-relaxed">
              43% of JEE aspirants incorrectly assume acceleration is zero at the trajectory apex, or misapply Newton's Third Law in accelerating frames. Nexus Learn AI's diagnostic engine isolates these exact failure modes.
            </p>
          </div>

          <Link
            href="/learn/jee-kinematics"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition shadow-sm whitespace-nowrap"
          >
            <span>Start JEE Diagnostic Drill</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Concept Breakdown Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-main text-base">
          {selectedSubject.toUpperCase()} Modules & Conceptual Vulnerabilities
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jeeConcepts.map((concept) => (
            <div key={concept.id} className="nexus-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-primary">
                    {concept.module} &bull; Difficulty {concept.difficulty}/5
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Threshold: {concept.masteryThreshold}%
                  </span>
                </div>

                <h4 className="font-bold text-base text-main">{concept.title}</h4>
                <p className="text-xs text-subtle mt-1">{concept.description}</p>

                {concept.commonMisconceptions.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Known JEE Misconception:</span>
                    </div>
                    <p className="text-[11px]">{concept.commonMisconceptions[0].description}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-subtle font-medium">Adaptive Remediation Ready</span>
                <Link
                  href={`/learn/${concept.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Practice Concept</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
