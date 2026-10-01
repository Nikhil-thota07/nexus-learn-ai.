import { Concept, DiagnosticQuestion } from '@/types';

export const CONCEPTS: Concept[] = [
  // --- PYTHON TRACK ---
  {
    id: 'py-basics',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Core Foundations',
    slug: 'python-basics',
    title: 'Python Syntax & Execution',
    description: 'Interpreter model, indentation rules, comments, and basic data types.',
    order: 1,
    difficulty: 1,
    masteryThreshold: 75,
    prerequisiteIds: [],
    dependentIds: ['py-vars'],
    keyTakeaways: [
      'Python uses indentation (4 spaces) rather than braces for code blocks.',
      'Scripts execute line-by-line via the CPython interpreter bytecode virtual machine.',
      'Dynamic typing allows variables to be reassigned to different types at runtime.'
    ],
    commonMisconceptions: [
      {
        name: 'Indentation is decorative',
        description: 'Assuming indentation has no semantic impact like in C/Java.',
        correction: 'Indentation defines the program block hierarchy and scope.',
        exampleIncorrect: 'def greet():\nprint("Hi")',
        exampleCorrect: 'def greet():\n    print("Hi")'
      }
    ]
  },
  {
    id: 'py-vars',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Core Foundations',
    slug: 'variables-and-types',
    title: 'Variables & Data Types',
    description: 'Dynamic typing, type casting, immutability, strings, and numeric operations.',
    order: 2,
    difficulty: 2,
    masteryThreshold: 75,
    prerequisiteIds: ['py-basics'],
    dependentIds: ['py-control'],
    keyTakeaways: [
      'Variables are references to memory objects, not memory boxes holding values.',
      'Strings, integers, and tuples are immutable; lists and dicts are mutable.',
      'Type casting functions (int(), float(), str()) convert between compatible types.'
    ],
    commonMisconceptions: [
      {
        name: 'Variable assignment copies data',
        description: 'Assuming b = a duplicates complex data structures in memory.',
        correction: 'Assignment creates a reference pointer to the same underlying object.',
        exampleIncorrect: 'a = [1, 2]; b = a; b.append(3) # Expects a to stay [1, 2]',
        exampleCorrect: 'a = [1, 2]; b = a.copy(); b.append(3) # a remains [1, 2]'
      }
    ]
  },
  {
    id: 'py-control',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Control Flow',
    slug: 'control-flow',
    title: 'Conditionals & Loops',
    description: 'if-elif-else branching, for and while loops, break, and continue statements.',
    order: 3,
    difficulty: 2,
    masteryThreshold: 75,
    prerequisiteIds: ['py-vars'],
    dependentIds: ['py-functions'],
    keyTakeaways: [
      'Conditionals evaluate truthiness (empty collections, 0, None evaluate to False).',
      'For loops iterate over any iterable protocol object using an internal iterator.',
      'Break terminates the enclosing loop; continue jumps directly to the next iteration.'
    ],
    commonMisconceptions: [
      {
        name: 'Modifying list while iterating',
        description: 'Deleting elements from a list during a for-loop causes skipped indices.',
        correction: 'Iterate over a copy of the list or use list comprehensions.',
        exampleIncorrect: 'for x in nums: if x > 2: nums.remove(x)',
        exampleCorrect: 'nums = [x for x in nums if x <= 2]'
      }
    ]
  },
  {
    id: 'py-functions',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Functions & Modularity',
    slug: 'functions-and-signatures',
    title: 'Functions & Signatures',
    description: 'Defining functions with def, calling conventions, and code reusability.',
    order: 4,
    difficulty: 2,
    masteryThreshold: 75,
    prerequisiteIds: ['py-control'],
    dependentIds: ['py-params', 'py-return'],
    keyTakeaways: [
      'Functions encapsulate logic and promote DRY (Don\'t Repeat Yourself) design.',
      'Functions in Python are first-class citizens: can be passed as args and assigned.',
      'The docstring immediately following def provides documentation accessible via help().'
    ],
    commonMisconceptions: [
      {
        name: 'Function definition executes logic immediately',
        description: 'Expecting function body to run when defined before invocation.',
        correction: 'A function only executes when invoked with parentheses () syntax.',
        exampleIncorrect: 'def compute(): print("Done") # Expects "Done" immediately',
        exampleCorrect: 'def compute(): print("Done")\ncompute() # Now it prints'
      }
    ]
  },
  {
    id: 'py-params',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Functions & Modularity',
    slug: 'parameters-and-arguments',
    title: 'Parameters & Arguments',
    description: 'Positional arguments, keyword arguments, default parameters, *args, and **kwargs.',
    order: 5,
    difficulty: 3,
    masteryThreshold: 75,
    prerequisiteIds: ['py-functions'],
    dependentIds: ['py-return', 'py-scope'],
    keyTakeaways: [
      'Parameters are variable names in the def line; arguments are values passed when calling.',
      'Default arguments are evaluated once at function definition time.',
      '*args collects arbitrary positional arguments as a tuple; **kwargs collects named args as a dictionary.'
    ],
    commonMisconceptions: [
      {
        name: 'Mutable default parameter trap',
        description: 'Using [] or {} as a default argument creates a shared persistent object across calls.',
        correction: 'Use None as default and initialize a new list inside the function body.',
        exampleIncorrect: 'def add_item(item, basket=[]): basket.append(item); return basket',
        exampleCorrect: 'def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket'
      }
    ]
  },
  {
    id: 'py-return',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Functions & Modularity',
    slug: 'return-values',
    title: 'Return Values vs Print',
    description: 'Function outputs, the return statement, returning None, and returning multiple values.',
    order: 6,
    difficulty: 3,
    masteryThreshold: 80,
    prerequisiteIds: ['py-functions', 'py-params'],
    dependentIds: ['py-scope', 'py-recursion'],
    keyTakeaways: [
      'return passes data back to the caller; print() merely writes text to standard output (console).',
      'If no return statement is specified, Python implicitly returns None.',
      'The returned value can be stored in a variable, passed to other functions, or used in calculations.',
      'return immediately halts function execution and returns control to caller.'
    ],
    commonMisconceptions: [
      {
        name: 'Confusing return with print()',
        description: 'Believing that print() inside a function saves or sends the value to the variable assigned to the function call.',
        correction: 'print() displays characters on the monitor. return hands the actual data object back so the program can use it.',
        exampleIncorrect: 'def square(n):\n    print(n * n)\nres = square(5) # res is None! Can\'t do res + 2',
        exampleCorrect: 'def square(n):\n    return n * n\nres = square(5) # res is 25, res + 2 is 27'
      },
      {
        name: 'Code executes after return',
        description: 'Expecting statements following return to still run.',
        correction: 'return acts as an immediate exit gate for that invocation.',
        exampleIncorrect: 'def calc(x):\n    return x * 2\n    x = x + 10 # dead code',
        exampleCorrect: 'def calc(x):\n    x = x + 10\n    return x * 2'
      }
    ]
  },
  {
    id: 'py-scope',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Functions & Modularity',
    slug: 'variable-scope-legb',
    title: 'Variable Scope & LEGB Rule',
    description: 'Local, Enclosing, Global, and Built-in namespaces, global and nonlocal keywords.',
    order: 7,
    difficulty: 3,
    masteryThreshold: 75,
    prerequisiteIds: ['py-return', 'py-params'],
    dependentIds: ['py-recursion'],
    keyTakeaways: [
      'LEGB: Python searches Local, then Enclosing, then Global, then Built-in scopes.',
      'Assigning to a variable inside a function marks it as Local by default.',
      'The global keyword allows modifying module-level variables inside a function.'
    ],
    commonMisconceptions: [
      {
        name: 'UnboundLocalError on global read/write',
        description: 'Trying to read a global variable and then assign to it in the same function without global declaration.',
        correction: 'Python treats any variable assigned anywhere in a function as local throughout that entire function.',
        exampleIncorrect: 'count = 0\ndef bump():\n    print(count)\n    count += 1 # UnboundLocalError!',
        exampleCorrect: 'count = 0\ndef bump():\n    global count\n    print(count)\n    count += 1'
      }
    ]
  },
  {
    id: 'py-recursion',
    track: 'python',
    trackName: 'Python Programming',
    module: 'Advanced Functions',
    slug: 'recursion',
    title: 'Recursion & Call Stacks',
    description: 'Base cases, recursive steps, stack frames, and call depth limits.',
    order: 8,
    difficulty: 4,
    masteryThreshold: 80,
    prerequisiteIds: ['py-return', 'py-scope'],
    dependentIds: [],
    keyTakeaways: [
      'A recursive function solves a problem by calling itself with a strictly smaller subproblem.',
      'Every recursive function MUST have at least one base case to terminate execution.',
      'Each recursive call creates a new stack frame in memory.'
    ],
    commonMisconceptions: [
      {
        name: 'Missing return in recursive step',
        description: 'Calling the recursive step without returning its result, causing the parent to return None.',
        correction: 'Always return the recursive call result back up the call stack.',
        exampleIncorrect: 'def fact(n):\n    if n <= 1: return 1\n    fact(n - 1) * n # Returns None!',
        exampleCorrect: 'def fact(n):\n    if n <= 1: return 1\n    return fact(n - 1) * n'
      }
    ]
  },

  // --- JEE PREPARATION TRACK (Physics, Chemistry, Maths) ---
  {
    id: 'jee-kinematics',
    track: 'jee-physics',
    trackName: 'JEE Physics',
    module: 'Mechanics',
    slug: 'jee-kinematics',
    title: 'Kinematics in 1D & 2D',
    description: 'Displacement, velocity vectors, acceleration, projectile motion, and relative velocity.',
    order: 1,
    difficulty: 3,
    masteryThreshold: 80,
    prerequisiteIds: [],
    dependentIds: ['jee-newton'],
    keyTakeaways: [
      'v = u + at applies only under constant linear acceleration.',
      'Horizontal and vertical components of 2D projectile motion are completely independent.',
      'Relative velocity V_AB = V_A - V_B applies vectorially in any inertial reference frame.'
    ],
    commonMisconceptions: [
      {
        name: 'Zero velocity means zero acceleration',
        description: 'Believing that at the apex of projectile motion, acceleration is zero.',
        correction: 'At the apex, vertical velocity is zero, but gravitational acceleration g remains constant downward.',
        exampleIncorrect: 'At top of trajectory: v=0, so a=0',
        exampleCorrect: 'At top: v=0, but a = -g = -9.8 m/s^2'
      }
    ]
  },
  {
    id: 'jee-newton',
    track: 'jee-physics',
    trackName: 'JEE Physics',
    module: 'Mechanics',
    slug: 'jee-newtons-laws',
    title: 'Newton\'s Laws of Motion & Friction',
    description: 'Free body diagrams, normal contact force, static vs kinetic friction, and pseudo forces.',
    order: 2,
    difficulty: 4,
    masteryThreshold: 80,
    prerequisiteIds: ['jee-kinematics'],
    dependentIds: ['jee-wep', 'jee-rotation'],
    keyTakeaways: [
      'Sigma F = ma applies in inertial reference frames.',
      'Static friction is a self-adjusting force: 0 <= f_s <= mu_s * N.',
      'In a non-inertial accelerating frame, add a pseudo force F_pseudo = -m * a_frame.'
    ],
    commonMisconceptions: [
      {
        name: 'Action and reaction cancel out',
        description: 'Thinking Newton\'s 3rd law action-reaction pair cancels each other.',
        correction: 'Action and reaction act on two entirely different bodies, never on the same body.',
        exampleIncorrect: 'Horse pulls cart with F, cart pulls horse with -F, so nothing moves.',
        exampleCorrect: 'Horse moves because ground exerts forward friction force on horse hooves.'
      }
    ]
  },
  {
    id: 'jee-wep',
    track: 'jee-physics',
    trackName: 'JEE Physics',
    module: 'Mechanics',
    slug: 'jee-work-energy-power',
    title: 'Work, Energy & Power',
    description: 'Work-energy theorem, conservative vs non-conservative forces, potential energy curves.',
    order: 3,
    difficulty: 3,
    masteryThreshold: 80,
    prerequisiteIds: ['jee-newton'],
    dependentIds: ['jee-rotation'],
    keyTakeaways: [
      'Work done by ALL forces equals the change in kinetic energy: W_total = Delta K.',
      'Conservative forces satisfy Delta U = -W_conservative; curl of F is zero.',
      'Mechanical energy is conserved if only conservative forces do work.'
    ],
    commonMisconceptions: [
      {
        name: 'Normal force never does work',
        description: 'Assuming normal force always does zero work because it is perpendicular to surface.',
        correction: 'If the surface itself moves in the direction of normal force (e.g. accelerating elevator, wedge), work is non-zero.',
        exampleIncorrect: 'W_normal is always 0 J',
        exampleCorrect: 'In a rising elevator, normal force does positive work on the passenger: W = N * d > 0.'
      }
    ]
  },
  {
    id: 'jee-rotation',
    track: 'jee-physics',
    trackName: 'JEE Physics',
    module: 'Mechanics',
    slug: 'jee-rotational-dynamics',
    title: 'Rotational Dynamics & Torque',
    description: 'Moment of inertia, parallel/perpendicular axis theorems, torque = I * alpha, rolling without slipping.',
    order: 4,
    difficulty: 5,
    masteryThreshold: 85,
    prerequisiteIds: ['jee-newton', 'jee-wep'],
    dependentIds: [],
    keyTakeaways: [
      'Moment of inertia I depends on mass distribution relative to the axis of rotation.',
      'Torque tau = r x F = I * alpha.',
      'Pure rolling condition on stationary surface: v_cm = R * omega and a_cm = R * alpha.'
    ],
    commonMisconceptions: [
      {
        name: 'Friction always opposes rolling motion',
        description: 'Thinking friction must always act backward on a rolling cylinder.',
        correction: 'In accelerated rolling or on driven wheels, static friction can act forward to provide angular or linear acceleration.',
        exampleIncorrect: 'Friction is always opposing the direction of vehicle displacement.',
        exampleCorrect: 'On the rear drive wheel of a bicycle, static friction points forward to accelerate the bike.'
      }
    ]
  },

  // --- JEE CHEMISTRY TRACK ---
  {
    id: 'jee-chem-mole',
    track: 'jee-chemistry',
    trackName: 'JEE Chemistry',
    module: 'Physical Chemistry',
    slug: 'mole-concept-stoichiometry',
    title: 'Mole Concept & Stoichiometry',
    description: 'Avogadro number, molar mass, empirical formulas, limiting reagents, and redox titration stoichiometry.',
    order: 1,
    difficulty: 3,
    masteryThreshold: 80,
    prerequisiteIds: [],
    dependentIds: ['jee-chem-bonding'],
    keyTakeaways: [
      '1 mole contains exactly 6.022 x 10^23 entities (Avogadro constant N_A).',
      'The limiting reagent determines the maximum theoretical yield of products.',
      'Molarity (M) varies with temperature, while Molality (m) is temperature independent.'
    ],
    commonMisconceptions: [
      {
        name: 'Limiting reagent has smaller initial mass',
        description: 'Assuming the reactant with fewer grams is always the limiting reagent.',
        correction: 'Limiting reagent is determined by molar ratio divided by stoichiometric coefficient, not raw mass.',
        exampleIncorrect: '10g of H2 vs 50g of O2 -> H2 has less mass so it is limiting',
        exampleCorrect: '10g H2 = 5 mol; 50g O2 = 1.56 mol. 2H2 + O2 -> 2H2O requires 2:1 ratio. O2 is limiting!'
      }
    ]
  },
  {
    id: 'jee-chem-bonding',
    track: 'jee-chemistry',
    trackName: 'JEE Chemistry',
    module: 'Inorganic Chemistry',
    slug: 'chemical-bonding-vsepr',
    title: 'Chemical Bonding & VSEPR Theory',
    description: 'Ionic vs covalent bonding, dipole moments, hybridization (sp, sp2, sp3, sp3d), and molecular orbital theory.',
    order: 2,
    difficulty: 4,
    masteryThreshold: 85,
    prerequisiteIds: ['jee-chem-mole'],
    dependentIds: [],
    keyTakeaways: [
      'VSEPR: Lone pair-lone pair repulsion > Lone pair-bond pair > Bond pair-bond pair.',
      'Dipole moment is a vector quantity: net mu depends on geometric symmetry.',
      'MOT predicts paramagnetism in O2 due to two unpaired electrons in pi* antibonding orbitals.'
    ],
    commonMisconceptions: [
      {
        name: 'Hybridization includes pi bonds',
        description: 'Counting pi bonds in steric number calculation for hybridization.',
        correction: 'Steric number only counts sigma bonds and localized lone pairs; unhybridized p orbitals form pi bonds.',
        exampleIncorrect: 'Ethylene (C2H4) has 4 bonds on C so it is sp3',
        exampleCorrect: 'Carbon has 3 sigma bonds + 0 lone pairs -> Steric number 3 -> sp2 hybridization.'
      }
    ]
  },

  // --- JEE MATHEMATICS TRACK ---
  {
    id: 'jee-math-quadratic',
    track: 'jee-math',
    trackName: 'JEE Mathematics',
    module: 'Algebra',
    slug: 'quadratic-equations-location-of-roots',
    title: 'Quadratic Equations & Location of Roots',
    description: 'Discriminant analysis, relation between roots and coefficients, common roots, and location of roots conditions.',
    order: 1,
    difficulty: 4,
    masteryThreshold: 85,
    prerequisiteIds: [],
    dependentIds: ['jee-math-calculus'],
    keyTakeaways: [
      'For ax^2 + bx + c = 0: sum of roots alpha + beta = -b/a, product alpha * beta = c/a.',
      'Roots are real and distinct iff D = b^2 - 4ac > 0.',
      'Location of roots constraints combine D >= 0, sign of a*f(k), and position of vertex -b/(2a).'
    ],
    commonMisconceptions: [
      {
        name: 'D > 0 alone guarantees positive roots',
        description: 'Assuming positive discriminant guarantees both roots are positive.',
        correction: 'Both roots positive requires D >= 0 AND sum of roots > 0 AND product of roots > 0.',
        exampleIncorrect: 'x^2 - x - 6 = 0 has D = 25 > 0, so roots must be positive.',
        exampleCorrect: 'Roots are 3 and -2; one is negative because product c/a = -6 < 0.'
      }
    ]
  },
  {
    id: 'jee-math-calculus',
    track: 'jee-math',
    trackName: 'JEE Mathematics',
    module: 'Differential Calculus',
    slug: 'limits-continuity-derivatives',
    title: 'Limits, Continuity & L\'Hopital Rule',
    description: 'Evaluation of standard limits, indeterminacies (0/0, inf/inf, 1^inf), continuity definitions, and differentiability.',
    order: 2,
    difficulty: 5,
    masteryThreshold: 85,
    prerequisiteIds: ['jee-math-quadratic'],
    dependentIds: [],
    keyTakeaways: [
      'L\'Hopital\'s rule applies ONLY to indeterminate forms 0/0 and inf/inf.',
      'Differentiability implies continuity, but continuity does NOT imply differentiability (e.g. |x| at x=0).',
      'Standard limit: lim (x->0) sin(x)/x = 1 where x is in radians.'
    ],
    commonMisconceptions: [
      {
        name: 'Applying L\'Hopital when not indeterminate',
        description: 'Differentiating numerator and denominator when the fraction does not yield 0/0 or inf/inf.',
        correction: 'Always verify indeterminacy before taking derivatives.',
        exampleIncorrect: 'lim (x->2) (x + 1)/(x + 2) -> (1)/(1) = 1 (Wrong!)',
        exampleCorrect: 'Direct substitution yields 3/4; no indeterminacy exists.'
      }
    ]
  },

  // --- ENGINEERING / B.TECH OPERATING SYSTEMS & DSA ---
  {
    id: 'btech-os-processes',
    track: 'btech-os',
    trackName: 'Operating Systems',
    module: 'Process & Thread Management',
    slug: 'process-management-pcb',
    title: 'Process Lifecycle & PCB',
    description: 'Process control blocks, context switching, fork() and exec() semantics, scheduling queues.',
    order: 1,
    difficulty: 3,
    masteryThreshold: 75,
    prerequisiteIds: [],
    dependentIds: ['btech-os-threads', 'btech-os-deadlocks'],
    keyTakeaways: [
      'A process is an active program instance with isolated virtual address space, registers, and open files.',
      'Context switching saves hardware registers into PCB and reloads new process state.',
      'fork() duplicates the parent address space via Copy-On-Write; child receives return value 0.'
    ],
    commonMisconceptions: [
      {
        name: 'Context switch is instantaneous',
        description: 'Ignoring CPU cycle overhead and cache invalidation during context switches.',
        correction: 'Context switching requires kernel trap, saving state, TLB flush, and cache miss penalties.',
        exampleIncorrect: 'Switching 10,000 times per second has zero computational penalty.',
        exampleCorrect: 'Excessive context switching leads to trashing and high CPU overhead in kernel space.'
      }
    ]
  },
  {
    id: 'btech-os-deadlocks',
    track: 'btech-os',
    trackName: 'Operating Systems',
    module: 'Concurrency & Synchronization',
    slug: 'deadlocks-and-bankers',
    title: 'Deadlocks & Banker\'s Algorithm',
    description: 'Four Coffman conditions, resource allocation graphs, avoidance vs prevention, and safe states.',
    order: 2,
    difficulty: 4,
    masteryThreshold: 80,
    prerequisiteIds: ['btech-os-processes'],
    dependentIds: ['btech-os-memory'],
    keyTakeaways: [
      'Deadlock requires: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.',
      'A safe state guarantees at least one sequence of process allocations that finishes without deadlock.',
      'Banker\'s Algorithm checks if allocating resources keeps the system in a safe state.'
    ],
    commonMisconceptions: [
      {
        name: 'Unsafe state equals deadlock',
        description: 'Believing an unsafe state is already in deadlock.',
        correction: 'An unsafe state means a deadlock CAN occur if processes request their maximum claims; it is not guaranteed deadlock.',
        exampleIncorrect: 'If system is in unsafe state, processes are frozen in deadlock.',
        exampleCorrect: 'Deadlock is a subset of unsafe states; with lucky completion ordering, unsafe states may still finish.'
      }
    ]
  },
  {
    id: 'btech-os-memory',
    track: 'btech-os',
    trackName: 'Operating Systems',
    module: 'Memory Management',
    slug: 'virtual-memory-and-paging',
    title: 'Virtual Memory & Paging',
    description: 'Page tables, MMU translation, TLB hits/misses, multi-level paging, and page fault handling.',
    order: 3,
    difficulty: 4,
    masteryThreshold: 80,
    prerequisiteIds: ['btech-os-deadlocks'],
    dependentIds: [],
    keyTakeaways: [
      'Paging eliminates external fragmentation by mapping fixed-size virtual pages to physical page frames.',
      'Translation Lookaside Buffer (TLB) caches recent virtual-to-physical address mappings in hardware.',
      'A page fault triggers an OS kernel trap to load the required page from secondary storage disk swap.'
    ],
    commonMisconceptions: [
      {
        name: 'Paging completely eliminates all fragmentation',
        description: 'Believing paging suffers from zero fragmentation.',
        correction: 'Paging eliminates EXTERNAL fragmentation, but causes INTERNAL fragmentation in the last allocated page frame.',
        exampleIncorrect: 'Paging has 0% fragmentation waste anywhere.',
        exampleCorrect: 'If a process needs 4097 bytes and page size is 4096 bytes, the second frame has 4095 bytes of internal fragmentation.'
      }
    ]
  }
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // --- PYTHON RETURN VALUES (Key Target Scenario) ---
  {
    id: 'diag-py-return-1',
    conceptId: 'py-return',
    question: 'Examine the following code carefully. What will be printed when this script runs?',
    codeSnippet: `def calculate_tax(amount):
    total = amount * 0.18
    print(total)

result = calculate_tax(100)
print(result)`,
    options: [
      '18.0 followed by 18.0',
      '18.0 followed by None',
      'None followed by 18.0',
      'TypeError: invalid print assignment'
    ],
    correctIndex: 1,
    explanation: 'The function calculate_tax() executes print(total), which prints 18.0. However, because it lacks a return statement, it implicitly returns None. Hence, variable result receives None, and print(result) outputs None.',
    misconceptionMap: {
      0: 'Confusing return with print(): Believes print(total) saved 18.0 into result.'
    }
  },
  {
    id: 'diag-py-return-2',
    conceptId: 'py-return',
    question: 'What is the output of the following function call?',
    codeSnippet: `def get_greeting(name):
    return "Hello, " + name
    print("Welcome to Nexus!")

msg = get_greeting("Dev")
print(msg)`,
    options: [
      'Hello, Dev',
      'Hello, Dev followed by Welcome to Nexus!',
      'Welcome to Nexus! followed by Hello, Dev',
      'None'
    ],
    correctIndex: 0,
    explanation: 'The return statement immediately terminates function execution. The line print("Welcome to Nexus!") is unreachable dead code and never executes.',
    misconceptionMap: {
      1: 'Unreachable code misconception: Believes statements after return continue to execute.'
    }
  },
  {
    id: 'diag-py-return-3',
    conceptId: 'py-return',
    question: 'Which of the following code snippets correctly allows the computed value to be used in subsequent mathematical calculations?',
    codeSnippet: `Option A:
def double(n):
    print(n * 2)
val = double(10) + 5

Option B:
def double(n):
    return n * 2
val = double(10) + 5`,
    options: [
      'Both Option A and Option B work identically',
      'Only Option A works',
      'Only Option B works',
      'Neither works without global keyword'
    ],
    correctIndex: 2,
    explanation: 'In Option A, double(10) returns None. Evaluating None + 5 raises a TypeError: unsupported operand type(s) for +: "NoneType" and "int". Only Option B returns an integer (20), enabling 20 + 5 = 25.',
    misconceptionMap: {
      0: 'Confusing return with print(): Assumes print() provides an output operand for expressions.'
    }
  },

  // --- PYTHON PARAMETERS ---
  {
    id: 'diag-py-params-1',
    conceptId: 'py-params',
    question: 'What will be the output of executing the following two calls to append_num()?',
    codeSnippet: `def append_num(val, target_list=[]):
    target_list.append(val)
    return target_list

print(append_num(1))
print(append_num(2))`,
    options: [
      '[1] then [2]',
      '[1] then [1, 2]',
      '[1, 2] then [1, 2]',
      'SyntaxError: mutable default'
    ],
    correctIndex: 1,
    explanation: 'In Python, default arguments are evaluated only once when the function is defined. The list target_list=[] is a single persistent list object across multiple invocations.',
    misconceptionMap: {
      0: 'Mutable default misconception: Assumes default parameter [] is recreated on every function call.'
    }
  },

  // --- PYTHON SCOPE ---
  {
    id: 'diag-py-scope-1',
    conceptId: 'py-scope',
    question: 'What happens when running the code below?',
    codeSnippet: `score = 100

def increase():
    print(score)
    score = score + 10

increase()`,
    options: [
      'Prints 100 and updates score to 110',
      'UnboundLocalError: local variable "score" referenced before assignment',
      'NameError: score is undefined',
      'Prints 110'
    ],
    correctIndex: 1,
    explanation: 'Because score is assigned inside increase() (score = ...), Python marks score as local throughout the entire function scope. When it hits print(score) before the assignment, it raises UnboundLocalError.',
    misconceptionMap: {
      0: 'Scope hoisting confusion: Assumes Python can read the global before creating the local.'
    }
  },

  // --- JEE PHYSICS ---
  {
    id: 'diag-jee-kin-1',
    conceptId: 'jee-kinematics',
    question: 'A ball is projected vertically upward into the air. At the highest point of its trajectory, what are its velocity and acceleration?',
    options: [
      'Velocity = 0 m/s, Acceleration = 0 m/s²',
      'Velocity = 0 m/s, Acceleration = 9.8 m/s² downward',
      'Velocity = 9.8 m/s upward, Acceleration = 0 m/s²',
      'Velocity = 0 m/s, Acceleration = 9.8 m/s² upward'
    ],
    correctIndex: 1,
    explanation: 'At the apex, instantaneous vertical velocity momentarily passes through zero, but the gravitational force F = mg acts continuously, producing a constant downward acceleration g = 9.8 m/s².',
    misconceptionMap: {
      0: 'Zero velocity implies zero acceleration misconception: Confusing state of motion with rate of change of motion.'
    }
  },
  {
    id: 'diag-jee-newton-1',
    conceptId: 'jee-newton',
    question: 'According to Newton\'s Third Law, if a horse pulls a cart forward with force F, the cart pulls back on the horse with force -F. Why does the cart accelerate forward?',
    options: [
      'Because the horse pulls before the cart can react',
      'Because the action force F is slightly greater than the reaction force',
      'Because action and reaction act on different bodies, and the net horizontal force on the horse-cart system from the ground is forward',
      'Because friction on the cart wheels overcomes the backward pull'
    ],
    correctIndex: 2,
    explanation: 'Newton third-law pairs act on different objects (cart on horse, horse on cart). Forward acceleration occurs because the ground friction pushes forward on the horse feet more than rolling friction on the cart wheels pushes backward.',
    misconceptionMap: {
      1: 'Dynamic action-reaction imbalance misconception: Believing force pairs differ during acceleration.'
    }
  },

  // --- B.TECH OPERATING SYSTEMS ---
  {
    id: 'diag-os-deadlock-1',
    conceptId: 'btech-os-deadlocks',
    question: 'Which of the following statements about safe and unsafe states in Operating Systems is TRUE?',
    options: [
      'An unsafe state is by definition a deadlocked state',
      'An unsafe state is not necessarily deadlocked; it simply means the system cannot guarantee avoidance of deadlock if all processes demand maximum resources',
      'A safe state can never transition into an unsafe state under any allocation',
      'Deadlocks only occur in safe states when preemption is disabled'
    ],
    correctIndex: 1,
    explanation: 'A system in an unsafe state is NOT deadlocked immediately. It merely lacks a guaranteed safe execution sequence. If processes request fewer resources than their declared maximums, execution may still proceed smoothly.',
    misconceptionMap: {
      0: 'Equating unsafe state with deadlock: Failing to distinguish between potential hazard and actual deadlock.'
    }
  },
  {
    id: 'diag-os-mem-1',
    conceptId: 'btech-os-memory',
    question: 'Paging in virtual memory systems completely eliminates which type of memory fragmentation?',
    options: [
      'Internal fragmentation',
      'External fragmentation',
      'Both internal and external fragmentation',
      'Neither; paging only improves cache locality'
    ],
    correctIndex: 1,
    explanation: 'Paging breaks virtual address space and physical memory into fixed-size frames, allowing non-contiguous allocation and completely eliminating external fragmentation. However, internal fragmentation still exists in the final page of an allocated segment.',
    misconceptionMap: {
      2: 'Total fragmentation elimination misconception: Believing fixed-sized allocation also cures internal waste.'
    }
  }
];
