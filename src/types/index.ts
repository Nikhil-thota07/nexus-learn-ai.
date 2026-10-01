export type PreparationMode = 'JEE' | 'ENGINEERING' | 'SCHOOL' | 'SKILL';
export type EducationLevel = 'High School' | 'Undergraduate' | 'B.Tech' | 'Postgraduate' | 'Other';
export type KnowledgeStatus = 'NOT_STARTED' | 'LEARNING' | 'NEEDS_REVIEW' | 'MASTERED';
export type MisconceptionStatus = 'ACTIVE' | 'RESOLVED' | 'MONITORING';
export type ActionType = 'Learn' | 'Review' | 'Practice' | 'Watch video' | 'Take assessment' | 'Fix misconception' | 'Skip mastered' | 'Unlock next';

export type TutorIntent =
  | 'EXPLANATION'
  | 'DEFINITION'
  | 'WHY'
  | 'HOW'
  | 'EXAMPLE'
  | 'PRACTICE'
  | 'HINT'
  | 'SOLUTION'
  | 'DEBUGGING'
  | 'CODE_REQUEST'
  | 'REVISION'
  | 'COMPARISON'
  | 'EXAM_PREPARATION'
  | 'MISCONCEPTION'
  | 'SYLLABUS_QUERY'
  | 'STUDY_PLAN'
  | 'CLARIFICATION_NEEDED';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  avatar?: string | null;
  age?: number | null;
  dob?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  // Core mode
  preparationMode: PreparationMode;
  educationLevel?: string;
  qualification?: string;

  // Engineering fields
  schoolCollege?: string;
  university?: string;
  branch?: string;
  branchId?: string;
  customBranch?: string;
  year?: string;
  semester?: string;
  regulation?: string;
  syllabusId?: string;
  syllabusVersion?: string;
  syllabusSource?: string;

  // JEE & School fields
  targetExam?: string;
  targetExamYear?: string;
  currentClass?: string;
  board?: string;
  schoolClass?: string;
  currentPreparationLevel?: string;

  // Skill fields
  selectedSkill?: string;

  // Subjects & Goals
  subjects?: string[];
  currentSubjectId?: string;
  currentTopicId?: string;
  careerInterests?: string[];
  primaryGoal?: string;
  secondaryGoal?: string;

  // Learning preferences
  preferredLanguage: string;
  dailyStudyMinutes: number;
  preferredStyle: 'visual' | 'conceptual' | 'hands-on';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'adaptive';
  videoPreference: 'deep-dive' | 'concise' | 'animated';
  updatedAt: string;
}

export interface Concept {
  id: string;
  track: 'python' | 'jee-physics' | 'jee-chemistry' | 'jee-math' | 'btech-os' | 'btech-dsa' | 'btech-dbms';
  trackName: string;
  module: string;
  slug: string;
  title: string;
  description: string;
  order: number;
  difficulty: number; // 1 to 5
  masteryThreshold: number; // e.g. 75
  prerequisiteIds: string[];
  dependentIds: string[];
  keyTakeaways: string[];
  commonMisconceptions: {
    name: string;
    description: string;
    correction: string;
    exampleIncorrect: string;
    exampleCorrect: string;
  }[];
}

export interface KnowledgeState {
  id: string;
  studentId: string;
  conceptId: string;
  masteryScore: number; // 0 - 100
  accuracy: number; // 0 - 100
  confidence: number; // 0 - 100
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageTimeSeconds: number;
  difficulty: number;
  misconceptionRisk: number; // 0 - 1.0
  improvementRate: number;
  status: KnowledgeStatus;
  lastAssessedAt?: string | null;
  updatedAt: string;
}

export interface Misconception {
  id: string;
  studentId: string;
  conceptId: string;
  title: string;
  description: string;
  evidence: string;
  confidence: number;
  status: MisconceptionStatus;
  firstDetected: string;
  lastDetected: string;
  resolvedAt?: string | null;
  diagnosticQuestion?: string;
  diagnosticOptions?: string[];
  correctOption?: number;
  explanation?: string;
}

export interface AssessmentAttempt {
  id: string;
  studentId: string;
  conceptId: string;
  questionId: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  confidenceScore: number;
  timeSpentSeconds: number;
  detectedMisconception?: string | null;
  createdAt: string;
}

export interface DiagnosticQuestion {
  id: string;
  conceptId: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  misconceptionMap?: Record<number, string>; // Maps option index to misconception
}

export interface NextBestAction {
  actionType: ActionType;
  conceptId: string;
  conceptTitle: string;
  track: string;
  reason: string;
  urgency: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  prerequisitesMet: boolean;
  misconceptionAlert?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
}

export interface CalibrationDataPoint {
  conceptId: string;
  conceptTitle: string;
  accuracy: number;
  confidence: number;
  quadrant: 'Overconfident' | 'Underconfident' | 'Mastered' | 'Gap';
  attempts: number;
  status: KnowledgeStatus;
}

export interface PedagogicalTutorResponse {
  intent: TutorIntent;
  directAnswer: string;
  intuition?: string;
  codeSnippet?: {
    language: string;
    code: string;
    explanation: string;
  };
  stepByStep?: string[];
  commonMistake?: {
    trap: string;
    correction: string;
  };
  quickCheck?: {
    question: string;
    hint: string;
    answer: string;
  };
  contextNote?: string;
  clarificationPrompt?: string;
}
