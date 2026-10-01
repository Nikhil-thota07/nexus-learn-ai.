import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';
import { resolveAuthoritativeSyllabus, AuthoritativeSyllabus } from '@/data/syllabi';
import { findBranch } from '@/data/branches';
import { PreparationMode } from '@/types';

export interface ComprehensiveStudentContext {
  student: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    age?: number | null;
  };
  education: string;
  preparationMode: PreparationMode;
  university: string;
  institution: string;
  regulation: string;
  branch: string;
  branchId: string;
  branchName: string;
  year: string;
  semester: string;
  syllabusId: string;
  authoritativeSyllabus: AuthoritativeSyllabus | null;
  subjects: {
    id: string;
    code: string;
    name: string;
    credits: number;
    category: string;
    isLab: boolean;
    programmingLanguage?: string;
    unitsCount: number;
  }[];
  currentSubject?: {
    id: string;
    code: string;
    name: string;
    unitsCount: number;
  };
  currentTopic?: string;
  knowledgeStates: {
    conceptId: string;
    title: string;
    masteryScore: number;
    accuracy: number;
    confidence: number;
    status: string;
    misconceptionRisk: number;
  }[];
  weakAreas: {
    conceptId: string;
    title: string;
    masteryScore: number;
    reason: string;
  }[];
  strongAreas: {
    conceptId: string;
    title: string;
    masteryScore: number;
  }[];
  misconceptions: {
    conceptId: string;
    title: string;
    description: string;
    status: string;
  }[];
  confidence: number;
  target: string;
  targetDate?: string;
  availableTime: number; // minutes per day
  careerGoal: string;
  recentActivity?: {
    lastConceptId?: string;
    lastAttemptDate?: string;
  };
}

export class StudentContextService {
  /**
   * Retrieves full unified student academic context.
   */
  static async getStudentContext(
    studentId: string,
    options?: {
      subjectIdOrName?: string;
      topicName?: string;
      year?: string | number;
      semester?: string | number;
      branchId?: string;
      regulation?: string;
      university?: string;
      college?: string;
    }
  ): Promise<ComprehensiveStudentContext> {
    const user = await db.user.findUnique({ where: { id: studentId } });
    if (!user) {
      throw new Error(`Student with id ${studentId} not found`);
    }

    const profile = await db.studentProfile.findUnique({ where: { userId: studentId } });
    const knowledgeList = await db.knowledgeState.findMany({ where: { studentId } });
    const activeMisconceptions = await db.misconception.findMany({
      where: { studentId, status: 'ACTIVE' },
    });
    const recentAttempts = await db.attempt.findMany({ where: { studentId } });

    const preparationMode: PreparationMode =
      (profile?.preparationMode as PreparationMode) || 'ENGINEERING';
    const branchCandidate = options?.branchId || profile?.branchId || profile?.branch;
    const branchObj = findBranch(branchCandidate);

    const university = options?.university || profile?.university || 'JNTUH';
    const college = options?.college || profile?.schoolCollege || undefined;
    const regulation = options?.regulation || profile?.regulation || 'R25';
    const branch = branchObj?.name || profile?.branch || 'Computer Science and Engineering';
    const branchId = branchObj?.id || 'cse';
    const year = options?.year ? String(options.year) : (profile?.year || '1st Year');
    const semester = options?.semester ? String(options.semester) : (profile?.semester || 'Semester 1');

    // Resolve Authoritative Syllabus with college priority
    const authSyllabus = resolveAuthoritativeSyllabus({
      university,
      college,
      regulation,
      branch: branchId,
      year,
      semester,
    });

    const subjects = authSyllabus
      ? authSyllabus.subjects.map((s) => ({
          id: s.id,
          code: s.code,
          name: s.name,
          credits: s.credits,
          category: s.category,
          isLab: s.isLab,
          programmingLanguage: s.programmingLanguage,
          unitsCount: s.units?.length || 0,
        }))
      : [];

    // Identify current subject
    let currentSubject: ComprehensiveStudentContext['currentSubject'] = undefined;
    if (options?.subjectIdOrName && authSyllabus) {
      const needle = options.subjectIdOrName.toLowerCase().trim();
      const matched = authSyllabus.subjects.find(
        (s) =>
          s.id.toLowerCase() === needle ||
          s.code.toLowerCase() === needle ||
          s.name.toLowerCase().includes(needle)
      );
      if (matched) {
        currentSubject = {
          id: matched.id,
          code: matched.code,
          name: matched.name,
          unitsCount: matched.units?.length || 0,
        };
      }
    } else if (subjects.length > 0) {
      currentSubject = {
        id: subjects[0].id,
        code: subjects[0].code,
        name: subjects[0].name,
        unitsCount: subjects[0].unitsCount,
      };
    }

    // Knowledge map
    const knowledgeStates = knowledgeList.map((k) => {
      const def = CONCEPTS.find((c) => c.id === k.conceptId);
      return {
        conceptId: k.conceptId,
        title: def?.title || k.conceptId,
        masteryScore: k.masteryScore,
        accuracy: k.accuracy,
        confidence: k.confidence,
        status: k.status,
        misconceptionRisk: k.misconceptionRisk,
      };
    });

    // Weak areas: mastery < 60 or status NEEDS_REVIEW or active misconception
    const weakAreas = knowledgeStates
      .filter((k) => k.status === 'NEEDS_REVIEW' || k.masteryScore < 60 || k.misconceptionRisk > 0.4)
      .map((k) => {
        const hasMisc = activeMisconceptions.some((m) => m.conceptId === k.conceptId);
        return {
          conceptId: k.conceptId,
          title: k.title,
          masteryScore: k.masteryScore,
          reason: hasMisc
            ? 'Active conceptual misconception detected'
            : k.masteryScore < 40
            ? 'Foundational knowledge gap'
            : 'Below required exam readiness threshold',
        };
      });

    // Strong areas: mastery >= 75
    const strongAreas = knowledgeStates
      .filter((k) => k.masteryScore >= 75)
      .map((k) => ({
        conceptId: k.conceptId,
        title: k.title,
        masteryScore: k.masteryScore,
      }));

    // Average confidence
    const avgConfidence =
      knowledgeStates.length > 0
        ? Math.round(
            knowledgeStates.reduce((acc, curr) => acc + curr.confidence, 0) /
              knowledgeStates.length
          )
        : 70;

    // Last attempt
    const sortedAttempts = recentAttempts.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastAttempt = sortedAttempts[0];

    return {
      student: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        age: user.age,
      },
      education: profile?.educationLevel || 'B.Tech',
      preparationMode,
      university,
      institution: profile?.schoolCollege || 'Engineering College',
      regulation,
      branch,
      branchId,
      branchName: branchObj?.name || branch,
      year,
      semester,
      syllabusId: authSyllabus?.id || `${university}-${regulation}-${branchId}-Y1-S1`,
      authoritativeSyllabus: authSyllabus,
      subjects,
      currentSubject,
      currentTopic: options?.topicName || undefined,
      knowledgeStates,
      weakAreas,
      strongAreas,
      misconceptions: activeMisconceptions.map((m) => ({
        conceptId: m.conceptId,
        title: m.title,
        description: m.description,
        status: m.status,
      })),
      confidence: avgConfidence,
      target: profile?.targetExam || profile?.primaryGoal || '9 CGPA Academic Excellence',
      targetDate: profile?.targetExamYear ? `May ${profile.targetExamYear}` : undefined,
      availableTime: profile?.dailyStudyMinutes || 120,
      careerGoal: profile?.careerInterests || 'AI Systems Engineer',
      recentActivity: lastAttempt
        ? {
            lastConceptId: lastAttempt.conceptId,
            lastAttemptDate: lastAttempt.createdAt,
          }
        : undefined,
    };
  }
}
