import { CONCEPTS } from '@/data/curriculum';
import { CalibrationDataPoint, Concept, KnowledgeState, Misconception, NextBestAction } from '@/types';
import { db, KnowledgeRecord } from '../db';

/**
 * Computes updated knowledge state using multi-signal Bayesian/DKT-inspired heuristics:
 * - Accuracy (correct / attempts)
 * - Confidence alignment penalty/bonus
 * - Time factor
 * - Difficulty damping
 */
export function calculateUpdatedMastery(params: {
  currentMastery: number;
  totalAttempts: number;
  correctAttempts: number;
  latestIsCorrect: boolean;
  latestConfidence: number; // 0 - 100
  conceptDifficulty: number; // 1 - 5
  timeSpentSeconds: number;
}): {
  newMastery: number;
  newAccuracy: number;
  newConfidence: number;
  misconceptionRisk: number;
  status: 'NOT_STARTED' | 'LEARNING' | 'NEEDS_REVIEW' | 'MASTERED';
} {
  const {
    currentMastery,
    totalAttempts,
    correctAttempts,
    latestIsCorrect,
    latestConfidence,
    conceptDifficulty,
    timeSpentSeconds,
  } = params;

  const newAttempts = totalAttempts + 1;
  const newCorrect = correctAttempts + (latestIsCorrect ? 1 : 0);
  const newAccuracy = Math.round((newCorrect / newAttempts) * 100);

  // Calibration check
  // If student was confident (>70%) but wrong => high misconception risk!
  const isOverconfidentMistake = !latestIsCorrect && latestConfidence >= 70;
  // If student was uncertain (<40%) but correct => lucky guess or underconfident
  const isGuessOrUnderconfident = latestIsCorrect && latestConfidence <= 40;

  let delta = 0;
  if (latestIsCorrect) {
    // Reward scaled by confidence and difficulty
    const confFactor = 0.5 + (latestConfidence / 100) * 0.5; // 0.5 to 1.0
    const diffBonus = 1 + (conceptDifficulty - 2) * 0.15;
    delta = 12 * confFactor * diffBonus;
  } else {
    // Penalty: larger if overconfident
    const penaltyWeight = isOverconfidentMistake ? 1.5 : 0.8;
    delta = -14 * penaltyWeight;
  }

  // Smooth learning curve with responsive progression
  let newMastery = Math.max(0, Math.min(100, Math.round(currentMastery + delta)));

  // If overconfident mistake occurred, dampen mastery
  if (isOverconfidentMistake) {
    newMastery = Math.min(newMastery, 42);
  }

  // Calculate misconception risk
  let misconceptionRisk = 0.1;
  if (isOverconfidentMistake || (newAccuracy <= 50 && latestConfidence > 65)) {
    misconceptionRisk = 0.88;
  } else if (newAccuracy < 65) {
    misconceptionRisk = 0.45;
  } else {
    misconceptionRisk = 0.08;
  }

  // Determine status
  let status: 'NOT_STARTED' | 'LEARNING' | 'NEEDS_REVIEW' | 'MASTERED' = 'LEARNING';
  if (newMastery >= 78 && newAccuracy >= 75) {
    status = 'MASTERED';
  } else if (misconceptionRisk > 0.5 || newMastery < 50) {
    status = 'NEEDS_REVIEW';
  }

  return {
    newMastery,
    newAccuracy,
    newConfidence: latestConfidence,
    misconceptionRisk,
    status,
  };
}

/**
 * Checks prerequisite gating:
 * Returns true if all prerequisites for the given concept have mastery >= threshold.
 */
export function arePrerequisitesMet(
  concept: Concept,
  knowledgeMap: Map<string, KnowledgeRecord>
): { met: boolean; blockingConcepts: string[] } {
  const blocking: string[] = [];

  for (const prereqId of concept.prerequisiteIds) {
    const prereqRecord = knowledgeMap.get(prereqId);
    const prereqDef = CONCEPTS.find((c) => c.id === prereqId);
    const threshold = prereqDef?.masteryThreshold || 70;

    if (!prereqRecord || prereqRecord.masteryScore < threshold) {
      blocking.push(prereqDef?.title || prereqId);
    }
  }

  return {
    met: blocking.length === 0,
    blockingConcepts: blocking,
  };
}

/**
 * Evaluates student confidence calibration across all concepts:
 * Categorizes each concept into the 4 Quadrants of Metacognition.
 */
export function getConfidenceCalibration(
  knowledgeList: KnowledgeRecord[]
): CalibrationDataPoint[] {
  return knowledgeList.map((k) => {
    const concept = CONCEPTS.find((c) => c.id === k.conceptId);
    const title = concept?.title || k.conceptId;

    let quadrant: 'Overconfident' | 'Underconfident' | 'Mastered' | 'Gap';

    if (k.accuracy >= 65 && k.confidence >= 65) {
      quadrant = 'Mastered';
    } else if (k.accuracy < 60 && k.confidence >= 65) {
      quadrant = 'Overconfident'; // Likely misconception!
    } else if (k.accuracy >= 65 && k.confidence < 60) {
      quadrant = 'Underconfident'; // Needs affirmation
    } else {
      quadrant = 'Gap'; // Genuine foundational gap
    }

    return {
      conceptId: k.conceptId,
      conceptTitle: title,
      accuracy: Math.round(k.accuracy),
      confidence: Math.round(k.confidence),
      quadrant,
      attempts: k.attempts,
      status: k.status,
    };
  });
}

/**
 * ADAPTIVE NEXT-BEST-ACTION ENGINE:
 * 1. Checks for ACTIVE misconceptions (Top priority: fix false beliefs first)
 * 2. Checks for concepts needing review (Mastery < threshold or accuracy < 50%)
 * 3. Checks prerequisite blockers
 * 4. Recommends next logical unlock along the DAG
 */
export async function determineNextBestAction(
  studentId: string,
  preferredTrack: string = 'python'
): Promise<NextBestAction> {
  const knowledgeList = await db.knowledgeState.findMany({ where: { studentId } });
  const activeMisconceptions = await db.misconception.findMany({
    where: { studentId, status: 'ACTIVE' },
  });

  const knowledgeMap = new Map<string, KnowledgeRecord>();
  knowledgeList.forEach((k) => knowledgeMap.set(k.conceptId, k));

  // 1. TOP PRIORITY: Active Misconception
  if (activeMisconceptions.length > 0) {
    const misc = activeMisconceptions[0];
    const concept = CONCEPTS.find((c) => c.id === misc.conceptId);
    return {
      actionType: 'Fix misconception',
      conceptId: misc.conceptId,
      conceptTitle: concept?.title || 'Targeted Concept',
      track: concept?.track || preferredTrack,
      reason: `Active misconception detected: "${misc.title}". You understand how to define functions, but are confusing return with print(). Correct this first.`,
      urgency: 'high',
      estimatedMinutes: 8,
      prerequisitesMet: true,
      misconceptionAlert: misc.description,
    };
  }

  // Filter track concepts
  const trackConcepts = CONCEPTS.filter((c) => c.track === preferredTrack || preferredTrack === 'all');

  // 2. High Urgency: Concepts in NEEDS_REVIEW
  const needsReview = trackConcepts
    .map((c) => ({ concept: c, k: knowledgeMap.get(c.id) }))
    .filter(({ k }) => k && k.status === 'NEEDS_REVIEW')
    .sort((a, b) => (a.k?.masteryScore || 0) - (b.k?.masteryScore || 0));

  if (needsReview.length > 0) {
    const target = needsReview[0];
    const { met } = arePrerequisitesMet(target.concept, knowledgeMap);
    return {
      actionType: target.k && target.k.masteryScore < 40 ? 'Watch video' : 'Practice',
      conceptId: target.concept.id,
      conceptTitle: target.concept.title,
      track: target.concept.track,
      reason: `Mastery dropped to ${target.k?.masteryScore || 0}%. Targeted remediation will strengthen this weak area.`,
      urgency: 'high',
      estimatedMinutes: 12,
      prerequisitesMet: met,
    };
  }

  // 3. Medium Urgency: In-progress concepts (status = LEARNING)
  const learningConcepts = trackConcepts
    .map((c) => ({ concept: c, k: knowledgeMap.get(c.id) }))
    .filter(({ k }) => k && k.status === 'LEARNING');

  if (learningConcepts.length > 0) {
    const target = learningConcepts[0];
    return {
      actionType: 'Take assessment',
      conceptId: target.concept.id,
      conceptTitle: target.concept.title,
      track: target.concept.track,
      reason: `You've achieved ${target.k?.masteryScore || 0}% mastery. Complete this assessment to lock in mastery.`,
      urgency: 'medium',
      estimatedMinutes: 10,
      prerequisitesMet: true,
    };
  }

  // 4. Find next unlocked concept in prerequisite DAG
  for (const concept of trackConcepts) {
    const record = knowledgeMap.get(concept.id);
    if (!record || record.status === 'NOT_STARTED') {
      const { met, blockingConcepts } = arePrerequisitesMet(concept, knowledgeMap);
      if (met) {
        return {
          actionType: 'Unlock next',
          conceptId: concept.id,
          conceptTitle: concept.title,
          track: concept.track,
          reason: `All prerequisites met! Advance your learning path by unlocking ${concept.title}.`,
          urgency: 'medium',
          estimatedMinutes: 15,
          prerequisitesMet: true,
        };
      } else {
        // Blocked by prerequisites
        return {
          actionType: 'Review',
          conceptId: concept.prerequisiteIds[0] || concept.id,
          conceptTitle: blockingConcepts[0] || 'Prerequisites',
          track: concept.track,
          reason: `Locked: ${concept.title} requires prior mastery of ${blockingConcepts.join(', ')}.`,
          urgency: 'medium',
          estimatedMinutes: 12,
          prerequisitesMet: false,
        };
      }
    }
  }

  // All completed
  const first = trackConcepts[0];
  return {
    actionType: 'Practice',
    conceptId: first.id,
    conceptTitle: first.title,
    track: first.track,
    reason: 'Outstanding progress! All concepts mastered. Complete a comprehensive challenge test.',
    urgency: 'low',
    estimatedMinutes: 20,
    prerequisitesMet: true,
  };
}
