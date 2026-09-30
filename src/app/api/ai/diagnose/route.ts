import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAIProvider } from '@/lib/ai/provider';
import { CONCEPTS } from '@/data/curriculum';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { conceptId, studentExplanation } = await req.json();

    if (!conceptId || !studentExplanation) {
      return NextResponse.json({ error: 'Concept ID and student explanation are required' }, { status: 400 });
    }

    const concept = CONCEPTS.find((c) => c.id === conceptId);
    const conceptTitle = concept?.title || 'Programming Concept';

    const provider = getAIProvider();
    const diagnosis = await provider.diagnoseMisconception(conceptTitle, studentExplanation, concept?.description);

    return NextResponse.json({
      success: true,
      provider: provider.name,
      diagnosis,
    });
  } catch (err: any) {
    console.error('AI diagnosis API error:', err);
    return NextResponse.json({ error: err.message || 'Diagnosis generation failed' }, { status: 500 });
  }
}
