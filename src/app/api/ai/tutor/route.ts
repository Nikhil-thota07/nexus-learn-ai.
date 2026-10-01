import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { executeTutorQuery } from '@/services/ai/tutorService';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const questionText = body.question || body.message;

    if (!questionText || typeof questionText !== 'string') {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const response = await executeTutorQuery({
      studentId: session.id,
      question: questionText,
      conceptId: body.conceptId,
      isSocraticMode: Boolean(body.isSocraticMode),
    });

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (err: any) {
    console.error('AI Tutor API error:', err);
    return NextResponse.json({ error: err.message || 'Tutor query failed' }, { status: 500 });
  }
}
