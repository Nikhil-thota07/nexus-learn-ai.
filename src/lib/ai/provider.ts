export interface DiagnosticResponse {
  isMisconception: boolean;
  misconceptionIdentified: string;
  explanation: string;
  minimalExample: {
    incorrect: string;
    correct: string;
    contrastNote: string;
  };
  practiceQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  confidenceAssessment: string;
}

export interface AIProvider {
  name: string;
  diagnoseMisconception(
    conceptTitle: string,
    studentInput: string,
    context?: string
  ): Promise<DiagnosticResponse>;
  generateCurriculum(
    subject: string,
    targetGoal: string,
    weeks: number
  ): Promise<{
    title: string;
    description: string;
    prerequisites: string[];
    modules: {
      week: number;
      title: string;
      topics: string[];
      checkpointProject: string;
    }[];
  }>;
}

class OpenAIProvider implements AIProvider {
  name = 'OpenAI';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async diagnoseMisconception(
    conceptTitle: string,
    studentInput: string,
    context?: string
  ): Promise<DiagnosticResponse> {
    if (!this.apiKey) {
      return fallbackDiagnostic(conceptTitle, studentInput);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are Nexus Learn AI's Lead Pedagogical Architect. Analyze the student's explanation for concept "${conceptTitle}".
Detect subtle conceptual errors, overconfidence, and misconceptions.
Respond ONLY with a JSON object adhering to this schema:
{
  "isMisconception": boolean,
  "misconceptionIdentified": "concise name of misconception",
  "explanation": "clear, empathetic pedagogical correction contrasting incorrect vs correct mental models",
  "minimalExample": {
    "incorrect": "code snippet illustrating student error",
    "correct": "code snippet illustrating correct pattern",
    "contrastNote": "why the correction matters"
  },
  "practiceQuestion": {
    "question": "diagnostic question targeting this exact mistake",
    "options": ["opt0", "opt1", "opt2", "opt3"],
    "correctIndex": 0,
    "explanation": "thorough solution"
  },
  "confidenceAssessment": "Evaluation of whether the student's mental model is calibrated or vulnerable to false confidence"
}`,
            },
            {
              role: 'user',
              content: `Context: ${context || 'Learning'}\nStudent Explanation / Response: "${studentInput}"`,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        console.warn('OpenAI API returned non-200. Falling back to local diagnostic engine.');
        return fallbackDiagnostic(conceptTitle, studentInput);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (err) {
      console.warn('OpenAI diagnosis failed, falling back:', err);
      return fallbackDiagnostic(conceptTitle, studentInput);
    }
  }

  async generateCurriculum(subject: string, targetGoal: string, weeks: number) {
    return fallbackCurriculum(subject, targetGoal, weeks);
  }
}

class GeminiProvider implements AIProvider {
  name = 'Gemini';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async diagnoseMisconception(
    conceptTitle: string,
    studentInput: string,
    context?: string
  ): Promise<DiagnosticResponse> {
    if (!this.apiKey) {
      return fallbackDiagnostic(conceptTitle, studentInput);
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      const prompt = `You are Nexus Learn AI's Pedagogical Diagnostician.
Student Concept: "${conceptTitle}"
Student Explanation: "${studentInput}"
Context: "${context || ''}"

Return ONLY a valid JSON object:
{
  "isMisconception": true,
  "misconceptionIdentified": "name",
  "explanation": "empathetic diagnostic explanation",
  "minimalExample": {
    "incorrect": "code",
    "correct": "code",
    "contrastNote": "note"
  },
  "practiceQuestion": {
    "question": "question",
    "options": ["A", "B", "C", "D"],
    "correctIndex": 1,
    "explanation": "explanation"
  },
  "confidenceAssessment": "calibration note"
}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (!res.ok) {
        return fallbackDiagnostic(conceptTitle, studentInput);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return JSON.parse(rawText);
    } catch (err) {
      return fallbackDiagnostic(conceptTitle, studentInput);
    }
  }

  async generateCurriculum(subject: string, targetGoal: string, weeks: number) {
    return fallbackCurriculum(subject, targetGoal, weeks);
  }
}

class LocalEdTechProvider implements AIProvider {
  name = 'Nexus Intelligent Engine';

  async diagnoseMisconception(
    conceptTitle: string,
    studentInput: string,
    context?: string
  ): Promise<DiagnosticResponse> {
    return fallbackDiagnostic(conceptTitle, studentInput);
  }

  async generateCurriculum(subject: string, targetGoal: string, weeks: number) {
    return fallbackCurriculum(subject, targetGoal, weeks);
  }
}

function fallbackDiagnostic(conceptTitle: string, studentInput: string): DiagnosticResponse {
  const lower = studentInput.toLowerCase();
  const isPrintReturnConfusion =
    lower.includes('print') ||
    lower.includes('display') ||
    lower.includes('show') ||
    conceptTitle.toLowerCase().includes('return');

  if (isPrintReturnConfusion) {
    return {
      isMisconception: true,
      misconceptionIdentified: 'Confusing return with print()',
      explanation:
        'You understand how to define and call functions, but you are confusing `return` with displaying output using `print()`. `print()` sends characters to the console display for humans to read, but does NOT allow the program to store or reuse that result. In contrast, `return` passes the computed object directly back to the caller.',
      minimalExample: {
        incorrect: `def calculate_price(item):\n    print(item * 1.18) # Only prints to screen\n\ntotal = calculate_price(100)\n# total is None! total + 10 raises TypeError!`,
        correct: `def calculate_price(item):\n    return item * 1.18 # Returns value to caller\n\ntotal = calculate_price(100)\n# total is 118.0! total + 10 is 128.0`,
        contrastNote:
          '`return` hands back real data that can be assigned to variables and passed to other functions. `print()` only creates a temporary visual side-effect.',
      },
      practiceQuestion: {
        question:
          'A developer writes: `def get_status(): print("ACTIVE")`. Then they run `status = get_status()`. What is `status`?',
        options: ['"ACTIVE"', 'None', 'True', '1'],
        correctIndex: 1,
        explanation:
          'Because get_status() does not specify a return statement, Python automatically returns None. The word "ACTIVE" appears on console, but variable status receives None.',
      },
      confidenceAssessment:
        'High risk of false confidence: Students frequently assume that seeing output on the screen implies the variable was assigned correctly.',
    };
  }

  return {
    isMisconception: true,
    misconceptionIdentified: `Conceptual Gap in ${conceptTitle}`,
    explanation: `Your understanding of ${conceptTitle} shows that certain operational guarantees are being conflated with side-effects. Focus on distinguishing data mutation from state access.`,
    minimalExample: {
      incorrect: `# Misapplied assumption in ${conceptTitle}\nx = compute(data) # Assuming synchronous instant mutation`,
      correct: `# Correct pattern in ${conceptTitle}\nx = compute(data.copy())\nreturn x.process()`,
      contrastNote: 'Explicit data flow prevents accidental state contamination.',
    },
    practiceQuestion: {
      question: `Which approach ensures pure functional integrity when working with ${conceptTitle}?`,
      options: [
        'Mutating arguments directly in place',
        'Returning a newly computed value without external side effects',
        'Relying on global variables to pass state',
        'Calling print() before assigning',
      ],
      correctIndex: 1,
      explanation: 'Pure functions avoid side effects and return explicit values.',
    },
    confidenceAssessment: 'Calibration needed: Review the underlying memory and execution models.',
  };
}

function fallbackCurriculum(subject: string, targetGoal: string, weeks: number) {
  return {
    title: `Adaptive ${subject} Roadmap for ${targetGoal}`,
    description: `A precision curriculum generated by Nexus Learn AI calibrated for mastery in ${weeks} weeks.`,
    prerequisites: ['Basic logical reasoning', 'Command line familiarity'],
    modules: [
      {
        week: 1,
        title: 'Core Fundamentals & Execution Semantics',
        topics: ['Syntax rules', 'Data types & Memory references', 'Control flow'],
        checkpointProject: 'Interactive CLI State Machine',
      },
      {
        week: 2,
        title: 'Modularity, Functions & Scope Isolation',
        topics: ['Function signatures', 'Parameters vs Arguments', 'Return values vs Side-effects', 'LEGB Scope'],
        checkpointProject: 'Financial Tax & Discount Calculator Engine',
      },
      {
        week: 3,
        title: 'Data Structures & Algorithmic Complexity',
        topics: ['Lists, Sets, Dictionaries', 'Time and Space Big-O', 'Iterators & Generators'],
        checkpointProject: 'In-Memory Key-Value Cache with Eviction',
      },
      {
        week: Math.max(4, weeks),
        title: 'Production Readiness & Advanced Architecture',
        topics: ['Error handling & Custom Exceptions', 'Object Oriented Design', 'Testing & Profiling'],
        checkpointProject: 'Full-Scale Capstone Application',
      },
    ],
  };
}

export function getAIProvider(): AIProvider {
  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const openAiKey = process.env.OPENAI_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';

  if (provider === 'gemini' && geminiKey) {
    return new GeminiProvider(geminiKey);
  }
  if (provider === 'openai' && openAiKey) {
    return new OpenAIProvider(openAiKey);
  }
  return new LocalEdTechProvider();
}
