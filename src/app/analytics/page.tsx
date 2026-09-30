'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/knowledge')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json) setData(json);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-semibold text-subtle">
        Loading knowledge model metrics...
      </div>
    );
  }

  const knowledge = data?.knowledge || [];
  const calibration = data?.calibration || [];
  const attempts = data?.recentAttempts || [];

  // Group calibration data by quadrant
  const overconfident = calibration.filter((c: any) => c.quadrant === 'Overconfident');
  const underconfident = calibration.filter((c: any) => c.quadrant === 'Underconfident');
  const mastered = calibration.filter((c: any) => c.quadrant === 'Mastered');
  const gaps = calibration.filter((c: any) => c.quadrant === 'Gap');

  // Chart data
  const chartData = knowledge.map((k: any) => ({
    name: k.conceptTitle.length > 15 ? k.conceptTitle.substring(0, 15) + '...' : k.conceptTitle,
    mastery: k.masteryScore,
    accuracy: k.accuracy,
    confidence: k.confidence,
    attempts: k.attempts,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Knowledge Model & Confidence Calibration
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Sections 9 & 10 &bull; Continuous Bayesian tracking of accuracy, confidence, and misconception risk.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-primary border border-primary/20 rounded-lg">
            Evaluation: Active DKT Signal
          </span>
        </div>
      </div>

      {/* 4 QUADRANTS OF METACOGNITIVE CALIBRATION */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-main flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>The 4 Quadrants of Metacognition (Accuracy vs Confidence)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overconfident (Misconception Risk) */}
          <div className="nexus-card p-5 border-amber-300 bg-amber-50/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                1. Overconfident
              </span>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono">
                {overconfident.length} Concepts
              </span>
            </div>
            <p className="text-[11px] text-amber-950 font-medium">
              High Confidence + Low Accuracy &rarr; Critical Misconception Indicator
            </p>
            <div className="space-y-1 pt-2">
              {overconfident.map((c: any) => (
                <div key={c.conceptId} className="p-2 bg-white rounded border border-amber-200 text-xs">
                  <div className="font-bold text-main">{c.conceptTitle}</div>
                  <div className="text-[10px] text-subtle flex justify-between mt-0.5">
                    <span>Acc: {c.accuracy}%</span>
                    <span className="text-amber-700 font-bold">Conf: {c.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Underconfident (Imposter) */}
          <div className="nexus-card p-5 border-indigo-200 bg-indigo-50/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                2. Underconfident
              </span>
              <span className="text-xs font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-mono">
                {underconfident.length} Concepts
              </span>
            </div>
            <p className="text-[11px] text-indigo-950 font-medium">
              Low Confidence + High Accuracy &rarr; Hesitant / Needs Affirmation
            </p>
            <div className="space-y-1 pt-2">
              {underconfident.length === 0 ? (
                <span className="text-xs text-subtle block py-2">None detected</span>
              ) : (
                underconfident.map((c: any) => (
                  <div key={c.conceptId} className="p-2 bg-white rounded border border-indigo-200 text-xs">
                    <div className="font-bold text-main">{c.conceptTitle}</div>
                    <div className="text-[10px] text-subtle flex justify-between mt-0.5">
                      <span className="text-emerald-700 font-bold">Acc: {c.accuracy}%</span>
                      <span>Conf: {c.confidence}%</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Strong Mastery */}
          <div className="nexus-card p-5 border-emerald-300 bg-emerald-50/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                3. Strong Mastery
              </span>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
                {mastered.length} Concepts
              </span>
            </div>
            <p className="text-[11px] text-emerald-950 font-medium">
              High Confidence + High Accuracy &rarr; Calibrated Mastery
            </p>
            <div className="space-y-1 pt-2">
              {mastered.slice(0, 3).map((c: any) => (
                <div key={c.conceptId} className="p-2 bg-white rounded border border-emerald-200 text-xs">
                  <div className="font-bold text-main">{c.conceptTitle}</div>
                  <div className="text-[10px] text-subtle flex justify-between mt-0.5">
                    <span className="text-emerald-700 font-bold">Acc: {c.accuracy}%</span>
                    <span className="text-primary font-bold">Conf: {c.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Genuine Learning Gap */}
          <div className="nexus-card p-5 border-slate-300 bg-slate-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Foundational Gap
              </span>
              <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono">
                {gaps.length} Concepts
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-medium">
              Low Confidence + Low Accuracy &rarr; Honest Foundational Gap
            </p>
            <div className="space-y-1 pt-2">
              {gaps.map((c: any) => (
                <div key={c.conceptId} className="p-2 bg-white rounded border border-slate-200 text-xs">
                  <div className="font-bold text-main">{c.conceptTitle}</div>
                  <div className="text-[10px] text-subtle flex justify-between mt-0.5">
                    <span>Acc: {c.accuracy}%</span>
                    <span>Conf: {c.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COMPARATIVE BAR CHART */}
      <div className="nexus-card p-6 space-y-4">
        <h3 className="font-bold text-main text-base">
          Mastery vs Accuracy vs Confidence Metrics
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} interval={0} angle={-15} textAnchor="end" />
              <YAxis stroke="#64748B" fontSize={11} domain={[0, 100]} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Bar dataKey="mastery" fill="#2563EB" name="Mastery Score %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accuracy" fill="#16A34A" name="Accuracy %" radius={[4, 4, 0, 0]} />
              <Bar dataKey="confidence" fill="#F59E0B" name="Confidence %" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* FULL KNOWLEDGE MODEL TABLE (Section 9) */}
      <div className="nexus-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-bold text-main text-base">
            Knowledge State Table (PostgreSQL Record View)
          </h3>
          <span className="text-xs text-subtle font-mono">
            {knowledge.length} Concepts Modeled
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-subtle font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-3">Concept</th>
                <th className="p-3">Track</th>
                <th className="p-3">Mastery</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Misc. Risk</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {knowledge.map((k: any) => (
                <tr key={k.conceptId} className="hover:bg-slate-50/60 transition">
                  <td className="p-3 font-semibold text-main">{k.conceptTitle}</td>
                  <td className="p-3 text-subtle">{k.trackName}</td>
                  <td className="p-3 font-mono font-bold text-primary">{k.masteryScore}%</td>
                  <td className="p-3 font-mono text-slate-700">{k.accuracy}%</td>
                  <td className="p-3 font-mono text-slate-700">{k.confidence}%</td>
                  <td className="p-3 font-mono text-slate-700">{k.attempts} ({k.correctAttempts}C / {k.incorrectAttempts}I)</td>
                  <td className="p-3 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded font-bold ${
                        k.misconceptionRisk > 0.5
                          ? 'bg-red-100 text-red-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {Math.round(k.misconceptionRisk * 100)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        k.status === 'MASTERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : k.status === 'NEEDS_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/learn/${k.conceptId}`}
                      className="text-primary font-bold hover:underline"
                    >
                      Practice &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
