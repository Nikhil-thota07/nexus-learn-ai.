import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { StudentContextService } from '@/services/context/StudentContextService';
import { ConceptService } from '@/services/concept/ConceptService';

export async function GET(
  req: NextRequest,
  { params }: { params: { conceptId: string } }
) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { conceptId } = params;
  if (!conceptId) {
    return NextResponse.json({ error: 'Concept ID is required' }, { status: 400 });
  }

  try {
    const context = await StudentContextService.getStudentContext(session.id);
    const conceptDetail = await ConceptService.getConcept(conceptId, context);

    return NextResponse.json({
      success: true,
      concept: conceptDetail,
    });
  } catch (err: any) {
    console.error('Concept route error:', err);
    return NextResponse.json({ error: err.message || 'Failed to resolve concept' }, { status: 500 });
  }
}
