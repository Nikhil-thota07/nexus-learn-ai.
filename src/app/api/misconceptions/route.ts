import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || undefined;

  const misconceptions = await db.misconception.findMany({
    where: {
      studentId: session.id,
      status: status || undefined,
    },
  });

  const enriched = misconceptions.map((m) => {
    const concept = CONCEPTS.find((c) => c.id === m.conceptId);
    return {
      ...m,
      conceptTitle: concept?.title || m.conceptId,
      trackName: concept?.trackName || 'General',
      module: concept?.module || 'Module',
    };
  });

  return NextResponse.json({ misconceptions: enriched });
}
