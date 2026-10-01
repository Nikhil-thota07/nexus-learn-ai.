'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  BookOpen,
  Target,
  Sparkles,
  Loader2,
  Compass,
  GraduationCap,
  Cpu,
  Laptop,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { BRANCH_CATALOG } from '@/data/branches';
import { PreparationMode } from '@/types';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Purpose / Mode
    preparationMode: 'ENGINEERING' as PreparationMode,

    // Step 2: Academic Setup (dynamic)
    educationLevel: 'B.Tech',
    qualification: 'Undergraduate',
    schoolCollege: 'Narsimha Reddy Engineering College',
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

    // Step 3: Personal & Habits
    name: '',
    email: '',
    password: '',
    age: 20,
    dob: '2004-05-14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    preferredLanguage: 'English',
    dailyStudyMinutes: 90,
    preferredStyle: 'visual',
    difficulty: 'adaptive',
    videoPreference: 'concise',
  });

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

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please provide your name, email, and password.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        branch: formData.branchId === 'other' ? (formData.customBranch || 'Custom Engineering') : formData.branch,
      };

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
      setLoading(false);
    }
  };

  const categories = ['Computing', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Chemical', 'Other'] as const;

  const modeCards = [
    {
      mode: 'JEE' as PreparationMode,
      title: 'JEE Preparation',
      subtitle: 'JEE Main & Advanced Physics, Chemistry, Math problem solving & adaptive tests',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Main & Adv',
    },
    {
      mode: 'ENGINEERING' as PreparationMode,
      title: 'Engineering / B.Tech',
      subtitle: 'University regulation syllabus (JNTUH R25), branch core subjects, labs & exams',
      icon: Cpu,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: '30+ Branches',
    },
    {
      mode: 'SCHOOL' as PreparationMode,
      title: 'School Student',
      subtitle: 'CBSE, ICSE & State Boards (Class 9-12) curriculum & foundation learning',
      icon: BookOpen,
      color: 'text-teal-600 bg-teal-50 border-teal-200',
      badge: 'Classes 9-12',
    },
    {
      mode: 'SKILL' as PreparationMode,
      title: 'Skill Learner',
      subtitle: 'Master Python, JavaScript, DSA, and Machine Learning independently',
      icon: Laptop,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Job Ready',
    },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ── LEFT HERO PANEL (DESKTOP) ── */}
      <div className="hidden lg:flex lg:w-5/12 relative flex-col justify-between p-12 bg-gradient-to-br from-primary via-secondary to-indigo-900 text-white overflow-hidden">
        {/* Decorative backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-teal-500/10 blur-2xl" />
        </div>

        {/* Brand */}
        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-sm group-hover:scale-105 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight">Nexus Learn AI</div>
              <div className="text-xs text-indigo-200">Your learning path should know you.</div>
            </div>
          </Link>
        </div>

        {/* Step Guide on Left */}
        <div className="relative my-8 space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Smart Onboarding Setup</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Let's tailor your academic environment.
            </h2>
            <p className="text-sm text-indigo-200 leading-relaxed">
              We never show generic courses. Choose your target curriculum, specify your branch or board, and Nexus builds a tailored prerequisite graph.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/10">
            {[
              { num: 1, title: 'Choose Your Goal', desc: 'Select JEE, B.Tech, School, or Skill mode' },
              { num: 2, title: 'Program & Regulation', desc: 'Select university, syllabus version & branch' },
              { num: 3, title: 'Account & Credentials', desc: 'Secure your Bayesian knowledge state profile' },
            ].map((s) => {
              const isCurrent = step === s.num;
              const isPast = step > s.num;
              return (
                <div
                  key={s.num}
                  className={`flex items-start gap-3.5 p-3 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-white/15 border border-white/20 backdrop-blur-sm'
                      : 'opacity-70'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isPast
                        ? 'bg-success text-white'
                        : isCurrent
                        ? 'bg-white text-primary'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{s.title}</h4>
                    <p className="text-[11px] text-indigo-200 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer features */}
        <div className="relative pt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            Zero Spam · Encrypted Passwords
          </span>
          <span className="font-semibold text-white">v1.0 Production</span>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 lg:px-16 overflow-y-auto">
        <div className="max-w-xl w-full mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-main">Nexus Learn AI</span>
            </Link>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary">
              Step {step} of 3
            </span>
          </div>

          {/* Stepper Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-extrabold text-main tracking-tight">
                {step === 1 && 'What are you preparing for?'}
                {step === 2 && 'Set Up Your Academic Profile'}
                {step === 3 && 'Create Your Student Account'}
              </h1>
              <span className="hidden lg:inline-flex text-xs font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary border border-primary-100">
                Step {step} of 3
              </span>
            </div>
            <p className="text-xs text-subtle">
              {step === 1 && 'Choose your primary learning path to get the exact syllabus and tools.'}
              {step === 2 && 'Your curriculum, branch, and regulation map directly to your subjects.'}
              {step === 3 && 'Your Bayesian mastery score and progress will be securely saved.'}
            </p>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <span className="font-bold flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ════ STEP 1: PREPARATION MODE ════ */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {modeCards.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.preparationMode === opt.mode;
                  return (
                    <div
                      key={opt.mode}
                      onClick={() => setFormData((prev) => ({ ...prev, preparationMode: opt.mode }))}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-primary bg-primary-50/50 shadow-subtle ring-1 ring-primary/20'
                          : 'border-border bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${opt.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {opt.badge}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-main">{opt.title}</h3>
                          <p className="text-xs text-subtle leading-relaxed mt-1">{opt.subtitle}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span className="text-xs text-subtle font-medium">
                  Selected:{' '}
                  <strong className="text-main">
                    {modeCards.find((m) => m.mode === formData.preparationMode)?.title}
                  </strong>
                </span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-subtle transition"
                >
                  <span>Continue to Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ════ STEP 2: ACADEMIC DETAILS ════ */}
          {step === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              {/* 2A: Engineering */}
              {formData.preparationMode === 'ENGINEERING' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-border shadow-subtle">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        University
                      </label>
                      <select
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="JNTUH">JNTU Hyderabad (JNTUH)</option>
                        <option value="JNTUK">JNTU Kakinada (JNTUK)</option>
                        <option value="Anna University">Anna University</option>
                        <option value="VTU">VTU Belagavi</option>
                        <option value="Autonomous">Autonomous Engineering College</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        College Name
                      </label>
                      <input
                        type="text"
                        name="schoolCollege"
                        value={formData.schoolCollege}
                        onChange={handleChange}
                        placeholder="e.g. Narsimha Reddy Engineering College"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main focus:ring-1 focus:ring-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Grouped Branch Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                      Engineering Branch (30+ Supported)
                    </label>
                    <select
                      name="branchId"
                      value={formData.branchId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <optgroup key={cat} label={`── ${cat} Engineering ──`}>
                          {BRANCH_CATALOG.filter((b) => b.category === cat).map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.name} ({b.shortName})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {formData.branchId === 'other' && (
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <label className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1">
                        Specify Your Branch Name
                      </label>
                      <input
                        type="text"
                        name="customBranch"
                        value={formData.customBranch}
                        onChange={handleChange}
                        placeholder="Type branch name..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg text-main"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Regulation
                      </label>
                      <select
                        name="regulation"
                        value={formData.regulation}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="R25">R25 (Latest)</option>
                        <option value="R22">R22</option>
                        <option value="NR25">NR25</option>
                        <option value="R21">R21</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Academic Year
                      </label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Semester
                      </label>
                      <select
                        name="semester"
                        value={formData.semester}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2B: JEE */}
              {formData.preparationMode === 'JEE' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-border shadow-subtle">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Target Exam
                      </label>
                      <select
                        name="targetExam"
                        value={formData.targetExam}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="JEE Main & Advanced">JEE Main & Advanced</option>
                        <option value="JEE Main Only">JEE Main Only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Target Exam Year
                      </label>
                      <select
                        name="targetExamYear"
                        value={formData.targetExamYear}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                      Current Class / Prep Level
                    </label>
                    <select
                      name="currentClass"
                      value={formData.currentClass}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="11th Standard">Class 11 (Foundations)</option>
                      <option value="12th Standard">Class 12 (Boards + Advanced)</option>
                      <option value="Dropper">Dropper / Full Repeat Year</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 2C: School */}
              {formData.preparationMode === 'SCHOOL' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-border shadow-subtle">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Board of Education
                      </label>
                      <select
                        name="board"
                        value={formData.board}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="CBSE">CBSE (Central Board)</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="State Board">State Board</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                        Class / Standard
                      </label>
                      <select
                        name="currentClass"
                        value={formData.currentClass}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                      >
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10 (Board Year)</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12 (Board Year)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* 2D: Skill */}
              {formData.preparationMode === 'SKILL' && (
                <div className="space-y-4 bg-white p-5 rounded-2xl border border-border shadow-subtle">
                  <div>
                    <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                      Choose Your Core Skill Track
                    </label>
                    <select
                      name="selectedSkill"
                      value={formData.selectedSkill}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-lg text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                    >
                      <option value="Python">Python Programming (Beginner to Pro)</option>
                      <option value="Java">Java & Object-Oriented Design</option>
                      <option value="JavaScript">Full-Stack JavaScript (React / Node)</option>
                      <option value="DSA">Data Structures & Algorithms</option>
                      <option value="AI & ML">AI, Machine Learning & Deep Learning</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-subtle hover:text-main bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Goals</span>
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-subtle transition"
                >
                  <span>Continue to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* ════ STEP 3: ACCOUNT & CREDENTIALS ════ */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-5 rounded-2xl border border-border shadow-subtle">
              <div>
                <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nikhil Sharma"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-main focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nikhil@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-main focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 text-xs bg-slate-50 border border-border rounded-xl text-main focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                    Daily Study Target
                  </label>
                  <select
                    name="dailyStudyMinutes"
                    value={formData.dailyStudyMinutes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main font-medium focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value={45}>45 mins / day</option>
                    <option value={90}>90 mins / day</option>
                    <option value={150}>2.5 hrs / day</option>
                    <option value={240}>4 hrs / day</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-main uppercase tracking-wider mb-1">
                    Student Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min={12}
                    max={65}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-border rounded-xl text-main focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-subtle hover:text-main bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-700 shadow-subtle transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete & Launch Dashboard</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Bottom link to Login */}
          <div className="mt-6 text-center text-xs text-subtle">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-primary hover:underline">
              Sign in to your learning path →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
