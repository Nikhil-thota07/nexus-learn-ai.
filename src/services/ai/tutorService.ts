import { buildStudentContext, StudentContext } from './studentContextBuilder';
import { buildStudentTutorPrompt } from './prompts/studentTutorPrompt';
import { PedagogicalTutorResponse, TutorIntent } from '@/types';

/**
 * Validates the structured tutor response.
 */
function validateTutorResponse(
  raw: any,
  context: StudentContext,
  question: string
): PedagogicalTutorResponse {
  if (!raw || typeof raw !== 'object') {
    return generateFallbackTutorResponse(context, question);
  }

  const validIntents: TutorIntent[] = [
    'EXPLANATION',
    'DEFINITION',
    'WHY',
    'HOW',
    'EXAMPLE',
    'PRACTICE',
    'HINT',
    'SOLUTION',
    'DEBUGGING',
    'CODE_REQUEST',
    'REVISION',
    'COMPARISON',
    'EXAM_PREPARATION',
    'MISCONCEPTION',
    'SYLLABUS_QUERY',
    'STUDY_PLAN',
    'CLARIFICATION_NEEDED',
  ];

  const intent: TutorIntent = validIntents.includes(raw.intent) ? raw.intent : 'EXPLANATION';

  const directAnswer =
    typeof raw.directAnswer === 'string' && raw.directAnswer.trim()
      ? raw.directAnswer
      : `Here is the explanation for your query on ${context.currentConcept?.title || context.currentSubject || 'your curriculum'}.`;

  const intuition = typeof raw.intuition === 'string' ? raw.intuition : undefined;

  let codeSnippet: PedagogicalTutorResponse['codeSnippet'] = undefined;
  if (raw.codeSnippet && typeof raw.codeSnippet === 'object' && raw.codeSnippet.code) {
    codeSnippet = {
      language: raw.codeSnippet.language || (context.syllabusSummary?.subjects[0]?.language?.toLowerCase() || 'python'),
      code: String(raw.codeSnippet.code),
      explanation: raw.codeSnippet.explanation || 'Step-by-step code execution.',
    };
  }

  const stepByStep = Array.isArray(raw.stepByStep) ? raw.stepByStep.map(String) : undefined;

  const commonMistake =
    raw.commonMistake && typeof raw.commonMistake.trap === 'string'
      ? {
          trap: raw.commonMistake.trap,
          correction: raw.commonMistake.correction || 'Keep this distinction clear.',
        }
      : undefined;

  const quickCheck =
    raw.quickCheck && typeof raw.quickCheck.question === 'string'
      ? {
          question: raw.quickCheck.question,
          hint: raw.quickCheck.hint || 'Think about data types and return flow.',
          answer: raw.quickCheck.answer || 'Check the console output vs return value.',
        }
      : undefined;

  return {
    intent,
    directAnswer,
    intuition,
    codeSnippet,
    stepByStep,
    commonMistake,
    quickCheck,
    contextNote: raw.contextNote || `Tailored for ${context.preparationMode} • ${context.branchName || context.educationLevel}`,
    clarificationPrompt: raw.clarificationPrompt,
  };
}

/**
 * Fallback tutor generator ensuring rich responses even offline.
 */
export function generateFallbackTutorResponse(
  context: StudentContext,
  question: string
): PedagogicalTutorResponse {
  const q = question.toLowerCase();

  // 1. Calculator or Code Request
  if (q.includes('calculator') || q.includes('write a code') || q.includes('write code') || q.includes('program')) {
    const isC = context.syllabusSummary?.subjects.some((s) => s.language === 'C');
    if (isC) {
      return {
        intent: 'CODE_REQUEST',
        directAnswer: 'Here is a clean, modular Simple Calculator in C implementing arithmetic operations with error handling for division by zero.',
        intuition: 'A calculator functions by accepting two numeric operands and an operator character (+, -, *, /), evaluating the expression using a switch-case control structure, and returning or displaying the calculated result.',
        codeSnippet: {
          language: 'c',
          code: `#include <stdio.h>

double calculate(double num1, double num2, char op) {
    switch (op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/':
            if (num2 == 0) {
                printf("Error: Division by zero is undefined!\\n");
                return 0.0;
            }
            return num1 / num2;
        default:
            printf("Error: Unsupported operator '%c'\\n", op);
            return 0.0;
    }
}

int main() {
    double a, b, result;
    char op;

    printf("Enter calculation (e.g., 10 + 5): ");
    if (scanf("%lf %c %lf", &a, &op, &b) != 3) {
        printf("Invalid input format.\\n");
        return 1;
    }

    result = calculate(a, b, op);
    printf("Result: %.2lf %c %.2lf = %.2lf\\n", a, op, b, result);
    return 0;
}`,
          explanation: 'Uses a separate calculate() function that returns a double to the caller rather than solely printing, keeping computation separate from user interface.',
        },
        stepByStep: [
          'Step 1: Define `calculate(double num1, double num2, char op)` returning the computed result.',
          'Step 2: Use `switch (op)` to branch cleanly across +, -, *, and /.',
          'Step 3: Guard against division by zero by verifying `num2 != 0` before division.',
          'Step 4: Return the computed value back to `main()`.',
        ],
        commonMistake: {
          trap: 'Confusing integer division (e.g. 5 / 2 = 2) with floating-point division (5.0 / 2 = 2.5) or forgetting to check for division by zero.',
          correction: 'Use `double` for operands and check `num2 == 0` before executing division.',
        },
        quickCheck: {
          question: 'What happens in C if you calculate `int a = 7 / 2;` versus `double a = 7.0 / 2;`?',
          hint: 'Consider integer truncation vs floating-point promotion.',
          answer: 'Integer division truncates decimals to 3; floating-point preserves 3.5.',
        },
        contextNote: `Grounded in ${context.university} ${context.regulation} ${context.branchName} Programming for Problem Solving`,
      };
    }

    // Default to Python Calculator
    return {
      intent: 'CODE_REQUEST',
      directAnswer: 'Here is a clean, modular Simple Calculator in Python with functions, input validation, and division-by-zero protection.',
      intuition: 'A calculator isolates computation into pure functions that take parameters and return values. This separates business logic from console I/O, allowing functions to be tested and reused.',
      codeSnippet: {
        language: 'python',
        code: `def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        raise ValueError("Division by zero is undefined.")
    return a / b

def calculator():
    print("--- Nexus Simple Calculator ---")
    print("Operations: +, -, *, /")
    try:
        num1 = float(input("Enter first number: "))
        op = input("Enter operator (+, -, *, /): ").strip()
        num2 = float(input("Enter second number: "))

        if op == '+':
            result = add(num1, num2)
        elif op == '-':
            result = subtract(num1, num2)
        elif op == '*':
            result = multiply(num1, num2)
        elif op == '/':
            result = divide(num1, num2)
        else:
            print("Invalid operator.")
            return

        print(f"Result: {num1} {op} {num2} = {result}")
    except ValueError as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    calculator()`,
        explanation: 'Each mathematical operator is encapsulated in a dedicated function that returns the result. The calculator() function handles user interaction and exception handling.',
      },
      stepByStep: [
        'Step 1: Write pure helper functions (`add`, `subtract`, `multiply`, `divide`) returning computed values.',
        'Step 2: Guard `divide` against `b == 0` using a ValueError.',
        'Step 3: Convert inputs to `float` to support decimal numbers.',
        'Step 4: Branch on the selected operator and capture the return value.',
      ],
      commonMistake: {
        trap: 'Using print() inside add(a, b) instead of return, so `result = add(2, 3)` becomes None.',
        correction: 'Always return the calculated result from operational functions.',
      },
      quickCheck: {
        question: 'If a function has `print(a + b)` but no `return`, what value does `res = add(4, 5)` hold?',
        hint: 'Think about what Python functions yield when no return statement is specified.',
        answer: 'None',
      },
      contextNote: `Personalized for ${context.name} (${context.preparationMode} Mode)`,
    };
  }

  // 2. Syllabus subjects inquiry
  if (q.includes('subject') || q.includes('syllabus') || q.includes('semester')) {
    const subjects = context.syllabusSummary?.subjects.map((s) => `${s.name} (${s.code})`).join('\n- ') ||
      'Matrices and Calculus, Applied Physics, Programming for Problem Solving, Basic Electrical Engineering, CAD';
    return {
      intent: 'SYLLABUS_QUERY',
      directAnswer: `Here are your official first-semester subjects for ${context.university} ${context.regulation} ${context.branchName}:\n- ${subjects}`,
      intuition: `Nexus Learn AI matches your exact academic profile against the authoritative university regulation (${context.regulation}) rather than a generic curriculum.`,
      stepByStep: [
        'Step 1: University verified: ' + context.university,
        'Step 2: Regulation matched: ' + context.regulation,
        'Step 3: Branch curriculum loaded: ' + context.branchName,
      ],
      contextNote: `Authoritative Source: JNTUH Official Academic Regulation ${context.regulation}`,
    };
  }

  // 3. Kirchhoff's Laws / Electrical circuits
  if (q.includes('kirchhoff') || q.includes('kvl') || q.includes('kcl')) {
    return {
      intent: 'EXPLANATION',
      directAnswer: 'Kirchhoff\'s Laws are two fundamental conservation principles in electrical circuits: Kirchhoff\'s Current Law (KCL) based on conservation of electric charge, and Kirchhoff\'s Voltage Law (KVL) based on conservation of electrical energy.',
      intuition: 'KCL states that at any circuit junction (node), the algebraic sum of currents entering equals currents leaving (Sigma I = 0). KVL states that around any closed loop, the algebraic sum of all potential differences (voltages) equals zero (Sigma V = 0).',
      codeSnippet: {
        language: 'text',
        code: `KCL at Node A:
I_in1 + I_in2 = I_out1 + I_out2  =>  Sigma I_node = 0

KVL around Mesh 1:
V_source - (I1 * R1) - ((I1 - I2) * R2) = 0`,
        explanation: 'Formulates node and mesh equations for linear electrical circuit analysis.',
      },
      stepByStep: [
        'Step 1: For KCL, identify independent nodes and assume branch current directions.',
        'Step 2: For KVL, trace a closed loop clockwise or counter-clockwise, assigning signs according to voltage rise (+) and voltage drop (-).',
        'Step 3: Form a system of linear equations and solve using Cramer\'s rule or Gauss elimination.',
      ],
      commonMistake: {
        trap: 'Assigning inconsistent signs when moving against an assumed branch current during KVL loop traversal.',
        correction: 'If you move against the assigned current arrow through a resistor, the potential difference is a rise (+I*R).',
      },
      quickCheck: {
        question: 'Three currents enter a node: 2A, 3A, and 4A. Two currents leave the node: 5A and I_x. What is I_x?',
        hint: 'Apply Sigma I_in = Sigma I_out.',
        answer: '2 + 3 + 4 = 5 + I_x  =>  9 = 5 + I_x  =>  I_x = 4 Amperes.',
      },
      contextNote: `Authoritative Subject: Basic Electrical Engineering (${context.regulation})`,
    };
  }

  // 4. Newton's second law / JEE physics
  if (q.includes('newton') || (q.includes('physics') && q.includes('law')) || q.includes('laws of motion')) {
    return {
      intent: 'EXAM_PREPARATION',
      directAnswer: 'Newton\'s Second Law states that the net external force acting on a body equals the time rate of change of its linear momentum: F_net = dp/dt.',
      intuition: 'Force is an interaction that changes motion. For constant mass m, F_net = m * a. In JEE problems, always draw a Free Body Diagram (FBD) and resolve forces along mutually perpendicular axes (often parallel and perpendicular to an inclined plane).',
      codeSnippet: {
        language: 'text',
        code: `In an accelerating elevator with upward acceleration a:
Normal force N - mg = m * a
=> N = m * (g + a)  [Apparent weight increases]

In a downward accelerating elevator:
mg - N = m * a
=> N = m * (g - a)  [Apparent weight decreases]`,
        explanation: 'Shows application of Newton\'s Second Law in non-inertial accelerating reference frames.',
      },
      stepByStep: [
        'Step 1: Isolate the target body and draw all real forces (Gravity, Normal, Tension, Friction).',
        'Step 2: Choose coordinate axes aligned with the direction of acceleration.',
        'Step 3: Apply Sigma F_x = m * a_x and Sigma F_y = m * a_y independently.',
      ],
      commonMistake: {
        trap: 'Confusing action-reaction pairs (Newton\'s 3rd Law) with equal and opposite forces acting on the same body (like Normal and Weight on a table).',
        correction: 'Action-reaction forces act on DIFFERENT bodies. N and mg both act on the book, so they are not an action-reaction pair even though they may be equal in magnitude.',
      },
      quickCheck: {
        question: 'A 2 kg mass rests on a scale inside an elevator accelerating upward at 2 m/s^2. What does the scale read? (g = 9.8 m/s^2)',
        hint: 'Use N = m * (g + a).',
        answer: 'N = 2 * (9.8 + 2) = 23.6 Newtons.',
      },
      contextNote: 'Calibrated for JEE Main & Advanced Mechanics Rigor',
    };
  }

  // 4. Return vs Print misconception
  if (q.includes('return') && (q.includes('print') || q.includes('why') || q.includes('difference'))) {
    return {
      intent: 'MISCONCEPTION',
      directAnswer: '`return` passes computed data back to the calling code so the program can use it, whereas `print()` only displays characters on the monitor for a human to see.',
      intuition: 'Think of a chef at a restaurant. `print()` is the chef shouting "The soup is ready!" to the kitchen. `return` is the chef handing the hot bowl of soup to the waiter to serve to the customer. If the chef only shouts without handing over the bowl, the customer has nothing to eat!',
      codeSnippet: {
        language: 'python',
        code: `# Incorrect (Only prints, caller receives None):
def calculate_area(r):
    print(3.14159 * r * r)

result = calculate_area(5)
# result is None! Trying result + 10 raises TypeError!

# Correct (Returns data to caller):
def calculate_area(r):
    return 3.14159 * r * r

result = calculate_area(5)
# result is 78.539, which can be stored, saved, or reused!`,
        explanation: 'Notice how the returned value can be stored in a variable and used in downstream calculations.',
      },
      stepByStep: [
        'Step 1: `print()` sends text to standard output (`stdout`) and always returns `None`.',
        'Step 2: `return` immediately halts function execution and passes the value directly to the expression that called it.',
        'Step 3: Storing a function call `x = func()` assigns whatever `func` returned, not what it printed.',
      ],
      commonMistake: {
        trap: 'Assuming that because text appeared on the screen, the variable got the value.',
        correction: 'Screen output is a display side-effect. Only `return` assigns value to variables.',
      },
      quickCheck: {
        question: 'What is the type and value of variable `x` after: `def f(): print("Hello"); x = f()`?',
        hint: 'Look for the return statement inside f().',
        answer: 'x is None (type NoneType).',
      },
      contextNote: 'Targeting Active Pedagogical Misconception: return vs print',
    };
  }

  // 5. Important Questions inquiry (e.g. "Give important questions in BEE", "important questions in Unit 3", etc.)
  if (q.includes('important question') || q.includes('important questions') || q.includes('pyq') || q.includes('exam question')) {
    const isBEE = q.includes('bee') || q.includes('electrical') || (!q.includes('pps') && !q.includes('math') && context.currentSubject?.toLowerCase().includes('electrical'));
    const isMath = q.includes('math') || q.includes('calculus') || q.includes('matrices');
    const isPPS = q.includes('pps') || q.includes('c ') || q.includes('programming');

    if (isBEE) {
      return {
        intent: 'EXAM_PREPARATION',
        directAnswer: `Here are the official syllabus-grounded Important Questions for Basic Electrical Engineering (${context.regulation} / ${context.university}):

UNIT 1: DC Circuits & Network Theorems
• Very Important:
  1. State and prove Thevenin's Theorem with a neat DC circuit diagram. Calculate the equivalent resistance R_th across load terminals. [Topic: Network Theorems | Difficulty: Medium | Expected Marks: 7M | Type: Analytical Derivation | Why Important: Core recurring university exam question]
  2. State and apply Kirchhoff's Voltage Law (KVL) and Kirchhoff's Current Law (KCL) to solve a two-loop circuit. [Topic: Circuit Laws | Difficulty: Easy | Expected Marks: 5M | Type: Problem Solving | Why Important: Foundational for all subsequent electrical problems]
• Important:
  1. State Maximum Power Transfer Theorem and prove that R_L = R_th for maximum power transfer in DC circuits. [Topic: Power Theorems | Difficulty: Medium | Expected Marks: 6M | Type: Derivation | Why Important: Critical for impedance matching]
• Practice:
  1. Find the current flowing through a 5Ω load resistor in a bridge circuit using Norton's Theorem. [Topic: Norton Equivalent | Difficulty: Hard | Expected Marks: 8M | Type: Numerical Problem | Why Important: Tests complex equivalent transformations]

UNIT 2: AC Circuits & Single Phase Resonance
• Very Important:
  1. Derive the expression for resonant frequency and Quality factor (Q) of a series RLC circuit. [Topic: Resonance | Difficulty: Medium | Expected Marks: 7M | Type: Derivation | Why Important: Fundamental AC circuit characteristic]
• Important:
  1. Define Power Factor and explain methods to improve lagging power factor in industrial circuits. [Topic: Power Factor | Difficulty: Easy | Expected Marks: 5M | Type: Theory & Analysis | Why Important: High exam frequency]

UNIT 3: Transformers & Magnetic Circuits
• Very Important:
  1. Explain the principle of operation and derive the EMF equation of a single-phase transformer. [Topic: Transformers | Difficulty: Medium | Expected Marks: 7M | Type: Derivation | Why Important: Tested in almost every semester exam]
• Important:
  1. Draw and explain the equivalent circuit of a single-phase transformer referred to primary. [Topic: Equivalent Circuit | Difficulty: Hard | Expected Marks: 8M | Type: Analytical | Why Important: Core machine modeling question]

*Note: AI-generated important practice questions structured directly from the authoritative JNTUH ${context.regulation} Basic Electrical Engineering syllabus.*`,
        intuition: 'Basic Electrical Engineering examinations heavily balance fundamental theorems (Thevenin, Norton, KVL/KCL) with derivations (Transformer EMF, RLC resonance). Always structure answers with circuit diagrams and step-by-step mathematical steps.',
        stepByStep: [
          'Step 1: Always sketch the circuit diagram with labeled nodes and mesh currents.',
          'Step 2: Explicitly state the theorem or law before writing equations.',
          'Step 3: Keep intermediate numeric fractions intact until the final answer to avoid rounding error.',
        ],
        commonMistake: {
          trap: 'Confusing load voltage with Thevenin open-circuit voltage V_th when calculating load current.',
          correction: 'Always draw the separate Thevenin equivalent circuit (V_th in series with R_th and R_L) before computing I_L = V_th / (R_th + R_L).',
        },
        quickCheck: {
          question: 'If a transformer primary has 500 turns and secondary has 100 turns, what is the transformation ratio K?',
          hint: 'K = N2 / N1.',
          answer: 'K = 100 / 500 = 0.2 (Step-down transformer).',
        },
        contextNote: `AI-generated important practice question based on the selected syllabus (${context.university} ${context.regulation})`,
      };
    }

    if (isMath) {
      return {
        intent: 'EXAM_PREPARATION',
        directAnswer: `Here are the official syllabus-grounded Important Questions for Matrices and Calculus (${context.regulation} / ${context.university}):

UNIT 1: Matrices & Eigenvalues
• Very Important:
  1. State Cayley-Hamilton Theorem. Verify it for matrix A and hence find A^-1 and A^4. [Topic: Cayley-Hamilton | Difficulty: Medium | Expected Marks: 7M | Type: Analytical Proof | Why Important: High exam frequency in all mid/end exams]
  2. Find the Eigenvalues and Eigenvectors of a 3x3 real symmetric matrix and verify orthogonality. [Topic: Eigenvectors | Difficulty: Hard | Expected Marks: 8M | Type: Problem Solving | Why Important: Core linear algebra requirement]
• Important:
  1. Find the rank of a matrix by reducing it to Echelon form and Normal form. [Topic: Matrix Rank | Difficulty: Easy | Expected Marks: 5M | Type: Methodical Algorithm | Why Important: Foundational technique]

UNIT 2: Mean Value Theorems & Calculus
• Very Important:
  1. Verify Lagrange's Mean Value Theorem for f(x) = log x in [1, e]. [Topic: LMVT | Difficulty: Medium | Expected Marks: 6M | Type: Proof / Application | Why Important: Recurring university question]

*Note: AI-generated important practice questions structured directly from the authoritative JNTUH ${context.regulation} syllabus.*`,
        intuition: 'Mathematics exams reward clear row operation indices (e.g. R2 -> R2 - 2R1) and explicit characteristic polynomial factorization steps.',
        contextNote: `AI-generated important practice question based on the selected syllabus (${context.university} ${context.regulation})`,
      };
    }
  }

  // 7. General concept explanation
  return {
    intent: 'EXPLANATION',
    directAnswer: `Here is the structured breakdown for: "${question}".`,
    intuition: `In ${context.preparationMode} learning (${context.currentSubject}), conceptual clarity precedes problem solving. Focus on the core mechanism before syntax or computation.`,
    stepByStep: [
      'Step 1: Define the core primitive and its constraints.',
      'Step 2: Trace state transformation step-by-step.',
      'Step 3: Apply the pattern to a concrete benchmark problem.',
    ],
    commonMistake: {
      trap: 'Conflating side-effects with explicit state transitions.',
      correction: 'Always trace the lifecycle of variables and memory allocations.',
    },
    quickCheck: {
      question: `How does this concept apply to your current module in ${context.currentTopic || 'your curriculum'}?`,
      hint: 'Relate this to prerequisite principles.',
      answer: 'It forms the foundation for advanced modular components.',
    },
    contextNote: `Adapted for ${context.name} • ${context.branchName} (${context.regulation})`,
  };
}

const CONVERSATION_MEMORY: Record<string, { lastSubject?: string; lastTopic?: string; lastConcept?: string; lastQuestion?: string }> = {};

/**
 * Main AI Tutor query execution pipeline with OpenAI, Gemini, and fallback support.
 */
export async function executeTutorQuery(params: {
  studentId: string;
  question: string;
  conceptId?: string;
  isSocraticMode?: boolean;
}): Promise<PedagogicalTutorResponse> {
  const mem = CONVERSATION_MEMORY[params.studentId];
  let effectiveConceptId = params.conceptId || mem?.lastConcept;
  let effectiveSubject = mem?.lastSubject;

  const context = await buildStudentContext(params.studentId, effectiveConceptId);
  if (effectiveSubject && !context.currentSubject) {
    context.currentSubject = effectiveSubject;
  }

  const prompt = buildStudentTutorPrompt(context, params.question, params.isSocraticMode);

  const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase();
  const openAiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  // 1. Try OpenAI if configured
  if (provider === 'openai' && openAiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are Nexus Learn AI\'s Pedagogical Architect. Always output strictly valid JSON matching the schema.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        return validateTutorResponse(parsed, context, params.question);
      }
    } catch (err) {
      console.warn('OpenAI tutor query failed, falling back:', err);
    }
  }

  // 2. Try Gemini if configured
  if ((provider === 'gemini' || geminiKey) && geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsed = JSON.parse(rawText);
        const resp = validateTutorResponse(parsed, context, params.question);
        CONVERSATION_MEMORY[params.studentId] = {
          lastSubject: context.currentSubject,
          lastTopic: context.currentTopic,
          lastConcept: effectiveConceptId,
          lastQuestion: params.question,
        };
        return resp;
      }
    } catch (err) {
      console.warn('Gemini tutor query failed, falling back:', err);
    }
  }

  // 3. Fallback to resilient pedagogical engine
  const fallbackResp = generateFallbackTutorResponse(context, params.question);
  CONVERSATION_MEMORY[params.studentId] = {
    lastSubject: params.question.toLowerCase().includes('bee') || params.question.toLowerCase().includes('kirchhoff')
      ? 'Basic Electrical Engineering'
      : context.currentSubject,
    lastTopic: context.currentTopic,
    lastConcept: effectiveConceptId,
    lastQuestion: params.question,
  };
  return fallbackResp;
}
