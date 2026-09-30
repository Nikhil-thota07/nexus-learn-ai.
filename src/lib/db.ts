import fs from 'fs';
import path from 'path';
import { CONCEPTS } from '@/data/curriculum';

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
  educationLevel?: string;
  qualification?: string;
  schoolCollege?: string;
  university?: string;
  branch?: string;
  year?: string;
  semester?: string;
  regulation?: string;
  subjects?: string;
  careerInterests?: string;
  targetExam?: string;
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

interface DatabaseSchema {
  users: UserRecord[];
  profiles: ProfileRecord[];
  knowledge: KnowledgeRecord[];
  misconceptions: MisconceptionRecord[];
  attempts: AttemptRecord[];
  youtubeCache: YouTubeCacheRecord[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'nexus_store.json');

function ensureStorage(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const initialData: DatabaseSchema = {
      users: [],
      profiles: [],
      knowledge: [],
      misconceptions: [],
      attempts: [],
      youtubeCache: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    const initialData: DatabaseSchema = {
      users: [],
      profiles: [],
      knowledge: [],
      misconceptions: [],
      attempts: [],
      youtubeCache: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function saveStorage(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const tempFile = `${DATA_FILE}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tempFile, DATA_FILE);
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
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      const store = ensureStorage();
      if (where.email) {
        return store.users.find((u) => u.email.toLowerCase() === where.email?.toLowerCase()) || null;
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
        // Expired
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
};
