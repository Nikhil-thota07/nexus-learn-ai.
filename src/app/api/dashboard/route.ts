import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { CONCEPTS } from '@/data/curriculum';
import { determineNextBestAction, getConfidenceCalibration } from '@/lib/adaptive/engine';
import { searchEducationalVideos } from '@/lib/youtube/service';
import { resolveAuthoritativeSyllabus } from '@/data/syllabi';
import { findBranch } from '@/data/branches';
import { PreparationMode } from '@/types';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const studentId = session.id;
  const { searchParams } = new URL(req.url);
  const qYear = searchParams.get('year');
  const qSemester = searchParams.get('semester');

  // Fetch profile, knowledge states, and active misconceptions
  const profile = await db.studentProfile.findUnique({ where: { userId: studentId } });
  const knowledgeList = await db.knowledgeState.findMany({ where: { studentId } });
  const misconceptions = await db.misconception.findMany({ where: { studentId } });
  const activeMisconceptions = misconceptions.filter((m) => m.status === 'ACTIVE');

  const preparationMode: PreparationMode = (profile?.preparationMode as PreparationMode) || 'ENGINEERING';
  const branchObj = findBranch(profile?.branchId || profile?.branch);

  const selectedYear = qYear ? String(qYear) : (profile?.year || '1st Year');
  const selectedSemester = qSemester ? String(qSemester) : (profile?.semester || 'Semester 1');

  // Compute Greeting based on hour
  const hour = new Date().getHours();
  let timeOfDay = 'morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17) timeOfDay = 'evening';

  const firstName = session.name.split(' ')[0] || 'Learner';
  const greeting = `Good ${timeOfDay}, ${firstName}`;

  // Authoritative Engineering Syllabus strictly for selected year & semester
  let engineeringSyllabus = null;
  if (preparationMode === 'ENGINEERING') {
    engineeringSyllabus = resolveAuthoritativeSyllabus({
      university: profile?.university || 'JNTUH',
      college: profile?.schoolCollege || undefined,
      regulation: profile?.regulation || 'R25',
      branch: branchObj?.id || profile?.branch || 'cse',
      year: selectedYear,
      semester: selectedSemester,
    });
  }

  // Determine appropriate track based on mode
  let preferredTrack = 'python';
  if (preparationMode === 'JEE') {
    preferredTrack = 'jee-physics';
  } else if (preparationMode === 'ENGINEERING') {
    preferredTrack = 'python'; // or engineering core programming
  } else if (preparationMode === 'SKILL') {
    preferredTrack = 'python';
  }

  // Next best action
  const nextAction = await determineNextBestAction(studentId, preferredTrack);

  // Mode-aware concepts subset for health metrics
  const relevantConcepts =
    preparationMode === 'JEE'
      ? CONCEPTS.filter((c) => c.track.startsWith('jee'))
      : preparationMode === 'ENGINEERING'
      ? CONCEPTS.filter((c) => c.track === 'python' || c.track.startsWith('btech'))
      : CONCEPTS.filter((c) => c.track === 'python');

  const relevantConceptIds = new Set(relevantConcepts.map((c) => c.id));
  const modeKnowledge = knowledgeList.filter((k) => relevantConceptIds.has(k.conceptId));

  const totalConcepts = modeKnowledge.length || relevantConcepts.length;
  const masteredCount = modeKnowledge.filter((k) => k.status === 'MASTERED').length;
  const attentionCount = modeKnowledge.filter((k) => k.status === 'NEEDS_REVIEW').length;

  const totalMastery = modeKnowledge.reduce((acc, k) => acc + k.masteryScore, 0);
  const avgMastery = modeKnowledge.length > 0 ? Math.round(totalMastery / modeKnowledge.length) : 48;

  const totalAccuracy = modeKnowledge.reduce((acc, k) => acc + k.accuracy, 0);
  const avgAccuracy = modeKnowledge.length > 0 ? Math.round(totalAccuracy / modeKnowledge.length) : 62;

  const calibration = getConfidenceCalibration(modeKnowledge.length > 0 ? modeKnowledge : knowledgeList);
  const overconfidentCount = calibration.filter((c) => c.quadrant === 'Overconfident').length;
  const calibrationStatus =
    overconfidentCount > 0
      ? 'Recalibrating (Misconception Detected)'
      : avgAccuracy > 70
      ? 'Well-Calibrated'
      : 'Calibrating';

  // Weak areas
  const weakAreas = (modeKnowledge.length > 0 ? modeKnowledge : knowledgeList)
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

  // Target Continue Learning item
  const targetConceptId =
    activeMisconceptions.length > 0
      ? activeMisconceptions[0].conceptId
      : nextAction.conceptId;

  const targetConcept =
    CONCEPTS.find((c) => c.id === targetConceptId) || relevantConcepts[0] || CONCEPTS[0];
  const targetKnowledge = knowledgeList.find((k) => k.conceptId === targetConcept.id);

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

  // Mode-Specific Today's Plan
  let todaysPlan = [];
  if (preparationMode === 'JEE') {
    todaysPlan = [
      {
        id: 1,
        title: 'Physics Mechanics: Kinematics 2D Relative Velocity',
        type: 'practice',
        completed: false,
        link: '/learn/jee-kinematics',
      },
      {
        id: 2,
        title: "Newton's 3rd Law Free Body Diagram traps revision",
        type: 'revision',
        completed: false,
        link: '/learn/jee-newton',
      },
      {
        id: 3,
        title: 'Solve 10 timed JEE Main level multiple-choice questions',
        type: 'quiz',
        completed: false,
        link: '/learn/jee-kinematics#assessment',
      },
      {
        id: 4,
        title: 'Mathematics: Quadratic Equations discriminant analysis',
        type: 'practice',
        completed: true,
        link: '/learn/py-vars',
      },
    ];
  } else if (preparationMode === 'ENGINEERING') {
    const sub1 = engineeringSyllabus?.subjects?.[0]?.name || 'Programming for Problem Solving';
    const sub2 = engineeringSyllabus?.subjects?.[1]?.name || 'Matrices and Calculus';
    const sub3 = engineeringSyllabus?.subjects?.[2]?.name || 'Applied Physics';
    todaysPlan = [
      {
        id: 1,
        title: activeMisconceptions.length > 0 ? `Review ${targetConcept.title} Misconception` : `${sub1}: Core Functions & Parameter Flow`,
        type: 'misconception',
        completed: activeMisconceptions.length === 0,
        link: `/learn/${targetConcept.id}`,
      },
      {
        id: 2,
        title: `Watch ${sub1} targeted video lesson`,
        type: 'video',
        completed: false,
        link: `/learn/${targetConcept.id}#videos`,
      },
      {
        id: 3,
        title: `Complete 5 adaptive diagnostic questions for ${sub1}`,
        type: 'quiz',
        completed: false,
        link: `/learn/${targetConcept.id}#assessment`,
      },
      {
        id: 4,
        title: `${sub2}: Review Key Unit 1 Concepts`,
        type: 'practice',
        completed: false,
        link: '/syllabus',
      },
      {
        id: 5,
        title: `${sub3}: Foundational Concepts & Derivations Review`,
        type: 'revision',
        completed: true,
        link: '/engineering',
      },
    ];
  } else {
    todaysPlan = [
      {
        id: 1,
        title: `Core Concept: ${targetConcept.title}`,
        type: 'practice',
        completed: false,
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
        title: 'Solve diagnostic practice quiz',
        type: 'quiz',
        completed: false,
        link: `/learn/${targetConcept.id}#assessment`,
      },
    ];
  }

  // Dynamic AI Insight
  let aiInsight =
    'Your accuracy improved after practicing function parameters. One misconception regarding return values still requires targeted review.';
  if (activeMisconceptions.length > 0) {
    aiInsight = `Pedagogical Alert: ${activeMisconceptions[0].description}`;
  } else if (weakAreas.length === 0) {
    aiInsight = 'Outstanding calibration! Your accuracy and confidence are tightly aligned across all syllabus modules.';
  }

  // Mode-Aware YouTube Query (Section 34, 35 Requirement)
  let youtubeQuery = `${targetConcept.title} tutorial`;
  if (preparationMode === 'JEE') {
    youtubeQuery = `JEE Physics ${targetConcept.title} concept explanation`;
  } else if (preparationMode === 'ENGINEERING') {
    youtubeQuery = `B.Tech ${branchObj?.shortName || 'CSE'} ${targetConcept.title} tutorial`;
  } else if (preparationMode === 'SKILL') {
    youtubeQuery = `Python ${targetConcept.title} beginner tutorial`;
  }

  const recommendedVideos = await searchEducationalVideos(youtubeQuery, targetConcept.id);

  // Roadmap snapshot
  const roadmap = relevantConcepts.map((c) => {
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
    preparationMode,
    profile: {
      university: profile?.university || 'JNTUH',
      college: profile?.schoolCollege || 'Narsimha Reddy Engineering College',
      branch: branchObj?.name || profile?.branch || 'Computer Science and Engineering',
      branchShort: branchObj?.shortName || 'CSE',
      regulation: profile?.regulation || 'R25',
      year: selectedYear.includes('Year') ? selectedYear : `${selectedYear}${selectedYear === '1' ? 'st' : selectedYear === '2' ? 'nd' : selectedYear === '3' ? 'rd' : 'th'} Year`,
      semester: selectedSemester.includes('Semester') ? selectedSemester : `Semester ${selectedSemester}`,
      targetExam: profile?.targetExam || 'JEE Main 2026',
      targetExamYear: profile?.targetExamYear || '2026',
      board: profile?.board || 'CBSE',
      currentClass: profile?.currentClass || '12th Standard',
      selectedSkill: profile?.selectedSkill || 'Python',
    },
    engineeringSyllabus,
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
