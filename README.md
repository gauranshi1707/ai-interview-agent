# AI Interview Agent — "Build the interviewer, not the interview."

An adaptive AI Interview Agent built for the ABTalks 31-Day Enterprise AI Engineering Cohort.

Rather than running a static script of fixed questions, this agent uses a **state-driven adaptive interview engine** that combines candidate background, curriculum targets, and live interview responses to generate personalized, context-aware follow-up questions.

---

## 🌟 Key Features

1. **Candidate Personalisation**: Uses cohort history (completed, skipped, and failed missions, attempt counts, and experience level) to form a tailored strategy.
2. **State-Driven Adaptive Engine**: Tracks 3 layers of context (Candidate History, Curriculum Grounding, Live Evidence) to adjust difficulty and select competencies dynamically.
3. **Graceful Handling of Weak & "I don't know" Answers**: Detects lack of demonstrated knowledge and pivots gracefully to another angle or competency without looping.
4. **Duplicate Question & Loop Prevention**: Employs semantic overlap checks (Jaccard similarity + exact match filters) and consecutive topic limits.
5. **Robust Demo Fallback Mode**: Functions deterministically without an LLM API key, satisfying all state tracking, multi-turn, and feedback requirements.
6. **Strict API Contract**: Fulfills `POST /api/interview` exactly as defined in `technical-spec.md`.

---

## 🏗️ Application Architecture

```
Candidate Profile + Cohort Data
              │
              ▼
   [ Interview Planner ]
              │
              ▼
    [ Question Generator ]
              │
              ▼
       Candidate Answer
              │
              ▼
    [ Answer Evaluator ] ──► Updates Candidate Skill State
              │
              ▼
 [ Adaptive Decision Engine ]
 (Difficulty / Competency / Topic Limit check)
              │
              ▼
     [ Final Feedback ]
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/gauranshisrivastava1/ai-interview-agent.git
cd ai-interview-agent

# Install dependencies
npm install

# (Optional) Set up OpenAI API Key for real LLM mode
cp .env.example .env.local
# Add your OPENAI_API_KEY to .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

If `OPENAI_API_KEY` is omitted, the application automatically operates in **Demo Fallback Mode**.

---

## 🔌 API Contract

### `POST /api/interview`

#### 1. Initial Request (Start Interview)
```json
{
  "sessionId": "session-cand-001-abc",
  "candidate": {
    "id": "cand-001",
    "name": "Sarah",
    "role": "Junior AI Engineer",
    "yearsOfExperience": 1,
    "education": "B.S. Computer Science",
    "completedMissions": [1, 2, 3, 4, 5, 6, 7, 8, 9],
    "failedMissions": [10, 11, 15],
    "skippedMissions": [12, 13, 14],
    "attempts": { "10": 3 },
    "commitDays": 14,
    "missionsCompleted": 9,
    "firstTryPerformance": 0.6
  }
}
```

Response:
```json
{
  "reply": "Welcome. Let's begin your interview.",
  "done": false
}
```

#### 2. Subsequent Turn (Candidate Answer)
```json
{
  "sessionId": "session-cand-001-abc",
  "message": "Embeddings convert text into high-dimensional vector representations that capture semantic meaning."
}
```

Response:
```json
{
  "reply": "Your embeddings look good, but retrieval precision is poor. How would you diagnose the problem?",
  "done": false
}
```

#### 3. Completion Response
```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Demonstrated strong foundational knowledge across retrieval and RAG...",
    "strengths": ["Clear explanation of vector embeddings", "Understood RAG grounding"],
    "gaps": ["Shallow explanation of production observability"],
    "next": ["Practice retrieval evaluation", "Study LLM monitoring frameworks"]
  }
}
```

---

## 🧪 Testing & Verification

```bash
# Type check
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build
```
