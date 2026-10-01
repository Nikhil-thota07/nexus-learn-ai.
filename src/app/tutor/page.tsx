'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  Sparkles,
  Send,
  Loader2,
  Code2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { PedagogicalTutorResponse } from '@/types';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  response?: PedagogicalTutorResponse;
  timestamp: string;
}

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSocraticMode, setIsSocraticMode] = useState(false);
  const [studentContext, setStudentContext] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch profile to build header context
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.profile) {
          setStudentContext(data.profile);
        }
      });

    // Initial greeting message
    setMessages([
      {
        id: 'init-1',
        sender: 'tutor',
        text: 'Hello! I am your Nexus Academic Tutor. My pedagogical engine adapts specifically to your university syllabus, target exam, and current knowledge state. How can I help you learn today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || input).trim();
    if (!q || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          isSocraticMode,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get tutor response');

      const tutorMsg: Message = {
        id: `tut_${Date.now()}`,
        sender: 'tutor',
        text: data.response.directAnswer,
        response: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'tutor',
          text: `I encountered an issue processing your query: ${err.message}. Please try again.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'Write a code for simple calculator',
    'What is the difference between return and print?',
    'What are my first-semester subjects?',
    "Explain Newton's second law for JEE",
    'What should I learn next based on my weaknesses?',
    'Explain variable scope and the LEGB rule',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. TOP CONTEXT HEADER (Section 49 Requirement) */}
      <div className="nexus-card p-4 sm:p-5 bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/50 border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base sm:text-lg text-main">
                  AI Academic Tutor & Pedagogy Engine
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                  {studentContext?.preparationMode || 'ENGINEERING'} Mode
                </span>
              </div>
              {/* Dynamic Context Breadcrumb */}
              <div className="text-xs text-subtle font-medium flex flex-wrap items-center gap-1.5 mt-0.5">
                {studentContext?.preparationMode === 'JEE' ? (
                  <>
                    <span className="text-primary font-bold">{studentContext.targetExam || 'JEE Main'}</span>
                    <span>&bull;</span>
                    <span>Physics / Chemistry / Mathematics</span>
                    <span>&bull;</span>
                    <span>Target Year {studentContext.targetExamYear || '2026'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-primary font-bold">
                      {studentContext?.branch || 'CSE'}
                    </span>
                    <span>&bull;</span>
                    <span>{studentContext?.university || 'JNTUH'}</span>
                    <span>&bull;</span>
                    <span>Regulation: {studentContext?.regulation || 'R25'}</span>
                    <span>&bull;</span>
                    <span>{studentContext?.year || 'Year 1'} &bull; {studentContext?.semester || 'Semester 1'}</span>
                    <span>&bull;</span>
                    <span className="text-indigo-600 font-semibold">Programming for Problem Solving</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Socratic Mode Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="flex items-center gap-2 text-xs font-semibold text-main cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-border shadow-subtle hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={isSocraticMode}
                onChange={(e) => setIsSocraticMode(e.target.checked)}
                className="w-3.5 h-3.5 text-primary rounded"
              />
              <span>Socratic Hint Mode</span>
            </label>
          </div>
        </div>
      </div>

      {/* 2. CHAT STREAM CONTAINER */}
      <div className="nexus-card p-4 sm:p-6 min-h-[480px] max-h-[640px] flex flex-col justify-between overflow-hidden">
        {/* Messages List */}
        <div className="overflow-y-auto space-y-4 pr-1 sm:pr-2 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-subtle mb-1">
                <span>{msg.sender === 'user' ? 'You' : 'Nexus AI Tutor'}</span>
                <span>&bull;</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-3xl rounded-2xl p-4 sm:p-5 text-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white shadow-subtle rounded-tr-none'
                    : 'bg-slate-50 border border-border text-main rounded-tl-none space-y-3.5'
                }`}
              >
                {/* Direct Answer text */}
                <div className="leading-relaxed whitespace-pre-line font-medium">
                  {msg.text}
                </div>

                {/* Rich Pedagogical Structured Components */}
                {msg.response && (
                  <div className="space-y-3.5 pt-2 border-t border-slate-200/80">
                    {/* Intuition Block */}
                    {msg.response.intuition && (
                      <div className="p-3 bg-white rounded-xl border border-indigo-100 text-xs text-slate-700 space-y-1">
                        <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider">
                          Conceptual Intuition:
                        </span>
                        <p className="leading-relaxed">{msg.response.intuition}</p>
                      </div>
                    )}

                    {/* Code Snippet Block */}
                    {msg.response.codeSnippet && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-subtle">
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5 text-primary" />
                            <span>Executable Code Implementation:</span>
                          </span>
                          <span className="text-[10px] font-mono uppercase bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                            {msg.response.codeSnippet.language}
                          </span>
                        </div>
                        <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                          {msg.response.codeSnippet.code}
                        </pre>
                        {msg.response.codeSnippet.explanation && (
                          <p className="text-[11px] text-slate-600 italic">
                            💡 {msg.response.codeSnippet.explanation}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Step-by-Step Breakdown */}
                    {msg.response.stepByStep && msg.response.stepByStep.length > 0 && (
                      <div className="p-3 bg-white rounded-xl border border-border space-y-1">
                        <span className="text-[11px] font-bold text-main uppercase tracking-wider block">
                          Step-by-Step Logic:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700">
                          {msg.response.stepByStep.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-primary font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Common Pitfall / Trap */}
                    {msg.response.commonMistake && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Common Student Trap / Misconception:</span>
                        </span>
                        <p className="text-amber-800">{msg.response.commonMistake.trap}</p>
                        <p className="text-emerald-800 font-semibold pt-0.5">
                          Fix: {msg.response.commonMistake.correction}
                        </p>
                      </div>
                    )}

                    {/* Quick Check Question */}
                    {msg.response.quickCheck && (
                      <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs space-y-1.5">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 text-primary" />
                          <span>Quick Check Question:</span>
                        </span>
                        <p className="text-slate-800">{msg.response.quickCheck.question}</p>
                        <details className="text-[11px] text-primary cursor-pointer pt-0.5">
                          <summary className="font-semibold hover:underline">Reveal Hint & Answer</summary>
                          <div className="mt-1.5 p-2 bg-white rounded border border-blue-100 text-slate-700">
                            <span className="font-semibold">Hint:</span> {msg.response.quickCheck.hint}
                            <br />
                            <span className="font-semibold text-success">Answer:</span> {msg.response.quickCheck.answer}
                          </div>
                        </details>
                      </div>
                    )}

                    {/* Context Note Footer */}
                    <div className="text-[10px] text-subtle font-medium border-t border-slate-200 pt-2 flex items-center justify-between">
                      <span>{msg.response.contextNote}</span>
                      <span className="text-primary font-semibold">Nexus Pedagogical Pipeline</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs font-semibold text-subtle p-3 bg-slate-50 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Analyzing student profile, retrieving syllabus & synthesizing pedagogical guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. QUICK SUGGESTED QUESTIONS */}
        <div className="pt-3 border-t border-border space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(p)}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-primary-50 hover:text-primary px-2.5 py-1 rounded-full border border-slate-200 transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (e.g. 'write a code for simple calculator', 'what are my subjects', etc.)..."
              className="flex-1 px-4 py-3 text-sm bg-slate-50 border border-border rounded-xl text-main focus:bg-white focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-1.5 shadow-subtle"
            >
              <span>Ask</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
