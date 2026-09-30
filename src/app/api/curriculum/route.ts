import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAIProvider } from '@/lib/ai/provider';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { subject, targetGoal, weeks = 4 } = await req.json();

    if (!subject) {
      return NextResponse.json({ error: 'Subject is required' }, { status: 400 });
    }

    const provider = getAIProvider();
    const curriculum = await provider.generateCurriculum(
      subject,
      targetGoal || 'Comprehensive Mastery & Placement Prep',
      Number(weeks)
    );

    return NextResponse.json({
      success: true,
      curriculum,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Curriculum generation failed' }, { status: 500 });
  }
}
