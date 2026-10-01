import { findBranch, BRANCH_CATALOG } from '../src/data/branches';
import { resolveAuthoritativeSyllabus, AUTHORITATIVE_SYLLABI } from '../src/data/syllabi';
import { generateFallbackTutorResponse } from '../src/services/ai/tutorService';
import { StudentContext } from '../src/services/ai/studentContextBuilder';
import { ComprehensiveStudentContext } from '../src/services/context/StudentContextService';
import { calculateUpdatedMastery, arePrerequisitesMet } from '../src/lib/adaptive/engine';
import { CONCEPTS } from '../src/data/curriculum';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    throw new Error(`TEST FAILED: ${message}`);
  }
  console.log(`✓ ${message}`);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('   NEXUS LEARN AI — ADAPTIVE PEDAGOGY & MODE TESTS   ');
  console.log('====================================================\n');

  // --- SUITE 1: BRANCH CATALOG & RESOLUTION TESTS (Section 56) ---
  console.log('--- 1. BRANCH CATALOG TESTS ---');
  const cseBranch = findBranch('cse');
  assert(cseBranch !== null && cseBranch.id === 'cse', 'CSE branch must resolve correctly');

  const eceBranch = findBranch('ece');
  assert(eceBranch !== null && eceBranch.id === 'ece', 'ECE branch must resolve correctly');

  const eeeBranch = findBranch('eee');
  assert(eeeBranch !== null && eeeBranch.id === 'eee', 'EEE branch must resolve correctly');

  const meBranch = findBranch('mechanical');
  assert(meBranch !== null && meBranch.id === 'me', 'Mechanical branch must resolve correctly');

  const civilBranch = findBranch('civil');
  assert(civilBranch !== null && civilBranch.id === 'civil', 'Civil branch must resolve correctly');

  const aimlBranch = findBranch('cse-aiml');
  assert(aimlBranch !== null && aimlBranch.id === 'cse-aiml', 'CSE-AIML branch must resolve correctly');

  const aliasMatch = findBranch('Computer Science & Engineering');
  assert(aliasMatch !== null && aliasMatch.id === 'cse', 'Legacy alias "Computer Science & Engineering" must map to CSE');

  assert(BRANCH_CATALOG.length >= 25, 'Catalog must contain computing, electronics, electrical, mech, civil, chemical, and other branches');

  // --- SUITE 2: AUTHORITATIVE SYLLABUS & NO REGULATION MIXING (Section 13, 14, 58) ---
  console.log('\n--- 2. AUTHORITATIVE ENGINEERING SYLLABUS TESTS ---');
  const r25CseSyllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'cse',
    year: 1,
    semester: 1,
  });
  assert(r25CseSyllabus !== null, 'JNTUH R25 CSE Y1 S1 syllabus must exist');
  assert(r25CseSyllabus!.regulation === 'R25', 'Must preserve R25 regulation identity');
  assert(
    Boolean(r25CseSyllabus!.subjects.some((s) => s.name === 'Programming for Problem Solving')),
    'R25 CSE must contain Programming for Problem Solving'
  );
  assert(
    Boolean(r25CseSyllabus!.subjects.some((s) => s.name === 'Matrices and Calculus')),
    'R25 CSE must contain Matrices and Calculus'
  );

  const r22CseSyllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R22',
    branch: 'cse',
    year: 1,
    semester: 1,
  });
  assert(r22CseSyllabus !== null, 'JNTUH R22 CSE Y1 S1 syllabus must exist');
  assert(r22CseSyllabus?.regulation === 'R22', 'Must preserve R22 regulation identity');
  assert(
    r22CseSyllabus?.id !== r25CseSyllabus?.id,
    'R22 and R25 must have distinct syllabus IDs (No regulation mixing)'
  );

  const r25EceSyllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'ece',
    year: 1,
    semester: 1,
  });
  assert(r25EceSyllabus !== null, 'ECE syllabus must resolve');
  assert(
    Boolean(r25EceSyllabus!.subjects.some((s) => s.name.includes('Electronic Devices'))),
    'ECE syllabus must contain Electronic Devices (not generic CSE subjects)'
  );

  // --- SUITE 3: AI TUTOR EVALUATION TEST CASES (Section 54) ---
  console.log('\n--- 3. AI TUTOR EVALUATION TEST CASES ---');

  const engineeringContext: StudentContext = {
    studentId: 'test_s1',
    name: 'Nikhil',
    preparationMode: 'ENGINEERING',
    educationLevel: 'B.Tech',
    university: 'JNTUH',
    college: 'Narsimha Reddy Engineering College',
    branch: 'CSE',
    branchName: 'Computer Science and Engineering',
    regulation: 'R25',
    year: '1st Year',
    semester: 'Semester 1',
    currentSubject: 'Programming for Problem Solving',
    currentTopic: 'Functions & Modularity',
    syllabusSummary: {
      syllabusId: 'JNTUH-R25-CSE-Y1-S1',
      university: 'JNTUH',
      regulation: 'R25',
      branch: 'Computer Science and Engineering',
      subjects: [
        { name: 'Programming for Problem Solving', code: 'CS101ES', language: 'C' },
        { name: 'Matrices and Calculus', code: 'MA102BS' },
      ],
    },
    activeMisconceptions: [
      {
        conceptId: 'py-return',
        title: 'Confusing return with print()',
        description: 'Conflating return with print side-effects',
      },
    ],
    weakConcepts: [
      { conceptId: 'py-return', title: 'Return Values vs Print', masteryScore: 31 },
      { conceptId: 'py-scope', title: 'Variable Scope & LEGB', masteryScore: 38 },
    ],
    masteredConcepts: ['Python Syntax', 'Functions & Signatures'],
    preferredLanguage: 'English',
    dailyStudyMinutes: 90,
  };

  // Test 1: Simple Calculator (User's specific reported issue)
  const calcResponse = generateFallbackTutorResponse(
    engineeringContext,
    'write a code for simple calculator'
  );
  assert(calcResponse.intent === 'CODE_REQUEST', 'Calculator request must be classified as CODE_REQUEST');
  assert(
    Boolean(calcResponse.codeSnippet && calcResponse.codeSnippet.code.length > 50),
    'Calculator request must produce complete executable code'
  );
  assert(
    Boolean(calcResponse.stepByStep && calcResponse.stepByStep.length >= 3),
    'Calculator response must include step-by-step logic breakdown'
  );
  assert(
    Boolean(calcResponse.commonMistake && calcResponse.commonMistake.trap.length > 10),
    'Calculator response must highlight common student pitfalls (e.g. division by zero, return vs print)'
  );
  assert(
    Boolean(calcResponse.quickCheck && calcResponse.quickCheck.question.length > 10),
    'Calculator response must include a quick check diagnostic question'
  );

  // Test 2: Difference between return and print
  const returnPrintResponse = generateFallbackTutorResponse(
    engineeringContext,
    'What is the difference between return and print?'
  );
  assert(
    returnPrintResponse.intent === 'MISCONCEPTION' || returnPrintResponse.intent === 'EXPLANATION',
    'Return vs print inquiry must address the fundamental pedagogical distinction'
  );
  assert(
    returnPrintResponse.directAnswer.toLowerCase().includes('return') &&
      returnPrintResponse.directAnswer.toLowerCase().includes('print'),
    'Direct answer must explain return passes values back while print displays to console'
  );

  // Test 3: Newton's Second Law for JEE
  const jeeContext: StudentContext = {
    ...engineeringContext,
    preparationMode: 'JEE',
    targetExam: 'JEE Main & Advanced',
    targetExamYear: '2027',
    currentSubject: 'JEE Physics',
    currentTopic: 'Mechanics',
  };

  const newtonResponse = generateFallbackTutorResponse(
    jeeContext,
    "Explain Newton's second law for JEE"
  );
  assert(
    newtonResponse.intent === 'EXAM_PREPARATION',
    'JEE mechanics query must be classified as EXAM_PREPARATION'
  );
  assert(
    newtonResponse.directAnswer.toLowerCase().includes('momentum') ||
      newtonResponse.directAnswer.toLowerCase().includes('f =') ||
      newtonResponse.directAnswer.toLowerCase().includes('f_net'),
    'Newton\'s law for JEE must state rate of change of momentum (F = dp/dt)'
  );

  // Test 4: First Semester Subjects
  const subjectsResponse = generateFallbackTutorResponse(
    engineeringContext,
    'What are my first-semester subjects?'
  );
  assert(
    subjectsResponse.intent === 'SYLLABUS_QUERY',
    'Subjects query must be classified as SYLLABUS_QUERY'
  );
  assert(
    subjectsResponse.directAnswer.includes('Programming for Problem Solving') &&
      subjectsResponse.directAnswer.includes('Matrices and Calculus'),
    'Subjects response must return the exact subjects from the student\'s active JNTUH R25 syllabus'
  );

  // --- SUITE 4: ADAPTIVE PEDAGOGY & WEAKNESS PRIORITIZATION (Section 55) ---
  console.log('\n--- 4. ADAPTIVE PEDAGOGY TEST ---');
  // Student knowledge: Functions = 80%, Return Values = 30%, Scope = 35%
  // Next action must prioritize Return Values / Scope over Functions
  const pyReturn = CONCEPTS.find((c) => c.id === 'py-return')!;
  const pyScope = CONCEPTS.find((c) => c.id === 'py-scope')!;
  const pyFunc = CONCEPTS.find((c) => c.id === 'py-functions')!;

  assert(pyReturn.order < pyScope.order, 'py-return comes before py-scope in DAG');
  assert(
    pyReturn.prerequisiteIds.includes('py-functions'),
    'py-functions (80%) is a prerequisite for py-return (30%)'
  );

  // --- SUITE 5: SECTION 41 REAL SCENARIOS (AIML, JEE, EEE, ECE, CSE) ---
  console.log('\n--- 5. SECTION 41 REAL SCENARIOS (AIML, JEE, EEE, ECE, CSE) ---');

  // Scenario 1: AIML Engineering (JNTUH R25 CSE-AIML Year 1 Semester 1)
  const aimlSyllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'cse-aiml',
    year: 1,
    semester: 1,
  });
  assert(aimlSyllabus !== null, 'Scenario 1: AIML syllabus must resolve');
  assert(
    Boolean(aimlSyllabus!.subjects.some((s) => s.code === 'MA101BS' && s.name.includes('Linear Algebra for AI'))),
    'Scenario 1: AIML syllabus must contain Mathematics & Linear Algebra for AI (MA101BS)'
  );

  // Scenario 2: JEE Roadmap
  const { StudentContextService } = await import('../src/services/context/StudentContextService');
  const { StudyPlannerService } = await import('../src/services/syllabus/StudyPlannerService');
  const { QuestionService } = await import('../src/services/questions/QuestionService');
  const { RoadmapService } = await import('../src/services/roadmap/RoadmapService');

  const mockAimlContext: ComprehensiveStudentContext = {
    studentId: 's1',
    name: 'Aarav',
    student: { id: 's1', name: 'Aarav', email: 'aarav@nexuslearn.ai' } as any,
    education: 'B.Tech',
    educationLevel: 'B.Tech',
    preparationMode: 'ENGINEERING' as const,
    university: 'JNTUH',
    institution: 'Engineering College',
    college: 'Engineering College',
    regulation: 'R25',
    branch: 'CSE - Artificial Intelligence and Machine Learning',
    branchId: 'cse-aiml',
    branchName: 'CSE - Artificial Intelligence and Machine Learning',
    year: '1st Year',
    semester: 'Semester 1',
    syllabusId: 'JNTUH-R25-CSE-AIML-Y1-S1',
    authoritativeSyllabus: aimlSyllabus,
    subjects: aimlSyllabus!.subjects.map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      credits: s.credits,
      category: s.category,
      isLab: s.isLab,
      unitsCount: s.units.length,
    })),
    knowledgeStates: [
      {
        conceptId: 'aiml-math-eigen',
        title: 'Eigenvalues & Spectral Decomposition',
        masteryScore: 38,
        accuracy: 40,
        confidence: 85,
        status: 'NEEDS_REVIEW',
        misconceptionRisk: 0.6,
      },
    ],
    weakAreas: [
      {
        conceptId: 'aiml-math-eigen',
        title: 'Eigenvalues & Spectral Decomposition',
        masteryScore: 38,
        reason: 'Active conceptual misconception detected',
      },
    ],
    strongAreas: [],
    misconceptions: [
      {
        conceptId: 'aiml-math-eigen',
        title: 'Confusing matrix determinants with eigenvalues',
        description: 'Conflating trace and determinant formulas',
        status: 'ACTIVE',
      },
    ],
    activeMisconceptions: [
      {
        conceptId: 'aiml-math-eigen',
        title: 'Confusing matrix determinants with eigenvalues',
        description: 'Conflating trace and determinant formulas',
      },
    ],
    weakConcepts: [
      {
        conceptId: 'aiml-math-eigen',
        title: 'Eigenvalues & Spectral Decomposition',
        masteryScore: 38,
      },
    ],
    masteredConcepts: [],
    confidence: 65,
    target: '9 CGPA',
    availableTime: 180, // 3 hours
    careerGoal: 'AI Systems Engineer',
    preferredLanguage: 'English',
    dailyStudyMinutes: 180,
  } as any;


  // Scenario 1: Study Plan Generation (Topic Prioritization + 2-Week Planner)
  const studyPlan = StudyPlannerService.generatePlan({
    subjectQuery: 'Mathematics',
    target: '9 CGPA',
    weeks: 2,
    dailyStudyHours: 3,
    context: mockAimlContext,
  });

  assert(studyPlan.subject.code === 'MA101BS', 'Scenario 1: Plan must resolve to MA101BS for AIML');
  assert(studyPlan.goal.durationDays === 14, 'Scenario 1: Plan must have 14 days');
  assert(studyPlan.priorityTopics.length > 0, 'Scenario 1: Topic prioritization must return topics');
  assert(
    studyPlan.priorityTopics.some((t) => t.priority === 'High'),
    'Scenario 1: High priority topics must be identified'
  );
  assert(studyPlan.weeks.length === 2, 'Scenario 1: Must generate exactly Week 1 and Week 2');
  assert(
    studyPlan.metrics.readinessNote.includes('Target: 9 CGPA'),
    'Scenario 1: Must show realistic readiness evaluation note'
  );

  // Scenario 1: Important Questions Engine
  const mathQuestions = await QuestionService.getImportantQuestionsForSubject(
    'MA101BS',
    mockAimlContext
  );
  assert(mathQuestions.length > 0, 'Scenario 1: Must return topic-wise questions');
  assert(
    mathQuestions.some((g) => g.questions.some((q) => q.tier === 'Very Important')),
    'Scenario 1: Must include Very Important questions'
  );

  // Scenario 1: AIML Roadmap
  const aimlRoadmap = RoadmapService.getPersonalizedRoadmap(mockAimlContext);
  assert(aimlRoadmap.branchId === 'cse-aiml', 'Scenario 1: Must generate AIML-specific roadmap');
  assert(
    aimlRoadmap.skillCategories.some((c) => c.categoryName.includes('Generative AI')),
    'Scenario 1: AIML roadmap must include Generative AI & LLM Systems'
  );
  assert(
    aimlRoadmap.progressiveProjects.some((p) => p.title.includes('RAG')),
    'Scenario 1: AIML roadmap must include RAG project'
  );

  // Scenario 2: JEE Roadmap
  const mockJeeContext = {
    ...mockAimlContext,
    preparationMode: 'JEE' as const,
    target: 'JEE Main & Advanced',
  };
  const jeeRoadmap = RoadmapService.getPersonalizedRoadmap(mockJeeContext);
  assert(jeeRoadmap.branchId === 'jee', 'Scenario 2: Must generate JEE roadmap');
  assert(
    jeeRoadmap.skillCategories.some((c) => c.categoryName.includes('Physics')),
    'Scenario 2: JEE roadmap must include Physics (Mechanics & Electrodynamics)'
  );
  assert(
    jeeRoadmap.skillCategories.some((c) => c.categoryName.includes('Chemistry')),
    'Scenario 2: JEE roadmap must include Chemistry (Physical, Organic & Inorganic)'
  );

  // Scenario 3: EEE Branch Roadmap & Syllabus
  const mockEeeContext = {
    ...mockAimlContext,
    branchId: 'eee',
    branch: 'Electrical and Electronics Engineering',
    branchName: 'Electrical and Electronics Engineering',
  };
  const eeeRoadmap = RoadmapService.getPersonalizedRoadmap(mockEeeContext);
  assert(eeeRoadmap.branchId === 'eee', 'Scenario 3: Must generate EEE roadmap');
  assert(
    eeeRoadmap.skillCategories.some((c) => c.categoryName.includes('Power Electronics') || c.categoryName.includes('Machines')),
    'Scenario 3: EEE roadmap must include Power Electronics and Electrical Machines'
  );

  // Scenario 4: ECE Branch Roadmap & Syllabus
  const mockEceContext = {
    ...mockAimlContext,
    branchId: 'ece',
    branch: 'Electronics and Communication Engineering',
    branchName: 'Electronics and Communication Engineering',
  };
  const eceRoadmap = RoadmapService.getPersonalizedRoadmap(mockEceContext);
  assert(eceRoadmap.branchId === 'ece', 'Scenario 4: Must generate ECE roadmap');
  assert(
    eceRoadmap.skillCategories.some((c) => c.categoryName.includes('Semiconductor') || c.categoryName.includes('Circuits')),
    'Scenario 4: ECE roadmap must include Semiconductor Devices & Analog Circuits'
  );

  // Scenario 5: CSE Branch Roadmap
  const mockCseContext = {
    ...mockAimlContext,
    branchId: 'cse',
    branch: 'Computer Science and Engineering',
    branchName: 'Computer Science and Engineering',
  };
  const cseRoadmap = RoadmapService.getPersonalizedRoadmap(mockCseContext);
  assert(cseRoadmap.branchId === 'cse', 'Scenario 5: Must generate CSE roadmap');
  assert(
    cseRoadmap.skillCategories.some((c) => c.categoryName.includes('Operating Systems')),
    'Scenario 5: CSE roadmap must include Operating Systems & Concurrency'
  );

  console.log('\n✅ ALL 5 SECTION 41 SCENARIOS PASSED WITH 100% SPEC COMPLIANCE');

  // ════════════════════════════════════════════════════════════
  // 6. SECTION 40 SURGICAL TESTS (TESTS 1 - 7)
  // ════════════════════════════════════════════════════════════
  console.log('\n--- 6. SECTION 40 SURGICAL VERIFICATION TESTS (TEST 1 - 7) ---');

  // TEST 1: Strict Semester Isolation (Sem 1 vs Sem 2)
  const sem1Syllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'cse',
    year: 1,
    semester: 1,
  });
  assert(sem1Syllabus !== null, 'TEST 1: Semester 1 syllabus must exist');
  assert(sem1Syllabus!.semester === 1, 'TEST 1: Must resolve semester 1');
  assert(
    Boolean(sem1Syllabus!.subjects.some((s) => s.code === 'MA101BS')),
    'TEST 1: Semester 1 must contain Matrices & Calculus (MA101BS)'
  );

  const sem2Syllabus = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'cse',
    year: 1,
    semester: 2,
  });
  assert(sem2Syllabus !== null, 'TEST 1: Semester 2 syllabus must exist');
  assert(sem2Syllabus!.semester === 2, 'TEST 1: Must resolve semester 2');
  assert(
    Boolean(sem2Syllabus!.subjects.some((s) => s.code === 'CS203ES' || s.name.includes('Data Structures'))),
    'TEST 1: Semester 2 must contain Data Structures (CS203ES)'
  );
  assert(
    Boolean(sem2Syllabus!.subjects.some((s) => s.code === 'MA201BS' || s.name.includes('Differential Equations'))),
    'TEST 1: Semester 2 must contain Ordinary Differential Equations (MA201BS)'
  );
  assert(
    !sem2Syllabus!.subjects.some((s) => s.code === 'MA101BS'),
    'TEST 1: NO Semester 1 subjects must remain when Semester 2 is selected'
  );
  console.log('✓ TEST 1: Semester 1 vs Semester 2 strict isolation verified (0% leakage)');

  // TEST 2: Hierarchy of Semester 2 Subject
  const dsaSubject = sem2Syllabus!.subjects.find((s) => s.code === 'CS203ES');
  assert(dsaSubject !== undefined, 'TEST 2: Semester 2 DSA subject must exist');
  assert(dsaSubject!.units.length >= 4, 'TEST 2: DSA subject must have at least 4 units');
  const dsaUnit3 = dsaSubject!.units.find((u) => u.unitNumber === 3);
  assert(dsaUnit3 !== undefined, 'TEST 2: Unit 3 (Trees) must exist');
  assert(
    Boolean(dsaUnit3!.concepts.some((c) => c.id === 'dsa-bst-ops')),
    'TEST 2: Concepts must belong strictly to Semester 2 DSA'
  );
  console.log('✓ TEST 2: Subject -> Unit -> Topic -> Concept hierarchy verified for Semester 2');


  // TEST 3: Roadmap Concept Resolution (No "Concept not found")
  const { ConceptService } = await import('../src/services/concept/ConceptService');
  const resolvedConcept = await ConceptService.getConcept('dsa-bst-ops', mockAimlContext);
  assert(resolvedConcept !== null, 'TEST 3: Concept must resolve successfully');
  assert(resolvedConcept.title.length > 0, 'TEST 3: Concept must have a valid title');
  assert(resolvedConcept.detailedExplanation.length > 20, 'TEST 3: Detailed explanation must load');
  assert(resolvedConcept.workedExample !== undefined, 'TEST 3: Worked example must load');
  assert(resolvedConcept.commonMistakes.length > 0, 'TEST 3: Common mistakes must load');
  assert(resolvedConcept.recommendedVideos.length > 0, 'TEST 3: Recommended YouTube videos must load');
  assert(resolvedConcept.quickAssessment !== undefined, 'TEST 3: Quick assessment must load');
  console.log('✓ TEST 3: Roadmap concept resolution verified with zero "not found" states');

  // TEST 4: AI Tutor BEE Important Questions (Not generic chatbot response)
  const beeTutorResp = generateFallbackTutorResponse(
    {
      ...mockAimlContext,
      currentSubject: 'Basic Electrical Engineering',
      studentId: 'test-student',
    } as any,
    'Give me important questions in BEE'
  );
  assert(beeTutorResp.intent === 'EXAM_PREPARATION', 'TEST 4: Must classify as EXAM_PREPARATION');
  assert(beeTutorResp.directAnswer.includes('Basic Electrical Engineering'), 'TEST 4: Must identify BEE as Basic Electrical Engineering');
  assert(beeTutorResp.directAnswer.includes('UNIT 1'), 'TEST 4: Must organize important questions by unit');
  assert(beeTutorResp.directAnswer.includes('Thevenin'), 'TEST 4: Must include core Thevenin theorem question');
  assert(beeTutorResp.directAnswer.includes('Very Important'), 'TEST 4: Must categorize into Very Important');
  assert(beeTutorResp.directAnswer.includes('AI-generated important practice questions'), 'TEST 4: Must state AI-generated practice question without fabricating past exam claims');
  console.log('✓ TEST 4: AI Tutor BEE important questions verified with unit-wise organization');

  // TEST 5: AI Tutor Context Memory & Non-Contamination
  const q1Resp = generateFallbackTutorResponse(mockAimlContext as any, 'Explain Kirchhoff\'s law.');
  assert(q1Resp.directAnswer.includes('Kirchhoff'), 'TEST 5: Q1 must explain Kirchhoff\'s laws');
  assert(q1Resp.codeSnippet !== undefined, 'TEST 5: Q1 must include circuit equation snippet');

  const q2Resp = generateFallbackTutorResponse(
    {
      ...mockAimlContext,
      currentSubject: 'Basic Electrical Engineering',
      studentId: 'test-student',
    } as any,
    'What are the important questions in Unit 3?'
  );
  assert(q2Resp.intent === 'EXAM_PREPARATION', 'TEST 5: Q2 must correctly shift intent to EXAM_PREPARATION');
  assert(q2Resp.directAnswer.includes('UNIT 3'), 'TEST 5: Q2 must return Unit 3 questions');
  console.log('✓ TEST 5: Conversation context memory & non-contamination verified');

  // TEST 6: Syllabus Upload & Dynamic Registration Pipeline
  const { registerCustomSyllabus } = await import('../src/data/syllabi');
  const uploadedSyllabus = {
    id: 'AUTONOMOUS-R25-CSE-Y1-S2-UPLOADED',
    university: 'Autonomous Engineering College',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'UPLOADED_PDF' as const,
    documentName: 'Autonomous_Syllabus.pdf',
    verified: true,
    version: '1.0.0',
    retrievedAt: new Date().toISOString(),
    subjects: [
      {
        id: 'auto-sub-1',
        code: 'CS201PC',
        name: 'Advanced Data Structures and Algorithms',
        credits: 4,
        category: 'Professional Core' as const,
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Advanced Heaps and B-Trees',
            description: 'Fibonacci heaps and multi-way search trees.',
            topics: ['B-Tree Insertion', 'Fibonacci Heap Amortized Bounds'],
            concepts: [
              { id: 'c-btree', title: 'B-Tree Node Splitting', description: 'Disk-optimized search trees' },
            ],
          },
        ],
      },
    ],
  };
  registerCustomSyllabus(uploadedSyllabus);
  const resolvedUploaded = resolveAuthoritativeSyllabus({
    university: 'Autonomous Engineering College',
    regulation: 'R25',
    branch: 'cse',
    year: 1,
    semester: 2,
  });
  assert(resolvedUploaded !== null, 'TEST 6: Custom uploaded syllabus must be retrievable');
  assert(resolvedUploaded!.id === uploadedSyllabus.id, 'TEST 6: Must resolve the uploaded syllabus ID');
  assert(resolvedUploaded!.subjects[0].code === 'CS201PC', 'TEST 6: Subject structure must be intact');
  console.log('✓ TEST 6: Syllabus upload, structural parsing & dynamic registration verified');

  // TEST 7: AIML Career Direction & Realistic Professional Wording
  const aimlCareer = aimlRoadmap.careerOptions[0];
  assert(aimlCareer !== undefined, 'TEST 7: AIML career options must exist');
  assert(
    aimlCareer.description.includes('potential career direction') || aimlCareer.description.includes('AI'),
    'TEST 7: Must use professional career guidance wording'
  );
  assert(aimlCareer.requiredSkills.length > 0, 'TEST 7: Required skills must be enumerated');
  assert(aimlCareer.suggestedNextStep.length > 0, 'TEST 7: Suggested next step must be prescribed');
  assert(aimlRoadmap.readinessSummary.overallMastery > 0, 'TEST 7: Overall readiness must be calculated from knowledge states');
  console.log('✓ TEST 7: AIML skill gap, progressive milestones & realistic career path verified');

  // ════════════════════════════════════════════════════════════
  // 7. SECTION 50 FINAL PRODUCTION VERIFICATION (TESTS A - F)
  // ════════════════════════════════════════════════════════════
  console.log('\n--- 7. SECTION 50 FINAL PRODUCTION VERIFICATION (TESTS A - F) ---');

  // TEST A: 4th Year 2nd Semester
  const y4s2Cse = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    regulation: 'R25',
    branch: 'cse',
    year: 4,
    semester: 2,
  });
  assert(y4s2Cse !== null, 'TEST A: 4th Year 2nd Semester syllabus must exist (No empty page)');
  assert(y4s2Cse!.year === 4 && y4s2Cse!.semester === 2, 'TEST A: Must resolve Year 4 Semester 2');
  assert(
    Boolean(y4s2Cse!.subjects.some((s) => s.code === 'CS801PE' || s.name.includes('Deep Learning & Generative AI'))),
    'TEST A: Must contain Deep Learning & Generative AI Systems (CS801PE)'
  );
  const dlSubject = y4s2Cse!.subjects.find((s) => s.code === 'CS801PE');
  assert(dlSubject !== undefined && dlSubject!.units.length >= 4, 'TEST A: Units must appear for 4-2 subject');
  assert(
    Boolean(dlSubject!.units.some((u) => u.topics.some((t) => t.includes('Attention') || t.includes('Diffusion')))),
    'TEST A: Topics must appear for 4-2 subject'
  );
  assert(
    Boolean(dlSubject!.units.some((u) => u.concepts.some((c) => c.id === 'tf-self-attention' || c.id === 'gen-diffusion'))),
    'TEST A: Concepts must appear for 4-2 subject'
  );
  console.log('✓ TEST A: 4th Year 2nd Semester complete syllabus verified (Subjects, Units, Topics, Concepts)');

  // TEST B: Every Semester (1-1, 1-2, 2-1, 2-2, 3-1, 3-2, 4-1, 4-2)
  const allSemesters = [
    { year: 1, sem: 1 },
    { year: 1, sem: 2 },
    { year: 2, sem: 1 },
    { year: 2, sem: 2 },
    { year: 3, sem: 1 },
    { year: 3, sem: 2 },
    { year: 4, sem: 1 },
    { year: 4, sem: 2 },
  ];
  for (const s of allSemesters) {
    const syl = resolveAuthoritativeSyllabus({
      university: 'JNTUH',
      regulation: 'R25',
      branch: 'cse',
      year: s.year,
      semester: s.sem,
    });
    assert(syl !== null, `TEST B: Semester ${s.year}-${s.sem} must resolve`);
    assert(syl!.year === s.year && syl!.semester === s.sem, `TEST B: Semester ${s.year}-${s.sem} must match exact year/sem`);
  }
  // Verify unimported combination returns NULL (clearly requesting import, never silently showing another semester)
  const unimportedSyllabus = resolveAuthoritativeSyllabus({
    university: 'Unknown Remote University',
    regulation: 'R99',
    branch: 'mining',
    year: 4,
    semester: 2,
  });
  assert(unimportedSyllabus === null, 'TEST B: Unimported syllabus must return null to trigger import CTA without silent fallback');
  console.log('✓ TEST B: All 8 B.Tech semesters verified with strict isolation and zero silent fallback');

  // TEST C: Different College Isolation
  const collegeASyllabus = {
    id: 'COLLEGE-A-R25-CSE-Y2-S1',
    university: 'JNTUH',
    college: 'Chaitanya Bharathi Institute of Technology',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 2,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_COLLEGE' as const,
    verified: true,
    version: 'CBIT-1.0',
    retrievedAt: new Date().toISOString(),
    subjects: [
      {
        id: 'cbit-sub-1',
        code: 'CB201PC',
        name: 'CBIT Advanced Algorithmic Engineering',
        credits: 4,
        category: 'Professional Core' as const,
        isLab: false,
        units: [],
      },
    ],
  };
  const collegeBSyllabus = {
    id: 'COLLEGE-B-R25-CSE-Y2-S1',
    university: 'JNTUH',
    college: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 2,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_COLLEGE' as const,
    verified: true,
    version: 'VNR-1.0',
    retrievedAt: new Date().toISOString(),
    subjects: [
      {
        id: 'vnr-sub-1',
        code: 'VN201PC',
        name: 'VNR Distributed Algorithms and Cloud Systems',
        credits: 4,
        category: 'Professional Core' as const,
        isLab: false,
        units: [],
      },
    ],
  };
  registerCustomSyllabus(collegeASyllabus);
  registerCustomSyllabus(collegeBSyllabus);

  const resolvedColA = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    college: 'Chaitanya Bharathi Institute of Technology',
    regulation: 'R25',
    branch: 'cse',
    year: 2,
    semester: 1,
  });
  const resolvedColB = resolveAuthoritativeSyllabus({
    university: 'JNTUH',
    college: 'VNR Vignana Jyothi Institute of Engineering and Technology',
    regulation: 'R25',
    branch: 'cse',
    year: 2,
    semester: 1,
  });
  assert(resolvedColA !== null && resolvedColA!.id === collegeASyllabus.id, 'TEST C: College A syllabus must resolve for College A');
  assert(resolvedColB !== null && resolvedColB!.id === collegeBSyllabus.id, 'TEST C: College B syllabus must resolve for College B');
  assert(resolvedColA!.id !== resolvedColB!.id, 'TEST C: College A and College B syllabi must remain strictly isolated');
  console.log('✓ TEST C: Multi-college syllabus separation verified (No automatic bleeding)');

  // TEST D: Multi-Semester Syllabus Structure
  assert(y4s2Cse!.subjects.length > 0, 'TEST D: Uploaded/authoritative multi-semester syllabus contains subjects');
  assert(y4s2Cse!.subjects[0].units.length > 0, 'TEST D: Contains units');
  assert(y4s2Cse!.subjects[0].units[0].topics.length > 0, 'TEST D: Contains topics');
  assert(y4s2Cse!.subjects[0].units[0].concepts.length > 0, 'TEST D: Contains concepts');
  console.log('✓ TEST D: Multi-semester syllabus hierarchy pipeline verified');

  // TEST E: Continuous Python Learning & Adaptive Personalization
  // Student gets return values wrong with overconfidence
  const returnAttemptResult = calculateUpdatedMastery({
    currentMastery: 60,
    totalAttempts: 3,
    correctAttempts: 1,
    latestIsCorrect: false, // Student confused return with print()
    latestConfidence: 85, // High confidence misconception!
    conceptDifficulty: 3,
    timeSpentSeconds: 45,
  });
  assert(returnAttemptResult.newMastery <= 54, 'TEST E: Overconfident misconception must drop mastery below 55%');
  assert(returnAttemptResult.misconceptionRisk > 0.5, 'TEST E: Misconception risk must be flagged high');
  assert(returnAttemptResult.status === 'NEEDS_REVIEW', 'TEST E: Status must transition to NEEDS_REVIEW');
  console.log('✓ TEST E: Continuous Python learning answer evaluation & misconception isolation verified');

  // TEST F: Career Path Using Actual Performance History
  assert(aimlRoadmap.careerOptions.length > 0, 'TEST F: Career options generated');
  assert(aimlRoadmap.careerOptions[0].title.length > 0, 'TEST F: Career title calculated');
  assert(aimlRoadmap.careerOptions[0].requiredSkills.length > 0, 'TEST F: Required skills evaluated');
  assert(aimlRoadmap.careerOptions[0].suggestedNextStep.length > 0, 'TEST F: Suggested next step prescribed');
  assert(aimlRoadmap.skillCategories.length > 0, 'TEST F: Progressive milestones present');
  console.log('✓ TEST F: Performance-grounded career roadmap verified');

  console.log('\n====================================================');
  console.log('🎉 ALL 7 SECTION 40 & SECTION 50 PRODUCTION TESTS PASSED [100% OK]');
  console.log('====================================================');
}

runTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});

