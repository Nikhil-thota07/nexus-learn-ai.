import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';
import { resolveAuthoritativeSyllabus } from '@/data/syllabi';
import { findBranch } from '@/data/branches';
import { PreparationMode } from '@/types';

export interface StudentContext {
  studentId: string;
  name: string;
  preparationMode: PreparationMode;
  educationLevel: string;
  university?: string;
  college?: string;
  branch?: string;
  branchName?: string;
  regulation?: string;
  year?: string;
  semester?: string;
  targetExam?: string;
  targetExamYear?: string;
  currentClass?: string;
  board?: string;
  selectedSkill?: string;
  currentSubject?: string;
  currentTopic?: string;
  currentConcept?: {
    id: string;
    title: string;
    description: string;
    masteryScore: number;
    accuracy: number;
    confidence: number;
    status: string;
  };
  syllabusSummary?: {
    syllabusId: string;
    university: string;
    regulation: string;
    branch: string;
    subjects: { name: string; code: string; language?: string }[];
  };
  activeMisconceptions: {
    conceptId: string;
    title: string;
    description: string;
  }[];
  weakConcepts: {
    conceptId: string;
    title: string;
    masteryScore: number;
  }[];
  masteredConcepts: string[];
  preferredLanguage: string;
  dailyStudyMinutes: number;
}

/**
 * Builds a structured, complete student context for AI Tutoring & Pedagogy.
 * Automatically aggregates university, regulation, branch, syllabus, and knowledge state.
 */
export async function buildStudentContext(
  studentId: string,
  conceptId?: string
): Promise<StudentContext> {
  const user = await db.user.findUnique({ where: { id: studentId } });
  const profile = await db.studentProfile.findUnique({ where: { userId: studentId } });
  const knowledgeList = await db.knowledgeState.findMany({ where: { studentId } });
  const misconceptions = await db.misconception.findMany({ where: { studentId, status: 'ACTIVE' } });

  const preparationMode: PreparationMode = (profile?.preparationMode as PreparationMode) || 'ENGINEERING';
  const branchObj = findBranch(profile?.branchId || profile?.branch);

  // Authoritative syllabus if engineering
  let syllabusSummary: StudentContext['syllabusSummary'] = undefined;
  if (preparationMode === 'ENGINEERING') {
    const authSyllabus = resolveAuthoritativeSyllabus({
      university: profile?.university || 'JNTUH',
      regulation: profile?.regulation || 'R25',
      branch: branchObj?.id || profile?.branch || 'cse',
      year: profile?.year || '1',
      semester: profile?.semester || '1',
    });

    if (authSyllabus) {
      syllabusSummary = {
        syllabusId: authSyllabus.id,
        university: authSyllabus.university,
        regulation: authSyllabus.regulation,
        branch: authSyllabus.branchName,
        subjects: authSyllabus.subjects.map((s) => ({
          name: s.name,
          code: s.code,
          language: s.programmingLanguage,
        })),
      };
    }
  }

  // Find target concept
  const targetConceptDef = conceptId ? CONCEPTS.find((c) => c.id === conceptId) : CONCEPTS[0];
  const targetKnowledge = targetConceptDef
    ? knowledgeList.find((k) => k.conceptId === targetConceptDef.id)
    : undefined;

  const currentConcept = targetConceptDef
    ? {
        id: targetConceptDef.id,
        title: targetConceptDef.title,
        description: targetConceptDef.description,
        masteryScore: targetKnowledge?.masteryScore || 0,
        accuracy: targetKnowledge?.accuracy || 0,
        confidence: targetKnowledge?.confidence || 50,
        status: targetKnowledge?.status || 'NOT_STARTED',
      }
    : undefined;

  // Weak concepts
  const weakConcepts = knowledgeList
    .filter((k) => k.status === 'NEEDS_REVIEW' || (k.attempts > 0 && k.masteryScore < 60))
    .map((k) => {
      const def = CONCEPTS.find((c) => c.id === k.conceptId);
      return {
        conceptId: k.conceptId,
        title: def?.title || k.conceptId,
        masteryScore: k.masteryScore,
      };
    });

  // Mastered concepts
  const masteredConcepts = knowledgeList
    .filter((k) => k.status === 'MASTERED')
    .map((k) => {
      const def = CONCEPTS.find((c) => c.id === k.conceptId);
      return def?.title || k.conceptId;
    });

  return {
    studentId,
    name: user?.name || 'Student',
    preparationMode,
    educationLevel: profile?.educationLevel || 'B.Tech',
    university: profile?.university || 'JNTUH',
    college: profile?.schoolCollege || 'Narsimha Reddy Engineering College',
    branch: branchObj?.shortName || profile?.branch || 'CSE',
    branchName: branchObj?.name || profile?.branch || 'Computer Science and Engineering',
    regulation: profile?.regulation || 'R25',
    year: profile?.year || '1st Year',
    semester: profile?.semester || 'Semester 1',
    targetExam: profile?.targetExam || (preparationMode === 'JEE' ? 'JEE Main & Advanced' : undefined),
    targetExamYear: profile?.targetExamYear || '2026',
    currentClass: profile?.currentClass || (preparationMode === 'SCHOOL' ? 'Class 10' : undefined),
    board: profile?.board || 'CBSE',
    selectedSkill: profile?.selectedSkill || 'Python',
    currentSubject: profile?.currentSubjectId || (syllabusSummary?.subjects[0]?.name || 'Programming for Problem Solving'),
    currentTopic: profile?.currentTopicId || targetConceptDef?.module || 'Functions & Modularity',
    currentConcept,
    syllabusSummary,
    activeMisconceptions: misconceptions.map((m) => ({
      conceptId: m.conceptId,
      title: m.title,
      description: m.description,
    })),
    weakConcepts,
    masteredConcepts,
    preferredLanguage: profile?.preferredLanguage || 'English',
    dailyStudyMinutes: profile?.dailyStudyMinutes || 90,
  };
}
