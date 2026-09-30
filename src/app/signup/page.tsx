'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BrainCircuit, CheckCircle2, ArrowRight, User, BookOpen, Target, Sparkles, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: 'Nikhil Sharma',
    email: 'nikhil@nexuslearn.ai',
    password: 'password123',
    age: 20,
    dob: '2004-05-14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',

    // Step 2: Education
    educationLevel: 'B.Tech',
    qualification: 'Undergraduate',
    schoolCollege: 'National Institute of Technology',
    university: 'Technical University',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    semester: 'Semester 5',
    regulation: 'R21',
    subjects: 'Data Structures, Operating Systems, Computer Networks, Database Management Systems',

    // Step 3: Goals & Learning Preferences
    careerInterests: 'AI Engineer, High Frequency Systems, Full Stack Architect',
    targetExam: 'GATE CS & Big Tech Software Engineering Placements',
    preferredLanguage: 'English',
    dailyStudyMinutes: 90,
    preferredStyle: 'visual',
    difficulty: 'adaptive',
    videoPreference: 'concise',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'dailyStudyMinutes' ? Number(value) : value,
    }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill in your name, email, and password.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-card border border-border p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-main tracking-tight">Nexus Learn AI</span>
          </Link>
          <h2 className="text-xl font-bold text-main">Create Your Student Account</h2>
          <p className="text-sm text-subtle mt-1">
            "Your learning path should know you." Complete your learning profile.
          </p>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
              step === 1
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border text-subtle bg-slate-50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Personal</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
              step === 2
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border text-subtle bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>2. Education</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition ${
              step === 3
                ? 'border-primary bg-primary-50 text-primary'
                : 'border-border text-subtle bg-slate-50'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>3. Goals & Prefs</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? handleSubmit : handleNext} className="space-y-5">
          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Nikhil Sharma"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="nikhil@nexuslearn.ai"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
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
                    min={12}
                    max={99}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
                >
                  <span>Continue to Education</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Education Level
                  </label>
                  <select
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  >
                    <option value="High School">High School (11th/12th / JEE)</option>
                    <option value="B.Tech">B.Tech / B.E. (Engineering)</option>
                    <option value="Undergraduate">Undergraduate (B.Sc / BCA)</option>
                    <option value="Postgraduate">Postgraduate (M.Tech / MCA)</option>
                    <option value="Self-Taught">Self-Taught / Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Branch / Major
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    School / College
                  </label>
                  <input
                    type="text"
                    name="schoolCollege"
                    value={formData.schoolCollege}
                    onChange={handleChange}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    University / Board
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    placeholder="e.g. Technical University / CBSE"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="3rd Year"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Semester
                  </label>
                  <input
                    type="text"
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    placeholder="Semester 5"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Regulation
                  </label>
                  <input
                    type="text"
                    name="regulation"
                    value={formData.regulation}
                    onChange={handleChange}
                    placeholder="R21"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Current Key Subjects
                </label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleChange}
                  placeholder="Data Structures, OS, DBMS, Python, Mechanics"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-sm font-semibold text-subtle hover:text-main"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition"
                >
                  <span>Continue to Goals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: GOALS & PREFERENCES */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                  Career Interests & Targets
                </label>
                <input
                  type="text"
                  name="careerInterests"
                  value={formData.careerInterests}
                  onChange={handleChange}
                  placeholder="AI Engineer, Full-Stack Architect, Research"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Target Exam / Milestone
                  </label>
                  <input
                    type="text"
                    name="targetExam"
                    value={formData.targetExam}
                    onChange={handleChange}
                    placeholder="JEE Advanced / GATE / Placements"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Daily Study Commitment (Minutes)
                  </label>
                  <input
                    type="number"
                    name="dailyStudyMinutes"
                    value={formData.dailyStudyMinutes}
                    onChange={handleChange}
                    min={15}
                    max={480}
                    step={15}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Explanation Style
                  </label>
                  <select
                    name="preferredStyle"
                    value={formData.preferredStyle}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  >
                    <option value="visual">Visual & Interactive</option>
                    <option value="conceptual">First-Principles Rigorous</option>
                    <option value="hands-on">Hands-On Code First</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Difficulty Mode
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  >
                    <option value="adaptive">Dynamic Adaptive (Recommended)</option>
                    <option value="beginner">Beginner Friendly</option>
                    <option value="advanced">Rigorous Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                    Video Preference
                  </label>
                  <select
                    name="videoPreference"
                    value={formData.videoPreference}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-main"
                  >
                    <option value="concise">Concise & Direct</option>
                    <option value="deep-dive">In-Depth Masterclass</option>
                    <option value="animated">Visual / Animated</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-sm font-semibold text-subtle hover:text-main"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initializing Knowledge Graph...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup & Enter Dashboard</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-subtle">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
