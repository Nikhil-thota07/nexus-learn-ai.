'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  BrainCircuit,
  ArrowLeft,
  AlertTriangle,
  PlayCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { CONCEPTS, DIAGNOSTIC_QUESTIONS } from '@/data/curriculum';
import { Concept, DiagnosticQuestion, YouTubeVideo } from '@/types';

export default function ConceptLearnPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = (params?.conceptId as string) || 'py-return';

  const [concept, setConcept] = useState<Concept | null>(null);
  const [activeMisconception, setActiveMisconception] = useState<any>(null);
  const [knowledgeState, setKnowledgeState] = useState<any>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  // Diagnostic Question State
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number>(85);
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);

  // AI Interactive Diagnostician State
  const [studentExplanation, setStudentExplanation] = useState('');
  const [analyzingExplanation, setAnalyzingExplanation] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  useEffect(() => {
    const foundConcept = CONCEPTS.find((c) => c.id === conceptId);
    if (!foundConcept) {
      setLoading(false);
      return;
    }
    setConcept(foundConcept);

    // Questions matching this concept
    const matchedQuestions = DIAGNOSTIC_QUESTIONS.filter((q) => q.conceptId === conceptId);
    setQuestions(matchedQuestions.length > 0 ? matchedQuestions : [DIAGNOSTIC_QUESTIONS[0]]);

    // Fetch user session, knowledge state, and active misconceptions
    Promise.all([
      fetch(`/api/knowledge`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/misconceptions?status=ACTIVE`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/youtube/search?q=${encodeURIComponent(foundConcept.title)}&conceptId=${conceptId}`).then(
        (r) => (r.ok ? r.json() : null)
      ),
    ])
      .then(([kData, mData, vData]) => {
        if (kData && kData.knowledge) {
          const kRec = kData.knowledge.find((k: any) => k.conceptId === conceptId);
          setKnowledgeState(kRec || null);
        }
        if (mData && mData.misconceptions) {
          const mRec = mData.misconceptions.find((m: any) => m.conceptId === conceptId);
          setActiveMisconception(mRec || null);
        }
        if (vData && vData.videos) {
          setVideos(vData.videos);
        }
      })
      .finally(() => setLoading(false));
  }, [conceptId]);

  const handleAssessmentSubmit = async () => {
    if (selectedOption === null || !questions[currentQuestionIndex]) return;

    setSubmittingAssessment(true);
    setAssessmentResult(null);

    try {
      const q = questions[currentQuestionIndex];
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId,
          questionId: q.id,
          selectedOptionIndex: selectedOption,
          confidenceScore: confidence,
          timeSpentSeconds: 28,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit answer');

      setAssessmentResult(data);
      // Update local knowledge state view
      setKnowledgeState((prev: any) => ({
        ...prev,
        masteryScore: data.updatedMastery,
        accuracy: data.updatedAccuracy,
        confidence: data.updatedConfidence,
        status: data.status,
      }));

      if (data.isCorrect && activeMisconception && confidence >= 70) {
        setActiveMisconception(null);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleAiDiagnose = async () => {
    if (!studentExplanation.trim()) return;
    setAnalyzingExplanation(true);
    setAiAnalysis(null);

    try {
      const res = await fetch('/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId,
          studentExplanation,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI analysis failed');
      setAiAnalysis(data.diagnosis);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setAnalyzingExplanation(false);
    }
  };

  const handleManualResolveMisconception = async () => {
    if (!activeMisconception) return;
    try {
      const res = await fetch('/api/misconceptions/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ misconceptionId: activeMisconception.id }),
      });
      if (res.ok) {
        setActiveMisconception(null);
        setKnowledgeState((prev: any) => ({
          ...prev,
          masteryScore: Math.min(100, (prev?.masteryScore || 31) + 25),
          status: 'LEARNING',
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-sm font-semibold text-subtle">
          Loading adaptive lesson and diagnostic matrix...
        </p>
      </div>
    );
  }

  if (!concept) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h2 className="text-lg font-bold text-main">Concept Not Found</h2>
        <Link href="/dashboard" className="text-sm text-primary hover:underline mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-subtle hover:text-main"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 rounded text-slate-700">
            {concept.trackName} &bull; {concept.module}
          </span>
          <span className="text-xs font-bold px-2.5 py-1 bg-primary-50 text-primary rounded-full">
            Difficulty {concept.difficulty}/5
          </span>
        </div>
      </div>

      {/* CONCEPT OVERVIEW & MASTERY STATUS */}
      <div className="nexus-card p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
              {concept.title}
            </h1>
            <p className="text-sm text-subtle mt-1">{concept.description}</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 border border-border p-3 rounded-xl min-w-[200px] justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-subtle block">
                Current Mastery
              </span>
              <span className="text-2xl font-extrabold font-mono text-primary">
                {knowledgeState?.masteryScore ?? 31}%
              </span>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                knowledgeState?.status === 'MASTERED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : knowledgeState?.status === 'NEEDS_REVIEW'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-primary-100 text-primary-800'
              }`}
            >
              {knowledgeState?.status || 'LEARNING'}
            </span>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="pt-3 border-t border-border">
          <span className="text-xs font-bold uppercase tracking-wider text-main block mb-2">
            First-Principles Takeaways
          </span>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {concept.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 1 & 2. MISCONCEPTION DETECTION & RESOLUTION BANNER (Specific Prompt Requirement) */}
      {activeMisconception && (
        <div className="nexus-card p-6 sm:p-8 bg-amber-50/60 border-amber-300 shadow-card space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  Targeted Misconception Identified
                </span>
                <h3 className="text-lg font-extrabold text-amber-950 mt-0.5">
                  {activeMisconception.title}
                </h3>
                <p className="text-sm text-amber-900 mt-1 leading-relaxed">
                  "{activeMisconception.description}"
                </p>
              </div>
            </div>

            <button
              onClick={handleManualResolveMisconception}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-100 transition whitespace-nowrap"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mark as Resolved</span>
            </button>
          </div>

          {/* Minimal Contrasting Example (Section 11) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-red-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-red-600">
                <span>❌ Incorrect Mental Model</span>
                <span>Side-effect only</span>
              </div>
              <pre className="p-3 bg-red-50/50 rounded-lg text-xs font-mono text-slate-800 overflow-x-auto">
{`def square(n):
    print(n * n) # Only displays to terminal!

result = square(5)
# result is None!
# result + 2 -> TypeError!`}
              </pre>
              <p className="text-[11px] text-red-700">
                Believing that print() saves or passes values back into variables.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
                <span>✅ Correct Understanding</span>
                <span>Programmatic Return</span>
              </div>
              <pre className="p-3 bg-emerald-50/50 rounded-lg text-xs font-mono text-slate-800 overflow-x-auto">
{`def square(n):
    return n * n # Hands data back to caller

result = square(5)
# result is 25
# result + 2 is 27! Works properly`}
              </pre>
              <p className="text-[11px] text-emerald-800 font-medium">
                return transfers the computed object back so callers can manipulate it.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3 & 4. AI PEDAGOGICAL DIAGNOSTICIAN (Type your explanation) */}
      <div className="nexus-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-main text-base">
              AI Pedagogical Diagnostician (Misconception Prober)
            </h3>
          </div>
          <span className="text-xs text-subtle font-mono">OpenAI / Gemini / Local Engine</span>
        </div>

        <p className="text-xs text-subtle leading-relaxed">
          In your own words, explain how <span className="font-bold text-main">{concept.title}</span> operates. The AI engine will audit your mental model for subtle conflations or false confidence.
        </p>

        <div className="space-y-3">
          <textarea
            rows={3}
            value={studentExplanation}
            onChange={(e) => setStudentExplanation(e.target.value)}
            placeholder={`e.g. "When I call a function, return is basically just like printing the text so I can see what the output is..."`}
            className="w-full p-3.5 text-xs sm:text-sm bg-slate-50/60 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary text-main"
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStudentExplanation("When I call print inside a function, that saves the value so I can assign it to a variable.")}
              className="text-xs text-subtle hover:text-primary font-medium"
            >
              Insert Sample Misconception Query
            </button>

            <button
              onClick={handleAiDiagnose}
              disabled={analyzingExplanation || !studentExplanation.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-white text-xs font-bold rounded-lg hover:bg-secondary-700 transition disabled:opacity-50"
            >
              {analyzingExplanation ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Diagnosing Mental Model...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Explanation</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Analysis Feedback */}
        {aiAnalysis && (
          <div className="p-4 rounded-xl border border-secondary/30 bg-indigo-50/40 space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Pedagogical Assessment:
              </span>
              <span className="text-xs font-bold text-main">
                {aiAnalysis.misconceptionIdentified}
              </span>
            </div>
            <p className="text-xs text-main leading-relaxed">{aiAnalysis.explanation}</p>
            {aiAnalysis.minimalExample && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="p-2.5 bg-white rounded border border-red-200 text-red-900">
                  <span className="block font-bold mb-1">Observed Error:</span>
                  <pre className="whitespace-pre-wrap">{aiAnalysis.minimalExample.incorrect}</pre>
                </div>
                <div className="p-2.5 bg-white rounded border border-emerald-200 text-emerald-900">
                  <span className="block font-bold mb-1">Target Correction:</span>
                  <pre className="whitespace-pre-wrap">{aiAnalysis.minimalExample.correct}</pre>
                </div>
              </div>
            )}
            <div className="text-[11px] text-subtle font-medium border-t border-secondary/20 pt-2">
              Calibration Note: {aiAnalysis.confidenceAssessment}
            </div>
          </div>
        )}
      </div>

      {/* 5 & 6. RECOMMENDED YOUTUBE LESSONS (Section 4 & 5) */}
      <div id="videos" className="nexus-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-danger" />
            <h3 className="font-bold text-main text-base">
              Targeted Educational Video Lessons
            </h3>
          </div>
          <span className="text-xs text-subtle font-mono">Server-side Cached Integration</span>
        </div>

        <p className="text-xs text-subtle">
          Watch this targeted lesson before taking the post-remediation diagnostic assessment.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.slice(0, 2).map((vid) => (
            <div
              key={vid.id}
              className="rounded-xl border border-border overflow-hidden bg-white flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-slate-900 group">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition"
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${vid.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                  </a>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-sm text-main line-clamp-1">{vid.title}</h4>
                  <p className="text-xs text-subtle line-clamp-2">{vid.description}</p>
                </div>
              </div>
              <div className="p-4 pt-0 flex items-center justify-between text-xs text-subtle">
                <span className="font-semibold text-slate-700">{vid.channelTitle}</span>
                <a
                  href={`https://www.youtube.com/watch?v=${vid.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Watch on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7, 8, 9, 10. ADAPTIVE DIAGNOSTIC ASSESSMENT & CONFIDENCE CALIBRATION */}
      <div id="assessment" className="nexus-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-primary">
              Section 7 &bull; Diagnostic Assessment
            </span>
            <h3 className="text-lg font-extrabold text-main">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentQuestionIndex(i);
                  setSelectedOption(null);
                  setAssessmentResult(null);
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition ${
                  currentQuestionIndex === i
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-subtle hover:bg-slate-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {currentQ && (
          <div className="space-y-5">
            <h4 className="font-bold text-base text-main leading-relaxed">
              {currentQ.question}
            </h4>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Answer Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx;
                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      setSelectedOption(optIdx);
                      setAssessmentResult(null);
                    }}
                    className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-50/50 text-primary font-semibold shadow-subtle'
                        : 'border-border bg-white hover:bg-slate-50 text-main'
                    }`}
                  >
                    <span>{opt}</span>
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CONFIDENCE CALIBRATION SLIDER (Section 10 Requirement) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-main flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-primary" />
                  <span>How confident are you in this answer?</span>
                </span>
                <span className="text-xs font-mono font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                  {confidence}%
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 25, label: 'Uncertain' },
                  { val: 50, label: 'Fairly Confident' },
                  { val: 80, label: 'Very Confident' },
                  { val: 95, label: 'Absolute Certainty' },
                ].map((tier) => (
                  <button
                    key={tier.val}
                    type="button"
                    onClick={() => setConfidence(tier.val)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition ${
                      confidence === tier.val
                        ? 'border-primary bg-white text-primary shadow-subtle'
                        : 'border-border bg-white/50 text-subtle hover:bg-white'
                    }`}
                  >
                    {tier.label} ({tier.val}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Assessment Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleAssessmentSubmit}
                disabled={selectedOption === null || submittingAssessment}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 shadow-sm"
              >
                {submittingAssessment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating Calibration...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer & Update Knowledge Model</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* ASSESSMENT RESULTS FEEDBACK */}
            {assessmentResult && (
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  assessmentResult.isCorrect
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-red-300 bg-red-50/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {assessmentResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="font-extrabold text-success text-sm">
                        Correct! Mastery Model Calibrated.
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-danger" />
                      <span className="font-extrabold text-danger text-sm">
                        Incorrect Choice. Misconception Pattern Detected.
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-800 leading-relaxed">
                  {assessmentResult.explanation}
                </p>

                {assessmentResult.misconceptionDetected && (
                  <div className="p-3 bg-white rounded-lg border border-red-200 text-xs font-medium text-red-800">
                    <strong>Specific Misconception Flagged:</strong>{' '}
                    {assessmentResult.misconceptionDetected}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                  <div className="p-2 bg-white rounded-lg border border-border">
                    <span className="text-[10px] text-subtle block font-semibold">New Mastery</span>
                    <span className="font-mono font-bold text-primary text-base">
                      {assessmentResult.updatedMastery}%
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-border">
                    <span className="text-[10px] text-subtle block font-semibold">New Accuracy</span>
                    <span className="font-mono font-bold text-slate-800 text-base">
                      {assessmentResult.updatedAccuracy}%
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-border">
                    <span className="text-[10px] text-subtle block font-semibold">State</span>
                    <span className="font-bold text-amber-800 text-sm">
                      {assessmentResult.status}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <Link
                    href="/roadmap"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    <span>View Updated Learning Roadmap</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
