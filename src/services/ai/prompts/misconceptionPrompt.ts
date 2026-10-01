import { StudentContext } from '../studentContextBuilder';

export function buildMisconceptionPrompt(
  context: StudentContext,
  conceptTitle: string,
  studentInput: string
): string {
  return `You are Nexus Learn AI's Pedagogical Diagnostician.
Student Context: ${context.name}, Mode: ${context.preparationMode} (${context.branchName || context.educationLevel})
Concept under examination: "${conceptTitle}"
Student Explanation / Response: "${studentInput}"

Detect whether the student possesses a flawed mental model, overconfidence, or subtle conceptual misunderstanding.
Return ONLY valid JSON matching this schema:
{
  "isMisconception": true,
  "misconceptionIdentified": "concise name of misconception",
  "explanation": "clear, empathetic pedagogical correction contrasting incorrect vs correct mental models",
  "minimalExample": {
    "incorrect": "code snippet or formula illustrating student error",
    "correct": "code snippet or formula illustrating correct pattern",
    "contrastNote": "why the correction matters"
  },
  "practiceQuestion": {
    "question": "diagnostic question targeting this exact mistake",
    "options": ["opt0", "opt1", "opt2", "opt3"],
    "correctIndex": 0,
    "explanation": "thorough solution"
  },
  "confidenceAssessment": "Evaluation of whether the student's mental model is calibrated or vulnerable to false confidence"
}`;
}
