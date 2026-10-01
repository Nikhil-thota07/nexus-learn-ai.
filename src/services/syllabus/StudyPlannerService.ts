import { ComprehensiveStudentContext } from '@/services/context/StudentContextService';
import { SyllabusService } from '@/services/syllabus/SyllabusService';
import { SyllabusSubject } from '@/data/syllabi';

export interface PriorityTopic {
  topic: string;
  unitNumber: number;
  unitTitle: string;
  importance: 'High' | 'Medium' | 'Low';
  currentMastery: number;
  examRelevance: string;
  prerequisites: string[];
  estimatedHours: number;
  priority: 'High' | 'Medium' | 'Low';
  priorityScore: number;
  status: 'Needs Work' | 'In Progress' | 'Mastered';
  recommendedAction: string;
}

export interface DayPlan {
  day: number;
  title: string;
  focus: 'Foundation' | 'Core Topics' | 'Weak Concepts' | 'Practice & PYQs' | 'Revision & Mock';
  topics: string[];
  durationHours: number;
  practiceTasks: string[];
  checkpoint: string;
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  summary: string;
  days: DayPlan[];
  weeklyMilestone: string;
}

export interface StructuredStudyPlan {
  subject: {
    id: string;
    code: string;
    name: string;
    credits: number;
    category: string;
    university: string;
    regulation: string;
    branch: string;
  };
  goal: {
    target: string;
    durationWeeks: number;
    durationDays: number;
    dailyHours: number;
    totalAvailableHours: number;
  };
  metrics: {
    totalAvailableHours: number;
    requiredEstimatedHours: number;
    coveragePercentage: number;
    estimatedReadiness: number;
    recommendedDailyWorkload: number;
    riskAreas: { topic: string; reason: string }[];
    readinessNote: string;
  };
  priorityTopics: PriorityTopic[];
  weeks: WeekPlan[];
  generatedAt: string;
}

export class StudyPlannerService {
  /**
   * Generates a grounded, prioritized study plan for a student based on authoritative syllabus,
   * knowledge states, targets, and available time.
   */
  static generatePlan(params: {
    subjectQuery: string;
    target: string; // e.g. "9 CGPA"
    weeks: number; // e.g. 2
    dailyStudyHours?: number; // e.g. 3
    context: ComprehensiveStudentContext;
  }): StructuredStudyPlan {
    const { subjectQuery, target, weeks = 2, dailyStudyHours, context } = params;

    // 1. Resolve authentic subject
    const subject = SyllabusService.getSubjectByCodeOrName(subjectQuery, context) || {
      id: 'default-sub',
      code: 'CS101ES',
      name: subjectQuery || 'Engineering Subject',
      credits: 4,
      category: 'Professional Core' as const,
      isLab: false,
      units: [],
    };

    const durationDays = weeks * 7;
    const dailyHours = dailyStudyHours || (context.availableTime ? Math.round(context.availableTime / 60) : 3);
    const totalAvailableHours = durationDays * dailyHours;

    // 2. Extract topics from actual units in the syllabus
    const topicsList: {
      topic: string;
      unitNumber: number;
      unitTitle: string;
      baseImportance: number;
      examRelevance: string;
      prerequisites: string[];
    }[] = [];

    if (subject.units && subject.units.length > 0) {
      subject.units.forEach((unit) => {
        unit.topics.forEach((t, tIdx) => {
          // Determine exam relevance based on unit & position
          const examRelevance =
            tIdx === 0
              ? 'Core university long-answer question (10 Marks)'
              : tIdx === 1
              ? 'Frequent short-answer concept & numerical (5 Marks)'
              : 'Applied concept & derivation';

          // Base importance: Unit 1 & Unit 2 have foundational weight
          const baseImportance = unit.unitNumber <= 2 ? 85 : unit.unitNumber === 3 ? 80 : 70;

          // Prerequisites inferred from previous units
          const prereqs = unit.unitNumber > 1 ? [`Unit ${unit.unitNumber - 1} Fundamentals`] : ['Basic Class 12 Foundations'];

          topicsList.push({
            topic: t,
            unitNumber: unit.unitNumber,
            unitTitle: unit.title,
            baseImportance,
            examRelevance,
            prerequisites: prereqs,
          });
        });
      });
    } else {
        // Fallback for custom subject
        const defaultTopics = [
          'Foundational Principles & Architecture',
          'Core Mathematical & Algorithmic Models',
          'Applied Problem Solving & Analysis',
          'Advanced Systems & Optimization',
          'Comprehensive Review & Examination Questions',
        ];
        defaultTopics.forEach((t, i) => {
          topicsList.push({
            topic: t,
            unitNumber: i + 1,
            unitTitle: `Unit ${i + 1}`,
            baseImportance: 75,
            examRelevance: 'Standard University Examination Syllabus',
            prerequisites: i > 0 ? [`Unit ${i}`] : ['Prerequisites'],
          });
        });
      }

    // 3. Calculate Prioritization for each topic (Requirement 5)
    // Priority = Syllabus Importance + Prerequisite Importance + Student Weakness + Assessment Performance + Exam Relevance + Available Time
    let requiredHoursSum = 0;
    const priorityTopics: PriorityTopic[] = topicsList.map((item, idx) => {
      // Check if student has knowledge state matching this topic or its keywords
      const matchedKnowledge = context.knowledgeStates.find(
        (k) =>
          k.title.toLowerCase().includes(item.topic.toLowerCase()) ||
          item.topic.toLowerCase().includes(k.title.toLowerCase())
      );

      const mastery = matchedKnowledge ? matchedKnowledge.masteryScore : 45; // default moderate mastery if unassessed
      const studentWeakness = 100 - mastery;

      // Active misconception check
      const hasMisconception = context.misconceptions.some(
        (m) =>
          item.topic.toLowerCase().includes(m.title.toLowerCase()) ||
          m.title.toLowerCase().includes(item.topic.toLowerCase())
      );

      const syllabusImportance = item.baseImportance;
      const prerequisiteImportance = item.unitNumber <= 2 ? 90 : 60;
      const examRelevanceScore = idx % 2 === 0 ? 95 : 70;
      const timeUrgencyScore = weeks <= 2 ? 85 : 50;

      // Formula:
      const rawScore =
        syllabusImportance * 0.25 +
        prerequisiteImportance * 0.2 +
        studentWeakness * (hasMisconception ? 0.3 : 0.2) +
        examRelevanceScore * 0.15 +
        timeUrgencyScore * 0.1;

      const priorityScore = Math.min(100, Math.round(rawScore));
      const priority: 'High' | 'Medium' | 'Low' =
        priorityScore >= 68 ? 'High' : priorityScore >= 45 ? 'Medium' : 'Low';

      const estimatedHours = priority === 'High' ? 4 : priority === 'Medium' ? 3 : 2;
      requiredHoursSum += estimatedHours;

      const status: 'Needs Work' | 'In Progress' | 'Mastered' =
        mastery >= 75 ? 'Mastered' : mastery >= 50 ? 'In Progress' : 'Needs Work';

      const recommendedAction = hasMisconception
        ? 'Resolve active misconception with targeted video remediation and diagnostic practice'
        : mastery < 50
        ? 'Study lecture notes & solve step-by-step example questions'
        : 'Attempt university exam-level questions under timed conditions';

      return {
        topic: item.topic,
        unitNumber: item.unitNumber,
        unitTitle: item.unitTitle,
        importance: item.baseImportance >= 80 ? 'High' : 'Medium',
        currentMastery: mastery,
        examRelevance: item.examRelevance,
        prerequisites: item.prerequisites,
        estimatedHours,
        priority,
        priorityScore,
        status,
        recommendedAction,
      };
    });

    // Sort priority topics descending by priority score
    priorityTopics.sort((a, b) => b.priorityScore - a.priorityScore);

    // 4. Calculate Readiness & Coverage Metrics (Requirement 6)
    const coveragePercentage = Math.min(100, Math.round((totalAvailableHours / Math.max(1, requiredHoursSum)) * 100));
    
    // Average current mastery across priority topics
    const avgMastery = Math.round(
      priorityTopics.reduce((acc, curr) => acc + curr.currentMastery, 0) / Math.max(1, priorityTopics.length)
    );

    // Realistic readiness estimation
    const estimatedReadiness = Math.min(
      95,
      Math.max(25, Math.round(avgMastery * 0.5 + coveragePercentage * 0.45))
    );

    // Identify risk areas
    const riskAreas: { topic: string; reason: string }[] = priorityTopics
      .filter((pt) => pt.currentMastery < 50 && pt.priority === 'High')
      .slice(0, 4)
      .map((pt) => ({
        topic: pt.topic,
        reason: `Low mastery (${pt.currentMastery}%) with high university exam weight (Unit ${pt.unitNumber})`,
      }));

    // Recommended daily workload
    const recommendedDailyWorkload =
      coveragePercentage < 80
        ? Math.round((requiredHoursSum / durationDays) * 10) / 10
        : dailyHours;

    const readinessNote = `Target: ${target} — Current estimated readiness: ${estimatedReadiness}%. Priority: High. Note: The target is an objective, not a guaranteed outcome. Consistent completion of priority units will elevate your score trajectory.`;

    // 5. Build Two-Week Schedule (Requirement 6)
    const weeksList: WeekPlan[] = [];

    // Separate high priority and foundation topics for Week 1 vs Week 2
    const week1Topics = priorityTopics.filter((t) => t.unitNumber <= 3 || t.priority === 'High').slice(0, 7);
    const week2Topics = priorityTopics.filter((t) => !week1Topics.includes(t)).slice(0, 7);

    // Ensure Week 2 has enough topics
    if (week2Topics.length < 5) {
      week2Topics.push(...priorityTopics.slice(0, 5 - week2Topics.length));
    }

    // Week 1: Foundation concepts, Important topics, Weak concepts, Practice, Revision
    const week1Days: DayPlan[] = [
      {
        day: 1,
        title: 'Diagnostic Baseline & Foundation Architecture',
        focus: 'Foundation',
        topics: [week1Topics[0]?.topic || 'Syllabus Overview', 'Core Mathematical/Algorithmic Notation'],
        durationHours: dailyHours,
        practiceTasks: ['Review prerequisite theorem statements', 'Solve 3 diagnostic foundational questions'],
        checkpoint: 'Verify no blind spots in fundamental terminology',
      },
      {
        day: 2,
        title: 'High-Priority Unit 1 Core Mechanisms',
        focus: 'Core Topics',
        topics: [week1Topics[0]?.topic || 'Matrix Operations / Language Syntax'],
        durationHours: dailyHours,
        practiceTasks: ['Solve 5 standard university derivation / numerical exercises'],
        checkpoint: 'Mastery check: Accuracy >= 75% on standard examples',
      },
      {
        day: 3,
        title: 'Remediating Identified Student Weaknesses',
        focus: 'Weak Concepts',
        topics: [week1Topics[1]?.topic || 'Linear Systems / Control Flow'],
        durationHours: dailyHours,
        practiceTasks: ['Watch 12-minute targeted video remediation', 'Re-attempt previous incorrect concepts'],
        checkpoint: 'Resolve active misconception without guessing',
      },
      {
        day: 4,
        title: 'Unit 2 Expansion & Multi-step Problems',
        focus: 'Core Topics',
        topics: [week1Topics[2]?.topic || 'Mean Value Theorems / Functions'],
        durationHours: dailyHours,
        practiceTasks: ['Derive core theorems step-by-step on paper', 'Complete 4 problem sets'],
        checkpoint: 'Write down formal step-by-step proofs',
      },
      {
        day: 5,
        title: 'Intermediate Topic Drill & Memory Retention',
        focus: 'Core Topics',
        topics: [week1Topics[3]?.topic || 'Multivariable Calculus / Arrays & Memory'],
        durationHours: dailyHours,
        practiceTasks: ['Analyze boundary edge cases and common traps', 'Solve 3 numerical problems'],
        checkpoint: 'Identify and avoid common exam traps',
      },
      {
        day: 6,
        title: 'Comprehensive Practice & Important Questions',
        focus: 'Practice & PYQs',
        topics: ['Consolidation of Unit 1 and Unit 2 Topics'],
        durationHours: dailyHours,
        practiceTasks: ['Solve 5 university-level 10-mark questions under untimed conditions'],
        checkpoint: 'Full written solution accuracy',
      },
      {
        day: 7,
        title: 'Mid-Point Review & Self-Correction',
        focus: 'Revision & Mock',
        topics: ['Week 1 Error Log & Misconception Review'],
        durationHours: dailyHours,
        practiceTasks: ['Review error notebook', '30-minute self-test on Units 1-2'],
        checkpoint: 'Zero recurring errors on previous mistakes',
      },
    ];

    weeksList.push({
      weekNumber: 1,
      title: 'Week 1: Foundational Mastery, High-Priority Concepts & Gap Remediation',
      summary: 'Cement the core 50% of the syllabus, eliminate active misconceptions, and master Unit 1 & 2 high-yield questions.',
      days: week1Days,
      weeklyMilestone: 'Units 1 and 2 thoroughly consolidated with verified conceptual understanding.',
    });

    // Week 2: Remaining high-priority, Previous mistakes, Important questions, Timed practice, Mock test, Final revision
    const week2Days: DayPlan[] = [
      {
        day: 8,
        title: 'Unit 3 & 4 Advanced Concepts',
        focus: 'Core Topics',
        topics: [week2Topics[0]?.topic || 'Advanced Calculus / Pointers & Memory'],
        durationHours: dailyHours,
        practiceTasks: ['Learn core transformation theorems', 'Solve 4 complex problems'],
        checkpoint: 'Understand multi-stage problem decomposition',
      },
      {
        day: 9,
        title: 'Remaining High-Priority Syllabus Topics',
        focus: 'Core Topics',
        topics: [week2Topics[1]?.topic || 'Vector Calculus / User-defined Types'],
        durationHours: dailyHours,
        practiceTasks: ['Solve standard exam questions from Units 3 and 4'],
        checkpoint: 'Verify complete unit topic coverage',
      },
      {
        day: 10,
        title: 'Previous Mistakes & Trap Question Drill',
        focus: 'Weak Concepts',
        topics: ['Targeted Remediation of Past Errors & Misconceptions'],
        durationHours: dailyHours,
        practiceTasks: ['Re-evaluate confidence calibration', 'Answer 5 high-difficulty trap questions'],
        checkpoint: 'Calibration alignment (high confidence matching high accuracy)',
      },
      {
        day: 11,
        title: 'Topic-wise Important University Questions Drill',
        focus: 'Practice & PYQs',
        topics: ['High-Yield 10-Mark & 5-Mark University Examination Questions'],
        durationHours: dailyHours,
        practiceTasks: ['Solve 6 curated important university questions with structured answers'],
        checkpoint: 'Structuring expected answer points per university marking scheme',
      },
      {
        day: 12,
        title: 'Full-Length Timed Examination Simulation',
        focus: 'Practice & PYQs',
        topics: ['All Units (Full Syllabus Coverage)'],
        durationHours: dailyHours,
        practiceTasks: ['Sit for a 2-hour timed mock exam without references', 'Self-grade with rubric'],
        checkpoint: 'Time management: completing paper within allotted minutes',
      },
      {
        day: 13,
        title: 'Mock Analysis & Targeted Revision',
        focus: 'Revision & Mock',
        topics: ['Mock Test Diagnostic Analysis & Final Gap Closure'],
        durationHours: dailyHours,
        practiceTasks: ['Analyze every lost mark in mock exam', 'Revise formula sheets and summary notes'],
        checkpoint: '100% clarity on solutions to missed mock questions',
      },
      {
        day: 14,
        title: 'Final Summary, Confidence Calibration & Readiness Check',
        focus: 'Revision & Mock',
        topics: ['Rapid Formula & Core Definition Recall'],
        durationHours: dailyHours,
        practiceTasks: ['Quick memory scan of all 5 units', 'Rest and mental preparation'],
        checkpoint: 'Target readiness achieved — fully equipped for semester examination',
      },
    ];

    weeksList.push({
      weekNumber: 2,
      title: 'Week 2: Advanced Topics, University Question Drills & Timed Examination Simulation',
      summary: 'Complete advanced units, drill expected examination questions, and simulate full-length exam conditions.',
      days: week2Days,
      weeklyMilestone: 'Syllabus mastery calibrated to target CGPA with verified exam execution speed.',
    });

    return {
      subject: {
        id: subject.id,
        code: subject.code,
        name: subject.name,
        credits: subject.credits,
        category: subject.category,
        university: context.university,
        regulation: context.regulation,
        branch: context.branchName,
      },
      goal: {
        target,
        durationWeeks: weeks,
        durationDays,
        dailyHours,
        totalAvailableHours,
      },
      metrics: {
        totalAvailableHours,
        requiredEstimatedHours: requiredHoursSum,
        coveragePercentage,
        estimatedReadiness,
        recommendedDailyWorkload,
        riskAreas,
        readinessNote,
      },
      priorityTopics,
      weeks: weeksList,
      generatedAt: new Date().toISOString(),
    };
  }
}
