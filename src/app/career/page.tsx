'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2,
  Award,
  Briefcase,
  Code2,
  Cpu,
  BrainCircuit,
} from 'lucide-react';

const CAREER_TRACKS = [
  {
    id: 'ai-engineer',
    title: 'AI & Machine Learning Systems Engineer',
    demand: 'Very High',
    description: 'Build large-scale AI applications, fine-tune models, design RAG pipelines, and optimize inference latency.',
    prerequisites: ['Python Foundations', 'Linear Algebra & Calculus', 'Data Structures & Algorithms', 'API Design'],
    recommendedConcepts: ['py-functions', 'py-return', 'py-recursion', 'btech-os-processes'],
    medianSalary: '$145,000 / ₹24 - 45 LPA',
  },
  {
    id: 'fullstack-architect',
    title: 'Full-Stack Software Architect',
    demand: 'High',
    description: 'Design resilient distributed web applications, state management architectures, database indexing, and microservices.',
    prerequisites: ['JavaScript/TypeScript & Python', 'Relational Databases & SQL', 'Concurrency & OS Architecture'],
    recommendedConcepts: ['py-scope', 'py-return', 'btech-os-threads', 'btech-os-memory'],
    medianSalary: '$135,000 / ₹18 - 38 LPA',
  },
  {
    id: 'systems-engineer',
    title: 'Core Systems & Infrastructure Engineer',
    demand: 'High',
    description: 'Low-level Linux kernel development, memory allocators, virtual memory paging, distributed consensus, and concurrency.',
    prerequisites: ['Operating Systems', 'Deadlock Detection & Prevention', 'Virtual Address Translation', 'C/C++ & Rust'],
    recommendedConcepts: ['btech-os-processes', 'btech-os-deadlocks', 'btech-os-memory'],
    medianSalary: '$150,000 / ₹22 - 50 LPA',
  },
];

export default function CareerPage() {
  const [selectedTrack, setSelectedTrack] = useState(CAREER_TRACKS[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              Career Exploration & Pathway Alignment
            </h1>
          </div>
          <p className="text-sm text-subtle">
            Align your conceptual knowledge graph with high-impact industry roles and interview competencies.
          </p>
        </div>
      </div>

      {/* Career Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CAREER_TRACKS.map((track) => {
          const isSelected = selectedTrack.id === track.id;
          return (
            <div
              key={track.id}
              onClick={() => setSelectedTrack(track)}
              className={`nexus-card p-6 cursor-pointer transition flex flex-col justify-between ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/20 bg-blue-50/20 shadow-card'
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Demand: {track.demand}
                  </span>
                  <span className="text-xs font-mono font-bold text-subtle">
                    {track.medianSalary}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-main">{track.title}</h3>
                <p className="text-xs text-subtle leading-relaxed">{track.description}</p>
              </div>

              <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs font-bold text-primary">
                <span>{isSelected ? 'Currently Selected' : 'View Target Roadmap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Career Deep Dive */}
      <div className="nexus-card p-6 sm:p-8 space-y-6 bg-white border-primary/20 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Targeted Career Competency Map
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-main mt-0.5">
              {selectedTrack.title}
            </h2>
          </div>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition"
          >
            <span>Synchronize with Learning Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-main flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Core Foundational Prerequisites</span>
            </h4>
            <ul className="space-y-2">
              {selectedTrack.prerequisites.map((p, idx) => (
                <li key={idx} className="p-3 bg-slate-50 rounded-lg text-xs font-medium text-slate-800 border border-border">
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm text-main flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span>Nexus Knowledge Nodes to Master First</span>
            </h4>
            <div className="space-y-2">
              {selectedTrack.recommendedConcepts.map((cid, idx) => (
                <Link
                  key={idx}
                  href={`/learn/${cid}`}
                  className="flex items-center justify-between p-3 bg-blue-50/60 rounded-lg text-xs font-bold text-primary hover:bg-blue-100 transition border border-blue-200"
                >
                  <span className="capitalize">{cid.replace(/-/g, ' ')}</span>
                  <span>Practice Node &rarr;</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
