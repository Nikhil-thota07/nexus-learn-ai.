import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { misconceptionId } = await req.json();

    const misc = await db.misconception.update({
      where: { id: misconceptionId },
      data: {
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
      },
    });

    // Also boost knowledge state for that concept
    const currentK = await db.knowledgeState.findUnique({
      where: {
        studentId_conceptId: {
          studentId: session.id,
          conceptId: misc.conceptId,
        },
      },
    });

    if (currentK) {
      const boostedMastery = Math.min(100, Math.max(65, currentK.masteryScore + 25));
      await db.knowledgeState.upsert({
        where: {
          studentId_conceptId: {
            studentId: session.id,
            conceptId: misc.conceptId,
          },
        },
        update: {
          masteryScore: boostedMastery,
          misconceptionRisk: 0.1,
          status: boostedMastery >= 75 ? 'MASTERED' : 'LEARNING',
          updatedAt: new Date().toISOString(),
        },
        create: {
          studentId: session.id,
          conceptId: misc.conceptId,
          masteryScore: boostedMastery,
          accuracy: 75,
          confidence: 70,
          attempts: 1,
          correctAttempts: 1,
          incorrectAttempts: 0,
          averageTimeSeconds: 30,
          difficulty: 2,
          misconceptionRisk: 0.1,
          improvementRate: 0.3,
          status: 'LEARNING',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Misconception marked as resolved. Learning path and prerequisites updated.',
      misconception: misc,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to resolve misconception' }, { status: 500 });
  }
}
