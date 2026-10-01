import { ALL_SEMESTERS_SYLLABI } from './syllabi_semesters';

export interface SyllabusUnit {
  unitNumber: number;
  title: string;
  description: string;
  topics: string[];
  concepts: {
    id: string;
    title: string;
    description: string;
    programmingLanguage?: string;
  }[];
}

export interface SyllabusSubject {
  id: string;
  code: string;
  name: string;
  credits: number;
  category: 'Professional Core' | 'Basic Sciences' | 'Engineering Sciences' | 'Humanities' | 'Mandatory' | 'Lab';
  isLab: boolean;
  programmingLanguage?: string;
  units: SyllabusUnit[];
}

export interface AuthoritativeSyllabus {
  id: string; // e.g. JNTUH-R25-CSE-Y1-S1
  university: string;
  college?: string;
  regulation: string;
  branchId: string;
  branchName: string;
  year: number;
  semester: number;
  academicYear: string;
  sourceType: 'OFFICIAL_UNIVERSITY' | 'OFFICIAL_COLLEGE' | 'UPLOADED_PDF' | 'TRUSTED_EDUCATIONAL' | 'AI_GENERATED';
  sourceUrl?: string;
  documentName?: string;
  verified: boolean;
  version: string;
  retrievedAt: string;
  subjects: SyllabusSubject[];
}

export const AUTHORITATIVE_SYLLABI: Record<string, AuthoritativeSyllabus> = {
  // 1. JNTUH R25 CSE Year 1 Semester 1
  'JNTUH-R25-CSE-Y1-S1': {
    id: 'JNTUH-R25-CSE-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/cse',
    documentName: 'JNTUH_BTech_R25_CSE_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-math1',
        code: 'MA101BS',
        name: 'Matrices and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices & Linear Systems',
            description: 'Rank of a matrix by Echelon form, normal form, system of linear equations, Gauss elimination.',
            topics: ['Matrix Rank & Echelon Forms', 'Gauss Elimination & Consistency', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'math-rank', title: 'Rank & Linear Independence', description: 'Row operations and dimension of vector span' },
              { id: 'math-eigen', title: 'Eigenvalues & Spectral Decomposition', description: 'Characteristic equations and orthogonal diagonalization' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Differential Calculus & Mean Value Theorems',
            description: 'Rolle’s theorem, Lagrange mean value theorem, Taylor’s and Maclaurin’s series for single variable.',
            topics: ['Mean Value Theorems', 'Taylor Series Expansions', 'Curvature & Evolutes'],
            concepts: [
              { id: 'math-mvt', title: 'Mean Value Theorems', description: 'Rates of change guarantees in closed intervals' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Multivariable Calculus',
            description: 'Partial derivatives, total derivative, Jacobian, maxima and minima of functions of two variables.',
            topics: ['Partial Differentiation', 'Jacobian Transformations', 'Lagrange Multipliers for Extreme Values'],
            concepts: [
              { id: 'math-jacobian', title: 'Jacobian Matrix & Area Scaling', description: 'Multivariable mapping derivative and determinant' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Multiple Integrals',
            description: 'Double and triple integrals, change of order of integration, change of variables to polar and cylindrical coordinates.',
            topics: ['Double Integrals over Rectangles & General Regions', 'Change of Order of Integration', 'Applications to Area & Volume'],
            concepts: [
              { id: 'math-mult-int', title: 'Double & Triple Integrals', description: 'Volume and surface integration techniques' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Vector Calculus',
            description: 'Gradient, divergence, curl, line, surface and volume integrals, Green’s, Gauss divergence and Stokes’ theorems.',
            topics: ['Gradient, Divergence and Curl', 'Line and Surface Integrals', 'Green’s Theorem & Stokes’ Theorem'],
            concepts: [
              { id: 'math-vector-calc', title: 'Vector Integral Theorems', description: 'Flux, circulation, and boundary transformations' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-pps',
        code: 'CS102ES',
        name: 'Programming for Problem Solving',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Problem Solving & C Language Fundamentals',
            description: 'Introduction to components of a computer, algorithm design, flowcharts, compilation process, and C tokens.',
            topics: ['Computer Architecture Basics', 'Algorithms & Flowcharts', 'C Tokens, Identifiers & Keywords', 'Data Types & Memory Representation', 'Input/Output Statements (printf, scanf)'],
            concepts: [
              { id: 'pps-algo', title: 'Algorithms & Computational Logic', description: 'Step-by-step procedure design and time bounds' },
              { id: 'pps-io', title: 'Formatted I/O vs Return Values', description: 'Difference between console print side-effects and data return' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Operators, Expressions & Control Structures',
            description: 'Arithmetic, relational, logical, bitwise operators, operator precedence, if-else, switch, while, do-while, and for loops.',
            topics: ['Operator Precedence & Associativity', 'Conditional Branching', 'Iteration Structures', 'Loop Control (break, continue, goto)'],
            concepts: [
              { id: 'pps-control', title: 'Branching Logic & Guard Conditions', description: 'Complex condition evaluation and short-circuit boolean semantics' },
              { id: 'pps-loops', title: 'Loop Invariants & Termination Proofs', description: 'Iterative state transformation and bound variables' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Arrays, Strings & Modular Functions',
            description: '1D and 2D arrays, character arrays, string manipulation, function prototypes, parameter passing mechanisms, recursion, and storage classes.',
            topics: ['Array Memory Layout', 'String Buffer Operations', 'Function Signatures & Prototypes', 'Call-by-Value vs Call-by-Reference', 'LEGB & Scope of Storage Classes'],
            concepts: [
              { id: 'py-return', title: 'Function Return Mechanics vs Output', description: 'Distinction between return statement value passing and console stdout writes' },
              { id: 'py-params', title: 'Parameters, Arguments & Memory Stack Frames', description: 'Activation record stack frames during function calls' },
              { id: 'py-scope', title: 'Variable Scope, Lifetime & Linkage', description: 'Local, static, global variable duration in memory' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Pointers & Dynamic Memory Allocation',
            description: 'Pointer arithmetic, pointer to pointers, pointers to functions, malloc, calloc, realloc, and free.',
            topics: ['Memory Address Operators', 'Pointer Arithmetic', 'Pointers and Arrays Equivalence', 'Heap Memory Management (malloc, free)'],
            concepts: [
              { id: 'pps-pointers', title: 'Pointers & Dereferencing', description: 'Direct memory addresses, dereferencing, and pointer arithmetic' },
              { id: 'pps-heap', title: 'Dynamic Memory & Memory Leaks', description: 'Allocating and reclaiming heap buffers safely' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Structures, Unions & File Handling',
            description: 'User-defined types, nested structures, union memory overlap, text vs binary files, sequential and random access.',
            topics: ['Structure Memory Alignment & Padding', 'Unions vs Structures', 'File Pointers & Stream Buffers', 'Error Handling in I/O'],
            concepts: [
              { id: 'pps-structs', title: 'Structures & Data Representation', description: 'Aggregating heterogeneous data types with memory alignment' },
              { id: 'pps-files', title: 'Persistent File Streams', description: 'Reading, writing, and seeking stream files on disk' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-physics',
        code: 'PH103BS',
        name: 'Applied Engineering Physics',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Wave Optics & Interference',
            description: 'Huygens principle, superposition of waves, interference in thin films, Newton rings, Fraunhofer diffraction.',
            topics: ['Superposition Principle', 'Thin Film Interference & Phase Shifts', 'Diffraction Gratings & Resolving Power'],
            concepts: [
              { id: 'phy-interference', title: 'Wave Superposition & Coherence', description: 'Constructive vs destructive path difference constraints' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Quantum Mechanics & Band Theory',
            description: 'De-Broglie hypothesis, wave-particle duality, Schrodinger time-independent wave equation, energy bands in solids.',
            topics: ['Wave-Particle Duality', '1D Infinite Potential Well Solution', 'Kronig-Penney Model & Fermi-Dirac Distribution'],
            concepts: [
              { id: 'phy-schrodinger', title: 'Schrodinger Wave Equation', description: 'Probability density and discrete energy eigenvalues' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Semiconductors & Optoelectronics',
            description: 'Intrinsic and extrinsic semiconductors, carrier concentration, Hall effect, LEDs, solar cells, and photodetectors.',
            topics: ['Direct vs Indirect Band Gap', 'Hall Effect & Carrier Mobility', 'PN Junction Photodiode Principles'],
            concepts: [
              { id: 'phy-semi', title: 'Semiconductor Band Gap Physics', description: 'Fermi level positioning and drift/diffusion currents' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-bee',
        code: 'EE104ES',
        name: 'Basic Electrical Engineering',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'D.C. Circuits & Network Theorems',
            description: 'Ohm’s law, Kirchhoff’s laws (KCL, KVL), mesh & nodal analysis, Thevenin’s, Norton’s, and Superposition theorems.',
            topics: ['KCL & KVL Node Equations', 'Thevenin Equivalent Circuits', 'Maximum Power Transfer Theorem'],
            concepts: [
              { id: 'bee-thevenin', title: 'Thevenin & Norton Equivalence', description: 'Simplifying multi-source networks to single equivalent source and resistance' },
            ],
          },
          {
            unitNumber: 2,
            title: 'A.C. Circuits',
            description: 'Sinusoidal waveforms, peak and RMS values, phasor representation, series and parallel RLC circuits, resonance, and power factor.',
            topics: ['RMS & Average Values', 'RLC Series Resonance', 'Active, Reactive and Apparent Power'],
            concepts: [
              { id: 'bee-ac-rlc', title: 'A.C. Phasors & Resonance', description: 'Impedance triangles, quality factor, and power factor correction' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Transformers & Electrical Machines',
            description: 'Ideal and practical single-phase transformers, equivalent circuit, losses, efficiency, 3-phase induction motor principles.',
            topics: ['Transformer EMF Equation', 'Transformer Losses & Efficiency', 'Rotating Magnetic Field & Induction Motor'],
            concepts: [
              { id: 'bee-trans', title: 'Transformer Principles', description: 'Mutual induction, turns ratio, and core/copper loss analysis' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-cad',
        code: 'ME105ES',
        name: 'Computer Aided Engineering Drafting',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Orthographic & Isometric Projections',
            description: 'Principles of orthographic projections, projection of points, lines, planes, and solids using CAD tools.',
            topics: ['First Angle vs Third Angle Projections', 'Projection of Regular Solids', 'Isometric Views from Orthographic Projections'],
            concepts: [
              { id: 'cad-ortho', title: 'Orthographic Projection Mechanics', description: 'Multi-view 2D engineering drawings from 3D solids' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-ppslab',
        code: 'CS106ES',
        name: 'Programming for Problem Solving Lab',
        credits: 1.5,
        category: 'Lab',
        isLab: true,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Hands-on Programming Exercises',
            description: 'Writing, compiling, debugging, and executing modular C programs.',
            topics: ['CLI Compilation (gcc)', 'Debugging with gdb', 'Array Algorithms & Pointer Operations'],
            concepts: [
              { id: 'lab-debug', title: 'Compilation & Runtime Debugging', description: 'Interpreting compiler warnings, segmentation faults, and logical bugs' },
            ],
          },
        ],
      },
    ],
  },

  // 2. JNTUH R25 CSE (AI&ML) Year 1 Semester 1
  'JNTUH-R25-CSE-AIML-Y1-S1': {
    id: 'JNTUH-R25-CSE-AIML-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse-aiml',
    branchName: 'CSE - Artificial Intelligence and Machine Learning',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/cse-aiml',
    documentName: 'JNTUH_BTech_R25_CSE_AIML_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'aiml-math1',
        code: 'MA101BS',
        name: 'Matrices, Calculus & Linear Algebra for AI',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices & Linear Systems for Machine Learning',
            description: 'Rank of matrices, Gauss elimination, consistency of linear systems, Eigenvalues and Eigenvectors, spectral decomposition.',
            topics: ['Matrix Rank & Echelon Form', 'Gauss Elimination & Consistency', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem', 'Orthogonal Diagonalization'],
            concepts: [
              { id: 'aiml-math-rank', title: 'Rank & Vector Dimension', description: 'Determining independent features in data matrices' },
              { id: 'aiml-math-eigen', title: 'Eigen Decomposition & PCA Foundations', description: 'Finding principal directions of variance in machine learning' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Differential Calculus & Optimization Fundamentals',
            description: 'Mean value theorems, Taylor series expansions for approximations, gradient vectors, partial derivatives, and Hessian matrices.',
            topics: ['Taylor Series Approximations', 'Gradient & Directional Derivatives', 'Hessian Matrix & Convexity'],
            concepts: [
              { id: 'aiml-math-grad', title: 'Gradients & Loss Surfaces', description: 'Direction of steepest ascent and gradient descent fundamentals' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Multivariable Calculus & Constrained Optimization',
            description: 'Jacobian matrices, area scaling, maxima and minima of several variables, Lagrange multipliers for constrained optimization.',
            topics: ['Jacobian Transformations in ML', 'Unconstrained Extrema', 'Lagrange Multipliers for SVM Formulations'],
            concepts: [
              { id: 'aiml-math-lagrange', title: 'Lagrange Multipliers & Constraints', description: 'Solving constrained optimization problems in machine learning' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Multiple Integrals & Probability Densities',
            description: 'Double and triple integrals, joint probability density functions, volume integrals, change of coordinates.',
            topics: ['Double Integrals over Bounded Domains', 'Joint Probability Density Normalization', 'Polar & Cylindrical Coordinate Transformations'],
            concepts: [
              { id: 'aiml-math-density', title: 'Continuous Probability & Area Integration', description: 'Evaluating 2D continuous distributions and marginal probabilities' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Vector Calculus & Field Theory',
            description: 'Vector fields, divergence, curl, line and surface integrals, Green’s and Stokes’ theorems.',
            topics: ['Vector Fields & Conservative Forces', 'Divergence and Curl Operations', 'Flux Integrals across Surfaces'],
            concepts: [
              { id: 'aiml-math-flux', title: 'Vector Field Flux & Divergence', description: 'Physical conservation laws and boundary integrals' },
            ],
          },
        ],
      },
      {
        id: 'aiml-pps',
        code: 'CS102ES',
        name: 'Programming for Problem Solving',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Computational Logic & C Language Fundamentals',
            description: 'Computer architecture basics, algorithmic complexity, flowcharts, compilation pipelines, C tokens, formatted I/O.',
            topics: ['Algorithm Design & Flowcharts', 'C Tokens & Type System', 'Memory Representation & Byte Alignment', 'Formatted I/O (printf vs scanf)'],
            concepts: [
              { id: 'aiml-pps-algo', title: 'Algorithmic Problem Decomposition', description: 'Structuring computational logic step-by-step' },
              { id: 'aiml-pps-io', title: 'Console Streams vs Value Returns', description: 'Understanding side effects vs functional returns' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Control Flow, Decision Making & Iterations',
            description: 'Branching constructs, short-circuit boolean evaluation, while, do-while, and for loops, loop invariants.',
            topics: ['Relational & Logical Operators', 'Multi-way Branching (if-else, switch)', 'Nested Loops & Loop Control'],
            concepts: [
              { id: 'aiml-pps-loops', title: 'Loop Convergence & State Tracking', description: 'Maintaining loop state and termination bounds' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Modular Functions, Arrays & Memory Frames',
            description: 'Function signatures, stack frames, call-by-value, arrays as buffers, string manipulation, recursion.',
            topics: ['1D & 2D Array Memory Contiguity', 'Function Activation Records', 'Parameter Passing Mechanisms', 'Storage Class Specifiers'],
            concepts: [
              { id: 'py-return', title: 'Function Return Mechanics vs Output', description: 'Returning data payloads from activation frames' },
              { id: 'py-params', title: 'Stack Frame Memory & Parameters', description: 'Pushing arguments to stack frames and return addresses' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Pointers & Dynamic Memory for AI Structures',
            description: 'Pointers, pointer arithmetic, void pointers, dynamic memory allocation using malloc, calloc, realloc, and free.',
            topics: ['Address Operator & Dereferencing', 'Array-Pointer Duality', 'Heap Memory Allocation & Memory Leaks'],
            concepts: [
              { id: 'aiml-pps-pointers', title: 'Pointer Semantics & Memory Addresses', description: 'Direct pointer manipulations and heap buffer management' },
            ],
          },
          {
            unitNumber: 5,
            title: 'User-defined Types & File Systems',
            description: 'Structures, structure padding, unions, file I/O operations, reading and writing dataset files.',
            topics: ['Structures & Bit-fields', 'Nested Structures', 'File Pointers & CSV/Dataset Ingestion'],
            concepts: [
              { id: 'aiml-pps-files', title: 'Stream I/O & File Records', description: 'Persisting and reading structured data buffers from disk' },
            ],
          },
        ],
      },
      {
        id: 'aiml-phy',
        code: 'PH103BS',
        name: 'Advanced Engineering Physics',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Quantum Mechanics & Wave Function Analysis',
            description: 'Matter waves, De-Broglie hypothesis, Heisenberg uncertainty principle, Schrodinger wave equation, particle in a box.',
            topics: ['Wave-Particle Duality', 'Time-Independent Schrodinger Equation', 'Infinite Potential Well Energy States'],
            concepts: [
              { id: 'aiml-phy-schrodinger', title: 'Quantum Probability & Wavefunctions', description: 'Eigenstate solutions and probability densities' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Semiconductor Devices & Carrier Transport',
            description: 'Energy bands, carrier concentration in intrinsic and extrinsic semiconductors, Hall effect, optoelectronic devices.',
            topics: ['Fermi-Dirac Distribution', 'Hall Effect Measurement', 'Direct vs Indirect Bandgaps'],
            concepts: [
              { id: 'aiml-phy-carrier', title: 'Carrier Drift & Diffusion Mechanics', description: 'Current conduction in silicon and modern semiconductor chips' },
            ],
          },
        ],
      },
      {
        id: 'aiml-bee',
        code: 'EE104ES',
        name: 'Basic Electrical & Electronics Engineering',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'DC Circuits & Circuit Theorems',
            description: 'Ohm’s law, Kirchhoff’s voltage and current laws, mesh and nodal analysis, Thevenin’s and Norton’s theorems.',
            topics: ['Mesh Current Analysis', 'Nodal Voltage Analysis', 'Thevenin Equivalent Circuits'],
            concepts: [
              { id: 'aiml-bee-thevenin', title: 'Thevenin Equivalent Models', description: 'Network simplification and linear resistive loads' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Semiconductor Electronics & Diodes',
            description: 'PN junction diode characteristics, half-wave and full-wave rectifiers, Zener diode as voltage regulator, BJT operation.',
            topics: ['Diode V-I Characteristics', 'Bridge Rectifier & Filter Capacitors', 'Zener Voltage Regulation'],
            concepts: [
              { id: 'aiml-bee-diode', title: 'Diode Rectification & Voltage Regulation', description: 'Converting AC to DC and voltage stabilization circuits' },
            ],
          },
        ],
      },
      {
        id: 'aiml-cad',
        code: 'ME105ES',
        name: 'Computer Aided Engineering Drafting',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Principles of Engineering Graphics & Projections',
            description: 'Scales, orthographic projections of points, lines, planes, and 3D solids using CAD workstations.',
            topics: ['Projection of Points & Lines', 'Projection of Cylinders, Prisms & Pyramids', 'Isometric Views'],
            concepts: [
              { id: 'aiml-cad-proj', title: '3D to 2D Spatial Projections', description: 'Multi-view orthographic conversion' },
            ],
          },
        ],
      },
    ],
  },

  // 3. JNTUH R25 ECE Year 1 Semester 1
  'JNTUH-R25-ECE-Y1-S1': {
    id: 'JNTUH-R25-ECE-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'ece',
    branchName: 'Electronics and Communication Engineering',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/ece',
    documentName: 'JNTUH_BTech_R25_ECE_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'ece-math1',
        code: 'MA101BS',
        name: 'Linear Algebra and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices & Linear Systems',
            description: 'Matrix rank, Echelon forms, Gauss elimination, Cayley-Hamilton theorem, and Eigenvalue analysis.',
            topics: ['Matrix Rank & Echelon Reduction', 'Gauss Elimination for Linear Systems', 'Eigenvalues & Diagonalization', 'Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'ece-math-eigen', title: 'Eigenvalues & Characteristic Polynomials', description: 'Matrix stability and pole analysis in circuits' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Calculus of Single & Several Variables',
            description: 'Mean value theorems, Taylor series, partial differentiation, Jacobian matrices, maxima and minima.',
            topics: ['Taylor Series Expansions', 'Jacobian Transformations', 'Lagrange Multipliers'],
            concepts: [
              { id: 'ece-math-jacob', title: 'Jacobian Determinants', description: 'Variable coordinate shifts in field equations' },
            ],
          },
        ],
      },
      {
        id: 'ece-eda',
        code: 'EC102ES',
        name: 'Electronic Devices & Circuit Analysis',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'PN Junction Diode & Applications',
            description: 'Diode equation, transition and diffusion capacitance, half-wave, full-wave and bridge rectifiers, clipper and clamper circuits.',
            topics: ['PN Diode V-I Characteristics', 'Zener Diode Breakdown & Voltage Regulation', 'Bridge Rectifier with C-Filter', 'Clipping & Clamping Circuits'],
            concepts: [
              { id: 'ece-diode-rect', title: 'Diode Rectifiers & Filtering', description: 'Ripple factor, efficiency, and peak inverse voltage calculations' },
              { id: 'ece-zener-reg', title: 'Zener Diode Voltage Regulation', description: 'Maintaining regulated DC voltage under variable load conditions' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Bipolar Junction Transistors (BJT)',
            description: 'BJT principles, CB, CE, CC configurations, input and output characteristics, h-parameter model, and DC load line biasing.',
            topics: ['CE Configuration Characteristics', 'Early Effect & Transistor Current Components', 'Fixed Bias & Voltage Divider Bias', 'Thermal Runaway & Stability Factor'],
            concepts: [
              { id: 'ece-bjt-ce', title: 'Common Emitter Biasing & Operating Point', description: 'Q-point stability and amplification behavior' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Field Effect Transistors (FET & MOSFET)',
            description: 'JFET construction, pinch-off voltage, transfer characteristics, Enhancement and Depletion MOSFETs, CMOS inverter intro.',
            topics: ['JFET Drain & Transfer Characteristics', 'Pinch-off Voltage & Transconductance', 'MOSFET Operation Modes (Cutoff, Triode, Saturation)'],
            concepts: [
              { id: 'ece-fet-trans', title: 'MOSFET Current Equation & Saturation', description: 'Gate threshold voltage and channel conduction physics' },
            ],
          },
        ],
      },
      {
        id: 'ece-physics',
        code: 'PH103BS',
        name: 'Applied Physics & Semiconductor Physics',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Quantum Physics & Band Structures',
            description: 'Schrodinger wave equation, Fermi-Dirac statistics, density of states, and energy bands in semiconductors.',
            topics: ['Matter Waves & De-Broglie Relation', '1D Schrodinger Potential Box', 'Fermi Level in Extrinsic Semiconductors'],
            concepts: [
              { id: 'ece-phy-band', title: 'Energy Bands & Fermi Level', description: 'Valence and conduction band carrier populations' },
            ],
          },
        ],
      },
      {
        id: 'ece-pps',
        code: 'CS104ES',
        name: 'Programming for Problem Solving',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'C Fundamentals & Bitwise Operations for Hardware',
            description: 'Algorithms, data types, bitwise operators for register manipulation, control flow, functions, and arrays.',
            topics: ['Bitwise Operators (AND, OR, XOR, Shifts)', 'Memory Addresses & Pointers', 'Array Indexing & Modular Functions'],
            concepts: [
              { id: 'ece-pps-bitwise', title: 'Bitwise Register Masking in C', description: 'Setting, clearing, and toggling hardware bit registers' },
            ],
          },
        ],
      },
    ],
  },

  // 4. JNTUH R25 EEE Year 1 Semester 1
  'JNTUH-R25-EEE-Y1-S1': {
    id: 'JNTUH-R25-EEE-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'eee',
    branchName: 'Electrical and Electronics Engineering',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/eee',
    documentName: 'JNTUH_BTech_R25_EEE_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'eee-math1',
        code: 'MA101BS',
        name: 'Matrices and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Linear Systems & Matrix Rank',
            description: 'Rank of a matrix, Gauss elimination, Cayley-Hamilton theorem, and Eigenvalues.',
            topics: ['Matrix Rank & Echelon Forms', 'Gauss Elimination & Consistency', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'eee-math-eigen', title: 'Matrix Eigenvalues in Electrical Systems', description: 'Modal decomposition of state space circuit models' },
            ],
          },
        ],
      },
      {
        id: 'eee-circuit',
        code: 'EE102ES',
        name: 'Electric Circuit Analysis & Network Theorems',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'D.C. Circuit Analysis & Network Theorems',
            description: 'Ohm’s law, Kirchhoff’s voltage and current laws, mesh analysis, nodal analysis, Thevenin’s, Norton’s, Superposition, and Maximum Power Transfer theorems.',
            topics: ['KCL & KVL Equations', 'Mesh & Nodal Analysis with Dependent Sources', 'Thevenin & Norton Theorems', 'Maximum Power Transfer Theorem'],
            concepts: [
              { id: 'eee-thevenin', title: 'Thevenin Network Simplification', description: 'Equivalent open-circuit voltage and Thevenin resistance calculation' },
              { id: 'eee-maxpower', title: 'Maximum Power Transfer Theorem', description: 'Matching load resistance to source impedance for maximum power delivery' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Single Phase A.C. Circuits & Resonance',
            description: 'RMS, average, form factor, peak factor, phasor representations, RLC series and parallel resonance, bandwidth and quality factor.',
            topics: ['AC Phasor Arithmetic', 'Series RLC Resonance Frequency & Bandwidth', 'Power Factor & Power Triangle (P, Q, S)'],
            concepts: [
              { id: 'eee-rlc-res', title: 'RLC Series Resonance & Q-Factor', description: 'Minimum impedance point and voltage magnification in tuned circuits' },
            ],
          },
        ],
      },
      {
        id: 'eee-phy',
        code: 'PH103BS',
        name: 'Applied Physics & Electromagnetics',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Electromagnetic Field Theory & Wave Equations',
            description: 'Gauss’s law, Ampere’s circuital law, Faraday’s law of induction, Maxwell’s equations, and electromagnetic wave propagation.',
            topics: ['Maxwell’s Four Equations in Differential Form', 'Displacement Current & Continuity Equation', 'Poynting Vector & Energy Density'],
            concepts: [
              { id: 'eee-maxwell', title: 'Maxwell’s Equations in Circuits & Fields', description: 'Unifying electricity, magnetism, and wave transmission' },
            ],
          },
        ],
      },
      {
        id: 'eee-pps',
        code: 'CS104ES',
        name: 'Programming for Problem Solving',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'C Programming for Numerical Computation',
            description: 'Conditionals, loops, numerical simulation of circuit equations, arrays, pointers, and functions.',
            topics: ['Algorithmic Logic & Loops', 'Array Implementations of Vectors', 'Functions and Call-by-Reference'],
            concepts: [
              { id: 'eee-pps-num', title: 'Numerical Functions in C', description: 'Writing algorithms for numerical equations' },
            ],
          },
        ],
      },
    ],
  },

  // 5. JNTUH R25 Mechanical Year 1 Semester 1
  'JNTUH-R25-ME-Y1-S1': {
    id: 'JNTUH-R25-ME-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'me',
    branchName: 'Mechanical Engineering',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/me',
    documentName: 'JNTUH_BTech_R25_ME_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'me-math1',
        code: 'MA101BS',
        name: 'Matrices and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices & Linear Systems',
            description: 'Rank of matrices, Gauss elimination, Cayley-Hamilton theorem, and Eigenvalues.',
            topics: ['Matrix Rank & Echelon Reduction', 'Gauss Elimination', 'Eigenvalues & Eigenvectors', 'Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'me-math-eigen', title: 'Eigenvalues & Vibrational Modes', description: 'Determining natural frequencies of mechanical systems' },
            ],
          },
        ],
      },
      {
        id: 'me-em',
        code: 'ME102ES',
        name: 'Engineering Mechanics & Statics',
        credits: 4,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'System of Forces & Equilibrium of Rigid Bodies',
            description: 'Coplanar concurrent and non-concurrent force systems, resultant of forces, free body diagrams, Lami’s theorem, equilibrium equations.',
            topics: ['Parallelogram Law of Forces', 'Free Body Diagram Construction', 'Lami’s Theorem & Particle Equilibrium', 'Varignon’s Theorem of Moments'],
            concepts: [
              { id: 'me-em-fbd', title: 'Free Body Diagrams & Equilibrium Equations', description: 'Isolating bodies and summing forces and moments to zero' },
              { id: 'me-em-lami', title: 'Lami’s Theorem in Concurrent Coplanar Forces', description: 'Equilibrium ratio of three coplanar concurrent forces' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Friction, Centroids & Moments of Inertia',
            description: 'Laws of dry friction, angle of friction, cone of friction, centroids of standard shapes, parallel and perpendicular axis theorems.',
            topics: ['Coulomb’s Laws of Dry Friction', 'Wedge & Ladder Friction', 'Centroid of Composite Figures', 'Moment of Inertia & Radius of Gyration'],
            concepts: [
              { id: 'me-em-friction', title: 'Friction & Limiting Equilibrium', description: 'Static vs kinetic friction coefficients and slipping criteria' },
              { id: 'me-em-inertia', title: 'Parallel Axis Theorem & Second Moment of Area', description: 'Calculating moment of inertia for beam bending resistance' },
            ],
          },
        ],
      },
      {
        id: 'me-cad',
        code: 'ME103ES',
        name: 'Computer Aided Engineering Drafting',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Orthographic Projections & Solids',
            description: 'Projection of points, lines, planes, auxiliary views, sections of solids, and isometric drawings.',
            topics: ['First Angle Projection Rules', 'True Length of Lines', 'Sectional Views of Cylinders and Cones'],
            concepts: [
              { id: 'me-cad-ortho', title: 'Mechanical Engineering Drafting Rules', description: 'Converting 3D machine parts into standardized 2D blueprints' },
            ],
          },
        ],
      },
      {
        id: 'me-pps',
        code: 'CS104ES',
        name: 'Programming for Problem Solving',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'C Language for Mechanical Calculations',
            description: 'Algorithms, variables, loops, writing programs for stress-strain curves and thermodynamic gas laws.',
            topics: ['Decision Structures in C', 'Loops for Iterative Calculations', 'File I/O for Experimental Data'],
            concepts: [
              { id: 'me-pps-calc', title: 'Iterative Mechanical Solvers in C', description: 'Solving non-linear equations iteratively' },
            ],
          },
        ],
      },
    ],
  },

  // 6. JNTUH R25 Civil Year 1 Semester 1
  'JNTUH-R25-CIVIL-Y1-S1': {
    id: 'JNTUH-R25-CIVIL-Y1-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'civil',
    branchName: 'Civil Engineering',
    year: 1,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/civil',
    documentName: 'JNTUH_BTech_R25_Civil_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'civ-math1',
        code: 'MA101BS',
        name: 'Matrices and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices & Linear Systems',
            description: 'Matrix rank, Gauss elimination, and structural displacement matrix equations.',
            topics: ['Matrix Rank & Echelon Reduction', 'Gauss Elimination', 'Eigenvalues & Structural Frequencies', 'Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'civ-math-rank', title: 'Stiffness Matrix Inversion & Rank', description: 'Solving simultaneous structural displacement equations' },
            ],
          },
        ],
      },
      {
        id: 'civ-em',
        code: 'CE102ES',
        name: 'Engineering Mechanics for Civil Engineers',
        credits: 4,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Force Systems, Equilibrium & Truss Analysis',
            description: 'Coplanar force systems, Lami’s theorem, free body diagrams, method of joints and method of sections for plane trusses.',
            topics: ['Equilibrium Equations of Rigid Bodies', 'Method of Joints for Trusses', 'Method of Sections for Trusses', 'Zero Force Members in Trusses'],
            concepts: [
              { id: 'civ-truss-joints', title: 'Truss Analysis by Method of Joints', description: 'Calculating axial tension and compression in structural members' },
              { id: 'civ-fbd-equil', title: 'Equilibrium Conditions for Civil Structures', description: 'Support reaction calculations for simply supported beams' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Centroid, Center of Gravity & Moment of Inertia',
            description: 'Centroids of I-sections, T-sections, channel sections, parallel axis theorem, polar moment of inertia, radius of gyration.',
            topics: ['Centroid of Composite Structural Sections', 'Moment of Inertia of I and T Beams', 'Parallel Axis Theorem'],
            concepts: [
              { id: 'civ-beam-inertia', title: 'Section Modulus & Moment of Inertia', description: 'Resistance to bending in reinforced concrete and steel beams' },
            ],
          },
        ],
      },
      {
        id: 'civ-phy',
        code: 'PH103BS',
        name: 'Applied Physics & Wave Mechanics',
        credits: 3.5,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Acoustics, Ultrasonics & Elasticity',
            description: 'Reverberation time, Sabine’s formula, ultrasonic non-destructive testing of concrete, stress-strain relations.',
            topics: ['Sabine’s Formula for Reverberation', 'Ultrasonic Pulse Velocity Method in Concrete', 'Hooke’s Law & Elastic Moduli'],
            concepts: [
              { id: 'civ-acoustic-sabine', title: 'Sabine’s Formula for Auditorium Acoustics', description: 'Acoustic design and sound absorption coefficients' },
            ],
          },
        ],
      },
    ],
  },

  // 7. JNTUH R22 CSE Year 1 Semester 1 (Distinct R22 identity with Engineering Chemistry)
  'JNTUH-R22-CSE-Y1-S1': {
    id: 'JNTUH-R22-CSE-Y1-S1',
    university: 'JNTUH',
    regulation: 'R22',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 1,
    semester: 1,
    academicYear: '2022-2023',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r22/btech/cse',
    documentName: 'JNTUH_BTech_R22_CSE_I_Year_Syllabus.pdf',
    verified: true,
    version: 'R22.2.0',
    retrievedAt: '2022-09-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r22-math1',
        code: 'MA101BS',
        name: 'Matrices and Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Matrices',
            description: 'Rank of matrix, Echelon form, Gauss elimination, Eigenvalues and Eigenvectors.',
            topics: ['Rank by Echelon Form', 'Gauss Elimination', 'Eigenvalues & Cayley-Hamilton Theorem'],
            concepts: [
              { id: 'r22-math-eigen', title: 'Eigenvalues & Characteristic Equations', description: 'Solving characteristic roots' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r22-chem',
        code: 'CH102BS',
        name: 'Engineering Chemistry',
        credits: 3.5,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Water and Its Treatment',
            description: 'Hardness of water, boiler troubles, internal and external treatment methods, reverse osmosis.',
            topics: ['Hardness Determination by EDTA', 'Boiler Scale & Sludge Formation', 'Ion-exchange Process & Reverse Osmosis'],
            concepts: [
              { id: 'r22-chem-water', title: 'Water Hardness & EDTA Titration', description: 'Determining temporary and permanent hardness' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r22-pps',
        code: 'CS103ES',
        name: 'Programming for Problem Solving using C',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Introduction to Programming in C',
            description: 'Algorithms, flowchart, variables, operators, expressions, and simple I/O in C.',
            topics: ['Algorithm Steps', 'Data Types & Control Expressions', 'Functions & Parameter Passing'],
            concepts: [
              { id: 'r22-pps-intro', title: 'C Syntax & Control Flow', description: 'Foundations of procedural programming' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 8. JNTUH R25 CSE Year 1 Semester 2 (STRICT SEMESTER 2 IDENTITY)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y1-S2': {
    id: 'JNTUH-R25-CSE-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/cse-sem2',
    documentName: 'JNTUH_BTech_R25_CSE_I_Year_II_Sem_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-math2',
        code: 'MA201BS',
        name: 'Ordinary Differential Equations and Vector Calculus',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'First Order Ordinary Differential Equations',
            description: 'Exact, linear, and Bernoulli differential equations, orthogonal trajectories, Newton’s law of cooling.',
            topics: ['Exact Equations & Integrating Factors', 'Linear & Bernoulli ODEs', 'Orthogonal Trajectories', 'Applications in RL Circuits'],
            concepts: [
              { id: 'math-ode1', title: 'First Order ODEs & Integrating Factors', description: 'Techniques for solving non-separable differential equations' },
              { id: 'math-ortho', title: 'Orthogonal Trajectories', description: 'Families of curves intersecting at right angles' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Higher Order Linear Differential Equations',
            description: 'Homogeneous and non-homogeneous linear ODEs with constant coefficients, method of variation of parameters, Cauchy-Euler equations.',
            topics: ['Characteristic Roots & Complementary Functions', 'Particular Integrals for Polynomial/Exponential/Trig Forcing', 'Variation of Parameters'],
            concepts: [
              { id: 'math-higher-ode', title: 'Variation of Parameters', description: 'General method for finding particular integrals' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Laplace Transforms',
            description: 'Definition, linearity, first and second shifting theorems, Dirac delta function, inverse Laplace transform, convolution theorem.',
            topics: ['Laplace Transform Properties', 'First & Second Shifting Theorems', 'Convolution Theorem', 'Solving ODEs using Laplace'],
            concepts: [
              { id: 'math-laplace', title: 'Laplace Transform & S-Domain Analysis', description: 'Transforming differential equations into algebraic equations' },
              { id: 'math-convolution', title: 'Convolution Theorem', description: 'Time-domain convolution through s-domain multiplication' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Vector Differentiation',
            description: 'Scalar and vector fields, gradient of a scalar field, directional derivative, divergence and curl of vector fields, solenoidal and irrotational vectors.',
            topics: ['Gradient & Directional Derivatives', 'Divergence & Flux Density', 'Curl & Circulation', 'Solenoidal & Irrotational Fields'],
            concepts: [
              { id: 'math-grad-curl', title: 'Gradient, Divergence & Curl', description: 'Differential operators in multivariable vector spaces' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Vector Integration & Integral Theorems',
            description: 'Line, surface, and volume integrals, Green’s theorem in a plane, Gauss divergence theorem, Stokes’ theorem and their applications.',
            topics: ['Line Integrals & Work Done', 'Green’s Theorem in Plane', 'Gauss Divergence Theorem', 'Stokes’ Circulation Theorem'],
            concepts: [
              { id: 'math-gauss-stokes', title: 'Gauss Divergence & Stokes Theorems', description: 'Relating surface integrals to volume integrals and line integrals to surface integrals' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-chem',
        code: 'CH202BS',
        name: 'Engineering Chemistry',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Atomic & Molecular Structure',
            description: 'Molecular orbital theory of diatomic molecules, band theory of solids, liquid crystals.',
            topics: ['MOT of Diatomic Molecules', 'Crystal Field Splitting', 'Band Theory of Solids & Semiconductors'],
            concepts: [
              { id: 'chem-mot', title: 'Molecular Orbital Theory & Bond Order', description: 'Linear combination of atomic orbitals' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Water Treatment & Technology',
            description: 'Hardness of water, EDTA method, boiler troubles, internal and external conditioning, reverse osmosis (RO).',
            topics: ['EDTA Titration for Hardness', 'Boiler Corrosion & Priming', 'Ion Exchange & Reverse Osmosis'],
            concepts: [
              { id: 'chem-water', title: 'Water Hardness & Demineralization', description: 'Removal of dissolved mineral salts and scaling ions' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Electrochemistry & Corrosion',
            description: 'Galvanic cells, Nernst equation, electrochemical series, dry and wet corrosion, cathodic protection.',
            topics: ['Nernst Equation & Cell EMF', 'Electrochemical Series', 'Mechanism of Rusting', 'Cathodic & Sacrificial Protection'],
            concepts: [
              { id: 'chem-corrosion', title: 'Electrochemical Corrosion & Protection', description: 'Redox thermodynamics and sacrificial anode defense' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Polymers & Smart Materials',
            description: 'Thermoplastics and thermosetting plastics, conducting polymers, biodegradable polymers, composites.',
            topics: ['Polymerization Mechanisms', 'Conducting Polymers (Polyaniline)', 'Biodegradable Polymers (PLA)'],
            concepts: [
              { id: 'chem-polymers', title: 'Conducting Polymers & Composites', description: 'Conjugated pi-electron mobility and synthetic structures' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Energy Sources & Batteries',
            description: 'Fossil fuels, lithium-ion batteries, supercapacitors, hydrogen fuel cells, photovoltaic cells.',
            topics: ['Lithium-Ion Battery Chemistry', 'Supercapacitors vs Batteries', 'Hydrogen Fuel Cells'],
            concepts: [
              { id: 'chem-batteries', title: 'Lithium-Ion Energy Storage', description: 'Intercalation chemistry and electrode potential' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-dsa',
        code: 'CS203ES',
        name: 'Data Structures and Algorithms',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Linear Data Structures — Stacks & Queues',
            description: 'Array and linked representations of stacks, infix to postfix conversion, evaluation of postfix expressions, linear queues, circular queues, deques.',
            topics: ['Stack ADT & Array/Linked Representation', 'Infix to Postfix Conversion', 'Queue ADT & Circular Queues', 'Double-Ended Queues (Deque)'],
            concepts: [
              { id: 'dsa-stack-ops', title: 'Stack Infix-to-Postfix Parsing', description: 'Operator precedence parsing and parenthesized operand stack' },
              { id: 'dsa-circ-queue', title: 'Circular Queue Wrap-Around Logic', description: 'Modulo arithmetic front/rear pointer management' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Linked Lists & Dynamic Memory',
            description: 'Singly linked lists, operations (insertion, deletion, traversal), doubly linked lists, circular linked lists, polynomial representation and addition.',
            topics: ['Singly Linked List CRUD Operations', 'Doubly Linked Lists with Predecessor Pointers', 'Circular Linked Lists', 'Polynomial Representation'],
            concepts: [
              { id: 'dsa-linked-nodes', title: 'Pointer Manipulation in Linked Lists', description: 'Head insertion, node deletion, and memory deallocation' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Non-Linear Structures — Trees',
            description: 'Binary trees, representation, traversals (in-order, pre-order, post-order), binary search trees (BST), insertion, deletion, searching, AVL trees basics.',
            topics: ['Binary Tree Recursive Traversals', 'Binary Search Tree Insertion & Search', 'BST Node Deletion (3 cases)', 'AVL Tree Rotations'],
            concepts: [
              { id: 'dsa-bst-ops', title: 'Binary Search Tree Search & Deletion', description: 'BST invariant, in-order predecessor/successor replacement' },
              { id: 'dsa-avl-rotations', title: 'AVL Self-Balancing Rotations (LL, RR, LR, RL)', description: 'Height-balanced invariant and restructuring' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Graphs & Networks',
            description: 'Graph representations (adjacency matrix, adjacency list), graph traversals (Breadth First Search, Depth First Search), minimum spanning trees (Prim, Kruskal).',
            topics: ['Adjacency Matrix vs List Representation', 'Breadth First Search (BFS)', 'Depth First Search (DFS)', 'Prim’s & Kruskal’s Minimum Spanning Tree'],
            concepts: [
              { id: 'dsa-bfs-dfs', title: 'BFS Queue vs DFS Recursion Traversals', description: 'Connected components, cycles, and traversal visitation markers' },
              { id: 'dsa-mst-greedy', title: 'Greedy Minimum Spanning Tree Algorithms', description: 'Cut property, disjoint-set union, and priority queues' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Searching & Sorting Algorithms',
            description: 'Linear search, binary search, bubble sort, selection sort, insertion sort, merge sort, quick sort, heap sort, hash tables and collision resolution.',
            topics: ['Binary Search with O(log n) Invariant', 'Merge Sort Divide & Conquer', 'Quick Sort Partitioning (Lomuto/Hoare)', 'Hash Tables & Chaining vs Open Addressing'],
            concepts: [
              { id: 'dsa-quicksort', title: 'Quick Sort Partitioning & Average O(n log n)', description: 'Pivot selection, in-place partitioning, and recursion depth' },
              { id: 'dsa-hashing', title: 'Hash Collision Resolution (Separate Chaining vs Probing)', description: 'Load factor management and hash bucket lookups' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-beee',
        code: 'EE204ES',
        name: 'Basic Electrical and Electronics Engineering',
        credits: 3,
        category: 'Engineering Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'AC Circuits & Resonance',
            description: 'Sinusoidal steady state analysis, phasor representation, series and parallel RLC resonance, power factor.',
            topics: ['Phasor Algebra in AC Circuits', 'Series & Parallel RLC Resonance', 'Active, Reactive & Apparent Power'],
            concepts: [
              { id: 'beee-ac-phasors', title: 'RLC Resonance & Power Factor', description: 'Quality factor, resonant frequency, and impedance minimum' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Semiconductor Diodes & Applications',
            description: 'PN junction diode characteristics, half-wave, full-wave center tapped and bridge rectifiers, Zener diode as voltage regulator.',
            topics: ['PN Junction Forward & Reverse Bias', 'Bridge Rectifier with Capacitor Filter', 'Zener Diode Voltage Regulation'],
            concepts: [
              { id: 'beee-rectifier', title: 'Bridge Rectifier & Ripple Factor', description: 'AC to DC rectification and ripple voltage calculation' },
              { id: 'beee-zener', title: 'Zener Diode Voltage Stabilization', description: 'Avalanche and Zener breakdown operational clamping' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Bipolar Junction Transistors (BJT)',
            description: 'BJT operation, CE, CB, CC configurations, input/output characteristics, transistor as a switch and amplifier.',
            topics: ['BJT Operation in Active/Saturation/Cutoff', 'Common Emitter (CE) Characteristics', 'Transistor as an Electronic Switch'],
            concepts: [
              { id: 'beee-bjt', title: 'BJT Transistor Switching & Current Gain Beta', description: 'Base current control and collector saturation' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-dsalab',
        code: 'CS206ES',
        name: 'Data Structures and Algorithms Laboratory',
        credits: 1.5,
        category: 'Lab',
        isLab: true,
        programmingLanguage: 'C',
        units: [
          {
            unitNumber: 1,
            title: 'Linear Structures & Stacks Lab',
            description: 'Implementation of stack, queue, and linked list operations in C.',
            topics: ['Array Stack Implementation', 'Infix to Postfix Converter', 'Singly Linked List CRUD'],
            concepts: [
              { id: 'dsalab-stack', title: 'Dynamic Stack in C', description: 'Pointer-based push and pop implementations' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Trees & Graph Traversal Lab',
            description: 'Implementation of BST and graph traversal algorithms in C.',
            topics: ['BST Insert, Search & In-order Traversal', 'BFS and DFS Traversal of Graphs', 'Quick Sort Implementation'],
            concepts: [
              { id: 'dsalab-bst', title: 'BST Node Implementation in C', description: 'Recursive pointer tree traversal' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 9. JNTUH R25 CSE (AI & ML) Year 1 Semester 2
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-AIML-Y1-S2': {
    id: 'JNTUH-R25-CSE-AIML-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse-aiml',
    branchName: 'CSE - Artificial Intelligence and Machine Learning',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    sourceUrl: 'https://jntuh.ac.in/academics/syllabus/r25/btech/cse-aiml-sem2',
    documentName: 'JNTUH_BTech_R25_CSE_AIML_I_Year_II_Sem_Syllabus.pdf',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-aiml-math2',
        code: 'MA201BS',
        name: 'Statistical Methods and Probability for AI',
        credits: 4,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Probability & Random Variables in Machine Learning',
            description: 'Sample space, conditional probability, Bayes’ theorem, discrete and continuous random variables, joint distributions.',
            topics: ['Bayes’ Rule in Classification', 'Discrete & Continuous Probability Density', 'Expectation, Variance & Covariance Matrices'],
            concepts: [
              { id: 'aiml-bayes', title: 'Bayesian Inference & Conditional Independence', description: 'Prior, likelihood, evidence, and posterior distributions' },
              { id: 'aiml-cov', title: 'Covariance Matrices & Feature Correlation', description: 'Multivariate spread and feature dependence' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Probability Distributions & Maximum Likelihood',
            description: 'Binomial, Poisson, Normal, Uniform, and Exponential distributions, Central Limit Theorem, Maximum Likelihood Estimation (MLE).',
            topics: ['Gaussian Distribution & 68-95-99.7 Rule', 'Central Limit Theorem in AI Sampling', 'Maximum Likelihood Estimation (MLE) Principle'],
            concepts: [
              { id: 'aiml-gaussian', title: 'Multivariate Gaussian Distribution', description: 'Bell curve mathematics in noise modeling and clustering' },
              { id: 'aiml-mle', title: 'Maximum Likelihood Estimation (MLE)', description: 'Log-likelihood optimization for model parameter fitting' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Sampling Theory & Statistical Hypothesis Testing',
            description: 'Point and interval estimation, confidence intervals, Large sample tests (Z-test), Small sample tests (t-test, F-test, Chi-square test).',
            topics: ['Confidence Intervals for Model Accuracy', 'Student’s t-Test for Model Comparison', 'Chi-Square Goodness of Fit Test'],
            concepts: [
              { id: 'aiml-hypo', title: 'Hypothesis Testing & p-Value Interpretation', description: 'Null hypothesis, statistical significance, and Type I/II errors' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-aiml-dsa',
        code: 'CS202PC',
        name: 'Data Structures with Python for AI',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Python',
        units: [
          {
            unitNumber: 1,
            title: 'Python Data Structures & Computational Complexity',
            description: 'Python memory model, lists, tuples, dictionaries, sets, Big-O asymptotic analysis for data engineering.',
            topics: ['Python List Amortized O(1) Appends', 'Hash Tables & Dict Key Lookup', 'Big-O Asymptotic Complexity'],
            concepts: [
              { id: 'aiml-py-perf', title: 'Hash Table Lookups & Dictionary Internals', description: 'Fast key-value access and hash collisions in Python' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Linear Structures & Vectorized Data',
            description: 'Stacks, queues, deques, dynamic arrays, NumPy ndarray vectorized manipulation.',
            topics: ['Custom Stack & Queue in Python', 'NumPy Vectorized Array Broadcasting', 'Efficient In-Memory Batching'],
            concepts: [
              { id: 'aiml-numpy-broadcasting', title: 'NumPy Vectorized Tensor Operations', description: 'Dimension matching and hardware-accelerated element-wise execution' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Trees & Priority Queues in Search Algorithms',
            description: 'Binary trees, binary search trees, Heaps, Priority Queues (heapq), A* and tree search in AI.',
            topics: ['Binary Search Tree Traversal', 'Min-Heap & Max-Heap Implementation', 'Priority Queues in Best-First Search'],
            concepts: [
              { id: 'aiml-heap', title: 'Priority Queues & Heap Invariants', description: 'Efficient selection of lowest cost paths in state-space graphs' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-aiml-oose',
        code: 'CS203PC',
        name: 'Object-Oriented Software Engineering for AI Systems',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Modular AI Software Architecture',
            description: 'Design patterns for machine learning pipelines, clean architecture, SOLID principles in data science.',
            topics: ['SOLID Principles in ML Codebases', 'Factory & Strategy Patterns for Model Loading', 'Repository Pattern for Datasets'],
            concepts: [
              { id: 'aiml-solid', title: 'SOLID Design Principles in Python', description: 'Decoupled, extensible software architectures' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 10. JNTUH R25 ECE Year 1 Semester 2
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-ECE-Y1-S2': {
    id: 'JNTUH-R25-ECE-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'ece',
    branchName: 'Electronics and Communication Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-ece-net',
        code: 'EC201PC',
        name: 'Network Analysis and Transmission Lines',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Network Topology & Mesh/Nodal Analysis',
            description: 'Graph theory applied to electrical networks, incidence matrix, loop matrix, cut-set matrix, dual networks.',
            topics: ['Graph Representation of Circuits', 'Incidence & Tie-Set Matrices', 'State-Space Formulation'],
            concepts: [
              { id: 'ece-graph-circuit', title: 'Tie-Set & Cut-Set Matrix Formulation', description: 'Systematic topological circuit equations' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Network Theorems in AC',
            description: 'Superposition, Thevenin, Norton, Maximum Power Transfer, Tellegen, and Reciprocity theorems in phasor domain.',
            topics: ['Thevenin Equivalent in Phasor Domain', 'Maximum Power Transfer with Complex Conjugate Impedance', 'Reciprocity Theorem'],
            concepts: [
              { id: 'ece-ac-thevenin', title: 'AC Thevenin & Conjugate Matching', description: 'Impedance matching for maximum RF power transfer' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-ece-dld',
        code: 'EC202PC',
        name: 'Digital Logic Design & Verilog',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Boolean Algebra & Gate Minimization',
            description: 'Boolean laws, Karnaugh maps (2, 3, 4, 5 variables), Quine-McCluskey method, NAND/NOR implementations.',
            topics: ['K-Map 4-Variable Minimization', 'Don’t Care Conditions', 'Static & Dynamic Hazards'],
            concepts: [
              { id: 'ece-kmap', title: 'Karnaugh Map Minimization & Prime Implicants', description: 'SOP/POS algebraic logic reduction' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Combinational Logic Circuits',
            description: 'Adders, subtractors, decoders, encoders, multiplexers, demultiplexers, parity generators.',
            topics: ['Carry Lookahead Adder', 'Multiplexer-Based Logic Synthesis', 'Priority Encoders'],
            concepts: [
              { id: 'ece-mux-synthesis', title: 'Multiplexers as Universal Function Generators', description: 'Synthesizing truth tables via MUX selection lines' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 11. JNTUH R25 EEE Year 1 Semester 2
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-EEE-Y1-S2': {
    id: 'JNTUH-R25-EEE-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'eee',
    branchName: 'Electrical and Electronics Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-eee-cir2',
        code: 'EE201PC',
        name: 'Electrical Circuit Analysis-II',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Three-Phase Balanced and Unbalanced Systems',
            description: 'Star and delta connections, line and phase voltages and currents, two-wattmeter method for 3-phase power measurement.',
            topics: ['Star vs Delta Relationships', 'Two-Wattmeter Power Measurement Method', 'Unbalanced Three-Phase Neutral Shifts'],
            concepts: [
              { id: 'eee-3phase-wattmeter', title: 'Two-Wattmeter Power Factor Determination', description: 'Measuring total active and reactive 3-phase power' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-eee-emf',
        code: 'EE202PC',
        name: 'Electromagnetic Fields',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Electrostatic Fields & Gauss’s Law',
            description: 'Coulomb’s law, electric field intensity, Gauss’s law and applications, electric potential, Laplace and Poisson equations.',
            topics: ['Gauss’s Law for Symmetric Charge Distributions', 'Electrostatic Boundary Conditions', 'Capacitance of Coaxial Cables'],
            concepts: [
              { id: 'eee-gauss-law', title: 'Gauss’s Law & Electric Flux Density', description: 'Calculating field intensity across spherical and cylindrical boundaries' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 12. JNTUH R25 ME Year 1 Semester 2
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-ME-Y1-S2': {
    id: 'JNTUH-R25-ME-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'me',
    branchName: 'Mechanical Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-me-thermo',
        code: 'ME201PC',
        name: 'Engineering Thermodynamics',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'First Law of Thermodynamics & Steady Flow',
            description: 'Thermodynamic systems, boundary, state, process, cycle, work and heat, First Law for open and closed systems, SFEE.',
            topics: ['Steady Flow Energy Equation (SFEE)', 'First Law Applications to Nozzles & Turbines', 'P-V and T-S State Diagrams'],
            concepts: [
              { id: 'me-sfee', title: 'Steady Flow Energy Equation (SFEE)', description: 'Energy balance across open thermodynamic boundaries' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 13. JNTUH R25 CIVIL Year 1 Semester 2
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CIVIL-Y1-S2': {
    id: 'JNTUH-R25-CIVIL-Y1-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'civil',
    branchName: 'Civil Engineering',
    year: 1,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-civil-som',
        code: 'CE201PC',
        name: 'Strength of Materials-I',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Simple Stresses and Strains',
            description: 'Elasticity, Hooke’s law, stress-strain diagram for mild steel, Poisson’s ratio, volumetric strain, elastic moduli relationships.',
            topics: ['Hooke’s Law & Stress-Strain Curve', 'Composite Bars & Thermal Stresses', 'Relations Between Elastic Constants (E, G, K, mu)'],
            concepts: [
              { id: 'civil-stress-strain', title: 'Hooke’s Law & Elastic Moduli Relations', description: 'Axial deformation, shear modulus, and bulk modulus' },
            ],
          },
        ],
      },
    ],
  },
};

// Merge all 8 B.Tech Semesters (2-1, 2-2, 3-1, 3-2, 4-1, 4-2)
Object.assign(AUTHORITATIVE_SYLLABI, ALL_SEMESTERS_SYLLABI);

/**
 * Registers a newly uploaded or parsed authoritative syllabus.
 */
export function registerCustomSyllabus(syllabus: AuthoritativeSyllabus) {
  AUTHORITATIVE_SYLLABI[syllabus.id] = syllabus;
}

/**
 * Resolves an authoritative syllabus from university, college, regulation, branch, year, semester.
 * Guaranteed never to mix regulations or branches, and NEVER mix semesters or years.
 */
export function resolveAuthoritativeSyllabus(params: {
  university?: string;
  college?: string;
  regulation?: string;
  branch?: string;
  year?: string | number;
  semester?: string | number;
}): AuthoritativeSyllabus | null {
  const uni = (params.university || 'JNTUH').trim().toUpperCase();
  const reg = (params.regulation || 'R25').trim().toUpperCase();
  const branchClean = (params.branch || 'cse').trim().toLowerCase();
  const yr = Number(String(params.year || '1').replace(/\D/g, '')) || 1;
  const sem = Number(String(params.semester || '1').replace(/\D/g, '')) || 1;

  // Normalize branch key
  let branchKey: string | null = null;
  if (branchClean.includes('aiml') || branchClean.includes('machine learning') || branchClean.includes('ai & ml')) {
    branchKey = 'CSE-AIML';
  } else if (branchClean.includes('cse') || branchClean.includes('computer') || branchClean.includes('cs') || branchClean === 'c') {
    branchKey = 'CSE';
  } else if (branchClean.includes('ece') || branchClean.includes('electronics')) {
    branchKey = 'ECE';
  } else if (branchClean.includes('eee') || branchClean.includes('electrical')) {
    branchKey = 'EEE';
  } else if (branchClean.includes('mech') || branchClean.includes('me')) {
    branchKey = 'ME';
  } else if (branchClean.includes('civil')) {
    branchKey = 'CIVIL';
  } else if (branchClean === 'it' || branchClean.includes('information technology')) {
    branchKey = 'IT';
  }

  // 1. College-specific verified syllabus first (College Priority Rule)
  if (params.college) {
    const collegeClean = params.college.toLowerCase().trim();
    const collegeMatch = Object.values(AUTHORITATIVE_SYLLABI).find(
      (s) =>
        s.college &&
        s.college.toLowerCase().trim() === collegeClean &&
        s.year === yr &&
        s.semester === sem &&
        (s.branchId === branchClean || (branchKey && s.id.includes(branchKey)))
    );
    if (collegeMatch) return collegeMatch;
  }

  // 2. Check exact key: e.g. JNTUH-R25-CSE-Y4-S2 or JNTUH-R25-CSE-Y1-S2
  if (branchKey) {
    const targetKey = `${uni}-${reg}-${branchKey}-Y${yr}-S${sem}`;
    if (AUTHORITATIVE_SYLLABI[targetKey]) {
      return AUTHORITATIVE_SYLLABI[targetKey];
    }
  }

  // 2.5 Check registered custom/uploaded syllabi matching university, regulation, exact year, exact semester
  const customMatch = Object.values(AUTHORITATIVE_SYLLABI).find(
    (s) =>
      s.year === yr &&
      s.semester === sem &&
      s.regulation.toLowerCase() === reg.toLowerCase() &&
      s.university.toLowerCase() === (params.university || '').toLowerCase().trim() &&
      (s.branchId === branchClean || (branchKey && s.id.includes(branchKey)))
  );
  if (customMatch) {
    return customMatch;
  }

  // 3. Fallback to closest verified R25 regulation for that university, branch & EXACT year and semester
  if (branchKey) {
    const fallbackKey = `${uni}-R25-${branchKey}-Y${yr}-S${sem}`;
    if (AUTHORITATIVE_SYLLABI[fallbackKey]) {
      return {
        ...AUTHORITATIVE_SYLLABI[fallbackKey],
        regulation: reg,
        id: `${uni}-${reg}-${branchKey}-Y${yr}-S${sem}`,
        sourceType: 'TRUSTED_EDUCATIONAL',
      };
    }
  }

  // 4. Default JNTUH verified syllabus for this exact branch, year and semester ONLY if JNTUH was requested
  const isJntuh = uni === 'JNTUH' || !params.university;
  if (isJntuh && branchKey) {
    const defaultBranchKey = `JNTUH-R25-${branchKey}-Y${yr}-S${sem}`;
    if (AUTHORITATIVE_SYLLABI[defaultBranchKey]) {
      return AUTHORITATIVE_SYLLABI[defaultBranchKey];
    }

    // 5. If CSE-AIML and specialized syllabus not present for this exact year+sem, fallback to CSE for SAME year+sem
    if (branchKey === 'CSE-AIML') {
      const cseSameYrSem = `JNTUH-R25-CSE-Y${yr}-S${sem}`;
      if (AUTHORITATIVE_SYLLABI[cseSameYrSem]) {
        return AUTHORITATIVE_SYLLABI[cseSameYrSem];
      }
    }

    // 6. Default CSE for Year 1 Sem 1 ONLY if Year 1 Sem 1 was explicitly requested and branch is CSE
    if (yr === 1 && sem === 1 && (branchKey === 'CSE' || !params.branch)) {
      return AUTHORITATIVE_SYLLABI['JNTUH-R25-CSE-Y1-S1'] || null;
    }

    // 7. Default CSE for Year 1 Sem 2 ONLY if Year 1 Sem 2 was explicitly requested and branch is CSE
    if (yr === 1 && sem === 2 && (branchKey === 'CSE' || !params.branch)) {
      return AUTHORITATIVE_SYLLABI['JNTUH-R25-CSE-Y1-S2'] || null;
    }
  }

  // 8. STRICT SEMESTER & YEAR ISOLATION:
  // If no syllabus has been imported for this specific university + branch + semester, return null.
  // NEVER silently substitute another semester (e.g. S1 for S2 or Y1 for Y4)!
  // NEVER silently substitute JNTUH if another university was requested!
  return null;
}


