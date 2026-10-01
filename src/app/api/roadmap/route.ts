import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { StudentContextService } from '@/services/context/StudentContextService';
import { RoadmapService } from '@/services/roadmap/RoadmapService';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const context = await StudentContextService.getStudentContext(session.id);
    const roadmap = RoadmapService.getPersonalizedRoadmap(context);

    return NextResponse.json({
      success: true,
      roadmap,
      context: {
        name: context.student.name,
        preparationMode: context.preparationMode,
        branchName: context.branchName,
        university: context.university,
        regulation: context.regulation,
        year: context.year,
        semester: context.semester,
        target: context.target,
        careerGoal: context.careerGoal,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
