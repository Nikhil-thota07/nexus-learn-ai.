import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.studentProfile.findUnique({ where: { userId: session.id } });

    return NextResponse.json({
      user: session,
      profile,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to retrieve session' }, { status: 500 });
  }
}
