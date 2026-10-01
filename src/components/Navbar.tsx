'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BrainCircuit,
  Compass,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  User,
  Sparkles,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Cpu,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [activeMiscCount, setActiveMiscCount] = useState(0);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});

    // Check active misconceptions count
    fetch('/api/misconceptions?status=ACTIVE')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.misconceptions) {
          setActiveMiscCount(data.misconceptions.length);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      router.push('/login');
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/tutor', label: 'AI Tutor', icon: BrainCircuit, badge: 'Live', badgeColor: 'bg-indigo-100 text-indigo-800' },
    { href: '/roadmap', label: 'Roadmap', icon: Compass },
    {
      href: '/misconceptions',
      label: 'Misconceptions',
      icon: AlertTriangle,
      badge: activeMiscCount > 0 ? `${activeMiscCount} active` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    { href: '/syllabus', label: 'Syllabus AI', icon: BookOpen },
    { href: '/engineering', label: 'Engineering', icon: Cpu },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/career', label: 'Career Paths', icon: Sparkles },
  ];

  const isAuthPage =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition shrink-0">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex flex-col shrink-0 justify-center">
                <span className="font-bold text-lg text-main tracking-tight leading-snug whitespace-nowrap select-none">
                  Nexus Learn AI
                </span>
                <span className="text-[11px] text-subtle font-medium leading-normal whitespace-nowrap hidden sm:block">
                  Your learning path should know you.
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 xl:px-3 py-2 rounded-lg text-xs xl:text-sm font-medium transition shrink-0 ${
                    isActive
                      ? 'bg-primary-50 text-primary font-semibold'
                      : 'text-subtle hover:text-main hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] xl:text-[10px] px-1.5 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/misconceptions"
                  className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition group ${
                    activeMiscCount > 0
                      ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  }`}
                  title="Pedagogical Misconceptions Tracker"
                >
                  <AlertTriangle className={`w-3.5 h-3.5 group-hover:scale-110 transition ${activeMiscCount > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} />
                  <span>{activeMiscCount > 0 ? `${activeMiscCount} Misconception${activeMiscCount > 1 ? 's' : ''}` : '0 Misconceptions'}</span>
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-border hover:bg-slate-50 transition"
                  title="Edit Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-100 text-primary flex items-center justify-center font-bold text-xs">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-xs font-semibold text-main hidden md:inline">
                    {user.name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-subtle hover:text-danger hover:bg-red-50 rounded-lg transition"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-sm font-semibold text-main hover:text-primary transition"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary-700 rounded-lg shadow-sm transition"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="lg:hidden border-t border-border overflow-x-auto py-1 px-4 flex items-center gap-2 bg-slate-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs whitespace-nowrap ${
                isActive ? 'bg-primary text-white font-semibold' : 'text-subtle hover:text-main'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
