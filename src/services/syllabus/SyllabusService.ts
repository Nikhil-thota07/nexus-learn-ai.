import {
  resolveAuthoritativeSyllabus,
  AuthoritativeSyllabus,
  SyllabusSubject,
  SyllabusUnit,
  AUTHORITATIVE_SYLLABI,
} from '@/data/syllabi';
import { ComprehensiveStudentContext } from '@/services/context/StudentContextService';
import { CONCEPTS } from '@/data/curriculum';

export class SyllabusService {
  /**
   * Retrieves the authoritative syllabus for a student context or specific parameters.
   */
  static getStudentSyllabus(params: {
    university?: string;
    regulation?: string;
    branch?: string;
    year?: string | number;
    semester?: string | number;
  }): AuthoritativeSyllabus | null {
    return resolveAuthoritativeSyllabus(params);
  }

  /**
   * Retrieves subjects from the student's authoritative syllabus.
   */
  static getSubjects(context: ComprehensiveStudentContext): SyllabusSubject[] {
    if (context.authoritativeSyllabus) {
      return context.authoritativeSyllabus.subjects;
    }
    const resolved = resolveAuthoritativeSyllabus({
      university: context.university,
      regulation: context.regulation,
      branch: context.branchId,
      year: context.year,
      semester: context.semester,
    });
    return resolved ? resolved.subjects : [];
  }

  /**
   * Finds a subject by its code, id, or partial name match.
   */
  static getSubjectByCodeOrName(
    query: string,
    context: ComprehensiveStudentContext
  ): SyllabusSubject | null {
    const subjects = this.getSubjects(context);
    const q = query.toLowerCase().trim();

    // 1. Exact ID
    const byId = subjects.find((s) => s.id.toLowerCase() === q);
    if (byId) return byId;

    // 2. Exact Code
    const byCode = subjects.find((s) => s.code.toLowerCase() === q);
    if (byCode) return byCode;

    // 3. Exact or Partial Name
    const byName = subjects.find((s) => s.name.toLowerCase().includes(q));
    if (byName) return byName;

    // 4. Fallback for 'mathematics' -> match math
    if (q.includes('math')) {
      const mathSub = subjects.find(
        (s) => s.name.toLowerCase().includes('mat') || s.code.startsWith('MA')
      );
      if (mathSub) return mathSub;
    }

    // 5. Fallback for 'programming' or 'c' or 'python' -> match PPS
    if (q.includes('program') || q.includes('c ') || q === 'c' || q.includes('python')) {
      const ppsSub = subjects.find(
        (s) =>
          s.name.toLowerCase().includes('program') ||
          s.code.startsWith('CS') ||
          s.programmingLanguage
      );
      if (ppsSub) return ppsSub;
    }

    // 6. Search across all authoritative syllabi if not in current semester
    for (const syl of Object.values(AUTHORITATIVE_SYLLABI) as AuthoritativeSyllabus[]) {
      const found = syl.subjects.find(
        (s: SyllabusSubject) =>
          s.id.toLowerCase() === q ||
          s.code.toLowerCase() === q ||
          s.name.toLowerCase() === q ||
          s.name.toLowerCase().includes(q) ||
          q.includes(s.name.toLowerCase()) ||
          (q.includes('matric') && s.name.toLowerCase().includes('calculus'))
      );
      if (found) return found;
    }

    return subjects[0] || null;
  }

  /**
   * Retrieves all units for a given subject.
   */
  static getUnits(subjectId: string, context: ComprehensiveStudentContext): SyllabusUnit[] {
    const subject = this.getSubjectByCodeOrName(subjectId, context);
    return subject ? subject.units : [];
  }

  /**
   * Retrieves topics for a given unit.
   */
  static getTopics(
    unitNumber: number,
    subjectId: string,
    context: ComprehensiveStudentContext
  ): string[] {
    const units = this.getUnits(subjectId, context);
    const unit = units.find((u) => u.unitNumber === unitNumber);
    return unit ? unit.topics : [];
  }

  /**
   * Retrieves concepts associated with a topic name.
   */
  static getConcepts(topicName: string, context: ComprehensiveStudentContext) {
    const subjects = this.getSubjects(context);
    const matchedConcepts: any[] = [];
    const tLower = topicName.toLowerCase();

    for (const sub of subjects) {
      for (const unit of sub.units) {
        for (const concept of unit.concepts) {
          if (
            unit.title.toLowerCase().includes(tLower) ||
            concept.title.toLowerCase().includes(tLower) ||
            concept.description.toLowerCase().includes(tLower)
          ) {
            matchedConcepts.push({
              ...concept,
              subjectName: sub.name,
              subjectCode: sub.code,
              unitNumber: unit.unitNumber,
            });
          }
        }
      }
    }

    return matchedConcepts;
  }

  /**
   * Retrieves prerequisites for a concept.
   */
  static getPrerequisites(conceptId: string) {
    const conceptDef = CONCEPTS.find((c) => c.id === conceptId);
    if (!conceptDef) return [];
    return conceptDef.prerequisiteIds.map((pid) => {
      const pDef = CONCEPTS.find((c) => c.id === pid);
      return {
        id: pid,
        title: pDef?.title || pid,
        masteryThreshold: pDef?.masteryThreshold || 75,
      };
    });
  }

  /**
   * Retrieves curated learning resources for a topic.
   */
  static getTopicResources(subjectId: string, topicName: string, context: ComprehensiveStudentContext) {
    const subject = this.getSubjectByCodeOrName(subjectId, context);
    return {
      topicName,
      subjectName: subject?.name || 'Engineering Subject',
      courseCode: subject?.code || 'CS101',
      recommendedTextbook: `${context.university} Prescribed Reference Materials & Lecture Notes for ${context.regulation}`,
      curatedVideoQuery: `${subject?.name || ''} ${topicName} ${context.university} engineering lecture`,
      suggestedHours: 4,
    };
  }
}
