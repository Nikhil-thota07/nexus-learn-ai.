import OpenAI from 'openai';

// Evidence level classification from certificate type
export type EvidenceLevel = 'EXPOSURE' | 'LEARNING' | 'DEMONSTRATED' | 'VERIFIED_ACHIEVEMENT';

export interface CertificateAnalysisResult {
  certificateTitle: string;
  certificateType: string;
  organization: string;
  eventName: string;
  issueDate: string;
  credentialId: string;
  description: string;
  domains: Array<{ domain: string; confidence: number; evidenceLevel: string }>;
  skillsDetected: Array<{ skillName: string; confidence: number; evidenceLevel: string; validationStatus: 'PENDING' }>;
  evidenceLevel: EvidenceLevel;
  extractionConfidence: number;
  reasoningSummary: string;
  recommendedAssessment: string[];
  nextSkillRecommendations: Array<{ skill: string; reason: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  learningPathUpdates: string[];
  evidenceSummary: string; // Human-readable message to show student
}

export async function analyzeCertificate(
  textContent: string,
  fileName: string,
  studentKnowledge?: Array<{ conceptId: string; masteryScore: number }>
): Promise<CertificateAnalysisResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey || apiKey === 'your-openai-api-key-here') {
    return analyzeCertificateFallback(textContent, fileName);
  }

  try {
    const openai = new OpenAI({ apiKey });
    
    const knowledgeContext = studentKnowledge && studentKnowledge.length > 0
      ? `Student's existing knowledge (mastery 0-100): ${studentKnowledge.slice(0, 10).map(k => `${k.conceptId}: ${k.masteryScore}%`).join(', ')}`
      : 'No existing knowledge data available.';

    const prompt = `You are an expert educational credential analyzer for an adaptive learning platform.

Analyze the following certificate text and extract structured information.

CERTIFICATE TEXT:
${textContent.slice(0, 3000)}

FILE NAME: ${fileName}

STUDENT KNOWLEDGE CONTEXT:
${knowledgeContext}

RULES:
1. DO NOT fabricate information not present in the certificate text.
2. If a field cannot be extracted, use "Unknown" or "Not detected".
3. Classify evidence level accurately:
   - EXPOSURE: participation, attendance, seminar
   - LEARNING: course completion, training completion
   - DEMONSTRATED: project, hackathon project, internship, technical competition
   - VERIFIED_ACHIEVEMENT: award, rank, professional certification
4. DO NOT mark skills as mastered from a participation certificate.
5. Detect skills that are REASONABLY supported by the certificate content.
6. Return ONLY valid JSON.

Return this exact JSON structure:
{
  "certificateTitle": "string",
  "certificateType": "string (hackathon_participation|course_completion|workshop|internship|competition|award|professional_certification|seminar|unknown)",
  "organization": "string",
  "eventName": "string",
  "issueDate": "string (YYYY-MM-DD or Unknown)",
  "credentialId": "string or Unknown",
  "description": "string",
  "domains": [{"domain": "string", "confidence": 0.0-1.0, "evidenceLevel": "EXPOSURE|LEARNING|DEMONSTRATED|VERIFIED_ACHIEVEMENT"}],
  "skillsDetected": [{"skillName": "string", "confidence": 0.0-1.0, "evidenceLevel": "EXPOSURE|LEARNING|DEMONSTRATED|VERIFIED_ACHIEVEMENT", "validationStatus": "PENDING"}],
  "evidenceLevel": "EXPOSURE|LEARNING|DEMONSTRATED|VERIFIED_ACHIEVEMENT",
  "extractionConfidence": 0.0-1.0,
  "reasoningSummary": "string",
  "recommendedAssessment": ["list of skill names to assess"],
  "nextSkillRecommendations": [{"skill": "string", "reason": "string", "priority": "HIGH|MEDIUM|LOW"}],
  "learningPathUpdates": ["list of recommended learning path changes"],
  "evidenceSummary": "string (human-readable message for the student — honest, not inflating skills)"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1500,
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    return validateAndSanitize(parsed);
  } catch (err) {
    console.error('OpenAI certificate analysis failed:', err);
    return analyzeCertificateFallback(textContent, fileName);
  }
}

function validateAndSanitize(raw: any): CertificateAnalysisResult {
  return {
    certificateTitle: String(raw.certificateTitle || 'Certificate'),
    certificateType: String(raw.certificateType || 'unknown'),
    organization: String(raw.organization || 'Unknown'),
    eventName: String(raw.eventName || 'Unknown'),
    issueDate: String(raw.issueDate || 'Unknown'),
    credentialId: String(raw.credentialId || 'Unknown'),
    description: String(raw.description || ''),
    domains: Array.isArray(raw.domains) ? raw.domains.slice(0, 10) : [],
    skillsDetected: Array.isArray(raw.skillsDetected) ? raw.skillsDetected.slice(0, 20).map((s: any) => ({ ...s, validationStatus: 'PENDING' as const })) : [],
    evidenceLevel: (['EXPOSURE', 'LEARNING', 'DEMONSTRATED', 'VERIFIED_ACHIEVEMENT'].includes(raw.evidenceLevel) ? raw.evidenceLevel : 'EXPOSURE') as EvidenceLevel,
    extractionConfidence: Math.min(1, Math.max(0, Number(raw.extractionConfidence) || 0.5)),
    reasoningSummary: String(raw.reasoningSummary || ''),
    recommendedAssessment: Array.isArray(raw.recommendedAssessment) ? raw.recommendedAssessment.slice(0, 10) : [],
    nextSkillRecommendations: Array.isArray(raw.nextSkillRecommendations) ? raw.nextSkillRecommendations.slice(0, 8) : [],
    learningPathUpdates: Array.isArray(raw.learningPathUpdates) ? raw.learningPathUpdates.slice(0, 6) : [],
    evidenceSummary: String(raw.evidenceSummary || 'Certificate analyzed. Evidence recorded in your learning profile.'),
  };
}

// Fallback when OpenAI is unavailable — uses keyword-based heuristics
function analyzeCertificateFallback(textContent: string, fileName: string): CertificateAnalysisResult {
  const text = textContent.toLowerCase();
  const name = fileName.toLowerCase();

  // Detect evidence level from keywords
  let evidenceLevel: EvidenceLevel = 'EXPOSURE';
  if (/award|rank|1st|2nd|3rd|winner|top|best|gold|silver|bronze|professional certif/.test(text)) {
    evidenceLevel = 'VERIFIED_ACHIEVEMENT';
  } else if (/internship|project completion|employed|built|developed|implemented/.test(text)) {
    evidenceLevel = 'DEMONSTRATED';
  } else if (/completion|completed|certified|passed|trained|course/.test(text)) {
    evidenceLevel = 'LEARNING';
  }

  // Detect certificate type
  let certificateType = 'unknown';
  if (/hackathon/.test(text + name)) certificateType = 'hackathon_participation';
  else if (/workshop/.test(text + name)) certificateType = 'workshop';
  else if (/internship/.test(text + name)) certificateType = 'internship';
  else if (/completion|completed|course/.test(text + name)) certificateType = 'course_completion';
  else if (/award|winner/.test(text + name)) certificateType = 'award';
  else if (/seminar|webinar/.test(text + name)) certificateType = 'seminar';
  else if (/competi/.test(text + name)) certificateType = 'competition';
  else if (/participation|participated/.test(text)) certificateType = 'hackathon_participation';

  // Detect domains and skills from keywords
  const domainMap: Record<string, string[]> = {
    'Artificial Intelligence': ['artificial intelligence', 'ai ', 'machine learning', 'deep learning', 'neural'],
    'Generative AI': ['generative ai', 'genai', 'llm', 'gpt', 'chatgpt', 'large language'],
    'Web Development': ['web development', 'html', 'css', 'javascript', 'react', 'node', 'nextjs'],
    'Data Science': ['data science', 'data analysis', 'pandas', 'numpy', 'matplotlib', 'statistics'],
    'Cloud Computing': ['cloud', 'aws', 'azure', 'gcp', 'kubernetes', 'docker'],
    'Cybersecurity': ['cybersecurity', 'security', 'ethical hacking', 'ctf'],
    'Mobile Development': ['android', 'ios', 'flutter', 'react native', 'mobile'],
    'Blockchain': ['blockchain', 'web3', 'solidity', 'ethereum', 'nft'],
    'Python': ['python', 'django', 'flask', 'fastapi'],
    'Java': ['java ', 'spring boot', 'spring'],
  };

  const detectedDomains: Array<{ domain: string; confidence: number; evidenceLevel: string }> = [];
  const detectedSkills: Array<{ skillName: string; confidence: number; evidenceLevel: string; validationStatus: 'PENDING' }> = [];

  for (const [domain, keywords] of Object.entries(domainMap)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        if (!detectedDomains.find(d => d.domain === domain)) {
          detectedDomains.push({ domain, confidence: 0.7, evidenceLevel });
          detectedSkills.push({ skillName: domain, confidence: 0.6, evidenceLevel, validationStatus: 'PENDING' });
        }
        break;
      }
    }
  }

  const skillsMap: Record<string, string[]> = {
    'LLMs': ['llm', 'large language model', 'gpt'],
    'Prompt Engineering': ['prompt engineering', 'prompting'],
    'RAG': ['rag', 'retrieval augmented'],
    'Embeddings': ['embedding', 'vector'],
    'Python': ['python'],
    'React': ['react'],
    'Machine Learning': ['machine learning', 'ml model'],
    'Deep Learning': ['deep learning', 'neural network'],
    'SQL': ['sql', 'database'],
    'Git': ['git', 'github'],
    'Docker': ['docker', 'container'],
    'REST APIs': ['api', 'rest'],
  };

  for (const [skill, keywords] of Object.entries(skillsMap)) {
    for (const kw of keywords) {
      if (text.includes(kw)) {
        if (!detectedSkills.find(s => s.skillName === skill)) {
          detectedSkills.push({ skillName: skill, confidence: 0.65, evidenceLevel, validationStatus: 'PENDING' });
        }
        break;
      }
    }
  }

  const primaryDomain = detectedDomains[0]?.domain || 'Technology';
  const evidenceSummary = evidenceLevel === 'EXPOSURE'
    ? `Your certificate indicates exposure to ${primaryDomain}. We have recorded this as an experience signal in your learning profile. Complete an assessment to validate your current knowledge level.`
    : evidenceLevel === 'LEARNING'
    ? `Your certificate confirms structured learning in ${primaryDomain}. We have recorded this as a learning completion signal. Take an assessment to measure your current skill level.`
    : evidenceLevel === 'DEMONSTRATED'
    ? `Your certificate demonstrates practical application in ${primaryDomain}. This is strong evidence of hands-on experience. We recommend validating specific skills through assessments.`
    : `Your certificate represents a verified achievement in ${primaryDomain}. This is strong evidence. Assessment-based validation will strengthen your knowledge profile further.`;

  // Extract title from text (first 100 chars)
  const titleMatch = textContent.match(/([A-Z][^.\n]{10,80})/) || [];
  const title = titleMatch[0] || fileName.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

  return {
    certificateTitle: title.trim().slice(0, 100),
    certificateType,
    organization: 'Unknown',
    eventName: 'Unknown',
    issueDate: 'Unknown',
    credentialId: 'Unknown',
    description: textContent.slice(0, 300),
    domains: detectedDomains.slice(0, 5),
    skillsDetected: detectedSkills.slice(0, 15),
    evidenceLevel,
    extractionConfidence: 0.5,
    reasoningSummary: `Analyzed via keyword extraction (AI analysis unavailable). Detected ${detectedDomains.length} domains and ${detectedSkills.length} skills.`,
    recommendedAssessment: detectedSkills.slice(0, 4).map(s => s.skillName),
    nextSkillRecommendations: detectedSkills.slice(0, 4).map((s, i) => ({
      skill: s.skillName,
      reason: `Detected from certificate. Assess current level to optimize learning path.`,
      priority: i === 0 ? 'HIGH' : 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    })),
    learningPathUpdates: detectedDomains.slice(0, 3).map(d => `Add ${d.domain} track based on certificate evidence`),
    evidenceSummary,
  };
}
