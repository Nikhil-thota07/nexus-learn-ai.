import { AuthoritativeSyllabus } from './syllabi';

export const ALL_SEMESTERS_SYLLABI: Record<string, AuthoritativeSyllabus> = {
  // ──────────────────────────────────────────────────────────
  // 1. JNTUH R25 CSE Year 2 Semester 1 (2-1)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y2-S1': {
    id: 'JNTUH-R25-CSE-Y2-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 2,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-dsa-cpp',
        code: 'CS301PC',
        name: 'Data Structures and Algorithms in C++',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'C++',
        units: [
          {
            unitNumber: 1,
            title: 'Advanced Trees and Priority Queues',
            description: 'Binary search trees, AVL trees, Red-Black trees, Binary Heaps, and priority queues.',
            topics: ['AVL Rotations and Balance Factor', 'Red-Black Tree Properties', 'Max-Heap & Min-Heap Operations', 'HeapSort Algorithm'],
            concepts: [
              { id: 'dsa-avl', title: 'AVL Tree Self-Balancing Rotations', description: 'Left and right rotations maintaining logarithmic search bounds' },
              { id: 'dsa-heap', title: 'Binary Heap & Priority Queue Operations', description: 'Heapify, extract-min/max, and priority queue applications' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Graph Algorithms and Disjoint Sets',
            description: 'Graph representations, BFS, DFS, Topological Sorting, Disjoint Set Union (DSU).',
            topics: ['Graph Traversal (BFS & DFS)', 'Cycle Detection in Directed/Undirected Graphs', 'Disjoint Set Union by Rank and Path Compression', 'Kruskal and Prim MST'],
            concepts: [
              { id: 'dsa-graphs', title: 'Graph Traversal & Topological Sort', description: 'Breadth-first and depth-first search on state spaces' },
              { id: 'dsa-dsu', title: 'Disjoint Set Union & Path Compression', description: 'Near-constant time dynamic connectivity queries' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Shortest Path and Network Flow',
            description: 'Dijkstra single source shortest path, Bellman-Ford algorithm, Floyd-Warshall all-pairs shortest path.',
            topics: ['Dijkstra Greedy Shortest Path', 'Bellman-Ford & Negative Cycle Detection', 'Floyd-Warshall Dynamic Programming', 'Max Flow Min Cut'],
            concepts: [
              { id: 'dsa-dijkstra', title: 'Dijkstra Shortest Path Algorithm', description: 'Greedy edge relaxation for non-negative weighted graphs' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Dynamic Programming & String Algorithms',
            description: 'Knapsack 0/1, Longest Common Subsequence (LCS), Knuth-Morris-Pratt (KMP) pattern matching.',
            topics: ['0/1 Knapsack Problem', 'Longest Common Subsequence', 'KMP Prefix Function Table', 'Rabin-Karp Rolling Hash'],
            concepts: [
              { id: 'dsa-lcs', title: 'Longest Common Subsequence Dynamic Programming', description: 'Optimal substructure and memoization on 2D table' },
              { id: 'dsa-kmp', title: 'KMP String Matching Algorithm', description: 'Failure function and linear-time pattern search' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-coa',
        code: 'CS302PC',
        name: 'Computer Organization and Architecture',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Digital Logic and Microoperations',
            description: 'Register transfer language, arithmetic, logic and shift microoperations, bus and memory transfers.',
            topics: ['Bus Transfer & Tri-State Buffers', 'Arithmetic Logic Shift Unit (ALU)', 'Instruction Cycle & Control Unit'],
            concepts: [
              { id: 'coa-alu', title: 'ALU Design & Microoperations', description: 'Hardware data paths and control signal sequencing' },
            ],
          },
          {
            unitNumber: 2,
            title: 'CPU Organization and Pipelining',
            description: 'Instruction formats, addressing modes, RISC vs CISC, pipeline hazards and branch prediction.',
            topics: ['Addressing Modes (Direct, Indirect, Indexed)', 'Instruction Pipelining Hazards (Data, Structural, Control)', 'Branch Prediction'],
            concepts: [
              { id: 'coa-pipeline', title: 'Instruction Pipelining & Hazard Resolution', description: 'Overlapped execution, forwarding, and stall minimization' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Memory Hierarchy and Cache Design',
            description: 'Main memory, auxiliary memory, associative memory, cache mapping techniques (Direct, Associative, Set-Associative).',
            topics: ['Cache Placement Policies', 'Cache Write Policies (Write-Through vs Write-Back)', 'Virtual Memory & Page Tables'],
            concepts: [
              { id: 'coa-cache', title: 'Cache Memory Mapping & Hit Ratio', description: 'Direct and Set-associative locality optimization' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-java',
        code: 'CS303PC',
        name: 'Object Oriented Programming through Java',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Java',
        units: [
          {
            unitNumber: 1,
            title: 'Java Fundamentals & OOP Principles',
            description: 'JVM architecture, bytecode, classes, encapsulation, inheritance, method overriding, and dynamic dispatch.',
            topics: ['JVM, JRE, and JDK Internal Architecture', 'Classes, Objects & Constructors', 'Inheritance & Method Overriding', 'Abstract Classes & Interfaces'],
            concepts: [
              { id: 'java-dispatch', title: 'Dynamic Method Dispatch in Java', description: 'Runtime polymorphism and virtual method tables' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Exception Handling & Multithreading',
            description: 'Try-catch-finally, custom exceptions, Thread lifecycle, synchronization, locks, and inter-thread communication.',
            topics: ['Checked vs Unchecked Exceptions', 'Thread Creation (Thread class vs Runnable)', 'Thread Synchronization & Deadlock', 'Wait, Notify, and NotifyAll'],
            concepts: [
              { id: 'java-threads', title: 'Java Multithreading & Synchronization', description: 'Thread safety, critical sections, and monitors' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Java Collections Framework & Generics',
            description: 'List, Set, Map hierarchies, ArrayList, HashMap, LinkedList, Generics type erasure, and Lambda expressions.',
            topics: ['ArrayList vs LinkedList Performance', 'HashMap Internal Hashing and Bucketing', 'Generics & Wildcards (? extends / ? super)', 'Streams API and Lambdas'],
            concepts: [
              { id: 'java-hashmap', title: 'HashMap Internal Architecture', description: 'Buckets, hash codes, collision resolution, and treeification' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-discrete-math',
        code: 'MA301BS',
        name: 'Discrete Mathematics and Graph Theory',
        credits: 3,
        category: 'Basic Sciences',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Mathematical Logic and Predicates',
            description: 'Propositional logic, truth tables, logical equivalences, predicate calculus, and quantifiers.',
            topics: ['Truth Tables and Tautologies', 'Universal & Existential Quantifiers', 'Methods of Proof & Mathematical Induction'],
            concepts: [
              { id: 'math-induction', title: 'Principle of Mathematical Induction', description: 'Base case, induction hypothesis, and step proofs' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Relations and Algebraic Structures',
            description: 'Equivalence relations, partial orderings, lattices, groups, subgroups, and homomorphisms.',
            topics: ['Equivalence Classes & Partitions', 'Posets & Hasse Diagrams', 'Group Theory Axioms & Lagrange Theorem'],
            concepts: [
              { id: 'math-hasse', title: 'Posets & Hasse Diagrams', description: 'Partial order relationships and lattice bounds' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 2. JNTUH R25 CSE Year 2 Semester 2 (2-2)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y2-S2': {
    id: 'JNTUH-R25-CSE-Y2-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 2,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-dbms',
        code: 'CS401PC',
        name: 'Database Management Systems',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Data Modeling & Relational Algebra',
            description: 'Database architecture, 3-schema ANSI/SPARC, ER models, and relational algebra operators.',
            topics: ['3-Tier Database Architecture', 'Entity-Relationship Diagrams', 'Relational Algebra (Select, Project, Join, Division)'],
            concepts: [
              { id: 'db-rel-algebra', title: 'Relational Algebra Operators', description: 'Selection, projection, Cartesian product, and Theta join semantics' },
            ],
          },
          {
            unitNumber: 2,
            title: 'SQL & Normalization',
            description: 'DDL, DML, subqueries, functional dependencies, 1NF, 2NF, 3NF, BCNF decomposition.',
            topics: ['Complex SQL Subqueries & Grouping', 'Functional Dependencies & Armstrong Axioms', 'Lossless Decomposition & Dependency Preservation', '3NF vs BCNF Comparison'],
            concepts: [
              { id: 'db-normal-forms', title: 'Database Normalization (1NF to BCNF)', description: 'Eliminating insertion, deletion, and update anomalies' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Transaction Management & Concurrency Control',
            description: 'ACID properties, serializability, two-phase locking (2PL), deadlock prevention, and write-ahead logging (WAL).',
            topics: ['ACID Properties Implementation', 'Conflict Serializability & Precedence Graphs', 'Two-Phase Locking (Strict vs Rigorous 2PL)', 'ARIES Recovery Algorithm'],
            concepts: [
              { id: 'db-concurrency-2pl', title: 'Two-Phase Locking Protocol (2PL)', description: 'Growing phase, shrinking phase, and serializability guarantees' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-os',
        code: 'CS402PC',
        name: 'Operating Systems Concepts & Design',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Process Management & Scheduling',
            description: 'Process states, PCB, context switching, CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority).',
            topics: ['Process Control Block & Context Switching', 'Preemptive vs Non-Preemptive Scheduling', 'Round Robin Scheduling with Time Quantum Tuning'],
            concepts: [
              { id: 'os-scheduling', title: 'CPU Scheduling & Context Switching', description: 'Minimizing average waiting time and turnaround time' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Process Synchronization & Deadlocks',
            description: 'Critical section problem, Peterson’s solution, Semaphores, Mutex, Banker’s Algorithm for deadlock avoidance.',
            topics: ['Critical Section Problem Criteria', 'Counting & Binary Semaphores', 'Classical Synchronization Problems (Dining Philosophers, Readers-Writers)', 'Banker’s Deadlock Avoidance Algorithm'],
            concepts: [
              { id: 'os-semaphores', title: 'Semaphores & Concurrency Control', description: 'Wait/signal atomic operations and mutual exclusion' },
              { id: 'os-bankers', title: 'Banker’s Algorithm for Deadlock Avoidance', description: 'Safe state detection using allocation and need matrices' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Memory Management & Virtual Memory',
            description: 'Contiguous allocation, Paging, Segmentation, Page replacement algorithms (FIFO, LRU, Optimal).',
            topics: ['Paging Architecture & Translation Lookaside Buffer (TLB)', 'Page Fault Handling Mechanism', 'Page Replacement (FIFO, LRU, Optimal Belady Anomaly)'],
            concepts: [
              { id: 'os-paging-tlb', title: 'Paging Architecture & TLB Lookup', description: 'Virtual to physical address translation with frame offset' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-daa',
        code: 'CS404PC',
        name: 'Design and Analysis of Algorithms',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Asymptotic Analysis & Recurrences',
            description: 'Big-O, Omega, Theta notations, Master Theorem, Akra-Bazzi method, Divide and Conquer recurrence solutions.',
            topics: ['Asymptotic Complexity Bounds', 'Master Theorem for Divide & Conquer', 'Strassen’s Matrix Multiplication'],
            concepts: [
              { id: 'daa-master-theorem', title: 'Master Theorem for Recurrence Relations', description: 'Solving divide and conquer runtime bounds directly' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Greedy & Dynamic Programming Paradigms',
            description: 'Huffman coding, Fractional knapsack, Matrix Chain Multiplication, All-Pairs Shortest Path.',
            topics: ['Huffman Optimal Prefix Codes', 'Matrix Chain Multiplication DP Table', 'Optimal Binary Search Trees'],
            concepts: [
              { id: 'daa-matrix-chain', title: 'Matrix Chain Multiplication Algorithm', description: 'Parenthesization optimization minimizing scalar operations' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Backtracking & Branch and Bound',
            description: 'N-Queens problem, Subset sum, 0/1 Knapsack Branch and Bound, Traveling Salesperson Problem.',
            topics: ['N-Queens Backtracking Tree', 'Hamiltonian Cycles & Graph Coloring', 'Branch and Bound Least Cost Search (LCBB)'],
            concepts: [
              { id: 'daa-nqueens', title: 'N-Queens Backtracking Algorithm', description: 'State-space pruning and constraint satisfaction' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 3. JNTUH R25 CSE Year 3 Semester 1 (3-1)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y3-S1': {
    id: 'JNTUH-R25-CSE-Y3-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 3,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-cn',
        code: 'CS501PC',
        name: 'Computer Networks and Protocols',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Data Link Layer & Medium Access Control',
            description: 'Framing, Error control (CRC, Hamming), Sliding window protocols (Go-Back-N, Selective Repeat), CSMA/CD.',
            topics: ['Cyclic Redundancy Check (CRC) Polynomials', 'Sliding Window Protocols (Go-Back-N vs Selective Repeat)', 'Ethernet & CSMA/CD Backoff Algorithm'],
            concepts: [
              { id: 'cn-crc', title: 'Cyclic Redundancy Check (CRC)', description: 'Bit-level polynomial division for frame integrity verification' },
              { id: 'cn-sliding-window', title: 'Sliding Window Flow Control', description: 'Pipelining, window size limits, and sequence number wraparound' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Network Layer Routing & Addressing',
            description: 'IPv4 vs IPv6 addressing, Subnetting, CIDR, Distance Vector Routing (Bellman-Ford), Link State Routing (OSPF/Dijkstra).',
            topics: ['IPv4 Subnetting & CIDR Calculations', 'Distance Vector Routing & Count-to-Infinity', 'Link State Routing & OSPF Area Hierarchy', 'Border Gateway Protocol (BGP)'],
            concepts: [
              { id: 'cn-subnetting', title: 'IPv4 Subnetting & CIDR Masking', description: 'Network address calculations, broadcast boundaries, and VLSM' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Transport Layer Protocols & Congestion Control',
            description: 'TCP 3-way handshake, TCP flow control, TCP Tahoe/Reno congestion control, UDP datagrams.',
            topics: ['TCP 3-Way Handshake & Connection Teardown', 'TCP Congestion Control (Slow Start, Congestion Avoidance, Fast Retransmit)', 'UDP vs TCP Header Differences'],
            concepts: [
              { id: 'cn-tcp-congestion', title: 'TCP Congestion Control Dynamics', description: 'AIMD, cwnd growth, slow start threshold, and packet drop recovery' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-flat',
        code: 'CS502PC',
        name: 'Formal Languages and Automata Theory',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Finite Automata and Regular Languages',
            description: 'DFA, NFA, epsilon-NFA, Subset Construction, Pumping Lemma for Regular Languages, Regular Expressions.',
            topics: ['DFA Minimization (Table Filling Method)', 'NFA to DFA Subset Construction Algorithm', 'Pumping Lemma Proofs of Non-Regularity'],
            concepts: [
              { id: 'flat-dfa-min', title: 'DFA State Minimization', description: 'Distinguishable state partitions and Myhill-Nerode theorem' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Context-Free Grammars and Pushdown Automata',
            description: 'CFGs, Derivation trees, Ambiguity, Chomsky Normal Form (CNF), Pushdown Automata (PDA) by final state and empty stack.',
            topics: ['Ambiguous Grammars & Resolution', 'Chomsky Normal Form Conversion', 'Deterministic vs Non-Deterministic PDAs'],
            concepts: [
              { id: 'flat-pda', title: 'Pushdown Automata & Context-Free Languages', description: 'Stack-augmented state machines for nested balance validation' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Turing Machines and Computability',
            description: 'Turing Machine models, Decidability, Halting Problem, Church-Turing thesis, Post Correspondence Problem.',
            topics: ['Turing Machine Transition Functions', 'Undecidability of the Halting Problem', 'Chomsky Hierarchy of Languages'],
            concepts: [
              { id: 'flat-halting', title: 'Halting Problem & Turing Undecidability', description: 'Diagonalization proof of computational boundaries' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-ml',
        code: 'CS503PC',
        name: 'Machine Learning Foundations',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Python',
        units: [
          {
            unitNumber: 1,
            title: 'Supervised Learning & Regression',
            description: 'Linear regression, cost functions, gradient descent, polynomial regression, bias-variance tradeoff.',
            topics: ['Ordinary Least Squares (OLS) Formulation', 'Gradient Descent Variants (Batch, Mini-batch, Stochastic)', 'L1 Lasso vs L2 Ridge Regularization'],
            concepts: [
              { id: 'ml-gradient-descent', title: 'Gradient Descent & Loss Optimization', description: 'Convex optimization step updates and learning rate tuning' },
              { id: 'ml-bias-variance', title: 'Bias-Variance Tradeoff & Regularization', description: 'Overfitting mitigation through L1/L2 penalty parameters' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Classification & Tree-Based Models',
            description: 'Logistic regression, Decision Trees (ID3, C4.5, CART), Support Vector Machines (SVM), Kernel trick.',
            topics: ['Logistic Sigmoid Formulation & Log-Loss', 'Information Gain, Gini Impurity, and Entropy', 'Support Vector Machines & Margin Maximization', 'Radial Basis Function (RBF) Kernel'],
            concepts: [
              { id: 'ml-svm-kernel', title: 'Support Vector Machines & Kernel Trick', description: 'Projecting non-linear features into high-dimensional separable spaces' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Unsupervised Learning & Clustering',
            description: 'K-Means clustering, hierarchical clustering, Principal Component Analysis (PCA), dimensionality reduction.',
            topics: ['K-Means Convergence & Elbow Method', 'Principal Component Analysis (Covariance & Eigenvectors)', 'Hierarchical Agglomerative Clustering'],
            concepts: [
              { id: 'ml-pca', title: 'Principal Component Analysis (PCA)', description: 'Orthogonal variance maximization and dimension compression' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 4. JNTUH R25 CSE Year 3 Semester 2 (3-2)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y3-S2': {
    id: 'JNTUH-R25-CSE-Y3-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 3,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-cd',
        code: 'CS601PC',
        name: 'Compiler Design and Code Optimization',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Lexical Analysis & Syntax Analysis',
            description: 'Lexer specification, Regular expressions to DFA, Top-Down Parsing (LL(1)), Bottom-Up Parsing (SLR, CLR, LALR).',
            topics: ['First and Follow Set Computation', 'LL(1) Parsing Table Construction', 'LR(0) Items and Canonical Collections', 'LALR Parsing Tables'],
            concepts: [
              { id: 'cd-ll1-parsing', title: 'LL(1) Predictive Parsing', description: 'First and Follow sets for deterministic top-down syntax trees' },
              { id: 'cd-lalr-parsing', title: 'LALR Bottom-Up Parsing Engine', description: 'Merging LR(1) core items without introducing shift-reduce conflicts' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Intermediate Code Generation & Optimization',
            description: 'Syntax Directed Translations (SDT), Three-Address Code (TAC), Quadruples, Triples, Basic Blocks, Loop Optimization.',
            topics: ['Syntax-Directed Translation Schemes', 'Three-Address Code Generation for Expressions and Control Flow', 'Control Flow Graphs & Basic Block Identification', 'Loop Invariant Code Motion and Dead Code Elimination'],
            concepts: [
              { id: 'cd-tac', title: 'Three-Address Code (TAC) Generation', description: 'Linearized intermediate representation for machine-independent optimization' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-ai',
        code: 'CS602PC',
        name: 'Artificial Intelligence & Knowledge Representation',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Heuristic Search & Adversarial Games',
            description: 'State space formulation, A* algorithm, Admissibility, Minimax search, Alpha-Beta pruning.',
            topics: ['A* Search Algorithm & Consistent Heuristics', 'Minimax Adversarial Game Trees', 'Alpha-Beta Pruning Optimization'],
            concepts: [
              { id: 'ai-astar', title: 'A* Heuristic Graph Search', description: 'f(n) = g(n) + h(n) optimality guarantees under admissible heuristics' },
              { id: 'ai-alphabeta', title: 'Alpha-Beta Game Tree Pruning', description: 'Branch elimination preserving minimax decision equivalence' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Knowledge Representation & Expert Systems',
            description: 'First-order logic resolution, Unification algorithm, Semantic nets, Frames, Bayesian Networks.',
            topics: ['First-Order Predicate Logic (FOPL) Resolution', 'Unification Algorithm in FOPL', 'Bayesian Belief Networks & Inference'],
            concepts: [
              { id: 'ai-resolution', title: 'First-Order Logic Resolution Principle', description: 'Refutation proofs using conjunctive normal form and unifiers' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-cyber',
        code: 'CS604PC',
        name: 'Cyber Security and Cryptography',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Cryptographic Ciphers & Public Key Systems',
            description: 'AES, DES, RSA public-key algorithm, Diffie-Hellman key exchange, SHA-256 hash functions.',
            topics: ['AES Symmetric Encryption Rounds', 'RSA Mathematical Principles & Key Generation', 'Diffie-Hellman Key Exchange Protocol', 'Digital Signatures & SHA-256 Integrity'],
            concepts: [
              { id: 'sec-rsa', title: 'RSA Public Key Cryptosystem', description: 'Euler totient theorem, modular exponentiation, and prime factorization hardness' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 5. JNTUH R25 CSE Year 4 Semester 1 (4-1)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y4-S1': {
    id: 'JNTUH-R25-CSE-Y4-S1',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 4,
    semester: 1,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-cns',
        code: 'CS701PC',
        name: 'Cryptography and Network Security',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Symmetric & Asymmetric Security Architectures',
            description: 'Block cipher modes of operation (CBC, GCM), Elliptic Curve Cryptography (ECC), Kerberos authentication.',
            topics: ['Cipher Block Chaining (CBC) & Galois/Counter Mode (GCM)', 'Elliptic Curve Discrete Logarithm Problem (ECDLP)', 'Kerberos Authentication Tickets (AS & TGS)'],
            concepts: [
              { id: 'cns-ecc', title: 'Elliptic Curve Cryptography (ECC)', description: 'Shorter key lengths with equivalent algebraic security bounds' },
            ],
          },
          {
            unitNumber: 2,
            title: 'IP Security & Transport Layer Security',
            description: 'IPsec (AH and ESP), SSL/TLS handshake protocol, Firewalls, Intrusion Detection Systems (IDS).',
            topics: ['IPsec Architecture (Transport vs Tunnel Mode)', 'TLS 1.3 Cryptographic Handshake', 'Stateful Packet Inspection Firewalls'],
            concepts: [
              { id: 'cns-tls', title: 'TLS 1.3 Cryptographic Handshake', description: 'Zero-RTT key agreement, ephemeral Diffie-Hellman, and perfect forward secrecy' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-cloud',
        code: 'CS711PE',
        name: 'Cloud Computing and Virtualization',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Cloud Architectures and Virtualization',
            description: 'NIST Cloud model, IaaS, PaaS, SaaS, Hypervisors (Type 1 vs Type 2), Containerization (Docker, Kubernetes).',
            topics: ['Cloud Service Models & Deployment Paradigms', 'Hardware Virtualization vs Containerization', 'Kubernetes Pod Architecture and Service Mesh'],
            concepts: [
              { id: 'cloud-k8s', title: 'Kubernetes Container Orchestration', description: 'Declarative cluster management, replica controllers, and ingress routing' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-nlp',
        code: 'CS721PE',
        name: 'Natural Language Processing',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Python',
        units: [
          {
            unitNumber: 1,
            title: 'Word Embeddings & Sequence Models',
            description: 'Tokenization, Word2Vec (Skip-gram, CBOW), GloVe, Recurrent Neural Networks (RNNs), LSTM, GRU.',
            topics: ['Word2Vec Architecture & Negative Sampling', 'Vanishing Gradients in RNNs', 'Long Short-Term Memory (LSTM) Cell Gates'],
            concepts: [
              { id: 'nlp-lstm', title: 'LSTM Architecture & Gating Mechanics', description: 'Forget, input, and output gates resolving long-range dependency collapse' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 6. JNTUH R25 CSE Year 4 Semester 2 (4-2) — ALL 8 SEMESTERS & TEST A
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-Y4-S2': {
    id: 'JNTUH-R25-CSE-Y4-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse',
    branchName: 'Computer Science and Engineering',
    year: 4,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-deep-genai',
        code: 'CS801PE',
        name: 'Deep Learning & Generative AI Systems',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Python',
        units: [
          {
            unitNumber: 1,
            title: 'Deep Neural Networks & Backpropagation',
            description: 'Multi-layer perceptrons, backpropagation mathematics, loss functions, Adam optimizer, regularization.',
            topics: ['Analytical Derivation of Backpropagation', 'Batch Normalization and Layer Normalization', 'Adam & Learning Rate Schedules', 'Dropout and Weight Decay'],
            concepts: [
              { id: 'dnn-backprop', title: 'Backpropagation Mathematical Chain Rule', description: 'Gradient flow across deep tensor operations and weight updates' },
              { id: 'dnn-norm', title: 'Batch vs Layer Normalization', description: 'Mitigating internal covariate shift in deep network activations' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Convolutional Neural Networks & Vision',
            description: 'Convolutions, stride, padding, receptive field, ResNet residual skip connections, Object Detection (YOLO).',
            topics: ['Convolutional Kernel Operations', 'Residual Connections & Gradient Highway', 'Feature Pyramid Networks & YOLO Object Detection'],
            concepts: [
              { id: 'cnn-resnet', title: 'ResNet Architecture & Residual Skip Connections', description: 'Identity shortcuts solving vanishing gradients in 100+ layer nets' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Transformer Architecture & Self-Attention',
            description: 'Scaled dot-product attention, multi-head attention mechanism, positional encodings, encoder-decoder transformers.',
            topics: ['Scaled Dot-Product Attention Formulation', 'Multi-Head Attention Projections', 'Sinusoidal and Rotary Positional Embeddings (RoPE)', 'Encoder vs Decoder (BERT vs GPT) Architectures'],
            concepts: [
              { id: 'tf-self-attention', title: 'Scaled Dot-Product Self-Attention', description: 'Query, Key, and Value matrix multiplications with softmax scaling' },
              { id: 'tf-multihead', title: 'Multi-Head Attention Mechanism', description: 'Parallel subspace representations capturing rich linguistic semantics' },
            ],
          },
          {
            unitNumber: 4,
            title: 'Generative Models: GANs & Diffusion',
            description: 'Generative Adversarial Networks (GANs), Wasserstein GAN, Denoising Diffusion Probabilistic Models (DDPM).',
            topics: ['Minimax Game Formulation of GANs', 'Wasserstein GAN with Gradient Penalty', 'Forward and Reverse Diffusion Processes', 'Score-Based Generative Modeling'],
            concepts: [
              { id: 'gen-gan', title: 'Generative Adversarial Networks (GANs)', description: 'Adversarial training between generator and discriminator distributions' },
              { id: 'gen-diffusion', title: 'Diffusion Probabilistic Models (DDPM)', description: 'Markovian noise addition and reverse U-Net denoising trajectories' },
            ],
          },
          {
            unitNumber: 5,
            title: 'Retrieval-Augmented Generation & LLM Fine-Tuning',
            description: 'Vector embeddings, semantic retrieval, RAG architectures, Parameter-Efficient Fine-Tuning (LoRA, QLoRA).',
            topics: ['Vector Databases & Approximate Nearest Neighbor Search', 'Retrieval-Augmented Generation (RAG) Architecture', 'Low-Rank Adaptation (LoRA) Weight Decomposition', 'Quantized LoRA (QLoRA) and 4-Bit NormalFloat'],
            concepts: [
              { id: 'rag-vector-embed', title: 'Retrieval-Augmented Generation (RAG)', description: 'Grounding LLM inferences using external vector database retrieval' },
              { id: 'lora-peft', title: 'Low-Rank Adaptation (LoRA) Fine-Tuning', description: 'Decomposing weight updates W = W0 + B*A with minimal trainable parameters' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-mlops-hpc',
        code: 'CS802PE',
        name: 'MLOps, Distributed Systems & High Performance Computing',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Distributed Systems & Consistency',
            description: 'CAP Theorem, Raft consensus protocol, Distributed storage, Data parallelism vs Model parallelism.',
            topics: ['CAP Theorem Tradeoffs', 'Raft Consensus Leader Election & Log Replication', 'Distributed Model Parallelism & Pipeline Parallelism'],
            concepts: [
              { id: 'dist-raft', title: 'Raft Consensus Protocol', description: 'Replicated state machine safety and leader election heartbeat logic' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Production MLOps Pipelines',
            description: 'Data versioning (DVC), Model registry, CI/CD for machine learning, Model drift detection, Triton Inference Server.',
            topics: ['Automated Model CI/CD with GitHub Actions', 'Concept Drift vs Data Drift Detection (KS-Test)', 'High-Throughput Model Serving with Triton'],
            concepts: [
              { id: 'mlops-drift', title: 'Concept Drift & Model Monitoring', description: 'Statistical distribution shift detection on production inferences' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-seminar-internship',
        code: 'CS803PC',
        name: 'Technical Seminar & Industry Internship',
        credits: 2,
        category: 'Mandatory',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Technical Seminar & Literature Synthesis',
            description: 'Review of peer-reviewed research papers, slide deck presentation, and technical defense.',
            topics: ['Literature Review & State-of-the-Art Benchmarking', 'Technical Defense & Presentation'],
            concepts: [
              { id: 'seminar-review', title: 'Academic Research Synthesis', description: 'Critical evaluation of published algorithms and empirical studies' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-capstone-project',
        code: 'CS804PC',
        name: 'Major Project Stage-II & Capstone Implementation',
        credits: 6,
        category: 'Professional Core',
        isLab: true,
        units: [
          {
            unitNumber: 1,
            title: 'Capstone Engineering Architecture & Implementation',
            description: 'Full-stack production development, cloud deployment, load testing, comprehensive viva-voce.',
            topics: ['End-to-End System Architecture Design', 'Load Testing & Benchmark Profiling', 'Final Viva-Voce Defense'],
            concepts: [
              { id: 'capstone-arch', title: 'Production System Architecture', description: 'Scalable deployment, fault tolerance, and empirical evaluation' },
            ],
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────
  // 7. JNTUH R25 CSE-AIML Year 4 Semester 2 (4-2)
  // ──────────────────────────────────────────────────────────
  'JNTUH-R25-CSE-AIML-Y4-S2': {
    id: 'JNTUH-R25-CSE-AIML-Y4-S2',
    university: 'JNTUH',
    regulation: 'R25',
    branchId: 'cse-aiml',
    branchName: 'CSE - Artificial Intelligence and Machine Learning',
    year: 4,
    semester: 2,
    academicYear: '2025-2026',
    sourceType: 'OFFICIAL_UNIVERSITY',
    verified: true,
    version: 'R25.1.0',
    retrievedAt: '2025-08-01T00:00:00Z',
    subjects: [
      {
        id: 'jntuh-r25-aiml-llm-diffusion',
        code: 'AM801PE',
        name: 'Generative AI, LLMs & Diffusion Architectures',
        credits: 4,
        category: 'Professional Core',
        isLab: false,
        programmingLanguage: 'Python',
        units: [
          {
            unitNumber: 1,
            title: 'Large Language Model Architecture',
            description: 'Decoder-only transformers, RoPE positional encoding, FlashAttention, KV caching.',
            topics: ['Rotary Position Embeddings (RoPE)', 'FlashAttention GPU Memory Optimization', 'Key-Value (KV) Caching in Autoregressive Generation'],
            concepts: [
              { id: 'llm-flash-attn', title: 'FlashAttention & GPU Memory Optimization', description: 'IO-aware exact attention tiling minimizing HBM accesses' },
            ],
          },
          {
            unitNumber: 2,
            title: 'Fine-Tuning & Alignment (RLHF / DPO)',
            description: 'Supervised Fine-Tuning (SFT), RLHF with PPO, Direct Preference Optimization (DPO).',
            topics: ['SFT Data Quality and Curation', 'Reward Modeling in RLHF', 'Direct Preference Optimization (DPO) Closed-Form Objective'],
            concepts: [
              { id: 'llm-dpo', title: 'Direct Preference Optimization (DPO)', description: 'Implicit reward optimization eliminating actor-critic stability bottlenecks' },
            ],
          },
          {
            unitNumber: 3,
            title: 'Agentic Workflows & Multi-Modal Models',
            description: 'ReAct framework, Tool Calling, Vision-Language Models (CLIP, LLaVA).',
            topics: ['Reasoning and Acting (ReAct) Loop', 'Function Calling & Structured Outputs', 'Vision-Language Feature Alignment'],
            concepts: [
              { id: 'ai-react-agent', title: 'ReAct Agentic Architecture', description: 'Thought-Action-Observation iterative execution graphs' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-aiml-edge-mlops',
        code: 'AM802PE',
        name: 'Edge AI, High Performance Computing & MLOps',
        credits: 3,
        category: 'Professional Core',
        isLab: false,
        units: [
          {
            unitNumber: 1,
            title: 'Model Compression & Quantization',
            description: 'Post-Training Quantization (PTQ), Quantization-Aware Training (QAT), TensorRT, ONNX runtime.',
            topics: ['INT8 vs FP16 Quantization Calibration', 'Knowledge Distillation Student-Teacher Models', 'TensorRT Engine Optimization'],
            concepts: [
              { id: 'edge-quant', title: 'Neural Network Quantization (PTQ & QAT)', description: 'Mapping continuous weight floats into discrete low-precision integers' },
            ],
          },
        ],
      },
      {
        id: 'jntuh-r25-aiml-capstone',
        code: 'AM804PC',
        name: 'AI/ML Capstone Major Project Stage-II',
        credits: 6,
        category: 'Professional Core',
        isLab: true,
        units: [
          {
            unitNumber: 1,
            title: 'Production AI Deployment & Verification',
            description: 'End-to-end AI application development, model benchmarking, and defense.',
            topics: ['Production Model Serving & Low-Latency API Deployment', 'Empirical Evaluation & Bias Auditing'],
            concepts: [
              { id: 'aiml-capstone-deploy', title: 'Production AI System Deployment', description: 'Scalable containerized inference and automated performance monitoring' },
            ],
          },
        ],
      },
    ],
  },
};
