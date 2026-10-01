import { StudentContext } from '../studentContextBuilder';

export function buildLearningPathPrompt(
  context: StudentContext
): string {
  return `You are Nexus Learn AI's Learning Path Optimizer.
Student Profile:
- Mode: ${context.preparationMode}
- Degree/Branch: ${context.branchName} (${context.regulation || 'Official'})
- Mastered Concepts: ${context.masteredConcepts.join(', ') || 'None'}
- Weak / Needs Review Concepts: ${context.weakConcepts.map((w) => `${w.title} (${w.masteryScore}%)`).join(', ') || 'None'}
- Active Misconceptions: ${context.activeMisconceptions.map((m) => m.title).join(', ') || 'None'}

Determine the student's next-best learning step. Prioritize fixing misconceptions and weak foundational prerequisites before advancing.
Return ONLY valid JSON matching this schema:
{
  "nextAction": "Learn | Review | Practice | Watch video | Take assessment | Fix misconception",
  "reason": "Clear justification citing student's mastery and prerequisite state",
  "conceptId": "concept id or topic name",
  "priority": "HIGH | MEDIUM | LOW",
  "estimatedMinutes": 15
}`;
}
