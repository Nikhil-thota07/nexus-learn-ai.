import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { searchEducationalVideos } from '@/lib/youtube/service';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { certificateId, answers } = body;

    if (!certificateId || !answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'certificateId and answers object required' }, { status: 400 });
    }

    const cert = await db.certificate.findUnique({ where: { id: certificateId } });
    if (!cert || cert.studentId !== session.id) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    const questions = cert.diagnosticQuestions || [];
    if (questions.length === 0) {
      return NextResponse.json({ error: 'No diagnostic questions available for this certificate' }, { status: 400 });
    }

    let correctCount = 0;
    const skillScores: Record<string, { correct: number; total: number; questions: string[] }> = {};
    const questionEvaluations: Array<{
      questionId: string;
      question: string;
      selectedOption: number;
      correctOption: number;
      isCorrect: boolean;
      explanation: string;
      skillTested: string;
    }> = [];

    for (const q of questions) {
      const selectedIndex = answers[q.id];
      const isCorrect = Number(selectedIndex) === q.correctIndex;
      if (isCorrect) correctCount++;

      if (!skillScores[q.skillTested]) {
        skillScores[q.skillTested] = { correct: 0, total: 0, questions: [] };
      }
      skillScores[q.skillTested].total++;
      if (isCorrect) skillScores[q.skillTested].correct++;
      skillScores[q.skillTested].questions.push(q.question);

      questionEvaluations.push({
        questionId: q.id,
        question: q.question,
        selectedOption: Number(selectedIndex),
        correctOption: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
        skillTested: q.skillTested,
      });
    }

    const totalQuestions = questions.length;
    const scorePercent = Math.round((correctCount / totalQuestions) * 100);

    const weakAreas: string[] = [];
    const strongAreas: string[] = [];
    const assessedSkills: Array<{ skill: string; score: number; status: 'Mastered' | 'Developing' | 'Needs Review' }> = [];

    for (const [skill, stats] of Object.entries(skillScores)) {
      const skillScore = Math.round((stats.correct / stats.total) * 100);
      let status: 'Mastered' | 'Developing' | 'Needs Review' = 'Developing';

      if (skillScore >= 80) {
        status = 'Mastered';
        strongAreas.push(skill);
      } else if (skillScore < 50) {
        status = 'Needs Review';
        weakAreas.push(skill);
      } else {
        status = 'Developing';
        weakAreas.push(skill);
      }

      assessedSkills.push({ skill, score: skillScore, status });

      // Update student knowledge state in database for this skill
      const conceptSlug = `cert_${cert.detectedDomain || 'skill'}_${skill.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`.slice(0, 40);
      try {
        await db.knowledgeState.upsert({
          where: {
            studentId_conceptId: {
              studentId: session.id,
              conceptId: conceptSlug,
            },
          },
          update: {
            masteryScore: skillScore,
            accuracy: skillScore,
            confidence: Math.min(100, skillScore + 10),
            attempts: 1,
            correctAttempts: stats.correct,
            incorrectAttempts: stats.total - stats.correct,
            status: skillScore >= 80 ? 'MASTERED' : skillScore >= 50 ? 'LEARNING' : 'NEEDS_REVIEW',
            lastAssessedAt: new Date().toISOString(),
          },
          create: {
            studentId: session.id,
            conceptId: conceptSlug,
            masteryScore: skillScore,
            accuracy: skillScore,
            confidence: Math.min(100, skillScore + 10),
            attempts: 1,
            correctAttempts: stats.correct,
            incorrectAttempts: stats.total - stats.correct,
            averageTimeSeconds: 45,
            difficulty: 2,
            misconceptionRisk: skillScore < 60 ? 0.6 : 0.1,
            improvementRate: 0.25,
            status: skillScore >= 80 ? 'MASTERED' : skillScore >= 50 ? 'LEARNING' : 'NEEDS_REVIEW',
            lastAssessedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        console.warn('Could not update knowledge state for concept:', conceptSlug, err);
      }

      // Record in skill evidence
      try {
        await db.skillEvidence.create({
          data: {
            id: crypto.randomUUID(),
            studentId: session.id,
            skillName: skill,
            sourceType: 'ASSESSMENT',
            sourceId: cert.id,
            evidenceLevel: skillScore >= 80 ? 'DEMONSTRATED' : 'LEARNING',
            confidence: skillScore / 100,
            assessmentScore: skillScore,
            createdAt: new Date().toISOString(),
          },
        });
      } catch {}
    }

    // Dynamic next-skill learning path: Put weak areas first, followed by the rest of the personalizedNextSkillPath
    const baseNextPath = cert.personalizedNextSkillPath || [
      `${cert.detectedDomain || 'Domain'} Fundamentals`,
      `Core Architecture & Tools`,
      `Advanced Implementations`,
      `Production Project Deployment`,
    ];

    const updatedLearningPath = [
      ...weakAreas.map((w) => `${w} (Needs Review - Identified Gap)`),
      ...baseNextPath.filter((p) => !weakAreas.some((w) => p.toLowerCase().includes(w.toLowerCase()))),
    ].slice(0, 8);

    // Search YouTube educational videos targeting the weak areas
    let recommendedVideos: any[] = [];
    const querySkill = weakAreas[0] || cert.detectedDomain || 'Engineering';
    try {
      recommendedVideos = await searchEducationalVideos(`${querySkill} complete tutorial for beginners`);
    } catch {
      recommendedVideos = [];
    }

    const careerRoadmapNote = scorePercent >= 75
      ? `Strong validation in ${cert.detectedDomain}. Ready to advance into portfolio projects and specialized roles.`
      : `Exposure confirmed. Strengthening ${weakAreas.join(', ') || 'fundamentals'} will significantly accelerate your career readiness in ${cert.detectedDomain}.`;

    const assessmentResult = {
      assessedAt: new Date().toISOString(),
      scorePercent,
      assessedSkills,
      weakAreas,
      updatedLearningPath,
      recommendedVideos: recommendedVideos.slice(0, 4),
      careerRoadmapNote,
    };

    // Update certificate in database
    const updatedCert = await db.certificate.update({
      where: { id: cert.id },
      data: {
        verificationStatus: 'VERIFIED',
        skillsDetected: (cert.skillsDetected || []).map((s) => ({
          ...s,
          validationStatus: 'ASSESSED' as const,
        })),
        assessmentResult,
      },
    });

    return NextResponse.json({
      success: true,
      scorePercent,
      correctCount,
      totalQuestions,
      questionEvaluations,
      assessedSkills,
      weakAreas,
      strongAreas,
      updatedLearningPath,
      recommendedVideos,
      careerRoadmapNote,
      certificate: updatedCert,
      message: `Assessment evaluated! Score: ${scorePercent}%. Your skill profile, learning path, and recommendations have been calibrated.`,
    });
  } catch (err: any) {
    console.error('Certificate assessment evaluation error:', err);
    return NextResponse.json({ error: err.message || 'Failed to evaluate assessment' }, { status: 500 });
  }
}
