# Nexus Learn AI

> **"Your learning path should know you."**

Nexus Learn AI is a commercial-grade, full-stack adaptive EdTech platform built to solve the **Personalized Learning Path Optimizer** problem statement.

Rather than diagnosing student performance with superficial scores ("Python is weak"), Nexus Learn AI continuously models what a student knows, does not know, misunderstands, and how confident they are.

---

## 🌟 Key Features

### 1. Dynamic Metacognitive Calibration & DKT
- **Multi-Signal Mastery Modeling**: Blends Bayesian knowledge tracing, attempt frequency, difficulty weighting, and time spent.
- **The 4 Quadrants of Metacognition**:
  1. *Overconfident (Misconception Risk)*: High confidence + low accuracy. Triggers targeted intervention.
  2. *Underconfident*: Low confidence + high accuracy. Provides reinforcement and affirmation.
  3. *Strong Mastery*: High confidence + high accuracy. Unlocks downstream nodes.
  4. *Foundational Gap*: Low confidence + low accuracy. Initiates first-principles instruction.

### 2. Proactive Misconception Detection Engine
- Target Case Study: Detects specific confusion between `return` values and `print()` side-effects in Python functions.
- Provides immediate explanation, contrasting code examples, targeted practice questions, and prerequisite updates.

### 3. Topological Prerequisite DAG Graph
- Enforces strict prerequisite mastery thresholds.
- Dynamic gating prevents learners from getting lost in advanced concepts before cementing dependencies.

### 4. Real YouTube Data API v3 Integration
- Calls YouTube `search.list` exclusively from backend routes (`/api/youtube/search`).
- Aggressive server-side database caching (7-day TTL) prevents quota exhaustion (default 100 queries/day).
- Automatic high-quality educational fallback library if API quota is exceeded or keys are pending.

### 5. Multi-Provider AI Abstraction
- Supports **OpenAI** (`gpt-4o-mini`), **Google Gemini** (`gemini-1.5-flash`), and an embedded **Local Pedagogical Engine**.
- Diagnoses student conceptual queries, explanations, and generates custom dynamic curriculums.

### 6. Domain-Specific Learning Modes
- **Python Software Engineering Track**: From Syntax to Functions, Parameters, Return Values, Scope, and Recursion.
- **JEE Preparation Mode**: Physics (Kinematics, Newton's 3rd Law pseudo-forces, rotational torque).
- **Engineering / B.Tech Mode**: Operating Systems (Processes, Deadlocks, Banker's Algorithm, Virtual Memory Paging).
- **Career Exploration**: Career competency mapping for AI Engineers, Full-Stack Architects, and Systems Engineers.
- **Syllabus Intelligence**: Dynamic milestone and checkpoint curriculum generator.

---

## 🛠 Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Next.js API Routes with session handling and Zod validation.
- **Authentication**: Bcrypt password hashing, JWT signed session tokens stored in secure, HTTP-only cookies.
- **Database & ORM**: PostgreSQL with Prisma ORM schema (`prisma/schema.prisma`) and unified persistent ACID adapter for zero-setup local resilience.
- **UI Design System**: Light theme commercial palette (#F8FAFC background, #FFFFFF cards, #2563EB primary, #4F46E5 secondary, #14B8A6 accent, #16A34A success, #0F172A text).

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone <repo-url>
cd Nexus-Learn-AI
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nexus_learn_ai?schema=public"
AUTH_SECRET="nexus_learn_ai_prod_secret_token_auth_892716381267812"

AI_PROVIDER="openai" # or "gemini"
OPENAI_API_KEY="your-openai-api-key"
GEMINI_API_KEY="your-gemini-api-key"

YOUTUBE_API_KEY="your-youtube-data-api-v3-key"
YOUTUBE_REGION_CODE="IN"
YOUTUBE_RELEVANCE_LANGUAGE="en"
```

### 3. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Instant Demo Credentials

For quick evaluation, use the pre-configured credentials or click the **1-Click Demo Login** button:
- **Email**: `nikhil@nexuslearn.ai`
- **Password**: `password123`

### 5. Running the Test Suite

```bash
npm test
```

Executes test coverage across:
- Overconfident mistake dampening & misconception risk escalation
- Calibrated correct answer rewards & mastery status transitions
- Prerequisite DAG gating & blocker checks
- Metacognitive 4-quadrant calibration classification

---

## 📂 Project Structure

```
├── .data/                  # Persistent database store
├── prisma/
│   └── schema.prisma       # Complete PostgreSQL Prisma schema
├── src/
│   ├── app/                # App Router (Pages & API routes)
│   │   ├── (auth)/         # Login, Signup, Forgot, Reset Password
│   │   ├── analytics/      # Metacognitive 4-Quadrant Matrix & Metrics
│   │   ├── career/         # Career Exploration & Competencies
│   │   ├── dashboard/      # Master Student Dashboard
│   │   ├── engineering/    # B.Tech Engineering & OS Track
│   │   ├── jee/            # JEE Main & Advanced Prep Track
│   │   ├── learn/          # Interactive 12-Step Adaptive Loop
│   │   ├── misconceptions/ # Misconception Engine Management Center
│   │   ├── profile/        # Student Profile & Preferences
│   │   ├── roadmap/        # Prerequisite DAG Visualizer
│   │   └── syllabus/       # Syllabus Intelligence & Curriculum Generator
│   ├── components/         # Navbar, Footer, Recharts components
│   ├── data/               # Curriculums, Tracks & Diagnostic Questions
│   ├── lib/
│   │   ├── adaptive/       # Adaptive Engine, Mastery & Calibration
│   │   ├── ai/             # AI Provider Abstraction (OpenAI, Gemini, Local)
│   │   ├── auth.ts         # JWT & Bcrypt Authentication
│   │   ├── db.ts           # Unified Persistent Database Layer
│   │   └── youtube/        # Cached YouTube Data API v3 Client
│   └── types/              # Comprehensive TypeScript interfaces
└── tests/
    └── engine.test.ts      # Multi-scenario regression test suite
```
