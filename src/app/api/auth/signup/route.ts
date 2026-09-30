import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.number().optional().nullable(),
  dob: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  educationLevel: z.string().optional(),
  qualification: z.string().optional(),
  schoolCollege: z.string().optional(),
  university: z.string().optional(),
  branch: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
  regulation: z.string().optional(),
  subjects: z.string().optional(),
  careerInterests: z.string().optional(),
  targetExam: z.string().optional(),
  preferredLanguage: z.string().default('English'),
  dailyStudyMinutes: z.number().default(90),
  preferredStyle: z.string().default('visual'),
  difficulty: z.string().default('adaptive'),
  videoPreference: z.string().default('concise'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Validation failed' },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      password,
      age,
      dob,
      avatar,
      educationLevel,
      qualification,
      schoolCollege,
      university,
      branch,
      year,
      semester,
      regulation,
      subjects,
      careerInterests,
      targetExam,
      preferredLanguage,
      dailyStudyMinutes,
      preferredStyle,
      difficulty,
      videoPreference,
    } = parsed.data;

    // Check if user already exists
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        avatar: avatar || `https://avatar.vercel.sh/${encodeURIComponent(name)}`,
        age: age || 20,
        dob: dob || '2004-01-01',
      },
    });

    // Create student profile
    await db.studentProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        educationLevel: educationLevel || 'B.Tech',
        qualification: qualification || 'Undergraduate',
        schoolCollege: schoolCollege || 'National Institute of Technology',
        university: university || 'Technical University',
        branch: branch || 'Computer Science & Engineering',
        year: year || '3rd Year',
        semester: semester || 'Semester 5',
        regulation: regulation || 'R21',
        subjects: subjects || 'Data Structures, Operating Systems, Algorithms, Python',
        careerInterests: careerInterests || 'AI Engineer, Full-Stack Developer',
        targetExam: targetExam || 'GATE & Tech Placements',
        preferredLanguage,
        dailyStudyMinutes,
        preferredStyle,
        difficulty,
        videoPreference,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

    setAuthCookie(response, token);
    return response;
  } catch (err: any) {
    console.error('Signup error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
