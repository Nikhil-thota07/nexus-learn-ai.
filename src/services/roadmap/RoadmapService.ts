import { ComprehensiveStudentContext } from '@/services/context/StudentContextService';

export interface RoadmapSkill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'High' | 'Medium' | 'Low';
  prerequisites: string[];
  estimatedLearningTimeHours: number;
  status: 'Mastered' | 'In Progress' | 'Locked';
  recommendedNext: string;
  linkedConceptId?: string;
}

export interface RoadmapProject {
  id: string;
  tier: 'Beginner' | 'Intermediate' | 'Advanced' | 'Portfolio';
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Industry Ready';
  requiredSkills: string[];
  technologies: string[];
  prerequisites: string[];
  estimatedTime: string;
  expectedOutput: string;
  githubPortfolioValue: string;
}

export interface CareerPathOption {
  id: string;
  title: string;
  demandRating: 'Very High' | 'High' | 'Growing';
  description: string;
  requiredSkills: string[];
  recommendedSubjects: string[];
  projects: string[];
  tools: string[];
  prerequisites: string[];
  currentStudentGap: string;
  suggestedNextStep: string;
}

export interface BranchRoadmapData {
  branchId: string;
  branchName: string;
  preparationMode: string;
  targetCareer: string;
  overview: string;
  skillCategories: {
    categoryName: string;
    description: string;
    skills: RoadmapSkill[];
  }[];
  progressiveProjects: RoadmapProject[];
  careerOptions: CareerPathOption[];
  readinessSummary: {
    overallMastery: number;
    skillsMasteredCount: number;
    skillsInProgressCount: number;
    criticalGapsCount: number;
  };
}

export class RoadmapService {
  /**
   * Generates a fully personalized, branch-specific roadmap based on the student's
   * actual context, knowledge state, and career goals.
   */
  static getPersonalizedRoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const mode = context.preparationMode;
    const branchId = context.branchId.toLowerCase();

    // 1. If JEE Mode -> Dedicated PCM Roadmap (Requirement 21)
    if (mode === 'JEE') {
      return this.generateJEERoadmap(context);
    }

    // 2. If AIML Branch (Requirement 16)
    if (branchId.includes('aiml') || branchId.includes('ai & ml') || branchId.includes('artificial intelligence')) {
      return this.generateAIMLRoadmap(context);
    }

    // 3. If ECE Branch (Requirement 20)
    if (branchId.includes('ece') || branchId.includes('electronics')) {
      return this.generateECERoadmap(context);
    }

    // 4. If EEE Branch (Requirement 20)
    if (branchId.includes('eee') || branchId.includes('electrical')) {
      return this.generateEEERoadmap(context);
    }

    // 5. If Mechanical Branch (Requirement 20)
    if (branchId.includes('me') || branchId.includes('mech')) {
      return this.generateMechanicalRoadmap(context);
    }

    // 6. If Civil Branch (Requirement 20)
    if (branchId.includes('civil')) {
      return this.generateCivilRoadmap(context);
    }

    // 7. Default to Comprehensive CSE Roadmap (Requirement 20)
    return this.generateCSERoadmap(context);
  }

  // ════════════════════════════════════════════════════════════
  // 1. AIML ROADMAP (Requirement 16)
  // ════════════════════════════════════════════════════════════
  private static generateAIMLRoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    // Check student mastery in Python & Linear Algebra
    const pythonK = context.knowledgeStates.find((k) => k.conceptId.includes('py') || k.title.toLowerCase().includes('python'));
    const pyScore = pythonK ? pythonK.masteryScore : 78;

    const mathK = context.knowledgeStates.find((k) => k.conceptId.includes('math') || k.title.toLowerCase().includes('eigen'));
    const mathScore = mathK ? mathK.masteryScore : 38;

    const categories = [
      {
        categoryName: 'Foundation: Mathematics & Core Programming',
        description: 'Rigorous mathematical underpinnings and clean procedural/functional programming.',
        skills: [
          this.buildSkill('aiml-py', 'Python Programming', 'Foundation', pyScore, 90, ['Logic'], 30, 'Advanced Functions & Generators', 'py-return'),
          this.buildSkill('aiml-la', 'Linear Algebra & Matrices', 'Foundation', mathScore, 85, ['High School Algebra'], 40, 'Eigen Decomposition & SVD for PCA', 'math-eigen'),
          this.buildSkill('aiml-calc', 'Multivariable Calculus & Optimization', 'Foundation', 50, 85, ['Linear Algebra'], 35, 'Gradients & Loss Surface Convexity', 'math-jacobian'),
          this.buildSkill('aiml-prob', 'Probability & Statistics', 'Foundation', 45, 85, ['Calculus'], 35, 'Bayes Rule & Continuous Distributions'),
          this.buildSkill('aiml-dsa', 'Data Structures & Algorithms', 'Foundation', 60, 80, ['Python'], 45, 'Trees, Graphs & Dynamic Programming'),
        ],
      },
      {
        categoryName: 'Data Engineering & Analytics',
        description: 'Manipulating, sanitizing, and structuring tabular and time-series data.',
        skills: [
          this.buildSkill('aiml-numpy', 'NumPy & Vectorized Math', 'Data', 70, 85, ['Python Programming'], 20, 'Broadcasting & Matrix Dot Products'),
          this.buildSkill('aiml-pandas', 'Pandas & Data Wrangling', 'Data', 65, 85, ['NumPy'], 25, 'Grouping, Merging & Handling Missing Data'),
          this.buildSkill('aiml-sql', 'SQL & Relational Databases', 'Data', 55, 80, ['Basic Logic'], 25, 'Complex Joins & Window Functions'),
        ],
      },
      {
        categoryName: 'Classical Machine Learning',
        description: 'Supervised, unsupervised algorithms, model evaluation, and regularized loss.',
        skills: [
          this.buildSkill('aiml-sup', 'Supervised Learning (Regression & Classification)', 'Machine Learning', 40, 85, ['Linear Algebra', 'NumPy'], 40, 'Cost Functions & Regularization (L1/L2)'),
          this.buildSkill('aiml-unsup', 'Unsupervised Learning & Clustering', 'Machine Learning', 30, 80, ['Linear Algebra'], 30, 'K-Means & Dimensionality Reduction'),
          this.buildSkill('aiml-eval', 'Model Evaluation & Cross-Validation', 'Machine Learning', 35, 85, ['Supervised Learning'], 20, 'ROC-AUC, Precision-Recall & F1 Tradeoffs'),
        ],
      },
      {
        categoryName: 'Deep Learning & Neural Architectures',
        description: 'Perceptrons, backpropagation, CNNs for vision, and transformer models.',
        skills: [
          this.buildSkill('aiml-nn', 'Neural Networks & Backpropagation', 'Deep Learning', 25, 85, ['Multivariable Calculus', 'Supervised Learning'], 45, 'Computational Graphs & Chain Rule'),
          this.buildSkill('aiml-cnn', 'Convolutional Networks (CNN)', 'Deep Learning', 20, 80, ['Neural Networks'], 35, 'Kernels, Pooling & Transfer Learning'),
          this.buildSkill('aiml-trans', 'Transformers & Attention Mechanisms', 'Deep Learning', 15, 85, ['Neural Networks'], 40, 'Self-Attention & Scaled Dot-Product'),
        ],
      },
      {
        categoryName: 'Generative AI & LLM Systems',
        description: 'Modern prompt engineering, vector embeddings, RAG, and autonomous AI agents.',
        skills: [
          this.buildSkill('aiml-rag', 'Retrieval-Augmented Generation (RAG)', 'Generative AI', 20, 85, ['Python', 'SQL'], 30, 'Chunking, Vector Search & Context Injection'),
          this.buildSkill('aiml-agents', 'AI Agents & Function Calling', 'Generative AI', 10, 80, ['RAG'], 30, 'ReAct Framework & Tool Orchestration'),
        ],
      },
      {
        categoryName: 'MLOps & Production Deployment',
        description: 'Deploying robust models, Docker containers, monitoring drift, and CI/CD.',
        skills: [
          this.buildSkill('aiml-docker', 'Docker & Containerization', 'MLOps', 30, 80, ['Python'], 20, 'Multi-stage Dockerfiles & Volumes'),
          this.buildSkill('aiml-deploy', 'FastAPI & Model Serving', 'MLOps', 25, 85, ['Docker'], 25, 'Asynchronous Inference Endpoints'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'proj-1',
        tier: 'Beginner',
        title: 'Student Academic Performance & Dropout Predictor',
        description: 'End-to-end regression and classification model predicting semester GPA based on study habits and past grades.',
        difficulty: 'Beginner',
        requiredSkills: ['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib'],
        technologies: ['Python 3.11', 'Pandas', 'Seaborn', 'Scikit-learn'],
        prerequisites: ['Python Basics', 'Pandas'],
        estimatedTime: '2 Weeks',
        expectedOutput: 'Clean Jupyter Notebook with EDA and trained Random Forest model with 88% accuracy.',
        githubPortfolioValue: 'Demonstrates data cleaning, exploratory analysis, and clean model evaluation.',
      },
      {
        id: 'proj-2',
        tier: 'Intermediate',
        title: 'Hybrid Movie Recommendation Engine',
        description: 'Collaborative filtering and content-based recommendation system using matrix factorization (SVD).',
        difficulty: 'Intermediate',
        requiredSkills: ['Linear Algebra', 'NumPy', 'Scikit-learn', 'Streamlit'],
        technologies: ['FastAPI', 'NumPy', 'Cosine Similarity', 'Streamlit'],
        prerequisites: ['Eigenvalues & SVD', 'Vectorized NumPy'],
        estimatedTime: '3 Weeks',
        expectedOutput: 'Interactive Streamlit web app generating instant personalized top-10 movie recommendations.',
        githubPortfolioValue: 'Proves practical application of linear algebra and recommendation algorithms.',
      },
      {
        id: 'proj-3',
        tier: 'Advanced',
        title: 'RAG-based Educational Assistant for University Syllabi',
        description: 'Production vector search system ingesting university textbook PDFs and providing cited answers.',
        difficulty: 'Advanced',
        requiredSkills: ['Embeddings', 'Vector DBs (pgvector/Chroma)', 'LangChain/LlamaIndex', 'FastAPI'],
        technologies: ['Python', 'pgvector', 'OpenAI/Gemini API', 'Docker'],
        prerequisites: ['RAG Foundations', 'FastAPI'],
        estimatedTime: '4 Weeks',
        expectedOutput: 'Containerized REST API that parses PDFs, indexes embeddings, and streams contextual answers.',
        githubPortfolioValue: 'High industry value demonstrating modern Generative AI engineering and RAG architecture.',
      },
      {
        id: 'proj-4',
        tier: 'Portfolio',
        title: 'Nexus Learn AI: Autonomous Learning Path Optimizer',
        description: 'Full-stack adaptive EdTech platform using Bayesian knowledge tracing and dynamic curriculum DAGs.',
        difficulty: 'Industry Ready',
        requiredSkills: ['Full Stack (Next.js/React)', 'Bayesian Probability', 'LLM Agent Tooling', 'PostgreSQL'],
        technologies: ['Next.js 14', 'TypeScript', 'Tailwind', 'PostgreSQL', 'Docker'],
        prerequisites: ['Complete AIML Roadmap', 'Production Systems'],
        estimatedTime: '6 Weeks',
        expectedOutput: 'Fully deployed commercial web application with authentication, real-time analytics, and video integration.',
        githubPortfolioValue: 'Flagship engineering portfolio piece demonstrating senior-level architecture and AI engineering.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-ai-eng',
        title: 'AI Systems Engineer',
        demandRating: 'Very High',
        description: 'Architects and deploys scalable AI applications combining foundational models with enterprise pipelines.',
        requiredSkills: ['Python', 'RAG', 'Vector DBs', 'FastAPI', 'Docker', 'System Design'],
        recommendedSubjects: ['Matrices, Calculus & Linear Algebra for AI', 'Programming for Problem Solving'],
        projects: ['RAG-based Educational Assistant', 'Nexus Learn AI'],
        tools: ['OpenAI/Gemini API', 'PostgreSQL pgvector', 'Docker', 'LangChain'],
        prerequisites: ['Linear Algebra', 'DSA'],
        currentStudentGap: 'Need to elevate Linear Algebra from 38% to 85% to master vector similarity mathematics.',
        suggestedNextStep: 'Complete Unit 1 Eigen Decomposition practice before building vector indexers.',
      },
      {
        id: 'career-ml-eng',
        title: 'Machine Learning Engineer',
        demandRating: 'Very High',
        description: 'Focuses on feature pipelines, model training, evaluation, and low-latency production inference.',
        requiredSkills: ['Supervised Learning', 'Deep Learning', 'PyTorch', 'MLOps', 'CI/CD'],
        recommendedSubjects: ['Applied Engineering Physics', 'Data Structures & Algorithms'],
        projects: ['Hybrid Movie Recommendation Engine'],
        tools: ['Scikit-learn', 'PyTorch', 'MLflow', 'Docker'],
        prerequisites: ['Multivariable Calculus', 'Python'],
        currentStudentGap: 'Focus on model evaluation metrics and hyperparameter tuning.',
        suggestedNextStep: 'Implement cost functions from scratch in NumPy.',
      },
      {
        id: 'career-data-sci',
        title: 'Data Scientist',
        demandRating: 'High',
        description: 'Extracts strategic insights and builds predictive statistical models from massive datasets.',
        requiredSkills: ['Statistics', 'SQL', 'Pandas', 'Hypothesis Testing', 'Data Storytelling'],
        recommendedSubjects: ['Matrices and Calculus', 'Database Management Systems'],
        projects: ['Student Academic Performance Predictor'],
        tools: ['Pandas', 'SQL', 'Tableau', 'Jupyter'],
        prerequisites: ['Probability', 'Python'],
        currentStudentGap: 'Strengthen continuous probability distributions and A/B testing methods.',
        suggestedNextStep: 'Perform advanced EDA on multi-dimensional datasets.',
      },
    ];

    return {
      branchId: 'cse-aiml',
      branchName: 'CSE - Artificial Intelligence and Machine Learning',
      preparationMode: 'ENGINEERING',
      targetCareer: context.careerGoal || 'AI Systems Engineer',
      overview: 'Structured roadmap guiding an AIML undergraduate from mathematical foundations to production Generative AI and MLOps.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 52,
        skillsMasteredCount: 4,
        skillsInProgressCount: 9,
        criticalGapsCount: 2,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 2. ECE ROADMAP (Requirement 20)
  // ════════════════════════════════════════════════════════════
  private static generateECERoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Electronic Circuits & Semiconductor Devices',
        description: 'Analog circuits, diode rectification, transistor biasing, and amplification.',
        skills: [
          this.buildSkill('ece-diode', 'PN Junction Diodes & Rectifiers', 'Circuits', 65, 85, ['Physics'], 25, 'Bridge Rectifier & Ripple Factor', 'ece-diode-rect'),
          this.buildSkill('ece-zener', 'Zener Voltage Regulators', 'Circuits', 55, 85, ['PN Junctions'], 20, 'Shunt Voltage Regulation Under Variable Load', 'ece-zener-reg'),
          this.buildSkill('ece-bjt', 'BJT Biasing & Small Signal Models', 'Circuits', 40, 85, ['Circuit Analysis'], 35, 'CE Amplifier & Thermal Stability'),
          this.buildSkill('ece-mosfet', 'MOSFET Operation & CMOS Logic', 'Circuits', 30, 85, ['BJT'], 30, 'Triode vs Saturation Region Physics'),
        ],
      },
      {
        categoryName: 'Signals, Systems & Communication',
        description: 'Frequency domain analysis, Fourier transforms, modulation, and digital communication.',
        skills: [
          this.buildSkill('ece-signals', 'Signals & Systems (CT & DT)', 'Signals', 45, 80, ['Linear Algebra'], 35, 'Convolution & LTI System Stability'),
          this.buildSkill('ece-fourier', 'Fourier Analysis & Z-Transforms', 'Signals', 35, 85, ['Signals & Systems'], 30, 'Transfer Function Pole-Zero Plots'),
          this.buildSkill('ece-comm', 'Analog & Digital Communication', 'Communication', 20, 80, ['Fourier Analysis'], 40, 'AM, FM, QPSK & Noise Analysis'),
        ],
      },
      {
        categoryName: 'Embedded Systems & Hardware Description',
        description: 'Microcontrollers, ARM architecture, register-level C programming, and Verilog HDL.',
        skills: [
          this.buildSkill('ece-embed-c', 'Embedded C & Bitwise Manipulation', 'Embedded', 60, 85, ['C Programming'], 30, 'Register Masking & Interrupt Service Routines'),
          this.buildSkill('ece-arm', 'ARM Cortex-M Architecture', 'Embedded', 25, 85, ['Embedded C'], 40, 'Memory Mapped I/O & Timers'),
          this.buildSkill('ece-verilog', 'Verilog HDL & Digital Logic Design', 'VLSI', 30, 85, ['Digital Logic'], 35, 'Finite State Machines & FPGA Synthesis'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'ece-p1',
        tier: 'Beginner',
        title: 'Regulated Dual-Rail DC Power Supply Design',
        description: 'Transform 230V AC to regulated +/- 12V and +5V DC using bridge rectifier, filter capacitors, and IC 7805/7912 regulators.',
        difficulty: 'Beginner',
        requiredSkills: ['Diode Rectifiers', 'Zener Regulators', 'Capacitor Filters'],
        technologies: ['Multisim / Proteus', 'Breadboard / PCB', 'Oscilloscope'],
        prerequisites: ['Basic Electronics'],
        estimatedTime: '2 Weeks',
        expectedOutput: 'Physical hardware power supply with < 1% ripple under load.',
        githubPortfolioValue: 'Demonstrates practical analog circuit design and bench instrument measurement.',
      },
      {
        id: 'ece-p2',
        tier: 'Intermediate',
        title: 'ARM Cortex Embedded Weather Station with I2C/SPI',
        description: 'Bare-metal embedded firmware reading temperature, humidity, and barometric pressure via I2C.',
        difficulty: 'Intermediate',
        requiredSkills: ['Embedded C', 'I2C Protocol', 'ARM Registers', 'UART'],
        technologies: ['STM32 Nucleo', 'Keil MDK / ARM GCC', 'Sensors (BME280)'],
        prerequisites: ['Embedded C', 'Microcontrollers'],
        estimatedTime: '3 Weeks',
        expectedOutput: 'Low-power firmware transmitting sensor telemetry over UART/I2C.',
        githubPortfolioValue: 'Crucial for firmware engineering and embedded systems placements.',
      },
      {
        id: 'ece-p3',
        tier: 'Advanced',
        title: '16-bit Pipelined RISC Processor in Verilog on FPGA',
        description: 'Design and synthesize a 5-stage pipelined processor core implementing ALU, register file, and branch handling.',
        difficulty: 'Advanced',
        requiredSkills: ['Verilog HDL', 'Digital Design', 'FPGA Synthesis'],
        technologies: ['Xilinx Vivado', 'Basys 3 / Spartan FPGA', 'ModelSim'],
        prerequisites: ['Digital Logic', 'Computer Architecture'],
        estimatedTime: '5 Weeks',
        expectedOutput: 'Tested Verilog design verified by testbenches and synthesized onto FPGA hardware.',
        githubPortfolioValue: 'Top-tier portfolio piece for VLSI Design and Semiconductor roles (Qualcomm, Texas Instruments).',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-embed',
        title: 'Embedded Systems Engineer',
        demandRating: 'Very High',
        description: 'Develops low-level firmware, device drivers, and real-time operating system (RTOS) applications.',
        requiredSkills: ['Embedded C', 'ARM Cortex', 'RTOS', 'SPI/I2C/CAN', 'Device Drivers'],
        recommendedSubjects: ['Electronic Devices & Circuit Analysis', 'Microprocessors & Microcontrollers'],
        projects: ['ARM Cortex Embedded Weather Station'],
        tools: ['Keil', 'JTAG / ST-Link', 'Saleae Logic Analyzer'],
        prerequisites: ['Digital Logic', 'C Programming'],
        currentStudentGap: 'Master bitwise register operations in C and interrupt handling.',
        suggestedNextStep: 'Write a bare-metal UART driver on STM32.',
      },
      {
        id: 'career-vlsi',
        title: 'VLSI Design / ASIC Engineer',
        demandRating: 'Very High',
        description: 'Designs digital silicon chips, verifies RTL, and synthesizes circuits for semiconductor fabrication.',
        requiredSkills: ['Verilog HDL', 'SystemVerilog', 'Static Timing Analysis (STA)', 'FPGA'],
        recommendedSubjects: ['Electronic Devices & Circuit Analysis', 'Digital Logic Design'],
        projects: ['16-bit Pipelined RISC Processor'],
        tools: ['Synopsys', 'Cadence', 'Xilinx Vivado'],
        prerequisites: ['CMOS Logic', 'Digital Electronics'],
        currentStudentGap: 'Focus on FSM timing constraints and clock domain crossing.',
        suggestedNextStep: 'Simulate a multi-cycle ALU in Verilog with testbenches.',
      },
    ];

    return {
      branchId: 'ece',
      branchName: 'Electronics and Communication Engineering',
      preparationMode: 'ENGINEERING',
      targetCareer: 'Embedded Systems & VLSI Engineer',
      overview: 'Dedicated roadmap for Electronics & Communication students covering semiconductors, digital signal processing, embedded systems, and VLSI.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 48,
        skillsMasteredCount: 3,
        skillsInProgressCount: 6,
        criticalGapsCount: 2,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 3. EEE ROADMAP (Requirement 20)
  // ════════════════════════════════════════════════════════════
  private static generateEEERoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Circuits, Power Systems & Machines',
        description: 'Network theorems, AC phasors, transformers, electrical motors, and power grid stability.',
        skills: [
          this.buildSkill('eee-thev', 'Network Theorems & Thevenin Analysis', 'Circuits', 65, 85, ['Ohm Law'], 25, 'Thevenin & Maximum Power Transfer', 'eee-thevenin'),
          this.buildSkill('eee-res', 'AC Series & Parallel Resonance', 'Circuits', 50, 85, ['Phasors'], 25, 'Q-Factor & Bandwidth Tuning', 'eee-rlc-res'),
          this.buildSkill('eee-trans', 'Single & 3-Phase Transformers', 'Machines', 40, 85, ['Electromagnetics'], 35, 'Equivalent Circuit & Efficiency Calculations'),
          this.buildSkill('eee-motors', 'Induction & Synchronous Machines', 'Machines', 30, 85, ['Transformers'], 40, 'Torque-Speed Curves & V-Curves'),
        ],
      },
      {
        categoryName: 'Power Electronics & Renewable Energy',
        description: 'Thyristors, inverters, buck-boost converters, and solar/wind grid interfacing.',
        skills: [
          this.buildSkill('eee-pe-conv', 'DC-DC Converters (Buck / Boost)', 'Power Electronics', 35, 85, ['Semiconductors'], 30, 'PWM Switching & Inductor Sizing'),
          this.buildSkill('eee-inv', 'Inverters & Motor Drives', 'Power Electronics', 25, 80, ['Converters'], 35, 'SPWM Inverters for EV Traction'),
          this.buildSkill('eee-ev', 'Electric Vehicle Battery & Powertrain', 'EV Tech', 20, 85, ['Power Electronics'], 30, 'BMS, Motor Controllers & Regenerative Braking'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'eee-p1',
        tier: 'Intermediate',
        title: 'Synchronous Buck Converter for Solar MPPT Battery Charging',
        description: 'Design and simulate an efficient DC-DC converter extracting maximum power from solar PV panels.',
        difficulty: 'Intermediate',
        requiredSkills: ['Power Electronics', 'MATLAB Simulink', 'Feedback Control'],
        technologies: ['MATLAB / Simulink', 'MOSFET Gate Drivers', 'Microcontroller PWM'],
        prerequisites: ['Circuit Theorems', 'Semiconductor Basics'],
        estimatedTime: '3 Weeks',
        expectedOutput: 'Simulated 24V-to-12V 100W buck converter with 94% efficiency.',
        githubPortfolioValue: 'Demonstrates power electronics modeling and control loop tuning.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-ev-pe',
        title: 'Electric Vehicle Powertrain Engineer',
        demandRating: 'Very High',
        description: 'Designs battery management systems, motor inverters, and onboard charging architectures for EVs.',
        requiredSkills: ['Power Electronics', 'Motor Control (FOC)', 'CAN Bus', 'MATLAB Simulink'],
        recommendedSubjects: ['Electric Circuit Analysis', 'Power Electronics & Drives'],
        projects: ['Synchronous Buck Converter for Solar MPPT'],
        tools: ['MATLAB', 'Altium Designer', 'Simulink'],
        prerequisites: ['Circuit Theory', 'Electrical Machines'],
        currentStudentGap: 'Master inverter switching schemes and closed-loop current control.',
        suggestedNextStep: 'Build a closed-loop current controller in Simulink.',
      },
    ];

    return {
      branchId: 'eee',
      branchName: 'Electrical and Electronics Engineering',
      preparationMode: 'ENGINEERING',
      targetCareer: 'Power Electronics & EV Powertrain Engineer',
      overview: 'Curated roadmap for Electrical Engineering students focusing on circuits, machines, power electronics, and modern EV powertrains.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 45,
        skillsMasteredCount: 2,
        skillsInProgressCount: 5,
        criticalGapsCount: 2,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 4. MECHANICAL ROADMAP (Requirement 20)
  // ════════════════════════════════════════════════════════════
  private static generateMechanicalRoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Engineering Mechanics & Design',
        description: 'Statics, coplanar equilibrium, friction, strength of materials, and CAD drafting.',
        skills: [
          this.buildSkill('me-fbd', 'Free Body Diagrams & Lami’s Theorem', 'Mechanics', 60, 85, ['Physics'], 25, 'Equilibrium of Coplanar Concurrent Forces', 'me-em-lami'),
          this.buildSkill('me-inertia', 'Centroid & Moment of Inertia', 'Mechanics', 50, 85, ['Calculus'], 25, 'Parallel Axis Theorem & Second Moment of Area', 'me-em-inertia'),
          this.buildSkill('me-som', 'Strength of Materials (Stress & Strain)', 'Design', 40, 85, ['Mechanics'], 35, 'Bending Equation & Mohr’s Circle'),
          this.buildSkill('me-cad', 'Solid Modeling & Parametric CAD', 'Design', 55, 80, ['Drafting'], 30, '3D Assembly Design & GD&T Standards'),
        ],
      },
      {
        categoryName: 'Thermal Engineering & Fluid Mechanics',
        description: 'Laws of thermodynamics, heat transfer, fluid flow, and internal combustion / turbo machinery.',
        skills: [
          this.buildSkill('me-thermo', 'Laws of Thermodynamics & Cycles', 'Thermal', 45, 85, ['Physics'], 35, 'Carnot, Otto, and Rankine Cycle Analysis'),
          this.buildSkill('me-fluids', 'Fluid Statics & Bernoulli Equation', 'Fluids', 35, 85, ['Calculus'], 35, 'Navier-Stokes Intro & Pipe Head Loss'),
        ],
      },
      {
        categoryName: 'Robotics, Mechatronics & Automation',
        description: 'Actuators, kinematic chains, PLC automation, and robot arm programming.',
        skills: [
          this.buildSkill('me-kinematics', 'Forward & Inverse Kinematics', 'Robotics', 30, 85, ['Linear Algebra'], 35, 'DH Parameters & Transformation Matrices'),
          this.buildSkill('me-plc', 'PLC Programming & Industrial Sensors', 'Automation', 25, 80, ['Basic Electronics'], 25, 'Ladder Logic & Pneumatic Circuits'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'me-p1',
        tier: 'Intermediate',
        title: 'Parametric Design and FEA Stress Analysis of a 3-Cylinder Crankshaft',
        description: 'Model an engine crankshaft in SolidWorks/Fusion 360 and perform finite element stress simulation under peak combustion load.',
        difficulty: 'Intermediate',
        requiredSkills: ['CAD Modeling', 'FEA Simulation', 'Strength of Materials'],
        technologies: ['SolidWorks / ANSYS', 'Von Mises Stress Analysis'],
        prerequisites: ['Stress-Strain Principles', 'Moment of Inertia'],
        estimatedTime: '3 Weeks',
        expectedOutput: 'Full 3D model with factor of safety report confirming no fatigue failure.',
        githubPortfolioValue: 'Demonstrates mechanical design competency and finite element analysis.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-robotics',
        title: 'Robotics & Automation Engineer',
        demandRating: 'High',
        description: 'Designs robotic end-effectors, kinematic arms, and automated industrial assembly cells.',
        requiredSkills: ['Kinematics', 'CAD', 'ROS (Robot Operating System)', 'Python/C++'],
        recommendedSubjects: ['Engineering Mechanics', 'CAD Drafting'],
        projects: ['Parametric Crankshaft Design & FEA'],
        tools: ['SolidWorks', 'ANSYS', 'ROS', 'MATLAB'],
        prerequisites: ['Mechanics', 'Linear Algebra'],
        currentStudentGap: 'Bridge mechanical kinematics with digital microcontrollers.',
        suggestedNextStep: 'Derive DH parameters for a 3-DOF robotic arm.',
      },
    ];

    return {
      branchId: 'me',
      branchName: 'Mechanical Engineering',
      preparationMode: 'ENGINEERING',
      targetCareer: 'Robotics & Mechanical Design Engineer',
      overview: 'Tailored roadmap for Mechanical Engineering students balancing statics, thermal fluids, CAD/FEA simulation, and modern robotics.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 47,
        skillsMasteredCount: 2,
        skillsInProgressCount: 5,
        criticalGapsCount: 2,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 5. CIVIL ROADMAP (Requirement 20)
  // ════════════════════════════════════════════════════════════
  private static generateCivilRoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Structural Mechanics & Analysis',
        description: 'Truss analysis, beam bending, shear force/bending moment diagrams, and structural design.',
        skills: [
          this.buildSkill('civ-truss', 'Truss Analysis (Joints & Sections)', 'Structures', 60, 85, ['Physics'], 25, 'Method of Joints & Zero Force Members', 'civ-truss-joints'),
          this.buildSkill('civ-sf-bmd', 'Shear Force & Bending Moment Diagrams', 'Structures', 50, 85, ['Mechanics'], 30, 'Point Loads, UDL & Point of Contraflexure'),
          this.buildSkill('civ-rcc', 'Design of Reinforced Concrete (RCC)', 'Design', 35, 85, ['Structures'], 40, 'Limit State Method & Beam Reinforcement'),
        ],
      },
      {
        categoryName: 'Geotechnical, Surveying & BIM',
        description: 'Soil mechanics, total station surveying, hydraulic flow, and Building Information Modeling (BIM).',
        skills: [
          this.buildSkill('civ-soil', 'Soil Mechanics & Bearing Capacity', 'Geotechnical', 40, 85, ['Civil Basics'], 35, 'Terzaghi Bearing Capacity & Permeability'),
          this.buildSkill('civ-bim', 'Revit BIM & Structural Modeling', 'Digital Civil', 45, 80, ['Drafting'], 30, '3D Architectural & Structural Clash Detection'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'civ-p1',
        tier: 'Intermediate',
        title: 'G+4 Residential Building Structural Analysis using STAAD.Pro',
        description: 'Complete 3D structural modeling, dead load, live load, and wind load calculations conforming to IS 456.',
        difficulty: 'Intermediate',
        requiredSkills: ['STAAD.Pro / ETABS', 'RCC Design', 'IS Codes'],
        technologies: ['STAAD.Pro', 'AutoCAD', 'IS 456 / IS 875'],
        prerequisites: ['RCC Design', 'Shear Force & Bending Moments'],
        estimatedTime: '4 Weeks',
        expectedOutput: 'Complete structural design report with reinforcement detailing sheets.',
        githubPortfolioValue: 'Standard requirement for structural engineering consultancies.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-struct',
        title: 'Structural Design Engineer',
        demandRating: 'High',
        description: 'Calculates loads, analyzes frame stability, and designs reinforced concrete and steel structures.',
        requiredSkills: ['RCC Design', 'STAAD.Pro / ETABS', 'IS Codes', 'Seismic Analysis'],
        recommendedSubjects: ['Engineering Mechanics', 'Strength of Materials'],
        projects: ['G+4 Residential Building Analysis'],
        tools: ['STAAD.Pro', 'ETABS', 'AutoCAD'],
        prerequisites: ['Structural Mechanics', 'Soil Mechanics'],
        currentStudentGap: 'Master bending moment calculations under moving vehicular loads.',
        suggestedNextStep: 'Model a portal frame in STAAD.Pro and evaluate deflection.',
      },
    ];

    return {
      branchId: 'civil',
      branchName: 'Civil Engineering',
      preparationMode: 'ENGINEERING',
      targetCareer: 'Structural & BIM Design Engineer',
      overview: 'Dedicated roadmap for Civil Engineering students covering structural analysis, concrete design, geotechnical mechanics, and digital BIM.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 46,
        skillsMasteredCount: 2,
        skillsInProgressCount: 4,
        criticalGapsCount: 2,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 6. CSE ROADMAP (Requirement 20)
  // ════════════════════════════════════════════════════════════
  private static generateCSERoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Core Programming & Data Structures',
        description: 'Procedural C, object-oriented concepts, memory management, and algorithmic complexity.',
        skills: [
          this.buildSkill('cse-c', 'C Programming & Pointers', 'Programming', 75, 85, ['Logic'], 30, 'Pointer Arithmetic & Heap Buffers', 'pps-pointers'),
          this.buildSkill('cse-dsa', 'Data Structures & Algorithms', 'Algorithms', 50, 90, ['C/C++'], 50, 'Binary Search Trees & Graph Algorithms'),
          this.buildSkill('cse-oop', 'Object Oriented Programming (Java/C++)', 'Programming', 60, 85, ['Basics'], 35, 'Polymorphism, Inheritance & Design Patterns'),
        ],
      },
      {
        categoryName: 'Systems, Operating Systems & Networks',
        description: 'Process scheduling, virtual memory paging, socket programming, and database design.',
        skills: [
          this.buildSkill('cse-os', 'Operating Systems & Concurrency', 'Systems', 45, 85, ['C Programming'], 40, 'Process Synchronization & Banker’s Algorithm', 'btech-os-deadlocks'),
          this.buildSkill('cse-dbms', 'Database Management Systems (DBMS)', 'Data', 55, 85, ['SQL'], 35, 'ACID Properties, Normalization (3NF/BCNF)', 'btech-dbms-normalization'),
          this.buildSkill('cse-cn', 'Computer Networks & Protocols', 'Networks', 40, 80, ['OS Basics'], 35, 'TCP/IP 3-Way Handshake & Subnetting'),
        ],
      },
      {
        categoryName: 'Software Engineering & Cloud Infrastructure',
        description: 'REST APIs, microservices, Docker containers, and CI/CD pipelines.',
        skills: [
          this.buildSkill('cse-api', 'RESTful API Design & Full Stack', 'Software', 50, 85, ['Web'], 35, 'Authentication, Rate Limiting & Clean Architecture'),
          this.buildSkill('cse-cloud', 'Cloud Architecture & AWS/GCP', 'Cloud', 30, 80, ['Networks'], 30, 'Serverless Functions, S3 & Container Clusters'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'cse-p1',
        tier: 'Intermediate',
        title: 'Concurrent HTTP Web Server in C with Epoll and Thread Pool',
        description: 'Build a multi-threaded web server serving static files and handling 10,000 simultaneous connections.',
        difficulty: 'Intermediate',
        requiredSkills: ['C Programming', 'Sockets', 'POSIX Threads', 'Operating Systems'],
        technologies: ['C', 'Linux epoll', 'pthreads', 'Makefile'],
        prerequisites: ['Pointers', 'OS Process Threads'],
        estimatedTime: '3 Weeks',
        expectedOutput: 'Benchmarked web server passing ApacheBench load tests with zero memory leaks.',
        githubPortfolioValue: 'Exceptional systems engineering project showing deep OS and memory fundamentals.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-sde',
        title: 'Software Development Engineer (SDE)',
        demandRating: 'Very High',
        description: 'Designs and builds scalable distributed software services and resilient backend systems.',
        requiredSkills: ['DSA', 'System Design', 'Java/C++/Go', 'SQL', 'Docker'],
        recommendedSubjects: ['Programming for Problem Solving', 'Operating Systems', 'DBMS'],
        projects: ['Concurrent HTTP Web Server in C'],
        tools: ['Git', 'Docker', 'Linux', 'Postman'],
        prerequisites: ['DSA', 'OOP'],
        currentStudentGap: 'Elevate Data Structures from 50% to 90% for FAANG-level technical interview rounds.',
        suggestedNextStep: 'Solve 20 medium dynamic programming problems.',
      },
    ];

    return {
      branchId: 'cse',
      branchName: 'Computer Science and Engineering',
      preparationMode: 'ENGINEERING',
      targetCareer: 'Software Development Engineer (SDE)',
      overview: 'Comprehensive roadmap for Computer Science undergraduates covering programming languages, algorithms, operating systems, and distributed cloud computing.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 54,
        skillsMasteredCount: 3,
        skillsInProgressCount: 6,
        criticalGapsCount: 1,
      },
    };
  }

  // ════════════════════════════════════════════════════════════
  // 7. JEE ROADMAP (Requirement 21)
  // ════════════════════════════════════════════════════════════
  private static generateJEERoadmap(context: ComprehensiveStudentContext): BranchRoadmapData {
    const categories = [
      {
        categoryName: 'Physics (Mechanics, Electrodynamics & Modern Physics)',
        description: 'Deep conceptual physics focusing on free-body diagrams, conservation laws, and circuit loops.',
        skills: [
          this.buildSkill('jee-phy-mech', 'Newton’s Laws & Friction Traps', 'Physics', 65, 95, ['Kinematics'], 35, 'Pseudoforces & Incline Wedge Equilibrium', 'jee-newton-second'),
          this.buildSkill('jee-phy-rot', 'Rotational Dynamics & Torque', 'Physics', 45, 95, ['Mechanics'], 45, 'Rolling without Slipping & Angular Momentum Conservation', 'jee-rotational-dynamics'),
          this.buildSkill('jee-phy-electro', 'Electrostatics & Gauss’s Law', 'Physics', 50, 95, ['Calculus'], 40, 'Electric Field Flux Integrals & Dipoles'),
        ],
      },
      {
        categoryName: 'Chemistry (Physical, Organic & Inorganic)',
        description: 'Stoichiometry, chemical equilibrium, reaction mechanisms, and coordination chemistry.',
        skills: [
          this.buildSkill('jee-chem-mole', 'Mole Concept & Redox Stoichiometry', 'Physical Chemistry', 70, 95, ['Basic Math'], 25, 'Equivalent Weight & Normality Calculations', 'jee-chem-mole'),
          this.buildSkill('jee-chem-bond', 'Chemical Bonding & Molecular Orbitals', 'Inorganic Chemistry', 60, 95, ['Atomic Structure'], 30, 'MOT Diagrams & Hybridization Traps', 'jee-chem-bonding'),
          this.buildSkill('jee-chem-org', 'Reaction Mechanisms & Carbocation Shifts', 'Organic Chemistry', 40, 95, ['GOC'], 45, 'Markovnikov Addition & Hydride/Methyl Rearrangements'),
        ],
      },
      {
        categoryName: 'Mathematics (Calculus, Algebra & Coordinate Geometry)',
        description: 'Calculus transformations, quadratic inequalities, complex numbers, and conic sections.',
        skills: [
          this.buildSkill('jee-math-quad', 'Quadratic Equations & Roots Location', 'Algebra', 65, 95, ['Class 10 Algebra'], 30, 'Location of Roots Conditions', 'jee-math-quadratic'),
          this.buildSkill('jee-math-calc', 'Differential & Integral Calculus', 'Calculus', 50, 95, ['Functions'], 55, 'Definite Integrals as Limit of Sums', 'jee-math-calculus'),
          this.buildSkill('jee-math-conics', 'Coordinate Geometry & Conic Sections', 'Geometry', 45, 95, ['Straight Lines'], 40, 'Tangents & Normals to Parabola and Ellipse'),
        ],
      },
    ];

    const progressiveProjects: RoadmapProject[] = [
      {
        id: 'jee-m1',
        tier: 'Beginner',
        title: 'Chapter-Level Diagnostic Problem Set (PYQs 2021-2025)',
        description: 'Solve 30 curated single-correct and numerical-value questions from previous 5 years of JEE Main papers.',
        difficulty: 'Beginner',
        requiredSkills: ['Newton Laws', 'Mole Concept', 'Quadratic Equations'],
        technologies: ['JEE Formula Notebook', 'Timer Tracker'],
        prerequisites: ['Foundational Concepts'],
        estimatedTime: '1 Week',
        expectedOutput: 'Full solution log with detailed analysis of missed trap questions.',
        githubPortfolioValue: 'Establishes baseline question-solving accuracy under exam timer constraints.',
      },
      {
        id: 'jee-m2',
        tier: 'Intermediate',
        title: 'Full-Length 3-Hour Timed JEE Main Computer-Based Mock Test',
        description: 'Simulate exact NTA computer-based testing format with negative marking and section balance.',
        difficulty: 'Advanced',
        requiredSkills: ['Physics Mechanics', 'Organic Chemistry', 'Calculus'],
        technologies: ['CBT Simulation Engine'],
        prerequisites: ['All 3 Subject Foundations'],
        estimatedTime: '2 Weeks',
        expectedOutput: 'Detailed score report with speed, accuracy, and negative mark deduction breakdown.',
        githubPortfolioValue: 'Crucial for score optimization and mental endurance on examination day.',
      },
    ];

    const careerOptions: CareerPathOption[] = [
      {
        id: 'career-iit',
        title: 'IIT / NIT Computer Science & Top Tier Engineering',
        demandRating: 'Very High',
        description: 'Qualify JEE Advanced with top AIR ranking for admission into premier national engineering institutes.',
        requiredSkills: ['JEE Physics (Rotational Dynamics)', 'Organic Chemistry Mechanisms', 'Definite Integration'],
        recommendedSubjects: ['Physics', 'Chemistry', 'Mathematics'],
        projects: ['Full-Length 3-Hour Timed JEE Mock Test'],
        tools: ['HC Verma', 'MS Chouhan', 'Cengage Mathematics'],
        prerequisites: ['Class 11 & 12 PCM'],
        currentStudentGap: 'Bridge accuracy gap in Rotational Dynamics and Reaction Mechanisms.',
        suggestedNextStep: 'Attempt 15 multi-concept advanced questions on rolling without slipping.',
      },
    ];

    return {
      branchId: 'jee',
      branchName: 'JEE Main & Advanced Preparation',
      preparationMode: 'JEE',
      targetCareer: 'Top AIR in JEE Main & Advanced (IIT/NIT)',
      overview: 'Rigorous 3-pillar roadmap covering Physics, Chemistry, and Mathematics designed to eliminate trap errors and master multi-concept problem solving.',
      skillCategories: categories,
      progressiveProjects,
      careerOptions,
      readinessSummary: {
        overallMastery: 56,
        skillsMasteredCount: 3,
        skillsInProgressCount: 6,
        criticalGapsCount: 2,
      },
    };
  }

  // Helper builder for RoadmapSkill
  private static buildSkill(
    id: string,
    name: string,
    category: string,
    currentLevel: number,
    requiredLevel: number,
    prerequisites: string[],
    estimatedHours: number,
    recommendedNext: string,
    linkedConceptId?: string
  ): RoadmapSkill {
    const gap = Math.max(0, requiredLevel - currentLevel);
    const priority: 'High' | 'Medium' | 'Low' = gap >= 35 ? 'High' : gap >= 15 ? 'Medium' : 'Low';
    const status: 'Mastered' | 'In Progress' | 'Locked' =
      currentLevel >= requiredLevel ? 'Mastered' : currentLevel >= 30 ? 'In Progress' : 'Locked';

    return {
      id,
      name,
      category,
      currentLevel,
      requiredLevel,
      gap,
      priority,
      prerequisites,
      estimatedLearningTimeHours: estimatedHours,
      status,
      recommendedNext,
      linkedConceptId,
    };
  }
}
