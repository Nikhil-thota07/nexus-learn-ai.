'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Award, Upload, Loader2, CheckCircle2, AlertTriangle, Sparkles,
  Linkedin, Trash2, Eye, BookOpen, TrendingUp, Target, ArrowRight,
  FileText, Image as ImageIcon, RefreshCw, Clock, BarChart2,
  ChevronDown, ChevronUp, X, Plus, ExternalLink,
} from 'lucide-react';

const EVIDENCE_CONFIG = {
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
  const [linkedinText, setLinkedinText] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [analyzingLinkedin, setAnalyzingLinkedin] = useState(false);
  const [linkedinResult, setLinkedinResult] = useState<any>(null);
  const [linkedinError, setLinkedinError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'certificates' | 'linkedin' | 'evidence'>('certificates');
  const [expandedCert, setExpandedCert] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [certRes, evidenceRes] = await Promise.all([
        fetch('/api/certificates'),
        fetch('/api/skill-evidence'),
      ]);
      if (certRes.ok) { const d = await certRes.json(); setCertificates(d.certificates || []); }
      if (evidenceRes.ok) {
        const d = await evidenceRes.json();
        setSkillEvidence(d.evidence || []);
        if (d.linkedin) setLinkedin(d.linkedin);
      }
    } catch {}
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
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">Certificate & Achievement Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">Achievements & Certificates</h1>
          <p className="text-sm text-subtle mt-1">Upload certificates to build your verified skill evidence profile. Nexus AI analyzes each document to understand your exposure, learning, and demonstrated skills.</p>
        </div>
        <div className="flex items-center gap-2">
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
          { key: 'certificates', label: 'Certificates', icon: Award, count: certificates.length },
          { key: 'linkedin', label: 'LinkedIn Intelligence', icon: Linkedin, count: linkedin ? 1 : 0 },
          { key: 'evidence', label: 'Skill Evidence', icon: BarChart2, count: skillEvidence.length },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
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

      {/* CERTIFICATES TAB */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          {/* Upload Area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`nexus-card p-10 border-2 border-dashed text-center cursor-pointer transition ${
              dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-slate-50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm font-bold text-main">Analyzing your certificate with AI...</p>
                <p className="text-xs text-subtle">Extracting skills, domains, and evidence level</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-main text-sm">Drop your certificate here or click to upload</p>
                  <p className="text-xs text-subtle mt-1">Supports PDF, JPG, JPEG, PNG — Max 10MB</p>
                  <p className="text-[10px] text-subtle mt-1">Hackathon · Workshop · Course · Internship · Competition · Award</p>
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

          {uploadResult && (
            <div className="nexus-card p-5 border-emerald-200 bg-emerald-50/30 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-main">Certificate Analyzed</h3>
              </div>
              <p className="text-sm text-slate-700">{uploadResult.evidenceSummary}</p>
              {uploadResult.analysis?.nextSkillRecommendations?.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                  <h4 className="font-bold text-sm text-main mb-2">Recommended Next Steps</h4>
                  <ul className="space-y-2">
                    {uploadResult.analysis.nextSkillRecommendations.map((r: any, i: number) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span><strong>{r.skill}</strong>: {r.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Certificate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map(cert => (
              <div key={cert.id} className="nexus-card p-5 border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <button onClick={() => handleDeleteCert(cert.id)} className="text-slate-400 hover:text-red-500 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-main line-clamp-2">{cert.certificateTitle}</h3>
                <p className="text-xs text-subtle mt-1">{cert.organization} • {cert.issueDate !== 'Unknown' ? cert.issueDate : 'Date Not Specified'}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cert.skillsDetected?.slice(0, 4).map((s: any, i: number) => (
                    <span key={i} className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-700">{s.skillName}</span>
                  ))}
                  {cert.skillsDetected?.length > 4 && <span className="text-[10px] bg-slate-50 px-2 py-1 rounded text-slate-500">+{cert.skillsDetected.length - 4} more</span>}
                </div>
              </div>
            ))}
            {certificates.length === 0 && !uploading && !uploadResult && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
                <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-main">No Certificates Yet</h3>
                <p className="text-sm text-subtle mt-1">Upload your first certificate to start building your verified profile.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LINKEDIN TAB */}
      {activeTab === 'linkedin' && (
        <div className="space-y-6">
          {!linkedinResult && !linkedin ? (
            <div className="nexus-card p-6 border border-border">
              <h2 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                Analyze LinkedIn Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Or Paste Profile Text (More accurate)</label>
                  <textarea
                    value={linkedinText}
                    onChange={e => setLinkedinText(e.target.value)}
                    placeholder="Paste your About, Experience, and Skills sections here..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition h-32 resize-none"
                  />
                </div>
                {linkedinError && (
                  <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                    {linkedinError}
                  </div>
                )}
                <button
                  onClick={handleLinkedInAnalyze}
                  disabled={analyzingLinkedin || (!linkedinUrl && !linkedinText)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {analyzingLinkedin ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {analyzingLinkedin ? 'Analyzing Profile...' : 'Analyze Profile'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-main flex items-center gap-2">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  LinkedIn Profile Intelligence
                </h2>
                <button onClick={handleDeleteLinkedin} className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {/* Analysis details would go here based on data structure */}
                  <div className="nexus-card p-6 border border-border">
                    <h3 className="font-bold text-main text-lg mb-2">Detected Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(linkedinResult?.skillsDetected || linkedin?.skillsDetected || []).map((s: any, i: number) => (
                        <div key={i} className="px-3 py-1.5 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-200">
                          <strong>{s.skillName}</strong> <span className="opacity-70 text-xs">({s.evidenceStrength || 'HIGH'})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="nexus-card p-6 border border-border bg-slate-50">
                    <h3 className="font-bold text-main mb-3">Skill Gaps</h3>
                    <div className="space-y-3">
                      {(linkedinResult?.skillGaps || linkedin?.skillGaps || []).map((gap: any, i: number) => (
                        <div key={i} className="text-sm">
                          <strong className="text-slate-800">{gap.skill}</strong>
                          <p className="text-xs text-subtle mt-0.5">{gap.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EVIDENCE TAB */}
      {activeTab === 'evidence' && (
        <div className="space-y-6">
          <div className="nexus-card p-6 border border-border">
            <h2 className="text-lg font-bold text-main mb-4 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              Verified Skill Evidence Timeline
            </h2>
            
            {skillEvidence.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-subtle text-sm">No skill evidence recorded yet. Upload certificates or connect LinkedIn to start building evidence.</p>
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {skillEvidence.map((ev, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      {ev.sourceType === 'CERTIFICATE' ? <Award className="w-4 h-4" /> : <Linkedin className="w-4 h-4" />}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] nexus-card p-4 border border-slate-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-primary">{new Date(ev.createdAt).toLocaleDateString()}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          ev.evidenceLevel === 'VERIFIED_ACHIEVEMENT' ? 'bg-emerald-100 text-emerald-800' :
                          ev.evidenceLevel === 'DEMONSTRATED' ? 'bg-amber-100 text-amber-800' :
                          ev.evidenceLevel === 'LEARNING' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>{ev.evidenceLevel}</span>
                      </div>
                      <h4 className="font-bold text-sm text-main">{ev.skillName}</h4>
                      <p className="text-xs text-subtle mt-1">Source: {ev.sourceType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
