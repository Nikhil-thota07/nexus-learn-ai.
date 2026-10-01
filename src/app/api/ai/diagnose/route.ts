import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getAIProvider } from '@/lib/ai/provider';
import { CONCEPTS } from '@/data/curriculum';
import { executeTutorQuery } from '@/services/ai/tutorService';

export async function POST(req: NextRequest) {
  const session = await getSessionUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { conceptId, studentExplanation } = await req.json();

    if (!studentExplanation || typeof studentExplanation !== 'string') {
      return NextResponse.json({ error: 'Student input is required' }, { status: 400 });
    }

    const inputLower = studentExplanation.toLowerCase();

    // Check if the user is asking a general question, code generation, or tutor query
    // e.g. "write a code for simple calculator", "explain newton's law", "what are my subjects", "how to"
    const isCodeOrGeneralTutorQuery =
      inputLower.includes('write a code') ||
      inputLower.includes('write code') ||
      inputLower.includes('calculator') ||
      inputLower.includes('how to') ||
      inputLower.includes('what are my') ||
      inputLower.includes('create a') ||
      inputLower.includes('implement') ||
      inputLower.startsWith('why ') ||
      inputLower.startsWith('what is ') ||
      inputLower.startsWith('how ');

    if (isCodeOrGeneralTutorQuery) {
      const tutorResponse = await executeTutorQuery({
        studentId: session.id,
        question: studentExplanation,
        conceptId: conceptId || 'py-return',
      });

      // Format as compatible diagnostic response with rich code and steps
      const formattedDiagnosis = {
        isMisconception: tutorResponse.intent === 'MISCONCEPTION',
        misconceptionIdentified:
          tutorResponse.intent === 'CODE_REQUEST'
            ? 'Interactive Implementation Request'
            : tutorResponse.intent === 'EXAM_PREPARATION'
            ? 'Exam Concept & Problem Solving'
            : `Tutor Guidance (${tutorResponse.intent})`,
        explanation: tutorResponse.directAnswer + (tutorResponse.intuition ? `\n\n${tutorResponse.intuition}` : ''),
        codeSnippet: tutorResponse.codeSnippet,
        stepByStep: tutorResponse.stepByStep,
        commonMistake: tutorResponse.commonMistake,
        quickCheck: tutorResponse.quickCheck,
        minimalExample: tutorResponse.codeSnippet
          ? {
              incorrect: tutorResponse.commonMistake ? tutorResponse.commonMistake.trap : '# Potential pitfall without proper design',
              correct: tutorResponse.codeSnippet.code,
              contrastNote: tutorResponse.commonMistake ? tutorResponse.commonMistake.correction : tutorResponse.codeSnippet.explanation,
            }
          : undefined,
        confidenceAssessment: tutorResponse.contextNote || 'Personalized Pedagogical Response',
      };

      return NextResponse.json({
        success: true,
        provider: 'Nexus AI Pedagogical Pipeline',
        diagnosis: formattedDiagnosis,
        tutorResponse,
      });
    }

    // Otherwise, treat as targeted misconception probe for the current concept
    const concept = CONCEPTS.find((c) => c.id === conceptId);
    const conceptTitle = concept?.title || 'Programming Concept';

    const provider = getAIProvider();
    const diagnosis = await provider.diagnoseMisconception(conceptTitle, studentExplanation, concept?.description);

    return NextResponse.json({
      success: true,
      provider: provider.name,
      diagnosis,
    });
  } catch (err: any) {
    console.error('AI diagnosis API error:', err);
    return NextResponse.json({ error: err.message || 'Diagnosis generation failed' }, { status: 500 });
  }
}
