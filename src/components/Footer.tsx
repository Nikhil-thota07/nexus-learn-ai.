import React from 'react';
import Link from 'next/link';
import { BrainCircuit, ShieldCheck, Database, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary flex items-center justify-center font-bold">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-main">Nexus Learn AI</p>
              <p className="text-xs text-subtle">"Your learning path should know you."</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-subtle font-medium">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>PostgreSQL Persistent State</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-secondary" />
              <span>Dynamic Metacognitive Calibration</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-success" />
              <span>Strict Prerequisite DAG Gating</span>
            </div>
          </div>

          <div className="text-xs text-subtle">
            &copy; {new Date().getFullYear()} Nexus Learn AI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
