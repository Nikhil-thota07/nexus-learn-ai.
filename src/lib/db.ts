import fs from 'fs';
import path from 'path';
import os from 'os';
import { CONCEPTS } from '@/data/curriculum';
import initialStoreData from '@/data/initial_store.json';

export interface UserRecord {
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

export interface ProfileRecord {
  id: string;
  userId: string;
  preparationMode?: 'JEE' | 'ENGINEERING' | 'SCHOOL' | 'SKILL';
  educationLevel?: string;
  qualification?: string;
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
  targetExam?: string;
  targetExamYear?: string;
  currentClass?: string;
  board?: string;
  schoolClass?: string;
  selectedSkill?: string;
  currentPreparationLevel?: string;
  subjects?: string;
  currentSubjectId?: string;
  currentTopicId?: string;
  careerInterests?: string;
  primaryGoal?: string;
  secondaryGoal?: string;
  preferredLanguage?: string;
  dailyStudyMinutes?: number;
  preferredStyle?: string;
  difficulty?: string;
  videoPreference?: string;
  updatedAt: string;
}

export interface KnowledgeRecord {
  id: string;
  studentId: string;
  conceptId: string;
  masteryScore: number;
  accuracy: number;
  confidence: number;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  averageTimeSeconds: number;
  difficulty: number;
  misconceptionRisk: number;
  improvementRate: number;
  status: 'NOT_STARTED' | 'LEARNING' | 'NEEDS_REVIEW' | 'MASTERED';
  lastAssessedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MisconceptionRecord {
  id: string;
  studentId: string;
  conceptId: string;
  title: string;
  description: string;
  evidence: string;
  confidence: number;
  status: 'ACTIVE' | 'RESOLVED' | 'MONITORING';
  firstDetected: string;
  lastDetected: string;
  resolvedAt?: string | null;
  diagnosticQuestion?: string;
  diagnosticOptions?: string;
  correctOption?: number;
  explanation?: string;
}

export interface AttemptRecord {
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

export interface YouTubeCacheRecord {
  id: string;
  queryKey: string;
  videosJson: string;
  cachedAt: string;
  expiresAt: string;
}

export interface CertificateRecord {
  id: string;
  studentId: string;
  fileName: string;
  fileType: string;
  fileDataBase64?: string;
  certificateTitle: string;
  certificateType: string;
  organization: string;
  eventName: string;
  issueDate: string;
  credentialId: string;
  description: string;
  extractionConfidence: number;
  verificationStatus: 'PENDING' | 'EXTRACTED' | 'VERIFIED' | 'FAILED';
  domains: Array<{ domain: string; confidence: number; evidenceLevel: string }>;
  skillsDetected: Array<{ skillName: string; confidence: number; evidenceLevel: string; validationStatus: 'PENDING' | 'ASSESSED' | 'VALIDATED' }>;
  evidenceLevel: 'EXPOSURE' | 'LEARNING' | 'DEMONSTRATED' | 'VERIFIED_ACHIEVEMENT';
  reasoningSummary: string;
  recommendedAssessment: string[];
  nextSkillRecommendations: Array<{ skill: string; reason: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  learningPathUpdates: string[];
  uploadedAt: string;
  detectedDomain?: string;
  experienceType?: string;
  exposureSummary?: string;
  personalizedNextSkillPath?: string[];
  verificationAdvice?: string;
  diagnosticQuestions?: Array<{
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    skillTested: string;
    difficulty: 'Fundamentals' | 'Intermediate' | 'Advanced';
  }>;
  assessmentResult?: {
    assessedAt: string;
    scorePercent: number;
    assessedSkills: Array<{ skill: string; score: number; status: 'Mastered' | 'Developing' | 'Needs Review' }>;
    weakAreas: string[];
    updatedLearningPath: string[];
    recommendedVideos: Array<{ videoId: string; title: string; channelTitle?: string }>;
    careerRoadmapNote?: string;
  };
}

export interface LinkedInProfileRecord {
  id: string;
  studentId: string;
  profileUrl: string;
  profileData: string;
  lastAnalyzedAt: string;
  analysisStatus: 'PENDING' | 'ANALYZED' | 'FAILED';
  dataSource: 'URL_PROVIDED' | 'PDF_UPLOAD' | 'TEXT_PASTE';
  skillsDetected: Array<{
    skillName: string;
    evidence: string;
    evidenceStrength: 'HIGH' | 'MEDIUM' | 'LOW';
    confidence: number;
    sourceSection: string;
  }>;
  experiences: Array<{
    title: string;
    organization: string;
    description: string;
    startDate: string;
    endDate: string;
    detectedSkills: string[];
  }>;
  projects: Array<{
    projectName: string;
    description: string;
    detectedSkills: string[];
    technologies: string[];
  }>;
  certifications: Array<{ name: string; organization: string; date: string }>;
  education: Array<{ degree: string; institution: string; year: string }>;
  headline: string;
  about: string;
  skillGaps: Array<{ skill: string; reason: string; priority: string }>;
  nextSkillRecommendations: Array<{ skill: string; reason: string; priority: string }>;
  careerAlignments: Array<{ role: string; alignmentScore: number; missingSkills: string[] }>;
  createdAt: string;
  updatedAt: string;
}

export interface SkillEvidenceRecord {
  id: string;
  studentId: string;
  skillName: string;
  sourceType: 'CERTIFICATE' | 'ASSESSMENT' | 'PROJECT' | 'LINKEDIN' | 'COURSE' | 'HACKATHON' | 'INTERNSHIP' | 'SELF_REPORTED';
  sourceId: string;
  evidenceLevel: 'EXPOSURE' | 'LEARNING' | 'DEMONSTRATED' | 'VERIFIED_ACHIEVEMENT';
  confidence: number;
  assessmentScore?: number;
  createdAt: string;
}

interface DatabaseSchema {
  users: UserRecord[];
  profiles: ProfileRecord[];
  knowledge: KnowledgeRecord[];
  misconceptions: MisconceptionRecord[];
  attempts: AttemptRecord[];
  youtubeCache: YouTubeCacheRecord[];
  certificates: CertificateRecord[];
  linkedinProfiles: LinkedInProfileRecord[];
  skillEvidence: SkillEvidenceRecord[];
}

let memoryStore: DatabaseSchema = { ...JSON.parse(JSON.stringify(initialStoreData)), certificates: [], linkedinProfiles: [], skillEvidence: [] };

function isServerless(): boolean {
  if (typeof process === 'undefined') return false;
  const cwd = process.cwd ? process.cwd() : '';
  return Boolean(
    process.env.VERCEL ||
    process.env.VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.LAMBDA_TASK_ROOT ||
    cwd.includes('task') ||
    cwd.includes('vercel') ||
    cwd.startsWith('/var') ||
    process.env.NODE_ENV === 'production'
  );
}

function ensureStorage(): DatabaseSchema {
  if (isServerless()) {
    return memoryStore;
  }

  // Local development on developer workstation:
  try {
    const localDir = path.join(process.cwd(), '.data');
    const localFile = path.join(localDir, 'nexus_store.json');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    if (fs.existsSync(localFile)) {
      const raw = fs.readFileSync(localFile, 'utf-8');
      const parsed: DatabaseSchema = JSON.parse(raw);
      if (!parsed.certificates) parsed.certificates = [];
      if (!parsed.linkedinProfiles) parsed.linkedinProfiles = [];
      if (!parsed.skillEvidence) parsed.skillEvidence = [];
      if (parsed.users && parsed.users.length > 0) {
        memoryStore = parsed;
        return memoryStore;
      }
    } else {
      fs.writeFileSync(localFile, JSON.stringify(memoryStore, null, 2), 'utf-8');
    }
  } catch (err) {
    // If local file I/O has any issues, memoryStore is ready
  }

  return memoryStore;
}

function saveStorage(data: DatabaseSchema) {
  memoryStore = data;
  if (!isServerless()) {
    try {
      const localDir = path.join(process.cwd(), '.data');
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }
      const localFile = path.join(localDir, 'nexus_store.json');
      const tempFile = `${localFile}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, localFile);
    } catch (err) {
      // Ignored
    }
  }
}

// Helper to seed initial knowledge state for a new student matching Prompt Section 1
export function seedStudentKnowledgeState(studentId: string) {
  const store = ensureStorage();

  // Python Track baseline
  const seedConfigs: Record<string, { mastery: number; accuracy: number; conf: number; attempts: number; correct: number; incorrect: number; status: 'NOT_STARTED' | 'LEARNING' | 'NEEDS_REVIEW' | 'MASTERED' }> = {
    'py-basics': { mastery: 95, accuracy: 96, conf: 92, attempts: 12, correct: 11, incorrect: 1, status: 'MASTERED' },
    'py-vars': { mastery: 90, accuracy: 88, conf: 85, attempts: 10, correct: 9, incorrect: 1, status: 'MASTERED' },
    'py-control': { mastery: 85, accuracy: 82, conf: 80, attempts: 10, correct: 8, incorrect: 2, status: 'MASTERED' },
    'py-functions': { mastery: 80, accuracy: 78, conf: 75, attempts: 9, correct: 7, incorrect: 2, status: 'LEARNING' },
    'py-params': { mastery: 76, accuracy: 74, conf: 70, attempts: 8, correct: 6, incorrect: 2, status: 'LEARNING' },
    // SPECIFIC REQUIREMENT FROM SECTION 1:
    // Return Values: 31% mastery, Low accuracy, High confidence, Repeated misconception
    'py-return': { mastery: 31, accuracy: 28, conf: 88, attempts: 7, correct: 2, incorrect: 5, status: 'NEEDS_REVIEW' },
    'py-scope': { mastery: 38, accuracy: 35, conf: 45, attempts: 5, correct: 2, incorrect: 3, status: 'NEEDS_REVIEW' },
    'py-recursion': { mastery: 0, accuracy: 0, conf: 50, attempts: 0, correct: 0, incorrect: 0, status: 'NOT_STARTED' },
    'jee-kinematics': { mastery: 70, accuracy: 68, conf: 65, attempts: 6, correct: 4, incorrect: 2, status: 'LEARNING' },
    'jee-newton': { mastery: 45, accuracy: 42, conf: 50, attempts: 4, correct: 2, incorrect: 2, status: 'NEEDS_REVIEW' },
    'btech-os-processes': { mastery: 65, accuracy: 62, conf: 60, attempts: 5, correct: 3, incorrect: 2, status: 'LEARNING' },
    'btech-os-deadlocks': { mastery: 40, accuracy: 38, conf: 45, attempts: 4, correct: 1, incorrect: 3, status: 'NEEDS_REVIEW' },
  };

  const now = new Date().toISOString();

  CONCEPTS.forEach((concept) => {
    const existing = store.knowledge.find(
      (k) => k.studentId === studentId && k.conceptId === concept.id
    );
    if (!existing) {
      const cfg = seedConfigs[concept.id] || {
        mastery: 0,
        accuracy: 0,
        conf: 50,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        status: 'NOT_STARTED',
      };

      store.knowledge.push({
        id: `k_${studentId}_${concept.id}`,
        studentId,
        conceptId: concept.id,
        masteryScore: cfg.mastery,
        accuracy: cfg.accuracy,
        confidence: cfg.conf,
        attempts: cfg.attempts,
        correctAttempts: cfg.correct,
        incorrectAttempts: cfg.incorrect,
        averageTimeSeconds: 35,
        difficulty: concept.difficulty,
        misconceptionRisk: concept.id === 'py-return' ? 0.85 : 0.15,
        improvementRate: concept.id === 'py-return' ? -0.1 : 0.2,
        status: cfg.status,
        lastAssessedAt: cfg.attempts > 0 ? now : null,
        createdAt: now,
        updatedAt: now,
      });
    }
  });

  // Seed the active misconception for py-return if not already present
  const existingMisc = store.misconceptions.find(
    (m) => m.studentId === studentId && m.conceptId === 'py-return' && m.status === 'ACTIVE'
  );

  if (!existingMisc) {
    store.misconceptions.push({
      id: `misc_${studentId}_py_return`,
      studentId,
      conceptId: 'py-return',
      title: 'Confusing return with print()',
      description: 'You understand how to define and call functions, but you are confusing `return` with displaying output using `print()`.',
      evidence: 'Student consistently predicted that print() inside a function stores the output into calling variables across 3 separate diagnostic questions with high confidence (88%).',
      confidence: 88,
      status: 'ACTIVE',
      firstDetected: now,
      lastDetected: now,
      resolvedAt: null,
      diagnosticQuestion: 'What does a function evaluate to if it contains print("Hello") but no return statement?',
      diagnosticOptions: JSON.stringify(['"Hello"', 'None', 'True', '0']),
      correctOption: 1,
      explanation: 'print() is a side-effect that displays characters on the monitor. A function without an explicit return statement always yields None in Python.',
    });
  }

  saveStorage(store);
}

// Database client abstraction
export const db = {
  user: {
    findMany: async ({ where }: { where?: Partial<UserRecord> } = {}) => {
      const store = ensureStorage();
      if (!where || Object.keys(where).length === 0) return store.users;
      return store.users.filter((u) => {
        return Object.entries(where).every(([key, val]) => (u as any)[key] === val);
      });
    },
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const store = ensureStorage();
      if (where.email) {
        return store.users.find((u) => u.email.toLowerCase().trim() === where.email?.toLowerCase().trim()) || null;
      }
      if (where.id) {
        return store.users.find((u) => u.id === where.id) || null;
      }
      return null;
    },
    create: async ({ data }: { data: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'> }) => {
      const store = ensureStorage();
      const id = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = new Date().toISOString();
      const newUser: UserRecord = {
        id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      store.users.push(newUser);
      saveStorage(store);
      // Automatically seed initial knowledge state and misconception
      seedStudentKnowledgeState(id);
      return newUser;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<UserRecord> }) => {
      const store = ensureStorage();
      const index = store.users.findIndex((u) => u.id === where.id);
      if (index === -1) throw new Error('User not found');
      store.users[index] = {
        ...store.users[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveStorage(store);
      return store.users[index];
    },
  },

  studentProfile: {
    findMany: async ({ where }: { where?: Partial<ProfileRecord> } = {}) => {
      const store = ensureStorage();
      if (!where || Object.keys(where).length === 0) return store.profiles;
      return store.profiles.filter((p) => {
        return Object.entries(where).every(([key, val]) => (p as any)[key] === val);
      });
    },
    findUnique: async ({ where }: { where: { userId: string } }) => {
      const store = ensureStorage();
      return store.profiles.find((p) => p.userId === where.userId) || null;
    },
    upsert: async ({
      where,
      update,
      create,
    }: {
      where: { userId: string };
      update: Partial<ProfileRecord>;
      create: Omit<ProfileRecord, 'id' | 'updatedAt'>;
    }) => {
      const store = ensureStorage();
      const index = store.profiles.findIndex((p) => p.userId === where.userId);
      const now = new Date().toISOString();
      if (index >= 0) {
        store.profiles[index] = {
          ...store.profiles[index],
          ...update,
          updatedAt: now,
        };
        saveStorage(store);
        return store.profiles[index];
      } else {
        const id = `prof_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newProf: ProfileRecord = {
          id,
          ...create,
          updatedAt: now,
        };
        store.profiles.push(newProf);
        saveStorage(store);
        return newProf;
      }
    },
  },

  knowledgeState: {
    findMany: async ({ where }: { where: { studentId: string } }) => {
      const store = ensureStorage();
      return store.knowledge.filter((k) => k.studentId === where.studentId);
    },
    findUnique: async ({ where }: { where: { studentId_conceptId: { studentId: string; conceptId: string } } }) => {
      const store = ensureStorage();
      return (
        store.knowledge.find(
          (k) =>
            k.studentId === where.studentId_conceptId.studentId &&
            k.conceptId === where.studentId_conceptId.conceptId
        ) || null
      );
    },
    upsert: async ({
      where,
      update,
      create,
    }: {
      where: { studentId_conceptId: { studentId: string; conceptId: string } };
      update: Partial<KnowledgeRecord>;
      create: Omit<KnowledgeRecord, 'id' | 'createdAt' | 'updatedAt'>;
    }) => {
      const store = ensureStorage();
      const index = store.knowledge.findIndex(
        (k) =>
          k.studentId === where.studentId_conceptId.studentId &&
          k.conceptId === where.studentId_conceptId.conceptId
      );
      const now = new Date().toISOString();
      if (index >= 0) {
        store.knowledge[index] = {
          ...store.knowledge[index],
          ...update,
          updatedAt: now,
        };
        saveStorage(store);
        return store.knowledge[index];
      } else {
        const id = `k_${where.studentId_conceptId.studentId}_${where.studentId_conceptId.conceptId}`;
        const newRec: KnowledgeRecord = {
          id,
          ...create,
          createdAt: now,
          updatedAt: now,
        };
        store.knowledge.push(newRec);
        saveStorage(store);
        return newRec;
      }
    },
  },

  misconception: {
    findMany: async ({ where }: { where: { studentId: string; status?: string } }) => {
      const store = ensureStorage();
      return store.misconceptions.filter(
        (m) =>
          m.studentId === where.studentId &&
          (!where.status || m.status === where.status)
      );
    },
    findFirst: async ({ where }: { where: { studentId: string; conceptId: string; status?: string } }) => {
      const store = ensureStorage();
      return (
        store.misconceptions.find(
          (m) =>
            m.studentId === where.studentId &&
            m.conceptId === where.conceptId &&
            (!where.status || m.status === where.status)
        ) || null
      );
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<MisconceptionRecord> }) => {
      const store = ensureStorage();
      const index = store.misconceptions.findIndex((m) => m.id === where.id);
      if (index === -1) throw new Error('Misconception not found');
      store.misconceptions[index] = {
        ...store.misconceptions[index],
        ...data,
      };
      saveStorage(store);
      return store.misconceptions[index];
    },
    create: async ({ data }: { data: Omit<MisconceptionRecord, 'id'> }) => {
      const store = ensureStorage();
      const id = `misc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newMisc: MisconceptionRecord = {
        id,
        ...data,
      };
      store.misconceptions.push(newMisc);
      saveStorage(store);
      return newMisc;
    },
  },

  attempt: {
    findMany: async ({ where }: { where: { studentId: string; conceptId?: string } }) => {
      const store = ensureStorage();
      return store.attempts.filter(
        (a) =>
          a.studentId === where.studentId &&
          (!where.conceptId || a.conceptId === where.conceptId)
      );
    },
    create: async (args: { studentId?: string; conceptId?: string; questionId?: string; questionText?: string; selectedAnswer?: string; correctAnswer?: string; isCorrect?: boolean; confidenceScore?: number; timeSpentSeconds?: number; detectedMisconception?: string | null; data?: Omit<AttemptRecord, 'id' | 'createdAt'> }) => {
      const store = ensureStorage();
      const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const recordData = args.data || (args as Omit<AttemptRecord, 'id' | 'createdAt'>);
      const newAtt: AttemptRecord = {
        id,
        studentId: recordData.studentId || '',
        conceptId: recordData.conceptId || '',
        questionId: recordData.questionId || '',
        questionText: recordData.questionText || '',
        selectedAnswer: recordData.selectedAnswer || '',
        correctAnswer: recordData.correctAnswer || '',
        isCorrect: recordData.isCorrect ?? true,
        confidenceScore: recordData.confidenceScore || 50,
        timeSpentSeconds: recordData.timeSpentSeconds || 60,
        detectedMisconception: recordData.detectedMisconception || null,
        createdAt: new Date().toISOString(),
      };
      store.attempts.push(newAtt);
      saveStorage(store);
      return newAtt;
    },
  },

  assessmentAttempt: {
    findMany: async ({ where }: { where: { studentId: string; conceptId?: string } }) => {
      const store = ensureStorage();
      return store.attempts.filter(
        (a) =>
          a.studentId === where.studentId &&
          (!where.conceptId || a.conceptId === where.conceptId)
      );
    },
    create: async ({ data }: { data: Omit<AttemptRecord, 'id' | 'createdAt'> }) => {
      const store = ensureStorage();
      const id = `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newAtt: AttemptRecord = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
      };
      store.attempts.push(newAtt);
      saveStorage(store);
      return newAtt;
    },
  },

  youtubeCache: {
    findUnique: async ({ where }: { where: { queryKey: string } }) => {
      const store = ensureStorage();
      const cached = store.youtubeCache.find((c) => c.queryKey === where.queryKey);
      if (!cached) return null;
      if (new Date(cached.expiresAt).getTime() < Date.now()) {
        store.youtubeCache = store.youtubeCache.filter((c) => c.queryKey !== where.queryKey);
        saveStorage(store);
        return null;
      }
      return cached;
    },
    set: async (queryKey: string, videosJson: string, ttlHours = 24) => {
      const store = ensureStorage();
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlHours * 60 * 60 * 1000).toISOString();
      const index = store.youtubeCache.findIndex((c) => c.queryKey === queryKey);
      if (index >= 0) {
        store.youtubeCache[index] = {
          id: store.youtubeCache[index].id,
          queryKey,
          videosJson,
          cachedAt: now.toISOString(),
          expiresAt,
        };
      } else {
        store.youtubeCache.push({
          id: `yt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          queryKey,
          videosJson,
          cachedAt: now.toISOString(),
          expiresAt,
        });
      }
      saveStorage(store);
    },
  },

  certificate: {
    findMany: async ({ where }: { where?: Partial<CertificateRecord> } = {}) => {
      const store = ensureStorage();
      if (!where || Object.keys(where).length === 0) return store.certificates;
      return store.certificates.filter((c) => Object.entries(where).every(([key, val]) => (c as any)[key] === val));
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const store = ensureStorage();
      return store.certificates.find((c) => c.id === where.id) || null;
    },
    create: async ({ data }: { data: CertificateRecord }) => {
      const store = ensureStorage();
      store.certificates.push(data);
      saveStorage(store);
      return data;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<CertificateRecord> }) => {
      const store = ensureStorage();
      const index = store.certificates.findIndex((c) => c.id === where.id);
      if (index === -1) throw new Error('Certificate not found');
      store.certificates[index] = { ...store.certificates[index], ...data };
      saveStorage(store);
      return store.certificates[index];
    },
    delete: async ({ where }: { where: { id: string; studentId?: string } }) => {
      const store = ensureStorage();
      store.certificates = store.certificates.filter((c) => {
        if (c.id === where.id) {
          if (where.studentId && c.studentId !== where.studentId) return true; // Keep it if studentId mismatch
          return false; // delete
        }
        return true;
      });
      saveStorage(store);
      return { success: true };
    },
  },

  linkedinProfile: {
    findFirst: async ({ where }: { where: { studentId: string } }) => {
      const store = ensureStorage();
      return store.linkedinProfiles.find((p) => p.studentId === where.studentId) || null;
    },
    create: async ({ data }: { data: LinkedInProfileRecord }) => {
      const store = ensureStorage();
      store.linkedinProfiles.push(data);
      saveStorage(store);
      return data;
    },
    update: async ({ where, data }: { where: { id: string }; data: Partial<LinkedInProfileRecord> }) => {
      const store = ensureStorage();
      const index = store.linkedinProfiles.findIndex((p) => p.id === where.id);
      if (index === -1) throw new Error('LinkedIn Profile not found');
      store.linkedinProfiles[index] = { ...store.linkedinProfiles[index], ...data };
      saveStorage(store);
      return store.linkedinProfiles[index];
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const store = ensureStorage();
      store.linkedinProfiles = store.linkedinProfiles.filter((p) => p.id !== where.id);
      saveStorage(store);
      return { success: true };
    },
  },

  skillEvidence: {
    findMany: async ({ where }: { where?: Partial<SkillEvidenceRecord> } = {}) => {
      const store = ensureStorage();
      if (!where || Object.keys(where).length === 0) return store.skillEvidence;
      return store.skillEvidence.filter((e) => Object.entries(where).every(([key, val]) => (e as any)[key] === val));
    },
    create: async ({ data }: { data: SkillEvidenceRecord }) => {
      const store = ensureStorage();
      store.skillEvidence.push(data);
      saveStorage(store);
      return data;
    },
  },
};
