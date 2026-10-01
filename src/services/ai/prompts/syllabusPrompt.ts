import { StudentContext } from '../studentContextBuilder';

export function buildSyllabusPrompt(
  context: StudentContext,
  subject: string,
  targetGoal: string,
  weeks: number
): string {
  return `You are Nexus Learn AI's Syllabus Intelligence Engine.
Student Mode: ${context.preparationMode}
Target: ${targetGoal}
Subject: ${subject}
Timeline: ${weeks} weeks
University/Regulation context: ${context.university} ${context.regulation} ${context.branch}

Synthesize a complete structured syllabus broken into weekly milestones and checkpoint projects.
Return ONLY valid JSON:
{
  "title": "Roadmap title",
  "description": "Executive description",
  "prerequisites": ["prereq 1", "prereq 2"],
  "modules": [
    {
      "week": 1,
      "title": "Module title",
      "topics": ["topic A", "topic B"],
      "checkpointProject": "Hands-on project description"
    }
  ]
}`;
}
