import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { determineNextBestAction } from '@/lib/adaptive/engine';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const track = searchParams.get('track') || 'python';

  const nextAction = await determineNextBestAction(session.id, track);
  return NextResponse.json({ nextAction });
}
