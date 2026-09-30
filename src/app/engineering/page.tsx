'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Database,
  Terminal,
} from 'lucide-react';
import { CONCEPTS } from '@/data/curriculum';

export default function EngineeringPage() {
  const [selectedDomain, setSelectedDomain] = useState<'os' | 'dsa' | 'dbms'>('os');

  const engineeringConcepts = CONCEPTS.filter((c) => c.track === 'btech-os');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Engineering & B.Tech Learning Mode
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Rigorous systems engineering, memory hierarchy, synchronization, and algorithmic complexity for university and placements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          {[
            { id: 'os', label: 'Operating Systems' },
            { id: 'dsa', label: 'Data Structures & Algorithms' },
            { id: 'dbms', label: 'Database Systems' },
          ].map((domain) => (
            <button
              key={domain.id}
              onClick={() => setSelectedDomain(domain.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedDomain === domain.id
                  ? 'bg-white text-primary shadow-subtle'
                  : 'text-subtle hover:text-main'
              }`}
            >
              {domain.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Highlight Banner */}
      <div className="nexus-card p-6 sm:p-8 bg-gradient-to-r from-teal-50/50 via-emerald-50/30 to-white border-teal-200 shadow-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full">
              Systems Core & Tech Placements
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-main">
              Deadlock Avoidance, Banker's Algorithm & Memory Paging
            </h2>
            <p className="text-xs sm:text-sm text-subtle leading-relaxed">
              Equating an unsafe state directly with deadlock is a classic trap in technical interviews. Nexus Learn AI teaches you to mathematically audit allocation vectors and page table lookups.
            </p>
          </div>

          <Link
            href="/learn/btech-os-deadlocks"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition shadow-sm whitespace-nowrap"
          >
            <span>Launch Systems Diagnostic</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Concepts List */}
      <div className="space-y-4">
        <h3 className="font-bold text-main text-base">
          Core Operating Systems Architecture Modules
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {engineeringConcepts.map((concept) => (
            <div key={concept.id} className="nexus-card p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-teal-700">
                    {concept.module}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Difficulty {concept.difficulty}/5
                  </span>
                </div>

                <h4 className="font-bold text-base text-main">{concept.title}</h4>
                <p className="text-xs text-subtle mt-1">{concept.description}</p>

                {concept.commonMisconceptions.length > 0 && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Interview Pitfall:</span>
                    </div>
                    <p className="text-[11px]">{concept.commonMisconceptions[0].description}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-subtle font-medium">B.Tech Curriculum</span>
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
