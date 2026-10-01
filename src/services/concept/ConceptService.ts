import { CONCEPTS, DIAGNOSTIC_QUESTIONS } from '@/data/curriculum';
import { Concept, DiagnosticQuestion, YouTubeVideo } from '@/types';
import { ComprehensiveStudentContext } from '@/services/context/StudentContextService';
import { searchEducationalVideos } from '@/lib/youtube/service';
import { AUTHORITATIVE_SYLLABI } from '@/data/syllabi';

export interface EnrichedConceptDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  subjectName?: string;
  subjectCode?: string;
  unitNumber?: number;
  unitTitle?: string;
  topicName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedLearningMinutes: number;
  whyItMatters: string;
  prerequisites: { id: string; title: string; threshold: number }[];
  simpleExplanation: string;
  detailedExplanation: string;
  workedExample: {
    problem: string;
    solution: string;
    explanation: string;
  };
  commonMistakes: {
    trap: string;
    correction: string;
  }[];
  keyPoints: string[];
  practiceQuestions: {
    question: string;
    type: string;
    difficulty: string;
    answer: string;
  }[];
  relatedConcepts: string[];
  recommendedVideos: YouTubeVideo[];
  quickAssessment?: DiagnosticQuestion;
}

// In-memory cache for dynamic concepts
const DYNAMIC_CONCEPT_CACHE: Record<string, EnrichedConceptDetail> = {};

export class ConceptService {
  /**
   * Resolves concept details through DB, syllabus, or AI generation.
   * NEVER returns null if context can be derived.
   */
  static async getConcept(
    conceptId: string,
    context?: ComprehensiveStudentContext
  ): Promise<EnrichedConceptDetail> {
    const cleanId = conceptId.trim().toLowerCase();

    // 1. Check dynamic cache
    if (DYNAMIC_CONCEPT_CACHE[cleanId]) {
      return DYNAMIC_CONCEPT_CACHE[cleanId];
    }

    // 2. Check curated curriculum (CONCEPTS)
    const baseDef = CONCEPTS.find((c) => c.id.toLowerCase() === cleanId);

    // 3. Search Authoritative Syllabus
    let syllabusMatch: {
      concept: { id: string; title: string; description: string };
      subject: any;
      unit: any;
      topic?: string;
    } | null = null;

    const candidateSyllabi = context?.authoritativeSyllabus
      ? [context.authoritativeSyllabus]
      : Object.values(AUTHORITATIVE_SYLLABI);

    for (const syl of candidateSyllabi) {
      for (const sub of syl.subjects) {
        for (const unit of sub.units) {
          for (const c of unit.concepts) {
            if (
              c.id.toLowerCase() === cleanId ||
              cleanId.includes(c.id.toLowerCase()) ||
              c.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(cleanId)
            ) {
              syllabusMatch = {
                concept: c,
                subject: sub,
                unit: unit,
                topic: unit.topics[0] || unit.title,
              };
              break;
            }
          }
          if (syllabusMatch) break;
        }
        if (syllabusMatch) break;
      }
      if (syllabusMatch) break;
    }

    const title = syllabusMatch?.concept.title || baseDef?.title || cleanId.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const subjectName = syllabusMatch?.subject.name || context?.currentSubject?.name || 'Engineering Curriculum';
    const subjectCode = syllabusMatch?.subject.code || context?.currentSubject?.code || 'CS101';
    const unitTitle = syllabusMatch?.unit.title || 'Core Foundation Unit';
    const unitNumber = syllabusMatch?.unit.unitNumber || 1;
    const topicName = syllabusMatch?.topic || 'Curriculum Concept';

    // 4. Try generating enriched content via OpenAI if API key present
    let aiEnriched: Partial<EnrichedConceptDetail> | null = null;
    const openAiKey = process.env.OPENAI_API_KEY;

    if (openAiKey) {
      try {
        const prompt = `You are a Senior Engineering Professor at ${context?.university || 'JNTUH'}.
Generate a comprehensive, pedagogically sound study breakdown for the following engineering concept:
Concept: ${title}
Subject: ${subjectName} (${subjectCode})
Unit: Unit ${unitNumber} - ${unitTitle}
Topic: ${topicName}
Regulation: ${context?.regulation || 'R25'}
Academic Level: B.Tech 1st/2nd Year

Output strictly valid JSON matching this schema:
{
  "whyItMatters": "string",
  "difficulty": "Easy | Medium | Hard",
  "estimatedLearningMinutes": 45,
  "simpleExplanation": "string",
  "detailedExplanation": "string",
  "workedExample": {
    "problem": "string",
    "solution": "string",
    "explanation": "string"
  },
  "commonMistakes": [
    { "trap": "string", "correction": "string" }
  ],
  "keyPoints": ["point 1", "point 2", "point 3"],
  "practiceQuestions": [
    { "question": "string", "type": "Short Answer", "difficulty": "Medium", "answer": "string" }
  ],
  "relatedConcepts": ["concept A", "concept B"]
}`;

        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${openAiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are an authoritative engineering educator. Output only JSON.' },
              { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          aiEnriched = JSON.parse(data.choices[0].message.content);
        }
      } catch (err) {
        console.warn('OpenAI concept enrichment failed, using deterministic fallback:', err);
      }
    }

    // 5. Fetch YouTube Videos
    const videos = await searchEducationalVideos(
      `${context?.university || 'JNTUH'} ${subjectName} ${title}`,
      cleanId
    );

    // 6. Resolve Diagnostic Assessment
    const matchedDiag: DiagnosticQuestion | undefined = DIAGNOSTIC_QUESTIONS.find((q) => q.conceptId === cleanId) || {
      id: `diag-${cleanId}`,
      conceptId: cleanId,
      question: `Which of the following is the fundamental governing property of ${title}?`,
      codeSnippet: undefined,
      options: [
        `It satisfies the foundational boundary conditions and structural invariants of ${subjectName}.`,
        `It operates as an unconstrained heuristic without mathematical guarantees.`,
        `It only applies to legacy architectures prior to modern standards.`,
        `It requires global external synchronization across all threads.`,
      ],
      correctIndex: 0,
      explanation: `${title} is rooted in the formal engineering principles defined in the authoritative university syllabus for ${subjectName}.`,
    };

    // 7. Compose Final Enriched Concept
    const enriched: EnrichedConceptDetail = {
      id: cleanId,
      title,
      description: syllabusMatch?.concept.description || baseDef?.description || `Authoritative educational module for ${title} in ${subjectName}.`,
      category: (baseDef as any)?.category || baseDef?.trackName || 'Professional Engineering Science',
      subjectName,
      subjectCode,
      unitNumber,
      unitTitle,
      topicName,
      difficulty: (aiEnriched?.difficulty as any) || (baseDef?.difficulty ? (baseDef.difficulty > 3 ? 'Hard' : 'Medium') : 'Medium'),
      estimatedLearningMinutes: aiEnriched?.estimatedLearningMinutes || 45,
      whyItMatters: aiEnriched?.whyItMatters || `${title} forms a foundational pillar in ${subjectName}. Mastering it is essential for university examinations and practical system design.`,
      prerequisites: (baseDef?.prerequisiteIds || []).map((pid) => ({
        id: pid,
        title: CONCEPTS.find((c) => c.id === pid)?.title || pid,
        threshold: 75,
      })),
      simpleExplanation:
        aiEnriched?.simpleExplanation ||
        `${title} provides the structural rules and analytical methods used to solve problems in ${subjectName}. Focus on understanding how inputs map systematically to valid outputs.`,
      detailedExplanation:
        aiEnriched?.detailedExplanation ||
        `In ${subjectName} (${context?.regulation || 'R25'}), ${title} is analyzed rigorously. You must understand:
1. Mathematical and algorithmic formulation: The analytical framework and governing equations.
2. Step-by-step execution: How standard problems are solved methodically from first principles.
3. System constraints: Boundary conditions, corner cases, and efficiency trade-offs.`,
      workedExample: aiEnriched?.workedExample || {
        problem: `Analyze a standard benchmark case of ${title} for ${subjectName}.`,
        solution: `Step 1: State known parameters and boundary conditions.\nStep 2: Apply the governing formula or algorithm.\nStep 3: Simplify and verify consistency with dimension/units.`,
        explanation: `Demonstrates the core mechanics of ${title} applied to university problem-solving standards.`,
      },
      commonMistakes: aiEnriched?.commonMistakes || [
        {
          trap: `Confusing syntax/display side-effects with actual state transitions or algebraic results.`,
          correction: `Always track variables, memory allocations, or mathematical signs explicitly through every step.`,
        },
      ],
      keyPoints: aiEnriched?.keyPoints || [
        `Grounded in ${context?.university || 'JNTUH'} ${context?.regulation || 'R25'} syllabus standards.`,
        `Directly tested in university mid-semester and end-semester examinations.`,
        `Pre-requisite for downstream advanced coursework.`,
      ],
      practiceQuestions: aiEnriched?.practiceQuestions || [
        {
          question: `Explain the fundamental concept of ${title} with a neat diagram or code snippet.`,
          type: 'University Exam Question (8 Marks)',
          difficulty: 'Medium',
          answer: `Define the concept, state the governing equation or structure, and illustrate with a standard worked example.`,
        },
      ],
      relatedConcepts: aiEnriched?.relatedConcepts || ['Foundations of Engineering Analysis', 'System Design Patterns'],
      recommendedVideos: videos,
      quickAssessment: matchedDiag,
    };

    DYNAMIC_CONCEPT_CACHE[cleanId] = enriched;
    return enriched;
  }
}
