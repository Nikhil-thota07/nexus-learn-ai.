import React from 'react';
import Link from 'next/link';
import {
  BrainCircuit,
  ArrowRight,
  Sparkles,
  Compass,
  AlertTriangle,
  PlayCircle,
  BarChart3,
  CheckCircle2,
  GraduationCap,
  Cpu,
  Zap,
  Target,
  BookOpen,
  TrendingUp,
  Shield,
  Users,
  Star,
  ChevronRight,
  Brain,
  Layers,
  Award,
} from 'lucide-react';

export default function LandingPage() {
  const stats = [
    { value: '4', label: 'Learning Modes', sub: 'JEE, B.Tech, School, Skill' },
    { value: '30+', label: 'Engineering Branches', sub: 'All major disciplines' },
    { value: 'Real-time', label: 'AI Adaptation', sub: 'Gemini + OpenAI powered' },
    { value: '100%', label: 'Personalized', sub: 'Your exact syllabus' },
  ];

  const features = [
    {
      icon: Brain,
      color: 'bg-blue-50 text-blue-600',
      title: 'Knowledge State Engine',
      description:
        'Bayesian mastery modeling tracks what you know, what you don\'t, and how confident you are — updated after every single answer.',
    },
    {
      icon: AlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      title: 'Misconception Detection',
      description:
        'Precisely identifies conceptual errors like confusing return with print(). Not "Python is weak" — but the exact mistake.',
    },
    {
      icon: Compass,
      color: 'bg-indigo-50 text-indigo-600',
      title: 'Prerequisite DAG Gating',
      description:
        'Strict topological graph ensures you never hit advanced concepts before cementing the foundations they depend on.',
    },
    {
      icon: PlayCircle,
      color: 'bg-rose-50 text-rose-600',
      title: 'YouTube Video Remediation',
      description:
        'Searches YouTube Data API v3 for videos targeting your exact weakness. Curated, cached, and matched to your misconception.',
    },
    {
      icon: BarChart3,
      color: 'bg-teal-50 text-teal-600',
      title: 'Metacognitive Calibration',
      description:
        'Maps confidence vs accuracy into 4 quadrants — Overconfidence, Underconfidence, Strong Mastery, Genuine Gap.',
    },
    {
      icon: Layers,
      color: 'bg-purple-50 text-purple-600',
      title: 'Authoritative Syllabi',
      description:
        'JNTUH R25 syllabi with every subject, unit, and concept for your branch and semester — not generic content.',
    },
  ];

  const modes = [
    {
      icon: GraduationCap,
      gradient: 'from-blue-500 to-indigo-600',
      badge: 'JEE Mode',
      badgeColor: 'bg-blue-100 text-blue-700',
      title: 'JEE Preparation',
      desc: 'Physics, Chemistry, Mathematics with trap-detection, misconception probing, and concept-level video remediation for JEE Main & Advanced.',
      features: ['Newton\'s law trap questions', 'Mole concept deep-dive', 'Quadratic & Calculus tracks'],
    },
    {
      icon: Cpu,
      gradient: 'from-indigo-500 to-purple-600',
      badge: 'Engineering Mode',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      title: 'B.Tech Engineering',
      desc: 'University-specific semester syllabus (JNTUH R25), branch-aware curriculum, lab tracking, and a personalized study plan.',
      features: ['30+ branches supported', 'Semester & regulation aware', 'Subject-level AI tutor'],
    },
    {
      icon: BookOpen,
      gradient: 'from-teal-500 to-emerald-600',
      badge: 'School Mode',
      badgeColor: 'bg-teal-100 text-teal-700',
      title: 'School Student',
      desc: 'CBSE, ICSE, or State Board. Class 9–12 adaptive path with board exam focus and topic-level misconception tracking.',
      features: ['CBSE / ICSE / State boards', 'Class 9–12 curriculum', 'Exam-ready practice'],
    },
    {
      icon: Sparkles,
      gradient: 'from-orange-500 to-rose-500',
      badge: 'Skill Mode',
      badgeColor: 'bg-orange-100 text-orange-700',
      title: 'Skill Learning',
      desc: 'Python, JavaScript, ML, DSA, or any domain skill. AI-curated path from beginner to proficiency with project checkpoints.',
      features: ['Python, JS, ML, DSA', 'Project-based milestones', 'Industry-ready portfolio'],
    },
  ];

  const steps = [
    { n: '01', icon: Target, title: 'Choose Your Mode', desc: 'JEE, B.Tech, School, or Skill learning — set up in 60 seconds.' },
    { n: '02', icon: Brain, title: 'AI Builds Your Path', desc: 'Your syllabus, branch, semester, and knowledge state load instantly.' },
    { n: '03', icon: TrendingUp, title: 'Learn & Get Diagnosed', desc: 'Answer questions. The system detects misconceptions in real-time.' },
    { n: '04', icon: Award, title: 'Watch, Practice, Unlock', desc: 'Targeted videos → post-assessment → mastery update → next concept unlocked.' },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative bg-white overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.06),rgba(255,255,255,0))]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-50/80 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-50/60 to-transparent rounded-full translate-y-20 -translate-x-20" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary text-xs font-bold mb-8 shadow-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Personalized Learning Path Optimizer</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-main tracking-tight leading-[1.1]">
              Your learning path{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                should know you.
              </span>
            </h1>

            <p className="mt-7 text-lg sm:text-xl text-subtle leading-relaxed max-w-2xl mx-auto">
              Nexus Learn AI continuously models what you know, what you misunderstand, and how
              confident you are — then adapts your entire learning path in real time.
            </p>

            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-primary text-white font-bold text-base rounded-xl hover:bg-primary-700 shadow-lg hover:shadow-hover transition-all duration-200"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border border-border text-main font-semibold text-base rounded-xl hover:bg-slate-50 hover:border-slate-300 transition shadow-subtle"
              >
                <span>Sign In</span>
                <ChevronRight className="w-4 h-4 text-subtle" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-subtle font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Secure & private
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Ready in 60 seconds
              </span>
            </div>
          </div>

          {/* ── COMPARISON CARD ── */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-border shadow-card overflow-hidden bg-white">
            <div className="bg-slate-50 border-b border-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono text-subtle font-medium">
                  Adaptive Feedback Loop — Python: Return Values (31% mastery)
                </span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                ⚠ Misconception Detected
              </span>
            </div>

            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-xl border border-red-200 bg-red-50/40">
                <div className="flex items-center gap-2 font-bold text-sm text-red-700 mb-3">
                  <span>❌</span> Traditional EdTech
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-100 text-sm text-slate-700 font-medium italic">
                  "Your Python score is 31%. Please rewatch all 12 hours of Python for Beginners."
                </div>
                <p className="text-xs text-red-500 mt-3 font-medium">
                  Frustrating, demotivating, and wastes hours of study time.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-700 mb-3">
                  <span>✨</span> Nexus Learn AI
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-100 text-sm text-main font-medium">
                  "You understand how to define and call functions, but you are confusing{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-primary font-mono font-bold text-xs">
                    return
                  </code>{' '}
                  with{' '}
                  <code className="bg-slate-100 px-1 py-0.5 rounded text-secondary font-mono font-bold text-xs">
                    print()
                  </code>
                  ."
                </div>
                <p className="text-xs text-emerald-700 mt-3 font-semibold">
                  Explains → curated 12-min video → practice → recalibrates path in 8 minutes.
                </p>
              </div>
            </div>

            <div className="border-t border-border px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Pinpoint Error', 'YouTube Lesson', 'Post-Assessment', 'Unlock Next'].map(
                (step, i) => (
                  <div key={step} className="text-center p-3 rounded-lg bg-slate-50">
                    <div
                      className={`text-xs font-bold mb-0.5 ${
                        ['text-primary', 'text-secondary', 'text-accent', 'text-success'][i]
                      }`}
                    >
                      {i + 1}. {step}
                    </div>
                    <div className="text-[11px] text-subtle">
                      {
                        [
                          'Gap vs misconception',
                          'Targeted 12-min lesson',
                          'Confidence re-test',
                          'DAG recalculated',
                        ][i]
                      }
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold mb-0.5">{s.value}</div>
                <div className="text-sm font-semibold text-primary-100">{s.label}</div>
                <div className="text-xs text-primary-200 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-primary-50 border border-primary-100 px-3 py-1 rounded-full mb-3">
              How It Works
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main">
              From enrollment to mastery in 4 steps
            </h2>
            <p className="mt-3 text-subtle text-base max-w-xl mx-auto">
              The adaptive loop runs continuously — every answer refines your model.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="relative p-6 rounded-2xl border border-border bg-white hover:shadow-card transition-shadow"
                >
                  <div className="absolute -top-3 -left-1 text-5xl font-black text-slate-100 select-none leading-none">
                    {s.n}
                  </div>
                  <div className="relative w-11 h-11 rounded-xl bg-primary-50 text-primary flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-main text-sm mb-1.5">{s.title}</h3>
                  <p className="text-xs text-subtle leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ LEARNING MODES ═══ */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-secondary bg-secondary-50 border border-secondary-100 px-3 py-1 rounded-full mb-3">
              Learning Modes
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main">
              One platform, four powerful modes
            </h2>
            <p className="mt-3 text-subtle text-base max-w-xl mx-auto">
              Whether you're cracking JEE, grinding your B.Tech semester, acing school boards, or
              learning a new skill — Nexus Learn AI adapts completely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modes.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="bg-white rounded-2xl border border-border shadow-subtle overflow-hidden hover:shadow-card transition-shadow"
                >
                  <div className={`bg-gradient-to-r ${m.gradient} p-5 flex items-center gap-3`}>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.badgeColor} bg-white/90`}
                    >
                      {m.badge}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-main text-base mb-2">{m.title}</h3>
                    <p className="text-xs text-subtle leading-relaxed mb-4">{m.desc}</p>
                    <ul className="space-y-1.5">
                      {m.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-main font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-block text-xs font-bold uppercase tracking-widest text-accent bg-accent-50 border border-accent-100 px-3 py-1 rounded-full mb-3">
              Core Technology
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-main">
              Built for serious EdTech
            </h2>
            <p className="mt-3 text-subtle text-base max-w-xl mx-auto">
              Every feature is backed by mathematical modeling, strict data persistence, and
              pedagogically sound algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-border bg-white hover:shadow-card transition-shadow group"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-main text-base mb-2">{f.title}</h3>
                  <p className="text-sm text-subtle leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF STRIP ═══ */}
      <section className="bg-slate-50 py-12 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-subtle font-medium">
              Built for students who take their learning seriously
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "The misconception detection is incredible. It told me exactly why I was failing Newton's law questions — not just that I was wrong.",
                name: 'Arjun R.',
                meta: 'JEE Advanced Aspirant · Delhi',
              },
              {
                quote:
                  "Finally an app that knows I'm in JNTUH R25 CSE sem 1 and shows the actual PPS syllabus, not some random Python course.",
                name: 'Priya M.',
                meta: 'B.Tech CSE · Year 1 · Hyderabad',
              },
              {
                quote:
                  "The adaptive tutor actually generates working calculator code and explains every line. Better than Stack Overflow for a beginner.",
                name: 'Rahul S.',
                meta: 'Skill Learner · Python Track',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-border p-5 shadow-subtle">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-main leading-relaxed mb-4 italic">"{t.quote}"</p>
                <div>
                  <div className="font-bold text-main text-xs">{t.name}</div>
                  <div className="text-xs text-subtle">{t.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-secondary to-indigo-700 p-10 sm:p-14 text-center shadow-hover">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.08),transparent)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold mb-6">
                <Users className="w-3.5 h-3.5" />
                <span>Join thousands of students learning smarter</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                Ready to experience truly adaptive learning?
              </h2>
              <p className="text-indigo-200 text-base max-w-lg mx-auto mb-8">
                Create your profile in 60 seconds. No credit card. No generic content. Just your
                personal learning path — built around you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-slate-100 shadow transition-all"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition"
                >
                  Sign in to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
