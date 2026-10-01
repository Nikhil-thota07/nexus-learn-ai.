import { StudentContext } from '../studentContextBuilder';

export function buildStudyPlanPrompt(
  context: StudentContext,
  availableMinutes: number
): string {
  return `You are Nexus Learn AI's Personal Academic Coach.
Student: ${context.name}, Mode: ${context.preparationMode}
Available Study Time Today: ${availableMinutes} minutes
Weak Concepts: ${context.weakConcepts.map((w) => `${w.title} (${w.masteryScore}%)`).join(', ') || 'None'}
Active Misconceptions: ${context.activeMisconceptions.map((m) => m.title).join(', ') || 'None'}

Generate a realistic, timed daily learning sprint optimized for retention.
Return ONLY valid JSON:
{
  "planTitle": "Sprint title",
  "totalAllocatedMinutes": ${availableMinutes},
  "items": [
    {
      "order": 1,
      "task": "Specific task name",
      "durationMinutes": 20,
      "type": "misconception | video | practice | revision | quiz",
      "targetConcept": "Concept title"
    }
  ]
}`;
}

export function buildCareerPrompt(
  context: StudentContext,
  targetRole: string
): string {
  return `You are Nexus Learn AI's Career & Placement Architect.
Student Context: ${context.educationLevel} ${context.branchName} (${context.university})
Target Role: ${targetRole}

Provide a skills gap breakdown and placement preparation trajectory.
Return ONLY valid JSON:
{
  "role": "${targetRole}",
  "matchScore": 78,
  "essentialSkills": ["skill 1", "skill 2"],
  "gapSkills": ["gap 1", "gap 2"],
  "recommendedCertificationsOrProjects": ["project 1", "project 2"]
}`;
}
