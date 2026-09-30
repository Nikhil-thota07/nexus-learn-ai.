import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CONCEPTS, DIAGNOSTIC_QUESTIONS } from '@/data/curriculum';
import { calculateUpdatedMastery } from '@/lib/adaptive/engine';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      conceptId,
      questionId,
      selectedOptionIndex,
      confidenceScore, // 0 - 100
      timeSpentSeconds = 25,
    } = body;

    const concept = CONCEPTS.find((c) => c.id === conceptId);
    if (!concept) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    const question = DIAGNOSTIC_QUESTIONS.find((q) => q.id === questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const isCorrect = selectedOptionIndex === question.correctIndex;
    const selectedAnswerText = question.options[selectedOptionIndex] || '';
    const correctAnswerText = question.options[question.correctIndex] || '';

    // Check if this option is flagged as a known misconception
    let detectedMisconception: string | null = null;
    if (!isCorrect && question.misconceptionMap && question.misconceptionMap[selectedOptionIndex]) {
      detectedMisconception = question.misconceptionMap[selectedOptionIndex];
    }

    // Record assessment attempt
    await db.assessmentAttempt.create({
      data: {
        studentId: session.id,
        conceptId,
        questionId,
        questionText: question.question,
        selectedAnswer: selectedAnswerText,
        correctAnswer: correctAnswerText,
        isCorrect,
        confidenceScore: Number(confidenceScore),
        timeSpentSeconds: Number(timeSpentSeconds),
        detectedMisconception,
      },
    });

    // Fetch existing knowledge state
    const currentKnowledge = await db.knowledgeState.findUnique({
      where: {
        studentId_conceptId: {
          studentId: session.id,
          conceptId,
        },
      },
    });

    const currentMastery = currentKnowledge?.masteryScore || 0;
    const totalAttempts = currentKnowledge?.attempts || 0;
    const correctAttempts = currentKnowledge?.correctAttempts || 0;
    const incorrectAttempts = currentKnowledge?.incorrectAttempts || 0;

    // Calculate updated Bayesian/calibration mastery
    const updated = calculateUpdatedMastery({
      currentMastery,
      totalAttempts,
      correctAttempts,
      latestIsCorrect: isCorrect,
      latestConfidence: Number(confidenceScore),
      conceptDifficulty: concept.difficulty,
      timeSpentSeconds: Number(timeSpentSeconds),
    });

    // Persist knowledge state
    const savedKnowledge = await db.knowledgeState.upsert({
      where: {
        studentId_conceptId: {
          studentId: session.id,
          conceptId,
        },
      },
      update: {
        masteryScore: updated.newMastery,
        accuracy: updated.newAccuracy,
        confidence: updated.newConfidence,
        attempts: totalAttempts + 1,
        correctAttempts: isCorrect ? correctAttempts + 1 : correctAttempts,
        incorrectAttempts: !isCorrect ? incorrectAttempts + 1 : incorrectAttempts,
        misconceptionRisk: updated.misconceptionRisk,
        status: updated.status,
        lastAssessedAt: new Date().toISOString(),
      },
      create: {
        studentId: session.id,
        conceptId,
        masteryScore: updated.newMastery,
        accuracy: updated.newAccuracy,
        confidence: updated.newConfidence,
        attempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        incorrectAttempts: isCorrect ? 0 : 1,
        averageTimeSeconds: timeSpentSeconds,
        difficulty: concept.difficulty,
        misconceptionRisk: updated.misconceptionRisk,
        improvementRate: isCorrect ? 0.2 : -0.2,
        status: updated.status,
        lastAssessedAt: new Date().toISOString(),
      },
    });

    // Manage misconception record if detected
    if (detectedMisconception) {
      const existing = await db.misconception.findFirst({
        where: {
          studentId: session.id,
          conceptId,
          status: 'ACTIVE',
        },
      });

      if (!existing) {
        await db.misconception.create({
          data: {
            studentId: session.id,
            conceptId,
            title: detectedMisconception.split(':')[0] || 'Conceptual Misconception',
            description: detectedMisconception,
            evidence: `Selected distractor "${selectedAnswerText}" on question "${question.question.substring(0, 60)}..." with ${confidenceScore}% confidence.`,
            confidence: Number(confidenceScore),
            status: 'ACTIVE',
            firstDetected: new Date().toISOString(),
            lastDetected: new Date().toISOString(),
            diagnosticQuestion: question.question,
            diagnosticOptions: JSON.stringify(question.options),
            correctOption: question.correctIndex,
            explanation: question.explanation,
          },
        });
      }
    } else if (isCorrect) {
      // If student answered correctly with high confidence, check if we can resolve active misconception
      const activeMisc = await db.misconception.findFirst({
        where: {
          studentId: session.id,
          conceptId,
          status: 'ACTIVE',
        },
      });

      if (activeMisc && Number(confidenceScore) >= 70 && updated.newMastery >= 60) {
        await db.misconception.update({
          where: { id: activeMisc.id },
          data: {
            status: 'RESOLVED',
            resolvedAt: new Date().toISOString(),
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      explanation: question.explanation,
      updatedMastery: savedKnowledge.masteryScore,
      updatedAccuracy: savedKnowledge.accuracy,
      updatedConfidence: savedKnowledge.confidence,
      status: savedKnowledge.status,
      misconceptionDetected: detectedMisconception,
    });
  } catch (err: any) {
    console.error('Assessment submit error:', err);
    return NextResponse.json({ error: err.message || 'Failed to submit assessment' }, { status: 500 });
  }
}
