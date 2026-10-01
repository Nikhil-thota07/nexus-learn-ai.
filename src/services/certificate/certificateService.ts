import OpenAI from 'openai';

// Evidence level classification from certificate type
export type EvidenceLevel = 'EXPOSURE' | 'LEARNING' | 'DEMONSTRATED' | 'VERIFIED_ACHIEVEMENT';

export interface DiagnosticQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  skillTested: string;
  difficulty: 'Fundamentals' | 'Intermediate' | 'Advanced';
}

export interface CertificateAnalysisResult {
  certificateTitle: string;
  certificateType: string;
  detectedDomain: string; // e.g. Generative AI, Machine Learning, Web Development, etc.
  experienceType: string; // e.g. Hackathon participation, Course completion, etc.
  exposureSummary: string; // What the student has been exposed to
  organization: string;
  eventName: string;
  issueDate: string;
  credentialId: string;
  description: string;
  domains: Array<{ domain: string; confidence: number; evidenceLevel: string }>;
  skillsDetected: Array<{ skillName: string; confidence: number; evidenceLevel: string; validationStatus: 'PENDING' | 'ASSESSED' | 'VALIDATED' }>;
  evidenceLevel: EvidenceLevel;
  extractionConfidence: number;
  reasoningSummary: string;
  recommendedAssessment: string[];
  personalizedNextSkillPath: string[]; // Ordered list of skills to learn next (e.g. GenAI Fundamentals -> LLM Fundamentals -> Prompt Engineering -> Embeddings -> Vector DB -> RAG -> LLM Eval -> AI Agents)
  nextSkillRecommendations: Array<{ skill: string; reason: string; priority: 'HIGH' | 'MEDIUM' | 'LOW' }>;
  learningPathUpdates: string[];
  verificationAdvice: string; // "Your certificate shows exposure to [Domain]. Let's assess your current knowledge..."
  evidenceSummary: string;
  diagnosticQuestions: DiagnosticQuestion[]; // Interactive 3-5 assessment questions to verify knowledge
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

    const prompt = `You are an expert educational credential analyzer and adaptive pedagogy engine for Nexus Learn AI.

Analyze the following certificate document text and extract structured learning evidence.

CERTIFICATE TEXT:
${textContent.slice(0, 3500)}

FILE NAME: ${fileName}

STUDENT KNOWLEDGE CONTEXT:
${knowledgeContext}

CRITICAL RULES:
1. Identify the primary DOMAIN (e.g. Generative AI, Machine Learning, Web Development, Cybersecurity, Cloud Computing, Data Science, Mobile Development, Blockchain, Python, Java, etc.).
2. Identify the TYPE OF EXPERIENCE (e.g. "Hackathon participation", "Course completion", "Workshop attendance", "Internship experience", "Competition achievement", "Technical event participation").
3. Determine what the student has been EXPOSED TO based strictly on the document context.
4. Classify evidence level accurately:
   - EXPOSURE: participation, attendance, seminar, workshop participation
   - LEARNING: course completion, training completion, online certification
   - DEMONSTRATED: project, hackathon project, internship, technical competition
   - VERIFIED_ACHIEVEMENT: award, rank, verified credential, professional certification
5. A participation certificate MUST NEVER be treated as skill mastery. It is strictly evidence of exposure.
6. Generate a tailored, progressive NEXT-SKILL PATH (6 to 9 sequential skills from fundamentals to production mastery).
   Example for Generative AI:
   ["Generative AI Fundamentals", "LLM Fundamentals", "Prompt Engineering", "Embeddings", "Vector Databases", "RAG", "LLM Evaluation", "AI Agents"]
   Example for Web Development:
   ["HTML/CSS Fundamentals", "Modern JavaScript", "React Components & State", "Next.js Fullstack & SSR", "REST/GraphQL APIs", "Database Modeling", "Web Security", "CI/CD & Cloud Deployment"]
   Recommendations MUST depend on the specific certificate content. DO NOT always return the same skills.
7. Generate 3 to 4 multiple-choice diagnostic questions to verify the student's actual knowledge level for the detected skills/domain (spanning Fundamentals, Intermediate, and Advanced).
8. Return ONLY valid JSON matching the exact schema below.

JSON OUTPUT FORMAT:
{
  "certificateTitle": "string",
  "certificateType": "string",
  "detectedDomain": "string",
  "experienceType": "string",
  "exposureSummary": "string describing what student was exposed to",
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
  "personalizedNextSkillPath": ["ordered array of 6-9 sequential skills to learn next"],
  "nextSkillRecommendations": [{"skill": "string", "reason": "string", "priority": "HIGH|MEDIUM|LOW"}],
  "learningPathUpdates": ["list of recommended updates to curriculum"],
  "verificationAdvice": "Your certificate shows exposure to [Domain]. Let's assess your current knowledge and identify the next skills you should learn.",
  "evidenceSummary": "string",
  "diagnosticQuestions": [
    {
      "id": "q1",
      "question": "string",
      "options": ["option A", "option B", "option C", "option D"],
      "correctIndex": 0,
      "explanation": "string",
      "skillTested": "string",
      "difficulty": "Fundamentals"
    }
  ]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2200,
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw);
    return validateAndSanitize(parsed, textContent, fileName);
  } catch (err) {
    console.error('OpenAI certificate analysis failed, falling back to rule-based analyzer:', err);
    return analyzeCertificateFallback(textContent, fileName);
  }
}

function validateAndSanitize(raw: any, textContent: string, fileName: string): CertificateAnalysisResult {
  const fallback = analyzeCertificateFallback(textContent, fileName);

  const detectedDomain = String(raw.detectedDomain || fallback.detectedDomain || 'Technology');
  const experienceType = String(raw.experienceType || fallback.experienceType || 'Certificate Completion');
  const evidenceLevel = (['EXPOSURE', 'LEARNING', 'DEMONSTRATED', 'VERIFIED_ACHIEVEMENT'].includes(raw.evidenceLevel) ? raw.evidenceLevel : fallback.evidenceLevel) as EvidenceLevel;

  const personalizedNextSkillPath = Array.isArray(raw.personalizedNextSkillPath) && raw.personalizedNextSkillPath.length >= 4
    ? raw.personalizedNextSkillPath.slice(0, 10).map((s: any) => String(s))
    : fallback.personalizedNextSkillPath;

  const diagnosticQuestions = Array.isArray(raw.diagnosticQuestions) && raw.diagnosticQuestions.length >= 2
    ? raw.diagnosticQuestions.slice(0, 5).map((q: any, idx: number) => ({
        id: String(q.id || `diag_${idx + 1}`),
        question: String(q.question || 'Diagnostic question'),
        options: Array.isArray(q.options) && q.options.length >= 2 ? q.options.map((o: any) => String(o)) : ['Option A', 'Option B', 'Option C', 'Option D'],
        correctIndex: typeof q.correctIndex === 'number' && q.correctIndex >= 0 && q.correctIndex < (q.options?.length || 4) ? q.correctIndex : 0,
        explanation: String(q.explanation || 'Verified knowledge check.'),
        skillTested: String(q.skillTested || detectedDomain),
        difficulty: (['Fundamentals', 'Intermediate', 'Advanced'].includes(q.difficulty) ? q.difficulty : 'Fundamentals') as 'Fundamentals' | 'Intermediate' | 'Advanced',
      }))
    : fallback.diagnosticQuestions;

  return {
    certificateTitle: String(raw.certificateTitle || fallback.certificateTitle),
    certificateType: String(raw.certificateType || fallback.certificateType),
    detectedDomain,
    experienceType,
    exposureSummary: String(raw.exposureSummary || fallback.exposureSummary),
    organization: String(raw.organization || fallback.organization),
    eventName: String(raw.eventName || fallback.eventName),
    issueDate: String(raw.issueDate || fallback.issueDate),
    credentialId: String(raw.credentialId || fallback.credentialId),
    description: String(raw.description || fallback.description),
    domains: Array.isArray(raw.domains) && raw.domains.length > 0 ? raw.domains.slice(0, 10) : fallback.domains,
    skillsDetected: Array.isArray(raw.skillsDetected) && raw.skillsDetected.length > 0
      ? raw.skillsDetected.slice(0, 20).map((s: any) => ({
          skillName: String(s.skillName || 'Skill'),
          confidence: Math.min(1, Math.max(0, Number(s.confidence) || 0.7)),
          evidenceLevel: s.evidenceLevel || evidenceLevel,
          validationStatus: 'PENDING' as const,
        }))
      : fallback.skillsDetected,
    evidenceLevel,
    extractionConfidence: Math.min(1, Math.max(0, Number(raw.extractionConfidence) || 0.85)),
    reasoningSummary: String(raw.reasoningSummary || fallback.reasoningSummary),
    recommendedAssessment: Array.isArray(raw.recommendedAssessment) && raw.recommendedAssessment.length > 0
      ? raw.recommendedAssessment.slice(0, 8).map(String)
      : fallback.recommendedAssessment,
    personalizedNextSkillPath,
    nextSkillRecommendations: Array.isArray(raw.nextSkillRecommendations) && raw.nextSkillRecommendations.length > 0
      ? raw.nextSkillRecommendations.slice(0, 8)
      : fallback.nextSkillRecommendations,
    learningPathUpdates: Array.isArray(raw.learningPathUpdates) && raw.learningPathUpdates.length > 0
      ? raw.learningPathUpdates.slice(0, 6)
      : fallback.learningPathUpdates,
    verificationAdvice: String(raw.verificationAdvice || `Your certificate shows exposure to ${detectedDomain}. Let's assess your current knowledge and identify the next skills you should learn.`),
    evidenceSummary: String(raw.evidenceSummary || fallback.evidenceSummary),
    diagnosticQuestions,
  };
}

// Domain curriculum roadmaps and diagnostic questions for realistic, offline & fallback operation
interface DomainProfile {
  domain: string;
  skills: string[];
  nextPath: string[];
  exposureTemplate: (experience: string) => string;
  questions: DiagnosticQuestion[];
}

const DOMAIN_CATALOG: Record<string, DomainProfile> = {
  'Generative AI': {
    domain: 'Generative AI',
    skills: ['Generative AI', 'LLMs', 'Prompt Engineering', 'RAG', 'Embeddings', 'AI Agents'],
    nextPath: [
      'Generative AI Fundamentals',
      'LLM Fundamentals',
      'Prompt Engineering',
      'Embeddings',
      'Vector Databases',
      'RAG',
      'LLM Evaluation',
      'AI Agents'
    ],
    exposureTemplate: (exp) => `Hands-on exposure to Generative AI through ${exp.toLowerCase()}, building with Large Language Models and prompt design.`,
    questions: [
      {
        id: 'genai_q1',
        question: 'What is the primary role of tokenization in Large Language Models (LLMs)?',
        options: [
          'It breaks text into numerical sub-word units that the model can process mathematically',
          'It translates code directly into machine assembly language',
          'It encrypts user prompts for safe transmission over networks',
          'It compresses images before generating textual captions'
        ],
        correctIndex: 0,
        explanation: 'Tokenization segments natural language text into tokens (words or subwords) and maps them to vector integer IDs for transformer processing.',
        skillTested: 'LLM Fundamentals',
        difficulty: 'Fundamentals'
      },
      {
        id: 'genai_q2',
        question: 'What are vector embeddings in the context of semantic search and AI models?',
        options: [
          'High-dimensional mathematical representations capturing semantic meaning and context of text or data',
          'Bitmaps of geometric fonts used for computer screen rendering',
          'Database indexes restricted strictly to alphabetical string matching',
          'CSS vector styles for responsive front-end design'
        ],
        correctIndex: 0,
        explanation: 'Embeddings convert text into dense vectors where semantically similar concepts reside close to one another in vector space.',
        skillTested: 'Embeddings',
        difficulty: 'Intermediate'
      },
      {
        id: 'genai_q3',
        question: 'Why is Retrieval-Augmented Generation (RAG) critical for production GenAI applications?',
        options: [
          'It retrieves external, authoritative data dynamically to ground LLM responses and prevent hallucinations',
          'It replaces the need for transformer neural networks completely',
          'It automatically writes unit test scripts for Python code',
          'It compiles Python code into C++ binaries for 10x faster execution'
        ],
        correctIndex: 0,
        explanation: 'RAG retrieves relevant domain documents from a vector store and passes them in context to the LLM, providing up-to-date facts and reducing hallucinations.',
        skillTested: 'RAG',
        difficulty: 'Intermediate'
      },
      {
        id: 'genai_q4',
        question: 'Which of the following is an effective technique for evaluating RAG and agentic AI systems?',
        options: [
          'Assessing Faithfulness (groundedness in context), Answer Relevance, and Context Recall (e.g. via RAGAS)',
          'Checking only the character count of the generated response',
          'Relying solely on CPU temperature during model inference',
          'Counting the number of tokens without validating truthfulness'
        ],
        correctIndex: 0,
        explanation: 'Modern RAG evaluation frameworks assess Faithfulness (factual alignment with context), Answer Relevance, and Context Recall.',
        skillTested: 'LLM Evaluation',
        difficulty: 'Advanced'
      }
    ]
  },
  'Machine Learning': {
    domain: 'Machine Learning',
    skills: ['Machine Learning', 'Python', 'Supervised Learning', 'Feature Engineering', 'Model Evaluation', 'Deep Learning'],
    nextPath: [
      'Mathematics for ML (Linear Algebra & Calculus)',
      'Python & Scientific Libraries (NumPy, Pandas)',
      'Supervised Learning & Regression',
      'Decision Trees & Random Forests',
      'Unsupervised Learning & Clustering',
      'Feature Engineering & Preprocessing',
      'Neural Network Architectures',
      'MLOps & Model Deployment'
    ],
    exposureTemplate: (exp) => `Exposure to statistical modeling, data preprocessing, and algorithm training in ${exp.toLowerCase()}.`,
    questions: [
      {
        id: 'ml_q1',
        question: 'What is the primary indicator of an overfitted machine learning model?',
        options: [
          'High accuracy on training data but significantly lower performance on unseen test data',
          'Equally poor performance on both training and test data',
          'The model training too fast in fewer than 2 epochs',
          'The model using too few parameters'
        ],
        correctIndex: 0,
        explanation: 'Overfitting occurs when a model memorizes noise in the training set, resulting in high training accuracy but poor generalization to test data.',
        skillTested: 'Model Evaluation',
        difficulty: 'Fundamentals'
      },
      {
        id: 'ml_q2',
        question: 'Which algorithm is best suited for non-linear classification with high interpretability?',
        options: [
          'Random Forest / Decision Trees',
          'Linear Regression',
          'K-Means Clustering',
          'PCA (Principal Component Analysis)'
        ],
        correctIndex: 0,
        explanation: 'Decision trees and ensembles like Random Forest handle non-linear boundaries well and offer clear feature importance interpretability.',
        skillTested: 'Supervised Learning',
        difficulty: 'Intermediate'
      },
      {
        id: 'ml_q3',
        question: 'Why is feature scaling (e.g. StandardScaler) crucial for algorithms like SVM and K-Nearest Neighbors?',
        options: [
          'Because distance-based calculations are distorted if features operate on vastly different numeric scales',
          'Because computers cannot store numbers larger than 100 in memory',
          'Because it reduces the dataset size to 50%',
          'Because it converts all numbers into strings'
        ],
        correctIndex: 0,
        explanation: 'Distance-based metrics (Euclidean, Manhattan) in KNN/SVM are dominated by features with large numeric ranges unless scaled.',
        skillTested: 'Feature Engineering',
        difficulty: 'Intermediate'
      }
    ]
  },
  'Web Development': {
    domain: 'Web Development',
    skills: ['Web Development', 'JavaScript', 'React', 'HTML/CSS', 'Next.js', 'REST APIs'],
    nextPath: [
      'Modern JavaScript (ES6+, Async/Await)',
      'React Components & Virtual DOM',
      'State Management & Custom Hooks',
      'Next.js Fullstack Architecture & SSR',
      'RESTful & GraphQL API Design',
      'Database Modeling with PostgreSQL/Prisma',
      'Web Security & Auth (JWT/OAuth)',
      'CI/CD & Cloud Deployment (Vercel/Docker)'
    ],
    exposureTemplate: (exp) => `Practical exposure to building user interfaces, interactive components, and web applications through ${exp.toLowerCase()}.`,
    questions: [
      {
        id: 'web_q1',
        question: 'What is the key benefit of React\'s Virtual DOM?',
        options: [
          'It reconciles state differences in-memory to minimize expensive direct operations on the real browser DOM',
          'It completely replaces the need for CSS stylesheets',
          'It executes JavaScript on the GPU instead of the CPU',
          'It provides unlimited database storage in the browser'
        ],
        correctIndex: 0,
        explanation: 'Virtual DOM computes the minimal batch of DOM modifications needed via diffing, optimizing browser rendering performance.',
        skillTested: 'React',
        difficulty: 'Fundamentals'
      },
      {
        id: 'web_q2',
        question: 'In modern Next.js (App Router), what is the difference between Server and Client Components?',
        options: [
          'Server Components render on the server without sending JS bundle to client; Client Components run in browser for interactivity',
          'Server Components can only run PHP code',
          'Client Components cannot make HTTP requests',
          'Server Components cannot query databases'
        ],
        correctIndex: 0,
        explanation: 'Server Components execute exclusively on the server reducing client-side bundle size, while Client Components enable browser hooks and event listeners.',
        skillTested: 'Next.js',
        difficulty: 'Intermediate'
      },
      {
        id: 'web_q3',
        question: 'How do you prevent SQL injection vulnerabilities when building web backend APIs?',
        options: [
          'Use parameterized queries, prepared statements, or ORM abstraction layers rather than string concatenation',
          'Encrypt the user password with Base64',
          'Store all database tables as plain text JSON files',
          'Only accept numbers in input fields'
        ],
        correctIndex: 0,
        explanation: 'Parameterized queries and ORMs ensure that user input is treated as data literals rather than executable SQL commands.',
        skillTested: 'Web Security',
        difficulty: 'Intermediate'
      }
    ]
  },
  'Cybersecurity': {
    domain: 'Cybersecurity',
    skills: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Cryptography', 'Vulnerability Assessment'],
    nextPath: [
      'Networking Fundamentals (TCP/IP, DNS, OSI Model)',
      'Linux Operating System & Shell Scripting',
      'Applied Cryptography (Symmetric, Asymmetric, Hashing)',
      'Web Application Security (OWASP Top 10)',
      'Penetration Testing Tools & Burp Suite',
      'Network Traffic Analysis with Wireshark',
      'SIEM Tools & SOC Monitoring',
      'Incident Response & Forensics'
    ],
    exposureTemplate: (exp) => `Foundational exposure to security auditing, vulnerability analysis, and network protocols through ${exp.toLowerCase()}.`,
    questions: [
      {
        id: 'sec_q1',
        question: 'What is the primary difference between symmetric and asymmetric encryption?',
        options: [
          'Symmetric uses the same secret key for encryption and decryption; asymmetric uses a public/private key pair',
          'Symmetric can only encrypt text while asymmetric can only encrypt images',
          'Symmetric encryption has been outlawed by international standards',
          'Asymmetric encryption is 1000x faster than symmetric encryption'
        ],
        correctIndex: 0,
        explanation: 'Symmetric cryptography uses a shared secret key (e.g. AES), whereas asymmetric cryptography uses mathematically linked public and private keys (e.g. RSA/ECC).',
        skillTested: 'Cryptography',
        difficulty: 'Fundamentals'
      },
      {
        id: 'sec_q2',
        question: 'Which vulnerability in the OWASP Top 10 occurs when untrusted user input is executed as a command in a system shell or database?',
        options: [
          'Injection (SQL, Command, LDAP)',
          'Cryptographic Failure',
          'Broken Access Control',
          'Security Misconfiguration'
        ],
        correctIndex: 0,
        explanation: 'Injection flaws happen when hostile data is sent to an interpreter as part of a command or query without proper sanitization.',
        skillTested: 'Web Application Security',
        difficulty: 'Intermediate'
      },
      {
        id: 'sec_q3',
        question: 'What is the purpose of a Man-in-the-Middle (MitM) attack countermeasure like TLS Certificate Pinning?',
        options: [
          'To ensure the client only accepts the exact pre-configured cryptographic certificate from the server, preventing spoofed CAs',
          'To speed up website download speeds by 50%',
          'To disable all passwords across the organization',
          'To encrypt hard drives on the client laptop'
        ],
        correctIndex: 0,
        explanation: 'Certificate pinning binds the client strictly to the host’s known certificate or public key, thwarting attacker-controlled proxy certificate authorities.',
        skillTested: 'Network Security',
        difficulty: 'Advanced'
      }
    ]
  },
  'Cloud Computing': {
    domain: 'Cloud Computing',
    skills: ['Cloud Computing', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices'],
    nextPath: [
      'Linux Administration & Networking',
      'Cloud Core Services (Compute, Storage, VPC)',
      'Containerization with Docker',
      'Container Orchestration with Kubernetes',
      'Infrastructure as Code (Terraform)',
      'Serverless Architectures (Lambda/Cloud Functions)',
      'Cloud Security & IAM Policies',
      'Observability & Distributed Tracing'
    ],
    exposureTemplate: (exp) => `Experience with cloud architectures, containerized deployments, and scalable infrastructure in ${exp.toLowerCase()}.`,
    questions: [
      {
        id: 'cloud_q1',
        question: 'What is the core distinction between a Docker container and a traditional Virtual Machine (VM)?',
        options: [
          'Containers share the host OS kernel and isolate at process level, whereas VMs run a complete guest OS on a hypervisor',
          'Containers cannot run Linux applications',
          'VMs do not use memory or disk storage',
          'Containers require hardware virtualization support (VT-x)'
        ],
        correctIndex: 0,
        explanation: 'Containers are lightweight process namespaces sharing the host Linux kernel, eliminating the overhead of full guest operating systems.',
        skillTested: 'Containerization',
        difficulty: 'Fundamentals'
      },
      {
        id: 'cloud_q2',
        question: 'In Kubernetes, what is the smallest deployable computing unit that can be created and managed?',
        options: [
          'A Pod',
          'A Dockerfile',
          'A Cluster',
          'A Node'
        ],
        correctIndex: 0,
        explanation: 'A Pod is the smallest execution unit in Kubernetes, encapsulating one or more containers sharing network and storage resources.',
        skillTested: 'Kubernetes',
        difficulty: 'Intermediate'
      }
    ]
  }
};

export function analyzeCertificateFallback(textContent: string, fileName: string): CertificateAnalysisResult {
  const text = textContent.toLowerCase();
  const name = fileName.toLowerCase();
  const combined = `${text} ${name}`;

  // 1. Detect experience type & evidence level
  let experienceType = 'Certificate of Participation';
  let evidenceLevel: EvidenceLevel = 'EXPOSURE';

  if (/hackathon/.test(combined)) {
    if (/winner|1st|2nd|3rd|champion|award|runner/.test(combined)) {
      experienceType = 'Hackathon Achievement & Winner';
      evidenceLevel = 'VERIFIED_ACHIEVEMENT';
    } else if (/project|built|developed/.test(combined)) {
      experienceType = 'Hackathon Project Presentation';
      evidenceLevel = 'DEMONSTRATED';
    } else {
      experienceType = 'Hackathon Participation';
      evidenceLevel = 'EXPOSURE';
    }
  } else if (/internship|intern\b/.test(combined)) {
    experienceType = 'Internship Experience';
    evidenceLevel = 'DEMONSTRATED';
  } else if (/workshop|seminar|webinar|bootcamp/.test(combined)) {
    experienceType = 'Workshop Attendance & Participation';
    evidenceLevel = 'EXPOSURE';
  } else if (/course|training|diploma|specialization|nanodegree/.test(combined)) {
    experienceType = 'Course Completion';
    evidenceLevel = 'LEARNING';
  } else if (/competition|contest|challenge|olympiad/.test(combined)) {
    if (/winner|rank|prize|1st|2nd|3rd/.test(combined)) {
      experienceType = 'Competition Award';
      evidenceLevel = 'VERIFIED_ACHIEVEMENT';
    } else {
      experienceType = 'Competition Participation';
      evidenceLevel = 'EXPOSURE';
    }
  } else if (/project/.test(combined)) {
    experienceType = 'Project Completion';
    evidenceLevel = 'DEMONSTRATED';
  }

  // 2. Detect primary Domain
  let detectedDomain = 'Generative AI'; // Default strong domain match
  if (/gen\s?ai|generative ai|llm|gpt|large language|chatgpt|prompt engineering|rag\b/.test(combined)) {
    detectedDomain = 'Generative AI';
  } else if (/machine learning|deep learning|neural network|computer vision|nlp|scikit|tensorflow|pytorch/.test(combined)) {
    detectedDomain = 'Machine Learning';
  } else if (/cybersecurity|security|ethical hacking|penetration|cryptograph|ctf|vulnerability/.test(combined)) {
    detectedDomain = 'Cybersecurity';
  } else if (/cloud|aws|azure|gcp|docker|kubernetes|devops/.test(combined)) {
    detectedDomain = 'Cloud Computing';
  } else if (/web|react|frontend|backend|node|nextjs|javascript|html|css|fullstack/.test(combined)) {
    detectedDomain = 'Web Development';
  } else if (/python/.test(combined)) {
    detectedDomain = 'Machine Learning';
  }

  // Look up catalog for rich domain profile
  const profile = DOMAIN_CATALOG[detectedDomain] || DOMAIN_CATALOG['Generative AI'];

  // 3. Extract title & organization
  let certificateTitle = `${detectedDomain} ${experienceType}`;
  const titleMatch = textContent.match(/certificate\s+(?:of\s+)?([A-Za-z0-9\s]{5,60})/i);
  if (titleMatch && titleMatch[0]) {
    certificateTitle = titleMatch[0].trim();
  } else if (fileName.length > 5) {
    certificateTitle = fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();
  }

  // Detect Organization
  let organization = 'Academic / Technical Organization';
  if (/google|microsoft|amazon|aws|meta|nvidia|ibm|oracle/.test(combined)) {
    const org = combined.match(/\b(google|microsoft|amazon|aws|meta|nvidia|ibm|oracle)\b/i);
    if (org) organization = org[0].toUpperCase();
  } else if (/ieee|acm|csi/.test(combined)) {
    organization = 'IEEE / Technical Society';
  } else if (/coursera|udemy|edx|nptel|scaler|unstop|devpost/.test(combined)) {
    const platform = combined.match(/\b(coursera|udemy|edx|nptel|scaler|unstop|devpost)\b/i);
    if (platform) organization = platform[0].toUpperCase();
  }

  const exposureSummary = profile.exposureTemplate(experienceType);
  const verificationAdvice = `Your certificate shows exposure to ${detectedDomain}. Let's assess your current knowledge and identify the next skills you should learn.`;

  const skillsDetected = profile.skills.map((s, idx) => ({
    skillName: s,
    confidence: idx < 3 ? 0.92 : 0.75,
    evidenceLevel,
    validationStatus: 'PENDING' as const,
  }));

  const nextSkillRecommendations = profile.nextPath.slice(0, 4).map((skill, i) => ({
    skill,
    reason: i === 0
      ? `Foundational prerequisite for ${detectedDomain} demonstrated in ${experienceType}.`
      : `Recommended next step in your ${detectedDomain} roadmap based on your certificate exposure.`,
    priority: (i === 0 ? 'HIGH' : i === 1 ? 'HIGH' : 'MEDIUM') as 'HIGH' | 'MEDIUM' | 'LOW',
  }));

  const evidenceSummary = evidenceLevel === 'EXPOSURE'
    ? `Your certificate indicates hands-on exposure to ${detectedDomain} through ${experienceType.toLowerCase()}. We have recorded this as an experience signal in your learning profile. Take the diagnostic assessment below to verify your current level and calibrate your next skills.`
    : `Your certificate indicates ${evidenceLevel.toLowerCase().replace('_', ' ')} in ${detectedDomain}. We have updated your learning profile with this verified signal.`;

  return {
    certificateTitle,
    certificateType: experienceType.toLowerCase().replace(/\s+/g, '_'),
    detectedDomain,
    experienceType,
    exposureSummary,
    organization,
    eventName: `${detectedDomain} ${experienceType}`,
    issueDate: new Date().toISOString().split('T')[0],
    credentialId: 'Unknown',
    description: textContent.slice(0, 250) || `Certificate for ${detectedDomain}`,
    domains: [{ domain: detectedDomain, confidence: 0.95, evidenceLevel }],
    skillsDetected,
    evidenceLevel,
    extractionConfidence: 0.88,
    reasoningSummary: `Certificate indicates ${experienceType} in ${detectedDomain}. Exposure signals registered. Knowledge verification recommended.`,
    recommendedAssessment: profile.skills.slice(0, 4),
    personalizedNextSkillPath: profile.nextPath,
    nextSkillRecommendations,
    learningPathUpdates: [
      `Incorporate ${detectedDomain} track based on ${experienceType} evidence`,
      `Target next milestone: ${profile.nextPath[2] || profile.nextPath[0]}`
    ],
    verificationAdvice,
    evidenceSummary,
    diagnosticQuestions: profile.questions,
  };
}
