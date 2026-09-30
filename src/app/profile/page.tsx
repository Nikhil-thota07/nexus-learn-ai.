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
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: '',
    age: 20,
    dob: '',
    educationLevel: 'B.Tech',
    qualification: 'Undergraduate',
    schoolCollege: '',
    university: '',
    branch: '',
    year: '',
    semester: '',
    regulation: '',
    subjects: '',
    careerInterests: '',
    targetExam: '',
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
          setFormData({
            name: u.name || '',
            email: u.email || '',
            avatar: u.avatar || '',
            age: u.age || 20,
            dob: u.dob || '',
            educationLevel: p.educationLevel || 'B.Tech',
            qualification: p.qualification || '',
            schoolCollege: p.schoolCollege || '',
            university: p.university || '',
            branch: p.branch || '',
            year: p.year || '',
            semester: p.semester || '',
            regulation: p.regulation || '',
            subjects: p.subjects || '',
            careerInterests: p.careerInterests || '',
            targetExam: p.targetExam || '',
            preferredLanguage: p.preferredLanguage || 'English',
            dailyStudyMinutes: p.dailyStudyMinutes || 90,
            preferredStyle: p.preferredStyle || 'visual',
            difficulty: p.difficulty || 'adaptive',
            videoPreference: p.videoPreference || 'concise',
          });
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' || name === 'dailyStudyMinutes' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to update profile');
      setSaveSuccess(true);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-main">
            Student Profile & Personalization
          </h1>
          <p className="text-sm text-subtle mt-1">
            Section 7 &bull; Persisted in database. Your learning path continuously adapts to your background.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg animate-fade">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Profile Saved Successfully</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: PERSONAL */}
        <div className="nexus-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
            <User className="w-4 h-4 text-primary" />
            <span>1. Personal Information</span>
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: EDUCATION */}
        <div className="nexus-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span>2. Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Education Level
              </label>
              <select
                name="educationLevel"
                value={formData.educationLevel}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              >
                <option value="High School">High School (JEE / 11th-12th)</option>
                <option value="B.Tech">B.Tech / B.E. (Engineering)</option>
                <option value="Undergraduate">Undergraduate (B.Sc / BCA)</option>
                <option value="Postgraduate">Postgraduate (M.Tech / MCA)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Branch / Specialization
              </label>
              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
              Subjects Enrolled
            </label>
            <input
              type="text"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
            />
          </div>
        </div>

        {/* SECTION 3 & 4: GOALS & LEARNING PREFERENCES */}
        <div className="nexus-card p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-main flex items-center gap-2 border-b border-border pb-3">
            <Target className="w-4 h-4 text-accent" />
            <span>3. Goals & Metacognitive Preferences</span>
          </h2>

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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                step={15}
                min={15}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-main uppercase tracking-wider mb-1.5">
                Preferred Explanation Style
              </label>
              <select
                name="preferredStyle"
                value={formData.preferredStyle}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              >
                <option value="adaptive">Dynamic Adaptive</option>
                <option value="beginner">Beginner Friendly</option>
                <option value="advanced">Rigorous Advanced</option>
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
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50/50 border border-border rounded-lg text-main"
              >
                <option value="concise">Concise & Direct</option>
                <option value="deep-dive">In-Depth Masterclass</option>
                <option value="animated">Visual / Animated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-700 transition shadow-sm disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Persisting to Database...</span>
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
