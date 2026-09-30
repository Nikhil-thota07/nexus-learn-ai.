'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react';
import { CONCEPTS } from '@/data/curriculum';

export default function RoadmapPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('python');
  const [knowledgeList, setKnowledgeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/knowledge')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.knowledge) {
          setKnowledgeList(data.knowledge);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const knowledgeMap = new Map<string, any>();
  knowledgeList.forEach((k) => knowledgeMap.set(k.conceptId, k));

  const trackConcepts = CONCEPTS.filter((c) => c.track === selectedTrack).sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Prerequisite Graph & Adaptive Roadmap
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Concepts unlock dynamically. Downstream topics remain gated until foundational mastery is verified.
          </p>
        </div>

        {/* Track Selector */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
          {[
            { id: 'python', label: 'Python Programming' },
            { id: 'jee-physics', label: 'JEE Physics' },
            { id: 'btech-os', label: 'B.Tech Operating Systems' },
          ].map((track) => (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedTrack === track.id
                  ? 'bg-white text-primary shadow-subtle'
                  : 'text-subtle hover:text-main'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>
      </div>

      {/* DAG Flow Visualizer */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trackConcepts.map((concept, index) => {
            const k = knowledgeMap.get(concept.id);
            const mastery = k?.masteryScore || 0;
            const status = k?.status || 'NOT_STARTED';

            // Check if prerequisites are satisfied
            const unmetPrereqs: string[] = [];
            concept.prerequisiteIds.forEach((pid) => {
              const prereqK = knowledgeMap.get(pid);
              const prereqDef = CONCEPTS.find((c) => c.id === pid);
              if (!prereqK || prereqK.masteryScore < (prereqDef?.masteryThreshold || 75)) {
                unmetPrereqs.push(prereqDef?.title || pid);
              }
            });

            const isLocked = unmetPrereqs.length > 0;
            const isMastered = status === 'MASTERED';
            const isNeedsReview = status === 'NEEDS_REVIEW';

            return (
              <div
                key={concept.id}
                className={`nexus-card p-6 flex flex-col justify-between transition relative overflow-hidden ${
                  isNeedsReview
                    ? 'border-amber-300 bg-amber-50/20'
                    : isMastered
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isLocked
                    ? 'border-slate-200 bg-slate-50/80 opacity-80'
                    : 'border-primary/30 hover:border-primary shadow-subtle'
                }`}
              >
                <div>
                  {/* Top Bar: Order & Lock State */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-subtle">
                      NODE 0{concept.order} &bull; {concept.module}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isLocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> Locked
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isMastered
                              ? 'bg-emerald-100 text-emerald-800'
                              : isNeedsReview
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-primary-100 text-primary-800'
                          }`}
                        >
                          <Unlock className="w-3 h-3" /> {status}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-extrabold text-base text-main mb-1.5">
                    {concept.title}
                  </h3>
                  <p className="text-xs text-subtle line-clamp-2 mb-4">
                    {concept.description}
                  </p>

                  {/* Prerequisites info */}
                  {concept.prerequisiteIds.length > 0 && (
                    <div className="text-[11px] text-subtle mb-3">
                      <span className="font-semibold text-slate-700">Requires: </span>
                      {concept.prerequisiteIds
                        .map((pid) => CONCEPTS.find((c) => c.id === pid)?.title || pid)
                        .join(', ')}
                    </div>
                  )}

                  {isLocked && (
                    <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 mb-3">
                      <strong>Prerequisite Blocker:</strong> Advance mastery in{' '}
                      <span className="font-bold underline">{unmetPrereqs.join(', ')}</span> to unlock.
                    </div>
                  )}
                </div>

                <div>
                  {/* Mastery Progress Bar */}
                  <div className="pt-3 border-t border-border/80">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-subtle font-medium">Mastery</span>
                      <span className="font-mono font-bold text-main">{mastery}% / {concept.masteryThreshold}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          isMastered ? 'bg-success' : isNeedsReview ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="mt-4">
                    <Link
                      href={`/learn/${concept.id}`}
                      className={`w-full py-2 px-3 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 transition ${
                        isLocked
                          ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          : 'bg-primary text-white hover:bg-primary-700 shadow-sm'
                      }`}
                    >
                      <span>{isLocked ? 'Inspect Prerequisites' : 'Launch Learning Module'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
