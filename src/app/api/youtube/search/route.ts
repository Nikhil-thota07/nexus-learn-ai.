import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { searchEducationalVideos } from '@/lib/youtube/service';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || 'python functions educational';
  const conceptId = searchParams.get('conceptId') || undefined;

  const videos = await searchEducationalVideos(q, conceptId);
  return NextResponse.json({ videos });
}
