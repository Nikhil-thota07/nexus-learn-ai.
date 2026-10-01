import { NextRequest, NextResponse } from 'next/server';
import { resolveCollege, normalizeCollegeDomain } from '@/lib/college/collegeService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || searchParams.get('domain') || searchParams.get('name') || '';

  const result = resolveCollege(query);
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body.query || body.domain || body.college || body.name || '';

    const result = resolveCollege(query);
    return NextResponse.json(result);
  } catch (err: any) {
    // Unknown input must never cause 500 error
    return NextResponse.json({
      success: true,
      status: 'UNVERIFIED',
      college: null,
      message: 'College could not be automatically verified. You can continue by providing the university or uploading your syllabus.',
    });
  }
}
