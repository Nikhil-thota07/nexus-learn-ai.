'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  BrainCircuit,
  Loader2,
} from 'lucide-react';
import { Misconception } from '@/types';

export default function MisconceptionsPage() {
  const [misconceptions, setMisconceptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchMisconceptions = () => {
    setLoading(true);
    fetch('/api/misconceptions')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.misconceptions) {
          setMisconceptions(data.misconceptions);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMisconceptions();
  }, []);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      const res = await fetch('/api/misconceptions/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ misconceptionId: id }),
      });
      if (res.ok) {
        fetchMisconceptions();
      }
    } finally {
      setResolvingId(null);
    }
  };

  const active = misconceptions.filter((m) => m.status === 'ACTIVE');
  const resolved = misconceptions.filter((m) => m.status === 'RESOLVED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Misconception Engine Center
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Section 11 &bull; Proactively identifying false beliefs and contrasting correct vs incorrect mental models.
          </p>
        </div>

        <button
          onClick={fetchMisconceptions}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-subtle hover:text-main bg-white border border-border rounded-lg hover:bg-slate-50 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* Active Misconceptions Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-main flex items-center gap-2">
          <span>Active Misconceptions</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
            {active.length} High Priority
          </span>
        </h2>

        {active.length === 0 ? (
          <div className="nexus-card p-8 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-success mx-auto" />
            <h3 className="font-bold text-main">Zero Active Misconceptions</h3>
            <p className="text-xs text-subtle">
              Your mental models are thoroughly calibrated. No false beliefs are active in your knowledge graph.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {active.map((m) => (
              <div
                key={m.id}
                className="nexus-card p-6 sm:p-8 border-amber-300 bg-amber-50/20 shadow-card space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-amber-800 uppercase tracking-wider">
                      Concept: {m.conceptTitle} ({m.trackName})
                    </span>
                    <h3 className="text-xl font-extrabold text-amber-950 mt-0.5">
                      {m.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                      Confidence Level: {m.confidence}%
                    </span>
                    <button
                      onClick={() => handleResolve(m.id)}
                      disabled={resolvingId === m.id}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                    >
                      {resolvingId === m.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <strong>Description:</strong> {m.description}
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-border text-xs text-subtle">
                  <span className="font-bold text-slate-700 block mb-1">Empirical Evidence:</span>
                  <p>{m.evidence}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                  <span className="text-[11px] text-subtle font-mono">
                    Detected: {new Date(m.firstDetected).toLocaleDateString()}
                  </span>
                  <Link
                    href={`/learn/${m.conceptId}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>Launch Step-by-Step Remediation</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resolved Misconceptions Section */}
      <div className="space-y-4 pt-6">
        <h2 className="text-lg font-bold text-main flex items-center gap-2">
          <span>Resolved Misconceptions</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {resolved.length} Overcome
          </span>
        </h2>

        {resolved.length === 0 ? (
          <p className="text-xs text-subtle">No resolved misconceptions yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resolved.map((m) => (
              <div key={m.id} className="nexus-card p-5 border-emerald-200 bg-emerald-50/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-success flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Resolved
                  </span>
                  <span className="text-[11px] font-mono text-subtle">
                    {new Date(m.resolvedAt || m.lastDetected).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-main">{m.title}</h4>
                <p className="text-xs text-subtle line-clamp-2">{m.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
