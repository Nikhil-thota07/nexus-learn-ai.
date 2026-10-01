import { StudentContext } from '../studentContextBuilder';

export function buildAssessmentPrompt(
  context: StudentContext,
  conceptTitle: string,
  difficulty: number
): string {
  return `You are Nexus Learn AI's Adaptive Assessment Designer.
Target Concept: "${conceptTitle}"
Student Level: ${context.preparationMode} (${context.branchName || context.educationLevel})
Target Difficulty: ${difficulty} (on scale 1 to 5)

Generate a diagnostic multiple-choice question designed to probe genuine conceptual mastery and uncover known misconceptions.
Return ONLY valid JSON matching this schema:
{
  "question": "Question text",
  "codeSnippet": "Optional code or equation snippet if relevant, else null",
  "options": [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  "correctIndex": 0,
  "explanation": "Detailed pedagogical explanation of why the correct option holds and why distractors are traps.",
  "misconceptionMap": {
    "1": "Misconception associated with Option B",
    "2": "Misconception associated with Option C",
    "3": "Misconception associated with Option D"
  }
}`;
}
