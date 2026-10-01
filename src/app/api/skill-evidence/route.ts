import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const evidence = await db.skillEvidence.findMany({ where: { studentId: session.id } });
  const certificates = await db.certificate.findMany({ where: { studentId: session.id } });
  const linkedin = await db.linkedinProfile.findFirst({ where: { studentId: session.id } });
  return NextResponse.json({ evidence, certificates, linkedin });
}
