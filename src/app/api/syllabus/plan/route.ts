import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { StudentContextService } from '@/services/context/StudentContextService';
import { StudyPlannerService } from '@/services/syllabus/StudyPlannerService';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const year = searchParams.get('year') || undefined;
  const semester = searchParams.get('semester') || undefined;

  try {
    const context = await StudentContextService.getStudentContext(session.id, {
      year,
      semester,
    });
    return NextResponse.json({
      success: true,
      context: {
        university: context.university,
        regulation: context.regulation,
        branch: context.branch,
        branchName: context.branchName,
        year: context.year,
        semester: context.semester,
        preparationMode: context.preparationMode,
        target: context.target,
        availableTime: context.availableTime,
        subjects: context.subjects,
        weakAreasCount: context.weakAreas.length,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { subject, target, weeks = 2, dailyHours, year, semester } = body;

    const context = await StudentContextService.getStudentContext(session.id, {
      subjectIdOrName: subject,
      year,
      semester,
    });

    const plan = StudyPlannerService.generatePlan({
      subjectQuery: subject || context.subjects[0]?.name || 'Mathematics',
      target: target || context.target || '9 CGPA',
      weeks: Number(weeks) || 2,
      dailyStudyHours: dailyHours ? Number(dailyHours) : undefined,
      context,
    });

    return NextResponse.json({
      success: true,
      plan,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to synthesize prioritized study plan' },
      { status: 500 }
    );
  }
}
