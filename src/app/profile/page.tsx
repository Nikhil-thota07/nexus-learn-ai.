'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  BookOpen,
  Target,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  Clock,
  GraduationCap,
  AlertTriangle,
  RotateCcw,
  Compass,
} from 'lucide-react';
import { BRANCH_CATALOG, Branch } from '@/data/branches';
import { PreparationMode } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRecalculateModal, setShowRecalculateModal] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    age: 20,
    dob: '',
    preparationMode: 'ENGINEERING' as PreparationMode,
    educationLevel: 'B.Tech',
    qualification: 'Undergraduate',
    schoolCollege: '',
    university: 'JNTUH',
    branchId: 'cse',
    branch: 'Computer Science and Engineering',
    customBranch: '',
    year: '1st Year',
    semester: 'Semester 1',
    regulation: 'R25',
    targetExam: 'JEE Main & Advanced',
    targetExamYear: '2026',
    currentClass: '12th Standard',
    board: 'CBSE',
    selectedSkill: 'Python',
    currentPreparationLevel: 'Intermediate',
    subjects: 'Programming for Problem Solving, Matrices & Calculus, Applied Physics',
    careerInterests: 'AI Engineer, Systems Architect',
    primaryGoal: '',
    secondaryGoal: '',
    preferredLanguage: 'English',
    dailyStudyMinutes: 90,
    preferredStyle: 'visual',
    difficulty: 'adaptive',
    videoPreference: 'concise',
  });

  useEffect(() => {
    fetch('/api/profile')
      .then((res) => {
        if (res.status === 401) {
          router.push('/login');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load profile');
        return res.json();
      })
      .then((data) => {
        if (data) {
          const u = data.user || {};
          const p = data.profile || {};
          const loaded = {
            name: u.name || '',
            email: u.email || '',
            avatar: u.avatar || '',
            age: u.age || 20,
            dob: u.dob || '',
            preparationMode: (p.preparationMode as PreparationMode) || 'ENGINEERING',
            educationLevel: p.educationLevel || 'B.Tech',
            qualification: p.qualification || '',
            schoolCollege: p.schoolCollege || 'Narsimha Reddy Engineering College',
            university: p.university || 'JNTUH',
            branchId: p.branchId || 'cse',
            branch: p.branch || 'Computer Science and Engineering',
            customBranch: p.customBranch || '',
            year: p.year || '1st Year',
            semester: p.semester || 'Semester 1',
            regulation: p.regulation || 'R25',
            targetExam: p.targetExam || 'JEE Main & Advanced',
            targetExamYear: p.targetExamYear || '2026',
            currentClass: p.currentClass || '12th Standard',
            board: p.board || 'CBSE',
            selectedSkill: p.selectedSkill || 'Python',
            currentPreparationLevel: p.currentPreparationLevel || 'Intermediate',
            subjects: p.subjects || '',
            careerInterests: p.careerInterests || '',
            primaryGoal: p.primaryGoal || '',
            secondaryGoal: p.secondaryGoal || '',
            preferredLanguage: p.preferredLanguage || 'English',
            dailyStudyMinutes: p.dailyStudyMinutes || 90,
            preferredStyle: p.preferredStyle || 'visual',
            difficulty: p.difficulty || 'adaptive',
            videoPreference: p.videoPreference || 'concise',
          };
          setFormData(loaded);
          setInitialData(loaded);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'branchId') {
      const selected = BRANCH_CATALOG.find((b) => b.id === value);
      setFormData((prev) => ({
        ...prev,
        branchId: value,
        branch: selected ? selected.name : value,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'dailyStudyMinutes' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if major educational parameters changed
    const majorChanged =
      initialData &&
      (formData.preparationMode !== initialData.preparationMode ||
        formData.branchId !== initialData.branchId ||
        formData.regulation !== initialData.regulation ||
        formData.year !== initialData.year ||
        formData.semester !== initialData.semester);

    if (majorChanged) {
      setShowRecalculateModal(true);
    } else {
      executeSave(false);
    }
  };

  const executeSave = async (recalculatePath: boolean) => {
    setShowRecalculateModal(false);
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          branch: formData.branchId === 'other' ? formData.customBranch : formData.branch,
          recalculatePath,
        }),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      setSaveSuccess(true);
      setInitialData(formData);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-sm font-semibold text-subtle">
        Loading student profile...
      </div>
    );
  }

  // Group branches by category for UI
  const categories = ['Computing', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Other'] as const;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            Student Profile & Personalization
          </h1>
          <p className="text-sm text-subtle mt-1">
            "Your learning path should know you." Your environment automatically reconfigures based on your purpose.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg animate-fade">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Profile Saved & Synchronized</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Recalculate Path Confirmation Modal */}
      {showRecalculateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border space-y-4 animate-scale">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-main">Recalculate Learning Path?</h3>
              <p className="text-xs text-subtle mt-1.5 leading-relaxed">
                Your learning path, prerequisite sequence, and recommended syllabus depend directly on your educational purpose, branch, and regulation. Would you like to recalculate your roadmap for the new settings? (Historical assessment attempts are safely preserved).
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => executeSave(false)}
                className="px-4 py-2 text-xs font-semibold text-subtle hover:text-main bg-slate-100 rounded-lg hover:bg-slate-200 transition"
              >
                Keep Current Path
              </button>
              <button
                type="button"
                onClick={() => executeSave(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-primary rounded-lg hover:bg-primary-700 transition shadow-subtle"
              >
                Recalculate Roadmap
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8">
        {/* SECTION 1: LEARNING PURPOSE (Section 6 Requirement) */}
        <div className="nexus-card p-6 sm:p-8 space-y-4 border-primary/20 bg-blue-50/20">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-main flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>1. What are you preparing for? (Student Purpose)</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-100/60 px-2.5 py-0.5 rounded-full">
              Primary Mode
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {[
              {
                mode: 'JEE',
                label: 'JEE Preparation',
                desc: 'JEE Main & Advanced Physics, Chemistry, Mathematics',
                icon: '🎯',
              },
              {
                mode: 'ENGINEERING',
                label: 'Engineering / B.Tech',
                desc: 'University syllabus, branch subjects, engineering labs',
                icon: '🎓',
              },
              {
                mode: 'SCHOOL',
                label: 'School Student',
                desc: 'CBSE / ICSE Board, Class 8 to 12 curriculum',
                icon: '📚',
              },
              {
                mode: 'SKILL',
                label: 'Skill Development',
                desc: 'Python, Web Dev, DSA, AI/ML career tracks',
                icon: '💻',
              },
            ].map((opt) => (
              <label
                key={opt.mode}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  formData.preparationMode === opt.mode
                    ? 'border-primary bg-white shadow-subtle ring-2 ring-primary/20'
                    : 'border-border bg-white hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{opt.icon}</span>
                    <input
                      type="radio"
                      name="preparationMode"
                      value={opt.mode}
                      checked={formData.preparationMode === opt.mode}
                      onChange={handleChange}
                      className="text-primary focus:ring-primary"
                    />
                  </div>
                  <h4 className="font-bold text-sm text-main">{opt.label}</h4>
                  <p className="text-xs text-subtle leading-relaxed">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* SECTION 2: PERSONAL INFORMATION */}
        <div className="nexus-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
            <User className="w-4 h-4 text-primary" />
            <span>2. Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Email Address (Persistent ID)
              </label>
              <input
                type="email"
                disabled
                value={formData.email}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-border rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Profile Photo URL
              </label>
              <input
                type="url"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: MODE-SPECIFIC ACADEMIC SETUP */}
        {/* 3A: ENGINEERING SETUP */}
        {formData.preparationMode === 'ENGINEERING' && (
          <div className="nexus-card p-6 sm:p-8 space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-main flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-secondary" />
                <span>3. Engineering / B.Tech Setup</span>
              </h2>
              <span className="text-xs text-subtle">Syllabus-locked configuration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  University / Affiliating Body
                </label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="JNTUH">Jawaharlal Nehru Technological University Hyderabad (JNTUH)</option>
                  <option value="JNTUK">JNTUK Kakinada</option>
                  <option value="Anna University">Anna University</option>
                  <option value="VTU">Visvesvaraya Technological University (VTU)</option>
                  <option value="Autonomous">Autonomous Engineering College</option>
                  <option value="Other">Other University</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Engineering College
                </label>
                <input
                  type="text"
                  name="schoolCollege"
                  value={formData.schoolCollege}
                  onChange={handleChange}
                  placeholder="e.g. Narsimha Reddy Engineering College"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                />
              </div>
            </div>

            {/* DYNAMIC BRANCH DROPDOWN (Section 44 Requirement) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Engineering Branch (Select Catalog)
                </label>
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  {categories.map((cat) => (
                    <optgroup key={cat} label={`--- ${cat} Engineering ---`}>
                      {BRANCH_CATALOG.filter((b) => b.category === cat).map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} ({branch.shortName})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Academic Regulation
                </label>
                <select
                  name="regulation"
                  value={formData.regulation}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="R25">R25 Regulation (Latest JNTUH 2025+)</option>
                  <option value="R22">R22 Regulation (JNTUH 2022-2024)</option>
                  <option value="NR25">NR25 Regulation (Autonomous College)</option>
                  <option value="R21">R21 Regulation</option>
                  <option value="UNKNOWN">I don't know my regulation</option>
                </select>
              </div>
            </div>

            {/* Custom Branch input if "other" is selected */}
            {formData.branchId === 'other' && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                  Specify Custom Engineering Branch
                </label>
                <input
                  type="text"
                  name="customBranch"
                  value={formData.customBranch}
                  onChange={handleChange}
                  placeholder="Enter your exact engineering specialization..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-amber-300 rounded-lg text-main"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Current Year
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="1st Year">1st Year (B.Tech)</option>
                  <option value="2nd Year">2nd Year (B.Tech)</option>
                  <option value="3rd Year">3rd Year (B.Tech)</option>
                  <option value="4th Year">4th Year (B.Tech)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Current Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="Semester 1">Semester 1 (Autumn / Odd)</option>
                  <option value="Semester 2">Semester 2 (Spring / Even)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3B: JEE PREPARATION SETUP (Section 7 Requirement) */}
        {formData.preparationMode === 'JEE' && (
          <div className="nexus-card p-6 sm:p-8 space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <h2 className="text-base font-bold text-main flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                <span>3. JEE Preparation Profile</span>
              </h2>
              <span className="text-xs text-primary font-bold">NTA Official Syllabus Alignment</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Target Exam
                </label>
                <select
                  name="targetExam"
                  value={formData.targetExam}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                  <option value="JEE Main Only">JEE Main Only</option>
                  <option value="BITSAT / State CETs">BITSAT / State CETs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Target Examination Year
                </label>
                <select
                  name="targetExamYear"
                  value={formData.targetExamYear}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="2025">2025 (Immediate Target)</option>
                  <option value="2026">2026 (Class 12 / Dropper)</option>
                  <option value="2027">2027 (Class 11)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Current Academic Status
                </label>
                <select
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="11th Standard">11th Standard</option>
                  <option value="12th Standard">12th Standard</option>
                  <option value="Dropper / Repeater">Dropper / Full-time Repeater</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Current Preparation Benchmark
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner (Starting Concepts)', 'Intermediate (Solving Level 1-2)', 'Advanced (Mock Tests & Previous Year Papers)'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, currentPreparationLevel: lvl }))}
                    className={`p-3 text-xs font-semibold rounded-lg border text-left transition ${
                      formData.currentPreparationLevel === lvl
                        ? 'border-primary bg-primary-50/60 text-primary'
                        : 'border-border bg-white text-subtle hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3C: SCHOOL SETUP */}
        {formData.preparationMode === 'SCHOOL' && (
          <div className="nexus-card p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
              <BookOpen className="w-4 h-4 text-secondary" />
              <span>3. School Academic Setup</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Educational Board
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="CBSE">Central Board of Secondary Education (CBSE)</option>
                  <option value="ICSE">ICSE / ISC</option>
                  <option value="State Board">State Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Class / Grade
                </label>
                <select
                  name="currentClass"
                  value={formData.currentClass}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
                >
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10 (Board Exam Year)</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12 (Board Exam Year)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 3D: SKILL DEVELOPMENT SETUP */}
        {formData.preparationMode === 'SKILL' && (
          <div className="nexus-card p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>3. Skill & Career Specialization</span>
            </h2>

            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Primary Skill Domain
              </label>
              <select
                name="selectedSkill"
                value={formData.selectedSkill}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              >
                <option value="Python">Python Programming (Core to Advanced)</option>
                <option value="Java">Java & Object-Oriented Architecture</option>
                <option value="JavaScript">Full-Stack JavaScript & React</option>
                <option value="DSA">Data Structures & Algorithmic Problem Solving</option>
                <option value="AI & ML">Artificial Intelligence & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity & Network Defense</option>
                <option value="Cloud">Cloud Architecture & DevOps</option>
              </select>
            </div>
          </div>
        )}

        {/* SECTION 4: LEARNING PREFERENCES */}
        <div className="nexus-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>4. Study Habits & Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Daily Study Time (Minutes)
              </label>
              <input
                type="number"
                name="dailyStudyMinutes"
                value={formData.dailyStudyMinutes}
                onChange={handleChange}
                min={15}
                max={480}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Explanation Style
              </label>
              <select
                name="preferredStyle"
                value={formData.preferredStyle}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              >
                <option value="visual">Visual & Diagrammatic</option>
                <option value="conceptual">Conceptual & First-Principles</option>
                <option value="hands-on">Hands-on Code & Problem Solving</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Video Lesson Style
              </label>
              <select
                name="videoPreference"
                value={formData.videoPreference}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main focus:bg-white"
              >
                <option value="concise">Concise & Direct (10-15 mins)</option>
                <option value="deep-dive">Comprehensive Masterclass (30+ mins)</option>
                <option value="animated">Animated & Illustrated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 shadow-subtle"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
