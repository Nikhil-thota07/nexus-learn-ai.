import OpenAI from 'openai';

export interface LinkedInAnalysisResult {
  headline: string;
  about: string;
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
  skillGaps: Array<{ skill: string; reason: string; priority: string }>;
  nextSkillRecommendations: Array<{ skill: string; reason: string; priority: string }>;
  careerAlignments: Array<{ role: string; alignmentScore: number; missingSkills: string[] }>;
  analysisSummary: string;
  confidence: number;
}

export async function analyzeLinkedInData(
  profileData: string, // raw text / JSON / pasted profile content
  studentKnowledge?: Array<{ conceptId: string; masteryScore: number }>
): Promise<LinkedInAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    return analyzeLinkedInFallback(profileData);
  }

  try {
    const openai = new OpenAI({ apiKey });

    const knowledgeContext = studentKnowledge && studentKnowledge.length > 0
      ? `Student Nexus assessments: ${studentKnowledge.slice(0, 10).map(k => `${k.conceptId}:${k.masteryScore}%`).join(', ')}`
      : '';

    const prompt = `You are an expert skill-extraction analyst for an adaptive learning platform.

Analyze the following LinkedIn profile data and extract structured skill evidence.

PROFILE DATA:
${profileData.slice(0, 4000)}

${knowledgeContext ? `STUDENT ASSESSMENT CONTEXT:\n${knowledgeContext}` : ''}

RULES:
1. DO NOT fabricate skills, jobs, projects, or experience that are not in the profile data.
2. Classify evidence strength based on how the skill appears: HIGH (used in multiple roles/projects), MEDIUM (mentioned in experience), LOW (listed in skills only).
3. DO NOT claim mastery from listing a skill.
4. Identify realistic skill gaps based on career alignment.
5. Return ONLY valid JSON.

Return this JSON:
{
  "headline": "string",
  "about": "string (first 300 chars)",
  "skillsDetected": [{"skillName": "str", "evidence": "str", "evidenceStrength": "HIGH|MEDIUM|LOW", "confidence": 0.0-1.0, "sourceSection": "skills|experience|project|certification"}],
  "experiences": [{"title": "str", "organization": "str", "description": "str", "startDate": "str", "endDate": "str", "detectedSkills": ["str"]}],
  "projects": [{"projectName": "str", "description": "str", "detectedSkills": ["str"], "technologies": ["str"]}],
  "certifications": [{"name": "str", "organization": "str", "date": "str"}],
  "education": [{"degree": "str", "institution": "str", "year": "str"}],
  "skillGaps": [{"skill": "str", "reason": "str", "priority": "HIGH|MEDIUM|LOW"}],
  "nextSkillRecommendations": [{"skill": "str", "reason": "str", "priority": "HIGH|MEDIUM|LOW"}],
  "careerAlignments": [{"role": "str", "alignmentScore": 0-100, "missingSkills": ["str"]}],
  "analysisSummary": "string",
  "confidence": 0.0-1.0
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2000,
    });

    const raw = JSON.parse(response.choices[0]?.message?.content || '{}');
    return sanitizeLinkedInResult(raw);
  } catch (err) {
    console.error('OpenAI LinkedIn analysis failed:', err);
    return analyzeLinkedInFallback(profileData);
  }
}

function sanitizeLinkedInResult(raw: any): LinkedInAnalysisResult {
  return {
    headline: String(raw.headline || ''),
    about: String(raw.about || '').slice(0, 500),
    skillsDetected: Array.isArray(raw.skillsDetected) ? raw.skillsDetected.slice(0, 30) : [],
    experiences: Array.isArray(raw.experiences) ? raw.experiences.slice(0, 10) : [],
    projects: Array.isArray(raw.projects) ? raw.projects.slice(0, 10) : [],
    certifications: Array.isArray(raw.certifications) ? raw.certifications.slice(0, 10) : [],
    education: Array.isArray(raw.education) ? raw.education.slice(0, 5) : [],
    skillGaps: Array.isArray(raw.skillGaps) ? raw.skillGaps.slice(0, 10) : [],
    nextSkillRecommendations: Array.isArray(raw.nextSkillRecommendations) ? raw.nextSkillRecommendations.slice(0, 8) : [],
    careerAlignments: Array.isArray(raw.careerAlignments) ? raw.careerAlignments.slice(0, 5) : [],
    analysisSummary: String(raw.analysisSummary || ''),
    confidence: Math.min(1, Math.max(0, Number(raw.confidence) || 0.5)),
  };
}

function analyzeLinkedInFallback(profileData: string): LinkedInAnalysisResult {
  const text = profileData.toLowerCase();
  const techSkillKeywords: Record<string, string[]> = {
    'Python': ['python'], 'Java': ['java '], 'JavaScript': ['javascript', 'js'],
    'React': ['react'], 'Node.js': ['node.js', 'nodejs'], 'Next.js': ['next.js', 'nextjs'],
    'Machine Learning': ['machine learning', 'ml '], 'Deep Learning': ['deep learning'],
    'Generative AI': ['generative ai', 'genai', 'llm'], 'SQL': ['sql'],
    'Git': ['git'], 'Docker': ['docker'], 'Cloud': ['aws', 'azure', 'gcp', 'cloud'],
    'Data Science': ['data science'], 'TensorFlow': ['tensorflow'], 'PyTorch': ['pytorch'],
    'C++': ['c++'], 'TypeScript': ['typescript'],
  };
  const detected: LinkedInAnalysisResult['skillsDetected'] = [];
  for (const [skill, kws] of Object.entries(techSkillKeywords)) {
    for (const kw of kws) {
      if (text.includes(kw)) {
        detected.push({ skillName: skill, evidence: `Found in profile text`, evidenceStrength: 'MEDIUM', confidence: 0.6, sourceSection: 'skills' });
        break;
      }
    }
  }
  return {
    headline: '', about: '',
    skillsDetected: detected,
    experiences: [], projects: [], certifications: [], education: [],
    skillGaps: [],
    nextSkillRecommendations: [],
    careerAlignments: [],
    analysisSummary: 'Profile analyzed via keyword extraction (AI analysis unavailable). Verify results by enabling OpenAI integration.',
    confidence: 0.4,
  };
}
