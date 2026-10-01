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
  TrendingUp,
  Layers,
  Sparkles,
  BookOpen,
  Briefcase,
  GitBranch,
  Clock,
  Target,
  GraduationCap,
  Cpu,
  Loader2,
  FolderGit2,
} from 'lucide-react';
import { BranchRoadmapData, RoadmapSkill } from '@/services/roadmap/RoadmapService';

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<BranchRoadmapData | null>(null);
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'skills' | 'projects' | 'careers'>('skills');

  useEffect(() => {
    fetch('/api/roadmap')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.roadmap) {
          setRoadmap(data.roadmap);
          setContext(data.context);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── 1. Header with Student Branch & Career Target ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              🧭 Dynamic Branch & Career Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            {roadmap ? `${roadmap.branchName} Roadmap` : 'Personalized Skill & Career Roadmap'}
          </h1>
          <p className="text-xs sm:text-sm text-subtle mt-1">
            {context ? (
              <span>
                Personalized for <strong>{context.name}</strong> &bull; Target Career: <strong>{roadmap?.targetCareer}</strong> &bull; {context.university} {context.regulation}
              </span>
            ) : (
              'Adaptive learning path and industry skill-gap progression.'
            )}
          </p>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'bg-white text-primary shadow-subtle'
                : 'text-subtle hover:text-main'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Skill Matrix</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projects')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'projects'
                ? 'bg-white text-primary shadow-subtle'
                : 'text-subtle hover:text-main'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Portfolio Projects</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('careers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'careers'
                ? 'bg-white text-primary shadow-subtle'
                : 'text-subtle hover:text-main'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Career Exploration</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-subtle flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-sm font-semibold">Synthesizing personalized branch roadmap...</span>
        </div>
      )}

      {roadmap && (
        <div className="space-y-8 animate-fade-in">
          {/* ── 2. Readiness Summary Banner ── */}
          <div className="nexus-card p-6 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/40 border-primary/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary/20">
                  {roadmap.branchId.toUpperCase()} &bull; {roadmap.preparationMode} MODE
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-1">
                  Target Career Track: {roadmap.targetCareer}
                </h2>
                <p className="text-xs text-subtle mt-0.5 max-w-2xl">{roadmap.overview}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-4 py-2 bg-white rounded-xl border border-border shadow-subtle">
                  <div className="text-xs font-bold text-subtle">Overall Mastery</div>
                  <div className="text-xl font-extrabold text-primary">
                    {roadmap.readinessSummary.overallMastery}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Skills Mastered</span>
                <span className="text-sm font-extrabold text-emerald-700">
                  {roadmap.readinessSummary.skillsMasteredCount} Skills
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">In Progress</span>
                <span className="text-sm font-extrabold text-primary">
                  {roadmap.readinessSummary.skillsInProgressCount} Skills
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Critical Gaps</span>
                <span className="text-sm font-extrabold text-amber-600">
                  {roadmap.readinessSummary.criticalGapsCount} High Priority
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-border text-center">
                <span className="text-[11px] font-bold text-subtle block">Portfolio Projects</span>
                <span className="text-sm font-extrabold text-indigo-700">
                  {roadmap.progressiveProjects.length} Milestones
                </span>
              </div>
            </div>
          </div>

          {/* ── 3. SKILL MATRIX TAB (Requirements 17, 18, 34) ── */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {roadmap.skillCategories.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-4">
                  <div className="border-b border-border pb-2">
                    <h3 className="font-bold text-base text-main">{cat.categoryName}</h3>
                    <p className="text-xs text-subtle">{cat.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cat.skills.map((skill) => (
                      <div
                        key={skill.id}
                        className={`nexus-card p-5 space-y-3 flex flex-col justify-between transition hover:border-primary/40 ${
                          skill.status === 'Mastered'
                            ? 'border-emerald-200 bg-emerald-50/20'
                            : skill.priority === 'High'
                            ? 'border-amber-200 bg-amber-50/10'
                            : 'border-border'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                skill.status === 'Mastered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : skill.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {skill.status}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                skill.priority === 'High'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : skill.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              Priority: {skill.priority}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-main">{skill.name}</h4>

                          {/* Skill Level & Gap Bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-subtle">
                                Current: <strong>{skill.currentLevel}%</strong>
                              </span>
                              <span className="text-subtle">
                                Target: <strong>{skill.requiredLevel}%</strong>
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  skill.currentLevel >= skill.requiredLevel
                                    ? 'bg-success'
                                    : 'bg-primary'
                                }`}
                                style={{ width: `${skill.currentLevel}%` }}
                              />
                            </div>
                            <div className="text-[10px] text-amber-700 font-semibold pt-0.5">
                              Skill Gap: {skill.gap}% &bull; Est. Time: {skill.estimatedLearningTimeHours} hrs
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/80 text-[11px] text-subtle space-y-1">
                            <div>
                              <strong>Prerequisites:</strong> {skill.prerequisites.join(', ')}
                            </div>
                            <div>
                              <strong>Recommended Next:</strong> {skill.recommendedNext}
                            </div>
                          </div>
                        </div>

                        {/* Action Link to Learning (Requirement 34) */}
                        <div className="pt-3 border-t border-border">
                          <Link
                            href={
                              skill.linkedConceptId
                                ? `/learn/${skill.linkedConceptId}`
                                : `/engineering`
                            }
                            className="w-full py-2 px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-1.5 shadow-subtle"
                          >
                            <span>Learn & Practice Skill</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── 4. PROGRESSIVE PROJECTS TAB (Requirement 35) ── */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-main">Progressive Portfolio Project Milestones</h3>
                <p className="text-xs text-subtle">
                  Structured progression from foundational scripting to industry-grade production systems.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {roadmap.progressiveProjects.map((p) => (
                  <div
                    key={p.id}
                    className="nexus-card p-6 space-y-4 border-border hover:border-primary/40 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                          {p.tier.toUpperCase()} TIER
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            p.difficulty === 'Industry Ready'
                              ? 'bg-purple-100 text-purple-800'
                              : p.difficulty === 'Advanced'
                              ? 'bg-red-100 text-red-800'
                              : p.difficulty === 'Intermediate'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </div>

                      <h4 className="font-bold text-base text-main">{p.title}</h4>
                      <p className="text-xs text-subtle leading-relaxed">{p.description}</p>

                      <div className="space-y-2 pt-1 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 block text-[11px] mb-1">
                            Technologies & Tools:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {p.technologies.map((t, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-800"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-border space-y-1 text-[11px]">
                          <div>
                            <strong>Expected Output:</strong> {p.expectedOutput}
                          </div>
                          <div>
                            <strong>Est. Time:</strong> {p.estimatedTime}
                          </div>
                          <div className="text-emerald-700 font-semibold pt-0.5">
                            <strong>Portfolio Value:</strong> {p.githubPortfolioValue}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <Link
                        href="/engineering"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <span>View Related Subjects & Concepts</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── 5. CAREER EXPLORATION TAB (Requirement 19) ── */}
          {activeTab === 'careers' && (
            <div className="space-y-6">
              <div className="border-b border-border pb-3">
                <h3 className="font-bold text-base text-main">Multi-Path Career Exploration</h3>
                <p className="text-xs text-subtle">
                  Explore diverse industry engineering trajectories based on your branch and current skill gap.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {roadmap.careerOptions.map((c) => (
                  <div
                    key={c.id}
                    className="nexus-card p-6 space-y-4 border-border hover:border-primary/40 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {c.demandRating} Demand
                        </span>
                        <Briefcase className="w-4 h-4 text-primary" />
                      </div>

                      <h4 className="font-bold text-lg text-main">{c.title}</h4>
                      <p className="text-xs text-subtle leading-relaxed">{c.description}</p>

                      <div className="space-y-2 pt-1 text-xs">
                        <div>
                          <span className="font-bold text-slate-700 block text-[11px] mb-1">
                            Required Skills:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {c.requiredSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-primary-50 text-primary px-2 py-0.5 rounded text-[10px] font-semibold"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] space-y-1">
                          <div className="font-bold text-amber-900">Your Current Gap:</div>
                          <div className="text-amber-800">{c.currentStudentGap}</div>
                        </div>

                        <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[11px] space-y-1">
                          <div className="font-bold text-emerald-900">Suggested Next Action:</div>
                          <div className="text-emerald-800">{c.suggestedNextStep}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <Link
                        href="/syllabus"
                        className="w-full py-2 px-3 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition flex items-center justify-center gap-1.5 shadow-subtle"
                      >
                        <span>Build Study Plan for this Path</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
