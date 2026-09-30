import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';
import { determineNextBestAction, getConfidenceCalibration } from '@/lib/adaptive/engine';
import { searchEducationalVideos } from '@/lib/youtube/service';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const studentId = session.id;

  // Fetch knowledge states and misconceptions
  const knowledgeList = await db.knowledgeState.findMany({ where: { studentId } });
  const misconceptions = await db.misconception.findMany({ where: { studentId } });
  const activeMisconceptions = misconceptions.filter((m) => m.status === 'ACTIVE');

  // Compute Greeting based on hour
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17) timeOfDay = 'evening';

  const firstName = session.name.split(' ')[0] || 'Learner';
  const greeting = `Good ${timeOfDay}, ${firstName}`;

  // Next best action
  const nextAction = await determineNextBestAction(studentId, 'python');

  // Learning Health metrics
  const totalConcepts = knowledgeList.length;
  const masteredCount = knowledgeList.filter((k) => k.status === 'MASTERED').length;
  const attentionCount = knowledgeList.filter((k) => k.status === 'NEEDS_REVIEW').length;

  const totalMastery = knowledgeList.reduce((acc, k) => acc + k.masteryScore, 0);
  const avgMastery = totalConcepts > 0 ? Math.round(totalMastery / totalConcepts) : 0;

  const totalAccuracy = knowledgeList.reduce((acc, k) => acc + k.accuracy, 0);
  const avgAccuracy = totalConcepts > 0 ? Math.round(totalAccuracy / totalConcepts) : 0;

  const calibration = getConfidenceCalibration(knowledgeList);
  const overconfidentCount = calibration.filter((c) => c.quadrant === 'Overconfident').length;
  const calibrationStatus =
    overconfidentCount > 0
      ? 'Recalibrating (Misconception Detected)'
      : avgAccuracy > 70
      ? 'Well-Calibrated'
      : 'Calibrating';

  // Weak areas (sorted by lowest mastery among attempted or needs review)
  const weakAreas = knowledgeList
    .filter((k) => k.status === 'NEEDS_REVIEW' || (k.attempts > 0 && k.masteryScore < 60))
    .sort((a, b) => a.masteryScore - b.masteryScore)
    .map((k) => {
      const concept = CONCEPTS.find((c) => c.id === k.conceptId);
      return {
        conceptId: k.conceptId,
        title: concept?.title || k.conceptId,
        module: concept?.module || 'Module',
        masteryScore: Math.round(k.masteryScore),
        accuracy: Math.round(k.accuracy),
        confidence: Math.round(k.confidence),
        status: k.status,
      };
    });

  // Target Continue Learning item: either the active misconception concept or next action concept
  const targetConceptId = activeMisconceptions.length > 0 ? activeMisconceptions[0].conceptId : nextAction.conceptId;
  const targetConcept = CONCEPTS.find((c) => c.id === targetConceptId) || CONCEPTS[0];
  const targetKnowledge = knowledgeList.find((k) => k.conceptId === targetConceptId);

  const continueLearning = {
    conceptId: targetConcept.id,
    module: targetConcept.module,
    title: targetConcept.title,
    currentMastery: targetKnowledge?.masteryScore || 31,
    projectedMastery: Math.min(100, (targetKnowledge?.masteryScore || 31) + 16),
    status: targetKnowledge?.status || 'NEEDS_REVIEW',
    actionUrl: `/learn/${targetConcept.id}`,
    hasActiveMisconception: activeMisconceptions.some((m) => m.conceptId === targetConcept.id),
  };

  // Today's Plan items
  const todaysPlan = [
    {
      id: 1,
      title: activeMisconceptions.length > 0 ? `Review ${targetConcept.title} Misconception` : 'Targeted Concept Review',
      type: 'misconception',
      completed: activeMisconceptions.length === 0,
      link: `/learn/${targetConcept.id}`,
    },
    {
      id: 2,
      title: 'Watch recommended pedagogical video lesson',
      type: 'video',
      completed: false,
      link: `/learn/${targetConcept.id}#videos`,
    },
    {
      id: 3,
      title: 'Complete 5 adaptive diagnostic questions',
      type: 'quiz',
      completed: false,
      link: `/learn/${targetConcept.id}#assessment`,
    },
    {
      id: 4,
      title: 'Practice Scope & Variable Lifetimes',
      type: 'practice',
      completed: false,
      link: '/learn/py-scope',
    },
    {
      id: 5,
      title: 'Spaced repetition revision on Control Flow',
      type: 'revision',
      completed: true,
      link: '/learn/py-control',
    },
  ];

  // Dynamic AI Insight
  let aiInsight =
    'Your accuracy improved after practicing function parameters. One misconception regarding return values still requires targeted review.';
  if (activeMisconceptions.length > 0) {
    aiInsight = `Pedagogical Alert: ${activeMisconceptions[0].description}`;
  } else if (weakAreas.length === 0) {
    aiInsight = 'Outstanding calibration! Your accuracy and confidence are tightly aligned across all modules.';
  }

  // Recommended YouTube videos for current target concept
  const recommendedVideos = await searchEducationalVideos(
    `${targetConcept.title} python functions`,
    targetConcept.id
  );

  // Roadmap snapshot
  const roadmap = CONCEPTS.filter((c) => c.track === targetConcept.track).map((c) => {
    const k = knowledgeList.find((item) => item.conceptId === c.id);
    return {
      id: c.id,
      title: c.title,
      order: c.order,
      masteryScore: k?.masteryScore || 0,
      status: k?.status || 'NOT_STARTED',
      difficulty: c.difficulty,
    };
  });

  return NextResponse.json({
    greeting,
    userName: session.name,
    continueLearning,
    learningHealth: {
      overallMastery: avgMastery,
      accuracy: avgAccuracy,
      confidenceCalibration: calibrationStatus,
      currentStreakDays: 6,
      conceptsMastered: masteredCount,
      conceptsNeedingAttention: attentionCount,
    },
    todaysPlan,
    aiInsight,
    weakAreas,
    recommendedVideos,
    roadmap,
    activeMisconceptions,
  });
}
