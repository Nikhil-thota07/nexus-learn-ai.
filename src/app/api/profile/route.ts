import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });
  const user = await db.user.findUnique({ where: { id: session.id } });

  return NextResponse.json({
    user,
    profile,
  });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, avatar, age, dob, ...profileData } = body;

    // Update user personal info
    if (name || avatar || age || dob) {
      await db.user.update({
        where: { id: session.id },
        data: {
          ...(name ? { name } : {}),
          ...(avatar ? { avatar } : {}),
          ...(age !== undefined ? { age: Number(age) } : {}),
          ...(dob ? { dob } : {}),
        },
      });
    }

    // Update student profile
    const updatedProfile = await db.studentProfile.upsert({
      where: { userId: session.id },
      update: {
        ...profileData,
        dailyStudyMinutes: profileData.dailyStudyMinutes ? Number(profileData.dailyStudyMinutes) : undefined,
      },
      create: {
        userId: session.id,
        ...profileData,
        dailyStudyMinutes: profileData.dailyStudyMinutes ? Number(profileData.dailyStudyMinutes) : 90,
      },
    });

    const updatedUser = await db.user.findUnique({ where: { id: session.id } });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      profile: updatedProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update profile' }, { status: 500 });
  }
}
