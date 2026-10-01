'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Award, Upload, Loader2, CheckCircle2, AlertTriangle, Sparkles,
  Linkedin, Trash2, Eye, BookOpen, TrendingUp, Target, ArrowRight,
  FileText, Image as ImageIcon, RefreshCw, Clock, BarChart2,
  ChevronDown, ChevronUp, X, Plus, ExternalLink, BrainCircuit, Play, Check, HelpCircle
} from 'lucide-react';

const EVIDENCE_CONFIG: Record<string, { label: string; color: string; desc: string }> = {
  EXPOSURE: { label: 'Exposure', color: 'bg-blue-50 text-blue-800 border-blue-200', desc: 'Attended or participated' },
  LEARNING: { label: 'Learning', color: 'bg-purple-50 text-purple-800 border-purple-200', desc: 'Completed structured learning' },
  DEMONSTRATED: { label: 'Demonstrated', color: 'bg-amber-50 text-amber-800 border-amber-200', desc: 'Applied in practice' },
  VERIFIED_ACHIEVEMENT: { label: 'Verified Achievement', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', desc: 'Verified by external authority' },
};

export default function AchievementsPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [linkedin, setLinkedin] = useState<any>(null);
  const [skillEvidence, setSkillEvidence] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  
  // LinkedIn State
  const [linkedinText, setLinkedinText] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [analyzingLinkedin, setAnalyzingLinkedin] = useState(false);
  const [linkedinResult, setLinkedinResult] = useState<any>(null);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'certificates' | 'linkedin' | 'evidence'>('certificates');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Skill Assessment Modal State
  const [activeAssessmentCert, setActiveAssessmentCert] = useState<any | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<string, number>>({});
  const [submittingAssessment, setSubmittingAssessment] = useState(false);
  const [assessmentFeedback, setAssessmentFeedback] = useState<any | null>(null);
  const [activeAssessmentTab, setActiveAssessmentTab] = useState<'quiz' | 'result'>('quiz');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [certRes, evidenceRes] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/skill-evidence'),
      ]);
      if (certRes.ok) {
        const d = await certRes.json();
        setCertificates(d.certificates || []);
      }
      if (evidenceRes.ok) {
        const d = await evidenceRes.json();
        setSkillEvidence(d.evidence || []);
        if (d.linkedin) setLinkedin(d.linkedin);
      }
    } catch (err) {
      console.error('Failed to load achievements data:', err);
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    setUploadResult(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/certificates/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setUploadResult(data);
        await loadData();
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileUpload(f);
    e.target.value = '';
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFileUpload(f);
  }, []);

  const handleDeleteCert = async (id: string) => {
    if (!confirm('Remove this certificate from your profile?')) return;
    setDeletingId(id);
    try {
      await fetch(`/api/certificates?id=${id}`, { method: 'DELETE' });
      await loadData();
    } finally { setDeletingId(null); }
  };

  const openAssessment = (cert: any) => {
    setActiveAssessmentCert(cert);
    setAssessmentAnswers({});
    setAssessmentFeedback(cert.assessmentResult || null);
    setActiveAssessmentTab(cert.assessmentResult ? 'result' : 'quiz');
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!activeAssessmentCert) return;
    const questions = activeAssessmentCert.diagnosticQuestions || [];
    const answeredCount = Object.keys(assessmentAnswers).length;
    if (answeredCount < questions.length) {
      alert(`Please answer all ${questions.length} questions before submitting.`);
      return;
    }

    setSubmittingAssessment(true);
    try {
      const res = await fetch('/api/certificates/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateId: activeAssessmentCert.id,
          answers: assessmentAnswers,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAssessmentFeedback(data);
        setActiveAssessmentTab('result');
        await loadData();
      } else {
        alert(data.error || 'Failed to submit assessment.');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to evaluate assessment.');
    } finally {
      setSubmittingAssessment(false);
    }
  };

  const handleLinkedInAnalyze = async () => {
    if (!linkedinText.trim() && !linkedinUrl.trim()) {
      setLinkedinError('Paste your LinkedIn profile text or provide your profile URL.');
      return;
    }
    setAnalyzingLinkedin(true);
    setLinkedinError(null);
    try {
      const res = await fetch('/api/linkedin/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileUrl: linkedinUrl,
          profileData: linkedinText,
          dataSource: linkedinText ? 'TEXT_PASTE' : 'URL_PROVIDED',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinkedinResult(data);
        await loadData();
      } else {
        setLinkedinError(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      setLinkedinError(err.message);
    } finally { setAnalyzingLinkedin(false); }
  };

  const handleDeleteLinkedin = async () => {
    if (!confirm('Remove your LinkedIn analysis data?')) return;
    await fetch('/api/linkedin/analyze', { method: 'DELETE' });
    setLinkedin(null);
    setLinkedinResult(null);
    await loadData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
              Certificate Skill Analyzer & Achievement Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            Certificate Skill Analyzer
          </h1>
          <p className="text-sm text-subtle mt-1 max-w-3xl">
            Upload your hackathons, workshops, internships, courses, and competition certificates.
            Nexus Learn AI analyzes the documents to detect your exact domain, exposure signals, and personalized next skills — and calibrates your learning path through interactive skill assessments.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Certificate
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={onFileChange} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl w-fit">
        {[
          { key: 'certificates', label: 'Certificates & Skill Analyzer', icon: Award, count: certificates.length },
          { key: 'linkedin', label: 'LinkedIn Intelligence', icon: Linkedin, count: linkedin ? 1 : 0 },
          { key: 'evidence', label: 'Verified Skill Timeline', icon: BarChart2, count: skillEvidence.length },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === tab.key ? 'bg-white text-primary shadow-sm' : 'text-subtle hover:text-main'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.count > 0 && <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{tab.count}</span>}
            </button>
          );
        })}
      </div>

      {/* ======================= CERTIFICATES TAB ======================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`nexus-card p-8 border-2 border-dashed text-center cursor-pointer transition ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-slate-50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-bold text-main">Analyzing your certificate with AI...</p>
                <p className="text-xs text-subtle">Extracting domain, skills, evidence level, and generating tailored next-skill roadmap</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-main text-sm">Drop your certificate here or click to upload</p>
                  <p className="text-xs text-subtle mt-1">Supports PDF, JPG, JPEG, PNG — Max 10MB</p>
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Hackathon</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Workshop</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Course Completion</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Internship</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Competition</span>
                    <span className="text-[10px] font-semibold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Technical Event</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}

          {/* Newly Uploaded Certificate Highlight Banner */}
          {uploadResult && (
            <div className="nexus-card p-6 border-emerald-300 bg-gradient-to-r from-emerald-50/40 via-white to-blue-50/30 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-base text-main">Certificate Successfully Analyzed!</h3>
                </div>
                <button onClick={() => setUploadResult(null)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-primary uppercase">Detected Domain</span>
                  <p className="font-extrabold text-sm text-main mt-0.5">{uploadResult.certificate?.detectedDomain || uploadResult.analysis?.detectedDomain || 'Generative AI'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-primary uppercase">Detected Experience</span>
                  <p className="font-extrabold text-sm text-main mt-0.5">{uploadResult.certificate?.experienceType || uploadResult.analysis?.experienceType || 'Participation'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-primary uppercase">Evidence Status</span>
                  <span className="inline-block mt-0.5 text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {uploadResult.certificate?.evidenceLevel || 'EXPOSURE'} (Verified Document)
                  </span>
                </div>
              </div>

              {/* What Student Has Been Exposed To */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>What you have been exposed to:</strong> {uploadResult.certificate?.exposureSummary || uploadResult.analysis?.exposureSummary || uploadResult.evidenceSummary}
              </div>

              {/* Evidence of Exposure Callout */}
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <span className="font-bold">Important Pedagogical Note:</span> A participation certificate shows hands-on exposure, not verified mastery.
                  <p className="mt-0.5 font-medium">
                    {uploadResult.certificate?.verificationAdvice || uploadResult.analysis?.verificationAdvice || "Your certificate shows exposure. Let's assess your current knowledge and identify the next skills you should learn."}
                  </p>
                </div>
              </div>

              {/* Assessment CTA */}
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openAssessment(uploadResult.certificate)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
                >
                  <BrainCircuit className="w-4 h-4" />
                  Take Skill Assessment Now
                </button>
                <span className="text-xs text-subtle">Takes 2-3 minutes &bull; Verifies actual skills &bull; Calibrates learning path</span>
              </div>
            </div>
          )}

          {/* Certificate Cards List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-bold text-main text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                Your Analyzed Certificates ({certificates.length})
              </h2>
              <span className="text-xs text-subtle">Persisted across sessions</span>
            </div>

            {certificates.length === 0 && !uploading && !uploadResult ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-border space-y-3">
                <Award className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-base text-main">No Certificates Added Yet</h3>
                <p className="text-xs text-subtle max-w-md mx-auto">
                  Upload a hackathon certificate, workshop certificate, course completion, or competition award.
                  Nexus Learn AI will extract the domain, identify your exposure, and map out your next skills.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload First Certificate
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {certificates.map(cert => {
                  const evConf = EVIDENCE_CONFIG[cert.evidenceLevel] || EVIDENCE_CONFIG.EXPOSURE;
                  const isAssessed = Boolean(cert.assessmentResult);
                  const nextSkills: string[] = cert.personalizedNextSkillPath || [
                    `${cert.detectedDomain || 'Domain'} Fundamentals`,
                    'Core Architecture & Implementation',
                    'Advanced Patterns',
                    'Production Projects'
                  ];

                  return (
                    <div key={cert.id} className="nexus-card p-6 border-border bg-white shadow-subtle space-y-5">
                      {/* Top Bar: Title, Badges, Delete */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-border pb-4">
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Domain Badge */}
                            <span className="text-xs font-extrabold px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs">
                              {cert.detectedDomain || 'Generative AI'}
                            </span>
                            {/* Experience Type Badge */}
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                              {cert.experienceType || cert.certificateType || 'Participation'}
                            </span>
                            {/* Evidence Level Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${evConf.color}`}>
                              {evConf.label}
                            </span>
                            {isAssessed && (
                              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Verified via Assessment ({cert.assessmentResult.scorePercent}%)
                              </span>
                            )}
                          </div>

                          <h3 className="font-extrabold text-lg text-main mt-1 leading-snug">
                            {cert.certificateTitle}
                          </h3>
                          <p className="text-xs text-subtle">
                            {cert.organization !== 'Unknown' && <span>Issued by <strong>{cert.organization}</strong> &bull; </span>}
                            {cert.issueDate !== 'Unknown' && <span>Date: {cert.issueDate} &bull; </span>}
                            <span>File: {cert.fileName}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openAssessment(cert)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition shadow-xs ${
                              isAssessed
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-primary text-white hover:bg-primary-700'
                            }`}
                          >
                            <BrainCircuit className="w-4 h-4" />
                            {isAssessed ? 'View / Retake Assessment' : 'Take Skill Assessment'}
                          </button>
                          <button
                            onClick={() => handleDeleteCert(cert.id)}
                            disabled={deletingId === cert.id}
                            className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50 transition"
                            title="Remove Certificate"
                          >
                            {deletingId === cert.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* 1. What the Student Has Been Exposed To */}
                      <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-1.5">
                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                          What You Have Been Exposed To
                        </span>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                          {cert.exposureSummary || `Hands-on exposure to ${cert.detectedDomain || 'the domain'} through ${cert.experienceType || 'the documented event'}.`}
                        </p>
                      </div>

                      {/* 2. Skills / Exposure Pills */}
                      <div>
                        <span className="text-[11px] font-bold text-subtle uppercase tracking-wider block mb-2">
                          Skills & Concepts Indicated
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(cert.skillsDetected || []).map((s: any, idx: number) => (
                            <span
                              key={idx}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50/70 text-indigo-900 border border-indigo-100 flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              {s.skillName}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 3. Pedagogical Warning: Exposure vs Mastery */}
                      <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Evidence of Exposure:</strong> A participation certificate indicates that you were exposed to these tools, but does not measure competency.
                          <span className="block mt-0.5 text-amber-800">
                            {cert.verificationAdvice || `Your certificate shows exposure to ${cert.detectedDomain || 'this domain'}. Let's assess your current knowledge and identify the next skills you should learn.`}
                          </span>
                        </div>
                      </div>

                      {/* 4. Personalized Next-Skill Path Visualization */}
                      <div className="p-4 bg-gradient-to-r from-slate-50 to-indigo-50/20 rounded-xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                            Personalized Next-Skill Learning Path
                          </span>
                          <span className="text-[10px] text-subtle font-medium">Tailored for {cert.detectedDomain}</span>
                        </div>

                        {/* Step-by-step flowchart */}
                        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-2 pt-1">
                          {nextSkills.map((skill, sIdx) => (
                            <React.Fragment key={sIdx}>
                              <div className="w-full sm:w-auto px-3 py-2 bg-white rounded-lg border border-border shadow-xs flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {sIdx + 1}
                                </span>
                                <span className="text-xs font-bold text-main whitespace-normal sm:whitespace-nowrap">
                                  {skill}
                                </span>
                              </div>
                              {sIdx < nextSkills.length - 1 && (
                                <span className="text-slate-400 font-bold text-sm hidden sm:inline">&rarr;</span>
                              )}
                              {sIdx < nextSkills.length - 1 && (
                                <span className="text-slate-400 font-bold text-xs sm:hidden">&darr;</span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      {/* 5. If Assessment is completed, show the results summary */}
                      {isAssessed && cert.assessmentResult && (
                        <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Measured Knowledge & Assessment Calibration
                            </h4>
                            <span className="text-xs font-extrabold text-emerald-800">
                              Score: {cert.assessmentResult.scorePercent}%
                            </span>
                          </div>

                          {/* Skill breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {(cert.assessmentResult.assessedSkills || []).map((sk: any, i: number) => (
                              <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                                <span className="font-bold text-slate-800">{sk.skill}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  sk.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' :
                                  sk.status === 'Developing' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {sk.status} ({sk.score}%)
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Identified Weak Areas */}
                          {cert.assessmentResult.weakAreas && cert.assessmentResult.weakAreas.length > 0 && (
                            <div className="text-xs text-slate-700">
                              <span className="font-bold text-red-700">Priority Learning Gaps: </span>
                              {cert.assessmentResult.weakAreas.join(', ')}
                            </div>
                          )}

                          {/* Recommended YouTube Videos for weak areas */}
                          {cert.assessmentResult.recommendedVideos && cert.assessmentResult.recommendedVideos.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                                Recommended Educational Videos for Your Gaps
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {cert.assessmentResult.recommendedVideos.map((vid: any, vIdx: number) => (
                                  <a
                                    key={vIdx}
                                    href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-white rounded-lg border border-border text-xs flex items-center justify-between hover:border-primary/40 hover:bg-slate-50 transition"
                                  >
                                    <span className="font-semibold text-main line-clamp-1">{vid.title}</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================= LINKEDIN TAB ======================= */}
      {activeTab === 'linkedin' && (
        <div className="space-y-6">
          <div className="nexus-card p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
              <div>
                <h3 className="font-bold text-sm text-main">LinkedIn Profile Intelligence</h3>
                <p className="text-xs text-subtle">
                  Paste your LinkedIn profile text to extract skills, projects, and career alignments.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-main block mb-1">LinkedIn Profile URL (optional)</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={e => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-main block mb-1">Paste LinkedIn Profile Text *</label>
                <textarea
                  value={linkedinText}
                  onChange={e => setLinkedinText(e.target.value)}
                  rows={8}
                  placeholder="Paste your LinkedIn profile sections here (About, Experience, Projects, Skills, Certifications, Education)..."
                  className="w-full text-xs border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y font-mono"
                />
              </div>
            </div>

            {linkedinError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">{linkedinError}</div>
            )}

            <button
              onClick={handleLinkedInAnalyze}
              disabled={analyzingLinkedin}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A66C2] text-white text-xs font-bold rounded-xl hover:bg-[#004182] transition shadow-subtle disabled:opacity-60"
            >
              {analyzingLinkedin ? <><Loader2 className="w-4 h-4 animate-spin" />Analyzing...</> : <><Sparkles className="w-4 h-4" />Analyze Profile</>}
            </button>
          </div>

          {(linkedin || linkedinResult?.profile) && (
            <div className="nexus-card p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-main">LinkedIn Analysis Results</h3>
                  <p className="text-xs text-subtle">
                    Last analyzed: {new Date((linkedin || linkedinResult?.profile)?.lastAnalyzedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={handleDeleteLinkedin} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {(() => {
                const profile = linkedin || linkedinResult?.profile;
                return (
                  <div className="space-y-4">
                    {profile?.skillsDetected?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-primary uppercase tracking-wider mb-2">Detected Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skillsDetected.map((s: any, idx: number) => (
                            <span key={idx} className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                              {s.skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile?.skillGaps?.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2">Identified Skill Gaps</p>
                        <div className="space-y-2">
                          {profile.skillGaps.map((g: any, i: number) => (
                            <div key={i} className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                              <strong>{g.skill}: </strong> {g.reason}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* ======================= EVIDENCE TIMELINE TAB ======================= */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          {skillEvidence.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-border space-y-3">
              <BarChart2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-main">No Skill Evidence Recorded Yet</p>
              <p className="text-xs text-subtle">Upload a certificate or complete an assessment to record verified evidence.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {skillEvidence.map((ev: any) => (
                <div key={ev.id} className="nexus-card p-4 flex items-center justify-between gap-4 border-border">
                  <div>
                    <span className="font-extrabold text-sm text-main">{ev.skillName}</span>
                    <p className="text-xs text-subtle mt-0.5">
                      Source: <strong>{ev.sourceType}</strong> &bull; Level: {ev.evidenceLevel} &bull; {new Date(ev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {ev.assessmentScore !== undefined && (
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
                      Score: {ev.assessmentScore}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ======================= INTERACTIVE SKILL ASSESSMENT MODAL ======================= */}
      {activeAssessmentCert && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto border border-border">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Diagnostic Skill Assessment &bull; {activeAssessmentCert.detectedDomain || 'Domain Check'}
                </span>
                <h3 className="font-extrabold text-xl text-main mt-0.5">
                  Verify Knowledge: {activeAssessmentCert.certificateTitle}
                </h3>
                <p className="text-xs text-subtle mt-1">
                  Answer the diagnostic questions below so Nexus Learn AI can calibrate your knowledge level and update your learning path.
                </p>
              </div>
              <button
                onClick={() => setActiveAssessmentCert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Quiz vs Result */}
            {activeAssessmentTab === 'quiz' ? (
              <div className="space-y-6">
                {(activeAssessmentCert.diagnosticQuestions || []).map((q: any, qIdx: number) => {
                  const selected = assessmentAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-primary">
                          Question {qIdx + 1} of {activeAssessmentCert.diagnosticQuestions.length}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {q.difficulty} &bull; {q.skillTested}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-main leading-snug">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-2 pt-1">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = selected === optIdx;
                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition flex items-center justify-between ${
                                isSelected
                                  ? 'bg-primary/10 border-primary text-primary font-bold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-subtle">
                    {Object.keys(assessmentAnswers).length} of {activeAssessmentCert.diagnosticQuestions?.length || 0} answered
                  </span>
                  <button
                    onClick={handleSubmitAssessment}
                    disabled={submittingAssessment || Object.keys(assessmentAnswers).length < (activeAssessmentCert.diagnosticQuestions?.length || 0)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 shadow-subtle"
                  >
                    {submittingAssessment ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Evaluating Responses...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Submit & Calibrate Learning Path
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* RESULT VIEW */
              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-r from-emerald-50 via-white to-blue-50 rounded-2xl border border-emerald-300 text-center space-y-2">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Assessment Evaluated</span>
                  <div className="text-4xl font-extrabold text-main">
                    {assessmentFeedback?.scorePercent}%
                  </div>
                  <p className="text-xs text-slate-700 max-w-md mx-auto">
                    {assessmentFeedback?.careerRoadmapNote || 'Your skill profile, knowledge states, and personalized learning path have been updated.'}
                  </p>
                </div>

                {/* Skill Level Breakdown */}
                {assessmentFeedback?.assessedSkills && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-subtle uppercase tracking-wider">Skill Level Breakdown</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {assessmentFeedback.assessedSkills.map((sk: any, i: number) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-border text-xs flex justify-between items-center">
                          <span className="font-bold text-slate-800">{sk.skill}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            sk.status === 'Mastered' ? 'bg-emerald-100 text-emerald-800' :
                            sk.status === 'Developing' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {sk.status} &bull; {sk.score}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Updated Learning Path */}
                {assessmentFeedback?.updatedLearningPath && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-border space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Calibrated Learning Path (Next Focus)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-800">
                      {assessmentFeedback.updatedLearningPath.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2">
                          <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Videos */}
                {assessmentFeedback?.recommendedVideos && assessmentFeedback.recommendedVideos.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-subtle uppercase tracking-wider">Recommended Video Lessons</span>
                    <div className="space-y-1.5">
                      {assessmentFeedback.recommendedVideos.map((v: any, idx: number) => (
                        <a
                          key={idx}
                          href={`https://www.youtube.com/watch?v=${v.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white rounded-xl border border-border text-xs flex items-center justify-between hover:border-primary/40 hover:bg-slate-50 transition"
                        >
                          <span className="font-bold text-main line-clamp-1">{v.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      setAssessmentAnswers({});
                      setActiveAssessmentTab('quiz');
                    }}
                    className="text-xs font-bold text-subtle hover:text-main"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setActiveAssessmentCert(null)}
                    className="px-5 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition"
                  >
                    Done & View Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
