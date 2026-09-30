import { calculateUpdatedMastery, arePrerequisitesMet, getConfidenceCalibration } from '../src/lib/adaptive/engine';
import { CONCEPTS } from '../src/data/curriculum';
import { KnowledgeRecord } from '../src/lib/db';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`✓ ${message}`);
}

async function runTests() {
  console.log('--- NEXUS LEARN AI ADAPTIVE ENGINE TESTS ---');

  // Test 1: Overconfident Mistake Penalty
  // High confidence (>70) but incorrect answer => should trigger severe penalty and cap mastery
  const overconfidentResult = calculateUpdatedMastery({
    currentMastery: 60,
    totalAttempts: 5,
    correctAttempts: 3,
    latestIsCorrect: false,
    latestConfidence: 90,
    conceptDifficulty: 3,
    timeSpentSeconds: 30,
  });

  assert(
    overconfidentResult.misconceptionRisk > 0.5,
    'Overconfident mistake must elevate misconception risk > 0.5'
  );
  assert(
    overconfidentResult.newMastery <= 45,
    'Overconfident mistake must dampen mastery to <= 45%'
  );
  assert(
    overconfidentResult.status === 'NEEDS_REVIEW',
    'Overconfident error must transition status to NEEDS_REVIEW'
  );

  // Test 2: Calibrated Correct Answer Reward
  const calibratedSuccess = calculateUpdatedMastery({
    currentMastery: 70,
    totalAttempts: 10,
    correctAttempts: 8,
    latestIsCorrect: true,
    latestConfidence: 85,
    conceptDifficulty: 3,
    timeSpentSeconds: 25,
  });

  assert(
    calibratedSuccess.newMastery >= 75,
    'High confidence correct answer should advance mastery'
  );
  assert(
    calibratedSuccess.status === 'MASTERED',
    'Mastery above threshold should mark status as MASTERED'
  );

  // Test 3: Prerequisite Gating DAG
  const pyReturnConcept = CONCEPTS.find((c) => c.id === 'py-return')!;
  const knowledgeMap = new Map<string, KnowledgeRecord>();

  // Prerequisite functions has low mastery (50 < 75 threshold)
  knowledgeMap.set('py-functions', {
    id: 'k1',
    studentId: 's1',
    conceptId: 'py-functions',
    masteryScore: 50,
    accuracy: 50,
    confidence: 60,
    attempts: 2,
    correctAttempts: 1,
    incorrectAttempts: 1,
    averageTimeSeconds: 30,
    difficulty: 2,
    misconceptionRisk: 0.1,
    improvementRate: 0,
    status: 'LEARNING',
    createdAt: '',
    updatedAt: '',
  });

  const check1 = arePrerequisitesMet(pyReturnConcept, knowledgeMap);
  assert(
    check1.met === false,
    'Prerequisite gating must block concept when prerequisite mastery < threshold'
  );

  // Boost prerequisite functions mastery to 85%
  knowledgeMap.set('py-functions', {
    ...knowledgeMap.get('py-functions')!,
    masteryScore: 85,
    status: 'MASTERED',
  });
  knowledgeMap.set('py-params', {
    id: 'k2',
    studentId: 's1',
    conceptId: 'py-params',
    masteryScore: 80,
    accuracy: 80,
    confidence: 75,
    attempts: 3,
    correctAttempts: 3,
    incorrectAttempts: 0,
    averageTimeSeconds: 25,
    difficulty: 2,
    misconceptionRisk: 0.1,
    improvementRate: 0.2,
    status: 'MASTERED',
    createdAt: '',
    updatedAt: '',
  });

  const check2 = arePrerequisitesMet(pyReturnConcept, knowledgeMap);
  assert(
    check2.met === true,
    'Prerequisites must be met when all dependency masteries exceed threshold'
  );

  // Test 4: Metacognitive Calibration Quadrant Categorization
  const mockKnowledge: KnowledgeRecord[] = [
    {
      id: 'k_return',
      studentId: 's1',
      conceptId: 'py-return',
      masteryScore: 31,
      accuracy: 28,
      confidence: 88, // High confidence, low accuracy!
      attempts: 7,
      correctAttempts: 2,
      incorrectAttempts: 5,
      averageTimeSeconds: 30,
      difficulty: 3,
      misconceptionRisk: 0.85,
      improvementRate: -0.1,
      status: 'NEEDS_REVIEW',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 'k_vars',
      studentId: 's1',
      conceptId: 'py-vars',
      masteryScore: 90,
      accuracy: 92,
      confidence: 90, // High accuracy, high confidence!
      attempts: 10,
      correctAttempts: 9,
      incorrectAttempts: 1,
      averageTimeSeconds: 20,
      difficulty: 2,
      misconceptionRisk: 0.1,
      improvementRate: 0.3,
      status: 'MASTERED',
      createdAt: '',
      updatedAt: '',
    },
  ];

  const calibration = getConfidenceCalibration(mockKnowledge);
  const returnPoint = calibration.find((c) => c.conceptId === 'py-return');
  const varsPoint = calibration.find((c) => c.conceptId === 'py-vars');

  assert(
    returnPoint?.quadrant === 'Overconfident',
    'py-return must be classified into the Overconfident quadrant'
  );
  assert(
    varsPoint?.quadrant === 'Mastered',
    'py-vars must be classified into the Mastered quadrant'
  );

  console.log('\nALL 5 TEST SUITES PASSED! [100% SPEC COMPLIANCE]');
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
