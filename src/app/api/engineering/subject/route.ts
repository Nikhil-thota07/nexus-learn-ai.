import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { StudentContextService } from '@/services/context/StudentContextService';
import { SyllabusService } from '@/services/syllabus/SyllabusService';
import { QuestionService } from '@/services/questions/QuestionService';
import { db } from '@/lib/db';
import { calculateUpdatedMastery } from '@/lib/adaptive/engine';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const codeOrId = searchParams.get('code') || searchParams.get('id') || '';
  const yearParam = searchParams.get('year') || undefined;
  const semesterParam = searchParams.get('semester') || undefined;
  const branchParam = searchParams.get('branch') || undefined;
  const regulationParam = searchParams.get('regulation') || undefined;
  const universityParam = searchParams.get('university') || undefined;
  const collegeParam = searchParams.get('college') || undefined;

  try {
    const context = await StudentContextService.getStudentContext(session.id, {
      subjectIdOrName: codeOrId,
      year: yearParam,
      semester: semesterParam,
      branchId: branchParam,
      regulation: regulationParam,
      university: universityParam,
      college: collegeParam,
    });

    if (!context.authoritativeSyllabus || !context.authoritativeSyllabus.subjects || context.authoritativeSyllabus.subjects.length === 0) {
      return NextResponse.json({
        success: false,
        syllabusNotAvailable: true,
        message: 'Official syllabus not yet available in the system for this academic combination.',
        university: context.university,
        college: context.institution,
        regulation: context.regulation,
        branch: context.branchName,
        year: context.year,
        semester: context.semester,
        syllabus: null,
        allSubjects: [],
        subject: null,
        questionGroups: [],
        context: {
          weakAreas: context.weakAreas,
          confidence: context.confidence,
          target: context.target,
          year: context.year,
          semester: context.semester,
        },
      });
    }

    const subject =
      (codeOrId ? SyllabusService.getSubjectByCodeOrName(codeOrId, context) : null) ||
      (context.authoritativeSyllabus?.subjects[0] as any);
    if (!subject) {
      return NextResponse.json({ error: 'Subject not found in authoritative syllabus' }, { status: 404 });
    }

    const questionGroups = await QuestionService.getImportantQuestionsForSubject(subject.id, context);

    return NextResponse.json({
      success: true,
      syllabus: context.authoritativeSyllabus,
      allSubjects: context.authoritativeSyllabus?.subjects || [],
      subject: {
        id: subject.id,
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        category: subject.category,
        isLab: subject.isLab,
        programmingLanguage: subject.programmingLanguage,
        university: context.university,
        regulation: context.regulation,
        branch: context.branchName,
        year: context.year,
        semester: context.semester,
        units: subject.units || [],
      },
      questionGroups,
      context: {
        weakAreas: context.weakAreas,
        confidence: context.confidence,
        target: context.target,
        year: context.year,
        semester: context.semester,
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
    const { questionId, conceptId = 'pps-pointers', studentAnswer, confidenceScore = 80, timeSpentSeconds = 60 } = body;

    if (!studentAnswer || studentAnswer.trim().length < 5) {
      return NextResponse.json({ error: 'Answer must not be empty' }, { status: 400 });
    }

    // Record Attempt in DB
    await db.attempt.create({
      studentId: session.id,
      conceptId,
      questionId: questionId || 'q-manual',
      questionText: `Important Question Practice: ${questionId}`,
      selectedAnswer: studentAnswer.substring(0, 300),
      correctAnswer: 'Verified Syllabus Answer Structure',
      isCorrect: true,
      confidenceScore: Number(confidenceScore),
      timeSpentSeconds: Number(timeSpentSeconds),
      detectedMisconception: null,
    });

    // Update Knowledge State in DB
    const existing = await db.knowledgeState.findUnique({
      where: {
        studentId_conceptId: {
          studentId: session.id,
          conceptId,
        },
      },
    });

    const previousState = existing || {
      id: `k_${Date.now()}`,
      studentId: session.id,
      conceptId,
      masteryScore: 40,
      accuracy: 60,
      confidence: confidenceScore,
      attempts: 0,
      correctAttempts: 0,
      incorrectAttempts: 0,
      averageTimeSeconds: 45,
      difficulty: 0.5,
      misconceptionRisk: 0.2,
      improvementRate: 0.1,
      status: 'LEARNING' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = calculateUpdatedMastery({
      currentMastery: previousState.masteryScore,
      totalAttempts: previousState.attempts,
      correctAttempts: previousState.correctAttempts,
      latestIsCorrect: true,
      latestConfidence: Number(confidenceScore),
      conceptDifficulty: previousState.difficulty * 5, // normalise 0-1 → 1-5
      timeSpentSeconds: Number(timeSpentSeconds),
    });

    const newAttempts = previousState.attempts + 1;
    const newCorrectAttempts = previousState.correctAttempts + 1;

    const upsertData = {
      studentId: session.id,
      conceptId,
      masteryScore: updated.newMastery,
      accuracy: updated.newAccuracy,
      confidence: updated.newConfidence,
      attempts: newAttempts,
      correctAttempts: newCorrectAttempts,
      incorrectAttempts: previousState.incorrectAttempts,
      averageTimeSeconds: Math.round(
        (previousState.averageTimeSeconds * previousState.attempts + Number(timeSpentSeconds)) / newAttempts
      ),
      difficulty: previousState.difficulty,
      misconceptionRisk: updated.misconceptionRisk,
      improvementRate: previousState.improvementRate,
      status: updated.status,
      lastAssessedAt: new Date().toISOString(),
    };

    await db.knowledgeState.upsert({
      where: {
        studentId_conceptId: {
          studentId: session.id,
          conceptId,
        },
      },
      create: upsertData,
      update: upsertData,
    });

    return NextResponse.json({
      success: true,
      updatedMastery: updated.newMastery,
      status: updated.status,
      feedback: 'Answer submitted successfully. Your mastery and knowledge state have been updated.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
