'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  BrainCircuit,
  TrendingUp,
  Lock,
  Target,
  Loader2,
  GitBranch,
  Layers,
  AlertTriangle,
} from 'lucide-react';
import { BranchRoadmapData, CareerPathOption } from '@/services/roadmap/RoadmapService';

const STAGE_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-pink-600',
  'from-pink-500 to-rose-600',
  'from-rose-500 to-orange-500',
  'from-orange-500 to-amber-500',
  'from-emerald-500 to-teal-600',
  'from-teal-500 to-cyan-600',
];

type ActiveView = 'stages' | 'careers' | 'gaps';

export default function CareerPage() {
  const [roadmap, setRoadmap] = useState<BranchRoadmapData | null>(null);
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCareer, setActiveCareer] = useState<CareerPathOption | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('stages');

  useEffect(() => {
    fetch('/api/roadmap')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.roadmap) {
          setRoadmap(data.roadmap);
          setContext(data.context);
          if (data.roadmap.careerOptions?.length > 0) {
            setActiveCareer(data.roadmap.careerOptions[0]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm font-bold text-main">Generating your personalized career path...</p>
        <p className="text-xs text-subtle text-center max-w-sm">
          Analyzing your branch, syllabus, and knowledge state to recommend the right professional direction.
        </p>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-main">Career Path Unavailable</h2>
        <p className="text-sm text-subtle max-w-md mx-auto">
          Complete your academic profile to unlock your personalized career roadmap.
        </p>
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition"
        >
          Setup Profile <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  const allCategories = roadmap.skillCategories || [];
  const allSkills = allCategories.flatMap((c) => c.skills);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              🚀 Personalized Career Path
            </span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {roadmap.branchName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            {roadmap.targetCareer}
          </h1>
          {context && (
            <p className="text-xs sm:text-sm text-subtle">
              Personalized for <strong>{context.name}</strong> &bull;{' '}
              {context.university} {context.regulation} &bull; Year {context.year}, Semester {context.semester}
            </p>
          )}
        </div>

        {/* Readiness card */}
        {roadmap.readinessSummary && (
          <div className="flex-shrink-0 bg-gradient-to-br from-primary/5 to-indigo-50 border border-primary/20 rounded-2xl p-4 min-w-[190px]">
            <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">Overall Readiness</p>
            <div className="text-3xl font-extrabold text-main">{roadmap.readinessSummary.overallMastery}%</div>
            <div className="flex flex-wrap gap-3 mt-2 text-[11px]">
              <span className="text-emerald-700 font-bold">
                ✓ {roadmap.readinessSummary.skillsMasteredCount} mastered
              </span>
              <span className="text-blue-700 font-bold">
                → {roadmap.readinessSummary.skillsInProgressCount} in progress
              </span>
              <span className="text-red-700 font-bold">
                ✗ {roadmap.readinessSummary.criticalGapsCount} gaps
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── View Tabs ── */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-xl w-fit">
        {(
          [
            { key: 'stages', label: 'Learning Stages', icon: Layers },
            { key: 'careers', label: 'Career Options', icon: Briefcase },
            { key: 'gaps', label: 'Skill Gaps', icon: AlertTriangle },
          ] as { key: ActiveView; label: string; icon: React.ElementType }[]
        ).map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveView(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeView === tab.key
                  ? 'bg-white text-primary shadow-subtle'
                  : 'text-subtle hover:text-main'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── LEARNING STAGES ── */}
      {activeView === 'stages' && (
        <div className="space-y-5">
          <p className="text-sm text-subtle">
            Your personalized learning progression — ordered by prerequisites and current mastery level.
          </p>

          {allCategories.map((category, catIdx) => {
            const gradient = STAGE_GRADIENTS[catIdx % STAGE_GRADIENTS.length];
            const masteredCount = category.skills.filter((s) => s.status === 'Mastered').length;
            const catProgress =
              category.skills.length > 0
                ? Math.round((masteredCount / category.skills.length) * 100)
                : 0;

            return (
              <div key={category.categoryName} className="nexus-card overflow-hidden border-border shadow-subtle">
                {/* Stage header */}
                <div className={`bg-gradient-to-r ${gradient} px-5 py-4 flex items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0">
                      {catIdx + 1}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-white text-sm sm:text-base leading-tight">
                        {category.categoryName}
                      </h3>
                      <p className="text-white/75 text-[11px] mt-0.5 line-clamp-1">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-white font-extrabold text-xl">{catProgress}%</div>
                    <div className="text-white/70 text-[10px]">
                      {masteredCount}/{category.skills.length}
                    </div>
                  </div>
                </div>

                {/* Skills grid */}
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.skills.map((skill) => {
                    const isMastered = skill.status === 'Mastered';
                    const isLocked = skill.status === 'Locked';
                    const isInProgress = skill.status === 'In Progress';

                    const cardClass = isMastered
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isInProgress
                      ? 'bg-blue-50 border-blue-200 text-blue-900'
                      : 'bg-slate-100 border-slate-200 text-slate-500';

                    const StatusIcon = isMastered ? CheckCircle2 : isLocked ? Lock : TrendingUp;

                    return (
                      <div key={skill.id} className={`p-3 rounded-xl border ${cardClass} space-y-2`}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs leading-snug">{skill.name}</h4>
                            <p className="text-[10px] opacity-60 mt-0.5">{skill.category}</p>
                          </div>
                          <StatusIcon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-70" />
                        </div>

                        {/* Mastery bar */}
                        <div>
                          <div className="flex justify-between text-[10px] font-bold mb-1">
                            <span>Mastery</span>
                            <span>
                              {skill.currentLevel}% / {skill.requiredLevel}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-current rounded-full"
                              style={{ width: `${Math.min(100, skill.currentLevel)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          {skill.priority === 'High' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-white/60 rounded">
                              ★ High Priority
                            </span>
                          )}
                          {skill.linkedConceptId && (
                            <Link
                              href={`/learn/${skill.linkedConceptId}`}
                              className="text-[10px] font-bold underline underline-offset-2 opacity-70 hover:opacity-100 ml-auto"
                            >
                              Practice →
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Portfolio Projects */}
          {roadmap.progressiveProjects?.length > 0 && (
            <div className="nexus-card p-6 space-y-4 border-border shadow-subtle">
              <h3 className="font-bold text-main flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Recommended Portfolio Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roadmap.progressiveProjects.slice(0, 4).map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl border border-border bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          project.tier === 'Portfolio'
                            ? 'bg-indigo-100 text-indigo-800'
                            : project.tier === 'Advanced'
                            ? 'bg-purple-100 text-purple-800'
                            : project.tier === 'Intermediate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {project.tier}
                      </span>
                      <span className="text-[10px] text-subtle">{project.estimatedTime}</span>
                    </div>
                    <h4 className="font-bold text-sm text-main">{project.title}</h4>
                    <p className="text-xs text-subtle leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono font-bold bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CAREER OPTIONS ── */}
      {activeView === 'careers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roadmap.careerOptions.map((career) => (
              <button
                key={career.id}
                onClick={() => setActiveCareer(career)}
                className={`nexus-card p-5 text-left transition ${
                  activeCareer?.id === career.id
                    ? 'border-primary ring-2 ring-primary/20 bg-blue-50/20 shadow-card'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      career.demandRating === 'Very High'
                        ? 'bg-emerald-100 text-emerald-800'
                        : career.demandRating === 'High'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {career.demandRating} Demand
                  </span>
                  <Briefcase className="w-4 h-4 text-subtle" />
                </div>
                <h3 className="font-extrabold text-sm text-main leading-snug">{career.title}</h3>
                <p className="text-xs text-subtle mt-2 leading-relaxed line-clamp-2">{career.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-primary">
                  <span>{activeCareer?.id === career.id ? 'Currently Selected' : 'View Details'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          {activeCareer && (
            <div className="nexus-card p-6 sm:p-8 space-y-6 bg-white border-primary/20 shadow-card">
              <div className="border-b border-border pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Career Alignment Analysis
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-0.5">
                  {activeCareer.title}
                </h2>
                <p className="text-sm text-subtle mt-1">{activeCareer.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-main flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    Required Skills
                  </h4>
                  <ul className="space-y-2">
                    {activeCareer.requiredSkills.map((s, i) => (
                      <li
                        key={i}
                        className="p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-border"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-main flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-600" />
                    Your Current Gap
                  </h4>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                    {activeCareer.currentStudentGap}
                  </div>

                  <h4 className="font-bold text-sm text-main flex items-center gap-2 pt-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    Suggested Next Step
                  </h4>
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-medium leading-relaxed">
                    {activeCareer.suggestedNextStep}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/roadmap"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
                >
                  Open Full Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/engineering"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-xs font-bold rounded-xl hover:bg-slate-50 transition"
                >
                  Practice Concepts
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SKILL GAPS ── */}
      {activeView === 'gaps' && (
        <div className="space-y-4">
          <p className="text-sm text-subtle">
            Skills ranked by the largest gap between your current mastery and required level. Focus on High Priority gaps first.
          </p>
          {allSkills
            .filter((s) => s.gap > 0)
            .sort((a, b) => {
              const pOrder = { High: 0, Medium: 1, Low: 2 };
              return (
                (pOrder[a.priority] ?? 3) - (pOrder[b.priority] ?? 3) || b.gap - a.gap
              );
            })
            .map((skill) => (
              <div
                key={skill.id}
                className="p-4 rounded-xl border border-border bg-white flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-sm text-main">{skill.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        skill.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : skill.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {skill.priority} Priority
                    </span>
                  </div>
                  <p className="text-xs text-subtle">{skill.recommendedNext}</p>
                  {skill.prerequisites.length > 0 && (
                    <p className="text-[11px] text-subtle">
                      Requires first: {skill.prerequisites.join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 space-y-1.5 min-w-[150px]">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-subtle">Current</span>
                    <span className="text-main">{skill.currentLevel}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.currentLevel}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-subtle">Gap to target</span>
                    <span className="font-bold text-red-600">−{skill.gap}%</span>
                  </div>
                </div>
              </div>
            ))}

          {allSkills.filter((s) => s.gap > 0).length === 0 && (
            <div className="text-center py-12 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <p className="font-bold text-main">No significant skill gaps detected!</p>
              <p className="text-xs text-subtle">All tracked skills meet or exceed the required level.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
