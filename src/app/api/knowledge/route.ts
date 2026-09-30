import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';
import { getConfidenceCalibration } from '@/lib/adaptive/engine';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const knowledgeList = await db.knowledgeState.findMany({ where: { studentId: session.id } });
  const attempts = await db.assessmentAttempt.findMany({ where: { studentId: session.id } });
  const calibration = getConfidenceCalibration(knowledgeList);

  const enrichedKnowledge = knowledgeList.map((k) => {
    const concept = CONCEPTS.find((c) => c.id === k.conceptId);
    return {
      ...k,
      conceptTitle: concept?.title || k.conceptId,
      track: concept?.track || 'python',
      trackName: concept?.trackName || 'General',
      module: concept?.module || 'Module',
      difficulty: concept?.difficulty || 2,
      masteryThreshold: concept?.masteryThreshold || 75,
      prerequisites: concept?.prerequisiteIds || [],
    };
  });

  return NextResponse.json({
    knowledge: enrichedKnowledge,
    calibration,
    recentAttempts: attempts.slice(-10).reverse(),
  });
}
