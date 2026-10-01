'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Database,
  Terminal,
  BookOpen,
  FileUp,
  Upload,
  Check,
  BrainCircuit,
  RotateCcw,
  Award,
  HelpCircle,
  Clock,
  Send,
  Loader2,
  X,
} from 'lucide-react';
import { resolveAuthoritativeSyllabus, AuthoritativeSyllabus, SyllabusSubject } from '@/data/syllabi';
import { findBranch } from '@/data/branches';
import { ImportantQuestion, TopicQuestionsGroup } from '@/services/questions/QuestionService';

export default function EngineeringPage() {
  const [profile, setProfile] = useState<any>(null);
  const [syllabus, setSyllabus] = useState<AuthoritativeSyllabus | null>(null);
  const [loading, setLoading] = useState(true);

  // Academic Hierarchy States
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  // Subject Selection State
  const [selectedSubject, setSelectedSubject] = useState<SyllabusSubject | null>(null);
  const [subjectQuestions, setSubjectQuestions] = useState<TopicQuestionsGroup[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [activeTopicIndex, setActiveTopicIndex] = useState(0);

  // Practice Question Modal State
  const [activeQuestion, setActiveQuestion] = useState<ImportantQuestion | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(80);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState<string | null>(null);

  // Modals & PDF Upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const loadSemesterSubjects = async (year: number, sem: number, profileData?: any) => {
    // Clear stale data first (Requirement 4)
    setSelectedSubject(null);
    setSubjectQuestions([]);
    setLoadingQuestions(true);

    const activeProfile = profileData || profile;
    const branchKey = activeProfile?.branchId || activeProfile?.branch || 'cse';
    const uni = activeProfile?.university || 'JNTUH';
    const reg = activeProfile?.regulation || 'R25';
    const college = activeProfile?.schoolCollege || activeProfile?.college || '';

    try {
      const queryParams = new URLSearchParams({
        year: String(year),
        semester: String(sem),
        branch: branchKey,
        regulation: reg,
        university: uni,
      });
      if (college) queryParams.set('college', college);

      const res = await fetch(`/api/engineering/subject?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.syllabusNotAvailable || !data.syllabus) {
          setSyllabus(null);
          setSelectedSubject(null);
          setSubjectQuestions([]);
        } else {
          setSyllabus(data.syllabus);
          if (data.subject) {
            setSelectedSubject(data.subject);
            if (data.questionGroups) {
              setSubjectQuestions(data.questionGroups);
            }
          } else if (data.syllabus.subjects && data.syllabus.subjects.length > 0) {
            handleSelectSubject(data.syllabus.subjects[0]);
          }
        }
      } else {
        const resolved = resolveAuthoritativeSyllabus({
          university: uni,
          college: college || undefined,
          regulation: reg,
          branch: branchKey,
          year,
          semester: sem,
        });
        setSyllabus(resolved);
        if (resolved && resolved.subjects.length > 0) {
          handleSelectSubject(resolved.subjects[0]);
        } else {
          setSelectedSubject(null);
          setSubjectQuestions([]);
        }
      }
    } catch (err) {
      console.error('Error loading semester subjects:', err);
      setSyllabus(null);
      setSelectedSubject(null);
      setSubjectQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.profile) {
          setProfile(data.profile);
          const storedYr = typeof window !== 'undefined' ? localStorage.getItem('nexus_selected_year') : null;
          const storedSem = typeof window !== 'undefined' ? localStorage.getItem('nexus_selected_semester') : null;
          const rawSem = storedSem ? parseInt(storedSem) : (data.profile.semester ? Number(String(data.profile.semester).replace(/\D/g, '')) || 1 : 1);
          const rawYr = storedYr ? parseInt(storedYr) : (data.profile.year ? Number(String(data.profile.year).replace(/\D/g, '')) || 1 : 1);
          setSelectedYear(rawYr);
          setSelectedSemester(rawSem);
          loadSemesterSubjects(rawYr, rawSem, data.profile);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSemesterChange = (newSem: number) => {
    if (newSem === selectedSemester) return;
    setSelectedSemester(newSem);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_selected_semester', String(newSem));
      localStorage.setItem('nexus_selected_year', String(selectedYear));
    }
    setSyllabus(null);
    setSelectedSubject(null);
    setSubjectQuestions([]);
    loadSemesterSubjects(selectedYear, newSem);
  };

  const handleYearChange = (newYear: number) => {
    if (newYear === selectedYear) return;
    setSelectedYear(newYear);
    setSelectedSemester(1);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_selected_year', String(newYear));
      localStorage.setItem('nexus_selected_semester', '1');
    }
    setSyllabus(null);
    setSelectedSubject(null);
    setSubjectQuestions([]);
    loadSemesterSubjects(newYear, 1);
  };

  const handleSelectSubject = async (sub: SyllabusSubject) => {
    setSelectedSubject(sub);
    setLoadingQuestions(true);
    setActiveTopicIndex(0);

    try {
      const res = await fetch(`/api/engineering/subject?code=${sub.code}&year=${selectedYear}&semester=${selectedSemester}`);
      if (res.ok) {
        const data = await res.json();
        if (data.questionGroups) {
          setSubjectQuestions(data.questionGroups);
        }
      }
    } catch {
      // Fallback handled gracefully
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleSubmitAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuestion || !studentAnswer.trim()) return;

    setSubmittingAnswer(true);
    setSubmitFeedback(null);

    try {
      const res = await fetch('/api/engineering/subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: activeQuestion.id,
          conceptId: activeQuestion.concept || 'math-eigen',
          studentAnswer,
          confidenceScore,
          timeSpentSeconds: 90,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitFeedback(`✓ Attempt saved! Updated concept mastery: ${data.updatedMastery}%`);
        setTimeout(() => {
          setActiveQuestion(null);
          setStudentAnswer('');
          setSubmitFeedback(null);
        }, 1800);
      } else {
        setSubmitFeedback(`Error: ${data.error || 'Submission failed'}`);
      }
    } catch (err: any) {
      setSubmitFeedback(`Error: ${err.message}`);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleSyllabusPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploading(true);
    setUploadError(null);
    setUploadProgress('Reading syllabus document...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (profile?.university) formData.append('university', profile.university);
      if (profile?.schoolCollege || profile?.college) formData.append('college', profile.schoolCollege || profile.college);
      if (profile?.regulation) formData.append('regulation', profile.regulation);
      if (profile?.branchId || profile?.branch) formData.append('branch', profile.branchId || profile.branch);
      formData.append('year', String(selectedYear));
      formData.append('semester', String(selectedSemester));

      setTimeout(() => setUploadProgress('Detecting academic structure & course codes...'), 300);
      setTimeout(() => setUploadProgress('Extracting units, topics & learning concepts...'), 700);

      const res = await fetch('/api/syllabus/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process syllabus upload');

      setUploadProgress('✓ Syllabus registered! Loading curriculum...');
      setUploadResult(data);
      if (data.syllabus) {
        setSyllabus(data.syllabus);
        if (data.syllabus.subjects && data.syllabus.subjects.length > 0) {
          const firstSubj = data.syllabus.subjects[0];
          // If upload returned pre-generated questions, inject them directly
          if (data.importantQuestions) {
            const subjKey = firstSubj.code || firstSubj.name;
            const rawQs: any[] = data.importantQuestions[subjKey] || Object.values(data.importantQuestions)[0] || [];
            if (rawQs.length > 0) {
              // Group by unit number
              const grouped: Record<number, any> = {};
              rawQs.forEach((q: any) => {
                const uNum = q.unitNumber ?? 1;
                if (!grouped[uNum]) {
                  grouped[uNum] = {
                    unitNumber: uNum,
                    topic: q.unitTitle || q.topic || `Unit ${uNum}`,
                    questions: [],
                  };
                }
                grouped[uNum].questions.push({
                  ...q,
                  tier: q.importance || 'Important',
                });
              });
              const groups = Object.values(grouped).sort((a, b) => a.unitNumber - b.unitNumber);
              setSubjectQuestions(groups);
              setActiveTopicIndex(0);
            }
          }
          handleSelectSubject(firstSubj);
        }
      }
      setUploading(false);
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
      setUploading(false);
    }
  };

  const branchObj = findBranch(profile?.branchId || profile?.branch);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── 1. Header with Breadcrumb ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
              🎓 Engineering & B.Tech Learning Environment
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            Authoritative Engineering Syllabus & Question Bank
          </h1>
          <p className="text-xs sm:text-sm text-subtle mt-1">
            {profile ? (
              <span>
                {profile.university} &bull; Regulation: <strong>{profile.regulation}</strong> &bull;{' '}
                {branchObj?.name || profile.branch} &bull; {profile.year}, {profile.semester}
              </span>
            ) : (
              'University regulation-locked coursework.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-border rounded-xl hover:bg-slate-50 transition shadow-subtle"
          >
            <FileUp className="w-4 h-4 text-primary" />
            <span>Upload Syllabus PDF</span>
          </button>
          <Link
            href="/tutor"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-primary rounded-xl hover:bg-primary-700 shadow-subtle transition"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </Link>
        </div>
      </div>

      {/* ── 2. PDF Upload Modal ── */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border space-y-4 animate-scale">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-main text-base">Upload Official Syllabus PDF</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-subtle hover:text-main text-xs font-bold"
              >
                &times; Close
              </button>
            </div>

            {uploadResult ? (
              <div className="space-y-4 py-1">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Syllabus Successfully Analyzed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-200/60">
                    <div>
                      <span className="text-subtle text-[11px] block">University:</span>
                      <strong className="text-main">{uploadResult.university}</strong>
                    </div>
                    <div>
                      <span className="text-subtle text-[11px] block">College:</span>
                      <strong className="text-main">{uploadResult.college || 'Autonomous College'}</strong>
                    </div>
                    <div>
                      <span className="text-subtle text-[11px] block">Regulation:</span>
                      <strong className="text-main">{uploadResult.regulation}</strong>
                    </div>
                    <div>
                      <span className="text-subtle text-[11px] block">Branch:</span>
                      <strong className="text-main">{uploadResult.branch}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-border">
                    <span className="text-[11px] text-subtle block">Semesters</span>
                    <strong className="text-base text-primary font-extrabold">{uploadResult.semestersCount || 8} Detected</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-border">
                    <span className="text-[11px] text-subtle block">Subjects</span>
                    <strong className="text-base text-main font-extrabold">{uploadResult.subjectsCount} Detected</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-border">
                    <span className="text-[11px] text-subtle block">Units</span>
                    <strong className="text-base text-main font-extrabold">{uploadResult.unitsCount} Detected</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-border">
                    <span className="text-[11px] text-subtle block">Concepts</span>
                    <strong className="text-base text-emerald-700 font-extrabold">{uploadResult.conceptsCount || uploadResult.topicsCount} Detected</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setUploadResult(null);
                      if (uploadResult.syllabus) {
                        setSyllabus(uploadResult.syllabus);
                        if (uploadResult.syllabus.subjects && uploadResult.syllabus.subjects.length > 0) {
                          handleSelectSubject(uploadResult.syllabus.subjects[0]);
                        }
                      }
                    }}
                    className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle flex items-center justify-center gap-1.5"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-subtle leading-relaxed">
                  Upload your official university or autonomous syllabus PDF. Nexus Learn AI will extract the course codes, unit breakdowns, topics, and laboratory exercises directly into your active curriculum.
                </p>

                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition cursor-pointer bg-slate-50 relative">
                  {uploading ? (
                    <div className="space-y-3 py-4">
                      <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                      <p className="text-xs font-bold text-main">{uploadProgress}</p>
                      <p className="text-[11px] text-subtle">Extracting academic structure and verifying against university standards...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-subtle mx-auto mb-2" />
                      <p className="text-xs font-semibold text-main">Click to select or drag and drop syllabus PDF</p>
                      <p className="text-[11px] text-subtle mt-1">PDF or TXT documents up to 25MB accepted</p>
                      <input
                        type="file"
                        accept=".pdf,.txt"
                        onChange={handleSyllabusPdfUpload}
                        className="mt-3 text-xs text-subtle file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-700 cursor-pointer"
                      />
                    </>
                  )}
                </div>

                {uploadError && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-200">
                    {uploadError}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ── 2.5 Academic Year & Semester Selector (Requirement 2, 4) ── */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-main uppercase tracking-wider">Academic Progression:</span>
            <span className="text-[11px] px-2 py-0.5 rounded font-bold bg-indigo-50 text-primary border border-indigo-200">
              Year {selectedYear} &bull; Semester {selectedSemester}
            </span>
          </div>
          <p className="text-[11px] text-subtle">
            Switching semester performs an isolated query, clearing stale subjects and locking onto official regulation subjects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Year Buttons */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[1, 2, 3, 4].map((yr) => (
              <button
                key={yr}
                onClick={() => handleYearChange(yr)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  selectedYear === yr
                    ? 'bg-white text-primary shadow-subtle'
                    : 'text-subtle hover:text-main'
                }`}
              >
                Year {yr}
              </button>
            ))}
          </div>

          {/* Semester Buttons (Crucial Requirement 2, 4) */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            {[1, 2].map((sem) => (
              <button
                key={sem}
                onClick={() => handleSemesterChange(sem)}
                className={`px-3.5 py-1 rounded-lg text-xs font-bold transition ${
                  selectedSemester === sem
                    ? 'bg-primary text-white shadow-subtle'
                    : 'text-subtle hover:text-main'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2.8 Official Syllabus Not Available Callout (Requirement 2) ── */}
      {!syllabus && !loadingQuestions && (
        <div className="nexus-card p-8 border-2 border-dashed border-amber-300 bg-amber-50/50 rounded-2xl text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-main">
              Official syllabus not yet available in the system
            </h3>
            <p className="text-xs text-subtle max-w-lg mx-auto leading-relaxed">
              No verified syllabus has been imported yet for {profile?.university || 'University'} Regulation {profile?.regulation || 'R25'} &bull; {branchObj?.name || profile?.branch || 'Engineering'} (Year {selectedYear}, Semester {selectedSemester}).
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
            >
              <FileUp className="w-4 h-4" />
              <span>Import / Upload Syllabus</span>
            </button>
          </div>
        </div>
      )}

      {/* ── 3. Syllabus Metadata Card ── */}
      {syllabus && (
        <div className="nexus-card p-6 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 border-primary/20 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary/20">
                  {syllabus.id}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Authoritative {syllabus.sourceType.replace('_', ' ')}</span>
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-main">
                {syllabus.university} Regulation {syllabus.regulation} &bull; {syllabus.branchName} (Year {syllabus.year}, Semester {syllabus.semester})
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-subtle font-mono block">Version: {syllabus.version}</span>
              <span className="text-xs text-subtle font-mono block">Academic Cycle: {syllabus.academicYear}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Subject Selector Tabs ── */}
      {syllabus && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-main uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-primary" />
              <span>Select Enrolled Subject:</span>
            </h3>
            <span className="text-xs text-subtle">
              Click any subject to view detailed units and topic-wise important questions
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {syllabus.subjects.map((sub) => {
              const isSelected = selectedSubject?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary bg-primary-50/70 shadow-subtle ring-2 ring-primary/20'
                      : 'border-border bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-mono text-[10px] font-bold text-primary block">
                      {sub.code}
                    </span>
                    <h4 className="font-bold text-xs text-main mt-1 line-clamp-2">{sub.name}</h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-subtle">
                    <span>{sub.credits} Credits</span>
                    <span className="font-semibold text-emerald-700">{sub.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 5. Detailed Subject View & Important Questions (Requirements 8, 9, 10, 11) ── */}
      {selectedSubject && (
        <div className="space-y-6">
          {/* Subject Overview Card */}
          <div className="nexus-card p-6 bg-white border-border shadow-subtle space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded">
                    {selectedSubject.code}
                  </span>
                  <span className="text-xs font-semibold text-subtle">{selectedSubject.category}</span>
                  {selectedSubject.programmingLanguage && (
                    <span className="text-[11px] font-mono font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                      Language: {selectedSubject.programmingLanguage}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-extrabold text-main">{selectedSubject.name}</h3>
                <p className="text-xs text-subtle mt-1">
                  {syllabus?.university} {syllabus?.regulation} &bull; {syllabus?.branchName} &bull; Year {syllabus?.year}, Semester {syllabus?.semester}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  {selectedSubject.credits} Credits
                </span>
                <Link
                  href={`/syllabus`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Create 2-Week Plan</span>
                </Link>
              </div>
            </div>

            {/* Units & Syllabus Hierarchy Breakdown */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-sm text-main">Syllabus Units & Structure:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {selectedSubject.units.map((unit) => (
                  <div key={unit.unitNumber} className="p-4 bg-slate-50/80 rounded-xl border border-border space-y-2">
                    <span className="font-mono text-[10px] font-bold text-primary uppercase">
                      Unit {unit.unitNumber}
                    </span>
                    <h5 className="font-bold text-xs text-main">{unit.title}</h5>
                    <p className="text-[11px] text-subtle line-clamp-3 leading-relaxed">
                      {unit.description}
                    </p>
                    <div className="pt-2 border-t border-border/60 space-y-2">
                      <div>
                        <span className="text-[10px] font-bold text-subtle block mb-1">Key Topics:</span>
                        <div className="flex flex-wrap gap-1">
                          {unit.topics.map((t, idx) => (
                            <span key={idx} className="text-[10px] bg-white px-2 py-0.5 rounded border border-border text-slate-700 font-medium">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {unit.concepts && unit.concepts.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold text-primary block mb-1">Concepts & Video Explanations:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {unit.concepts.map((c) => (
                              <Link
                                key={c.id}
                                href={`/learn/${c.id}`}
                                className="text-[10px] bg-primary-50 hover:bg-primary-100 text-primary font-bold px-2 py-0.5 rounded border border-primary/20 transition inline-flex items-center gap-1"
                              >
                                <span>{c.title}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subject Action Hub */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-main">Study Resources:</span>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                      `${syllabus?.university || 'JNTUH'} ${selectedSubject.name} complete syllabus lectures`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 font-semibold transition"
                  >
                    <span>Recommended YouTube Lectures</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
                <Link
                  href={`/tutor`}
                  className="inline-flex items-center gap-1.5 text-xs text-primary bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg border border-primary/20 font-semibold transition"
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Ask AI Tutor about {selectedSubject.code}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ── 6. Topic-Wise Important Questions Engine (Requirements 9, 10, 11, 12, 13, 14) ── */}
          <div className="nexus-card p-6 bg-white border-border shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div>
                <h3 className="font-bold text-base text-main flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" />
                  <span>Topic-Wise Important Questions ({selectedSubject.name})</span>
                </h3>
                <p className="text-xs text-subtle mt-0.5">
                  High-yield questions with marks, difficulty weighting, and expected answer structure.
                </p>
              </div>

              {loadingQuestions && (
                <div className="flex items-center gap-1.5 text-xs text-primary font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Retrieving Grounded Questions...</span>
                </div>
              )}
            </div>

            {/* Topic Filter Tabs */}
            {subjectQuestions.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {subjectQuestions.map((group, idx) => (
                  <button
                    key={group.topic}
                    type="button"
                    onClick={() => setActiveTopicIndex(idx)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition ${
                      activeTopicIndex === idx
                        ? 'bg-primary text-white shadow-subtle'
                        : 'bg-slate-100 text-subtle hover:text-main'
                    }`}
                  >
                    Unit {group.unitNumber}: {group.topic}
                  </button>
                ))}
              </div>
            )}

            {/* Questions List for Active Topic */}
            {subjectQuestions[activeTopicIndex] && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-main">
                    Topic: {subjectQuestions[activeTopicIndex].topic}
                  </h4>
                  <span className="text-xs text-subtle">
                    {subjectQuestions[activeTopicIndex].questions.length} Curated Questions
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {subjectQuestions[activeTopicIndex].questions.map((q) => (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-border bg-slate-50/50 hover:bg-white hover:border-primary/40 transition space-y-3"
                    >
                      {/* Badges Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              q.tier === 'Very Important'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : q.tier === 'Important'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            ★ {q.tier}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              q.difficulty === 'Exam Level'
                                ? 'bg-purple-100 text-purple-800'
                                : q.difficulty === 'Hard'
                                ? 'bg-red-100 text-red-800'
                                : q.difficulty === 'Medium'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {q.difficulty}
                          </span>
                          <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                            {q.marks} Marks
                          </span>
                          <span className="text-[10px] font-semibold text-subtle">
                            Type: {q.questionType}
                          </span>
                          {q.sourceType === 'AI_GENERATED' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
                              ✦ AI Generated
                            </span>
                          )}
                          {q.sourceType === 'VERIFIED_PAST_PAPER' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✓ Verified Past Paper
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveQuestion(q);
                            setStudentAnswer('');
                            setSubmitFeedback(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-700 transition shadow-subtle"
                        >
                          <Send className="w-3 h-3" />
                          <span>Solve / Practice Question</span>
                        </button>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm font-semibold text-main leading-relaxed whitespace-pre-line">
                        {q.question}
                      </p>

                      {/* Why it Matters */}
                      <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900 flex items-start gap-2">
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong>Exam Relevance: </strong>
                          <span>{q.whyItMatters}</span>
                        </div>
                      </div>

                      {/* Expected Answer Structure (Requirement 9) */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-subtle uppercase tracking-wider block">
                          Expected Answer Structure & Marking Points:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-700 pl-2">
                          {q.expectedAnswerStructure.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">&bull;</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 7. Interactive Practice & Answer Submission Modal (Requirement 14) ── */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-border space-y-4 animate-scale">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-main text-base">Practice Question ({activeQuestion.marks} Marks)</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuestion(null)}
                className="text-subtle hover:text-main text-sm font-bold"
              >
                &times; Close
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-primary">Topic: {activeQuestion.topic}</span>
              <p className="text-sm font-semibold text-main whitespace-pre-line bg-slate-50 p-3.5 rounded-xl border border-border">
                {activeQuestion.question}
              </p>
            </div>

            <form onSubmit={handleSubmitAttempt} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1.5">
                  Your Solution / Explanation
                </label>
                <textarea
                  rows={5}
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  required
                  placeholder="Type your derivation, code, or structured answer points here..."
                  className="w-full p-3 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                    Your Confidence Level ({confidenceScore}%)
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={100}
                    value={confidenceScore}
                    onChange={(e) => setConfidenceScore(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div className="text-xs text-subtle flex items-center">
                  <span>Confidence helps the engine calibrate your metacognitive quadrant.</span>
                </div>
              </div>

              {submitFeedback && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-800">
                  {submitFeedback}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuestion(null)}
                  className="px-4 py-2 text-xs font-semibold text-subtle hover:text-main bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAnswer}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 transition shadow-subtle disabled:opacity-50"
                >
                  {submittingAnswer ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Updating Mastery...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Solution</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
