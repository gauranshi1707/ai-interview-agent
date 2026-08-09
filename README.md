# AI Interview Agent — "Build the interviewer, not the interview."

An adaptive AI Interview Agent built for the **ABTalks 31-Day Enterprise AI Engineering Cohort — Problem Statement 2**.

Rather than running a static script of fixed questions, this agent uses a **state-driven adaptive interview engine** that combines candidate background, cohort history, curriculum targets, and live interview responses to generate personalized, context-aware technical interviews.

The goal is to make the experience resemble a **real technical interview rather than a scripted questionnaire**. The candidate's previous answers influence evaluation, difficulty, competency selection, follow-up questions, and final feedback.

---

## 🌐 Live Demo

**Live Application:**  
https://ai-interview-agent-opal.vercel.app/

**GitHub Repository:**  
https://github.com/gauranshi1707/ai-interview-agent

---

# 🎯 Problem Statement

The ABTalks AI Cohort is a **31-day enterprise AI engineering program** covering modern AI topics including:

- Retrieval-Augmented Generation (RAG)
- Vector Databases
- Prompt Engineering
- Agentic AI
- Model Context Protocol (MCP)
- AI Deployment
- Production AI Systems

After completing the cohort, learners should be able to confidently explain the systems they built and the engineering decisions behind them.

However, preparing for technical interviews and effectively communicating this knowledge remains one of the biggest challenges.

A candidate may have completed a mission successfully but still struggle to explain:

- Why a particular architecture was selected
- How a system behaves in production
- What tradeoffs were involved
- How failures would be diagnosed
- How different system components interact
- How the system could be improved

This project addresses that gap by converting the candidate's **learning journey into an adaptive technical interview**.

Instead of following a fixed sequence of questions, the system continuously uses candidate history, curriculum grounding, and live interview evidence to decide what should happen next.

---

# 🌟 Key Features

## 1. Candidate Personalisation

The interview is grounded in the candidate's cohort history rather than treating every candidate identically.

The system can use:

- Completed missions
- Failed missions
- Skipped missions
- Attempt counts
- Mission completion history
- First-try performance
- Commit-day activity
- Years of experience
- Candidate role
- Education

This allows the interview strategy to reflect the candidate's actual learning journey.

For example, failed or skipped missions can influence which competencies receive greater attention during the interview.

---

## 2. State-Driven Adaptive Interview Engine

The core of the application is a state-driven interview engine.

Instead of treating every request independently, the system maintains interview state across turns.

The state tracks information including:

- `skillState`
- `observations`
- `askedQuestions`
- `curriculumDaysCovered`
- `competenciesCovered`
- `consecutiveTopicCount`
- `difficulty`
- Answer evidence
- Current competency
- Interview messages

This allows later questions to be informed by everything that has already happened during the interview.

---

# 🧠 Three-Layer Context Model

The interview engine combines three major sources of context.

### Layer 1 — Candidate History

- Completed Missions
- Failed Missions
- Skipped Missions
- Attempts
- Learning Signals
- Experience Level

This represents what the candidate has already learned and where they may have struggled.

### Layer 2 — Curriculum Grounding

- Modules
- Curriculum Days
- Topics
- Learning Objectives
- Tools

This ensures that interview questions remain grounded in the supplied cohort curriculum.

### Layer 3 — Live Interview Evidence

- Previous Answers
- Evaluation Scores
- Observed Strengths
- Identified Gaps
- Current Competency
- Difficulty
- Previously Asked Questions

This represents what the candidate is actually demonstrating during the current interview.

Together:

```text
Candidate History
        +
Curriculum Grounding
        +
Live Interview Evidence
        |
        v
Adaptive Interview State
        |
        v
Next Question
```

---

# 🏗️ Application Architecture

```text
+----------------------------+
| Candidate Profile          |
| + Cohort Data              |
+-------------+--------------+
              |
              v
+----------------------------+
| Interview Planner          |
+-------------+--------------+
              |
              v
+----------------------------+
| Question Generator         |
+-------------+--------------+
              |
              v
+----------------------------+
| Candidate Answer           |
+-------------+--------------+
              |
              v
+----------------------------+
| Answer Evaluator           |
+-------------+--------------+
              |
              v
+----------------------------+
| Adaptive Decision Engine   |
|                            |
| - Difficulty               |
| - Competency               |
| - Evidence                 |
| - Topic Coverage           |
| - Duplicate Checks         |
+-------------+--------------+
              |
        +-----+------+
        |            |
        v            v
+---------------+  +----------------+
| Next Question |  | Final Feedback |
+---------------+  +----------------+
```

---

# 🤖 LLM + Deterministic Fallback Architecture

The application supports both an LLM-powered reasoning path and a deterministic fallback path.

```text
                 Interview Request
                        |
                        v
                +---------------+
                | Interview      |
                | Engine         |
                +-------+-------+
                        |
                 +------+------+
                 |             |
                 v             v
          LLM Available    No API Key
                 |             |
                 v             v
          LLM Reasoning   Deterministic
          + Evaluation    Fallback
                 |             |
                 +------+------+
                        |
                        v
                  Shared State
                        |
                        v
                  Next Question
                        |
                        v
                  Final Feedback
```

This architecture ensures that the core interview experience does not completely depend on external model availability.

---

# 🧠 LLM Mode

When an LLM API key is configured, the application uses dedicated modules for different reasoning responsibilities:

- Interview planning
- Question generation
- Answer evaluation
- Feedback generation

Relevant modules include:

```text
src/lib/interview/
├── planner.ts
├── evaluator.ts
├── question-generator.ts
├── feedback.ts
└── llm.ts
```

The LLM layer is separated from the core interview state so that reasoning, evaluation, question generation, and state management remain distinct responsibilities.

API credentials are kept server-side.

---

# 🛟 Deterministic Demo Fallback

The application remains functional even when no LLM API key is available.

If the LLM provider is unavailable, the system automatically falls back to deterministic interview logic.

The fallback supports:

- Interview initialization
- Question generation
- Multi-turn state
- Curriculum coverage
- Candidate-aware topic selection
- Answer evaluation
- "I don't know" detection
- Duplicate prevention
- Topic rotation
- Difficulty state
- Final feedback

This provides a reliable demonstration path even when external model access is unavailable.

The fallback mode is particularly important for hackathon judging because the core interview flow can still be demonstrated without requiring an external API key.

---

# 🎤 Adaptive Interviewing

The system is designed around a simple principle:

> **The next question should depend on what the candidate has already demonstrated.**

Question selection can take into account:

- Candidate experience
- Completed missions
- Failed missions
- Skipped missions
- Current competency
- Previous answers
- Answer evidence
- Existing knowledge gaps
- Current difficulty
- Previously assessed topics
- Curriculum coverage
- Consecutive topic limits

The interview can move through different levels of technical depth:

```text
Fundamentals
      |
      v
Application
      |
      v
Debugging
      |
      v
Architecture
      |
      v
Tradeoffs
      |
      v
Production
```

The actual progression depends on the candidate's demonstrated performance and evaluator signals.

---

# 🔄 Context-Aware Follow-Up Questions

The agent maintains context across interview turns.

For example:

### Candidate

> Embeddings convert text into high-dimensional vector representations that capture semantic meaning.

Instead of simply asking another definition question, the interviewer can move toward application:

### Interviewer

> Your embeddings look good, but retrieval precision is poor. How would you diagnose the problem?

This allows the interview to progress from:

```text
Definition
    |
    v
Understanding
    |
    v
Application
    |
    v
Debugging
    |
    v
Architecture
    |
    v
Tradeoffs
```

when appropriate.

The objective is to create a technical conversation rather than a list of disconnected questions.

---

# 🧩 Handling Weak Answers & "I Don't Know"

The system explicitly detects responses such as:

- `I don't know`
- `idk`
- `no idea`
- `not sure`

These responses are not treated as evidence of technical understanding.

Instead:

```text
Candidate Answer
       |
       v
"I don't know"
       |
       v
No Demonstrated Knowledge
       |
       v
Evidence Recorded
       |
       v
Competency Updated
       |
       v
Interview Moves Forward
```

This prevents the evaluator from generating false strengths simply because a candidate mentioned a few technical terms elsewhere.

It also prevents the interview from becoming stuck repeatedly probing a topic the candidate has already failed to demonstrate.

---

# 📊 Evidence-Based Evaluation

The evaluator does not rely solely on whether a response contains a keyword.

The interview tracks evidence associated with candidate responses.

Evaluation considers signals such as:

- Technical correctness
- Depth
- Practical understanding
- Reasoning
- Demonstrated technical terminology
- Explicit lack of knowledge

The system distinguishes between different response types.

### Strong Technical Answer

```text
Technically correct
        +
Sufficient evidence
        +
Relevant explanation
        |
        v
Demonstrated Strength
```

### Concise but Technically Correct Answer

```text
Technically correct
        +
Short explanation
        |
        v
Can still receive appropriate credit
```

### Weak Answer

```text
Limited evidence
        +
Incorrect or unsupported explanation
        |
        v
Knowledge Gap
```

### Explicit IDK

```text
"I don't know"
        |
        v
No Demonstrated Knowledge
```

---

# 🐛 Evaluation Edge Case & Fix

During final QA, a specific issue was identified in the deterministic evaluator.

A candidate could provide a concise but technically correct answer containing strong technical evidence, while the combined depth, practicality, and reasoning score was low enough to fall below the original strength threshold.

This created a scoring dead zone:

```text
Too strong to be a gap
        but
Too weak to be a strength
```

The result could incorrectly become:

```json
{
  "strengths": [],
  "gaps": []
}
```

with an inappropriate failure summary.

The fallback evaluator was subsequently updated to:

- Better recognize technically strong concise answers
- Expand relevant technical terminology
- Eliminate the scoring dead zone
- Preserve strict "I don't know" handling
- Keep final summaries consistent with collected evidence

The scenario was re-tested with:

- Strong candidates
- Mixed candidates
- Concise technical candidates
- All-IDK candidates

The previously failing concise-answer scenario was successfully resolved.

---

# 🔁 Duplicate Question & Loop Prevention

The system maintains previously asked questions and uses multiple mechanisms to prevent repetition.

These include:

- Exact question matching
- Question normalization
- Word-set overlap similarity
- Intersection / union similarity threshold
- Consecutive-topic limits
- Curriculum coverage tracking

The word-set comparison helps identify questions that are effectively duplicates even when they have been slightly rephrased.

This helps prevent scenarios such as:

```text
Question
   |
   v
Weak Answer
   |
   v
Same Question
   |
   v
Same Question Rephrased
   |
   v
Same Topic Repeated Indefinitely
```

Instead, the engine can rotate toward another relevant competency while maintaining the minimum curriculum coverage requirement.

---

# 📈 Adaptive Difficulty

The interview maintains an internal difficulty state.

The progression ladder contains:

```text
fundamentals
application
debugging
architecture
tradeoffs
production
```

The evaluator provides a recommendation to increase, decrease, or maintain the current difficulty.

The engine then adjusts the difficulty state while respecting the overall interview strategy and curriculum coverage.

Strong performance can lead to deeper questions.

Weaker evidence can cause the interview to remain at an appropriate level or move to another competency instead of repeatedly forcing the candidate into questions they cannot answer.

---

# ⏱️ Interview Completion Requirements

The interview engine explicitly enforces the core challenge constraints.

The interview must:

- Ask at least **8 questions**
- Cover at least **4 different curriculum days**

The state tracks:

- `questionCount`
- `curriculumDaysCovered`

Completion is only allowed once the required interview coverage has been achieved.

This prevents an interview from accidentally terminating after only a few turns.

---

# 📝 Structured Final Feedback

At the end of the interview, the system produces structured feedback containing:

### Summary

An overall assessment of the candidate's demonstrated technical capability.

### Strengths

Competencies where sufficient evidence was demonstrated.

### Gaps

Competencies where sufficient understanding was not demonstrated.

### Next Steps

Actionable preparation areas based on the observed gaps.

Example:

```json
{
  "summary": "Demonstrated strong foundational knowledge across retrieval and RAG.",
  "strengths": [
    "Clear explanation of vector embeddings",
    "Understood RAG grounding"
  ],
  "gaps": [
    "Shallow explanation of production observability"
  ],
  "next": [
    "Practice retrieval evaluation",
    "Study LLM monitoring frameworks"
  ]
}
```

---

# 📋 Problem Statement Alignment

| Requirement | Implementation |
|---|---|
| Conversational technical interview | Multi-turn interview through `POST /api/interview` |
| Assess candidate understanding | Evidence-based answer evaluation |
| Assess completed missions | Candidate history + mission state |
| Personalized interview | Candidate profile + cohort history |
| Adaptive questioning | Dynamic difficulty and competency state |
| Intelligent follow-ups | Previous answers + observations + evidence |
| Maintain context | Server-side interview session state |
| Minimum 8 questions | Completion guard |
| Minimum 4 curriculum days | Curriculum coverage guard |
| Structured feedback | Summary + strengths + gaps + next |
| Required HTTP endpoint | `POST /api/interview` |
| Session state | `sessionId` |
| No authentication required | Public interview flow |
| LLM flexibility | LLM modules + deterministic fallback |
| Synthetic data support | Supplied curriculum and candidate datasets |

---

# 🔌 API Contract

The application exposes the required endpoint:

```text
POST /api/interview
```

## 1. Initial Request — Start Interview

### Request

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
    "attempts": {
      "10": 3
    },
    "commitDays": 14,
    "missionsCompleted": 9,
    "firstTryPerformance": 0.6
  }
}
```

### Response

```json
{
  "reply": "Welcome. Let's begin your interview.",
  "done": false
}
```

---

## 2. Subsequent Turn — Candidate Answer

### Request

```json
{
  "sessionId": "session-cand-001-abc",
  "message": "Embeddings convert text into high-dimensional vector representations that capture semantic meaning."
}
```

### Response

```json
{
  "reply": "Your embeddings look good, but retrieval precision is poor. How would you diagnose the problem?",
  "done": false
}
```

The `sessionId` associates the response with the existing interview state.

---

## 3. Completion Response

```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Demonstrated strong foundational knowledge across retrieval and RAG.",
    "strengths": [
      "Clear explanation of vector embeddings",
      "Understood RAG grounding"
    ],
    "gaps": [
      "Shallow explanation of production observability"
    ],
    "next": [
      "Practice retrieval evaluation",
      "Study LLM monitoring frameworks"
    ]
  }
}
```

---

## 4. API Validation

The API validates request and session state.

### Missing Session ID

```json
{
  "error": "Missing or invalid sessionId"
}
```

### Missing Candidate During Initialization

```json
{
  "error": "No active session for this sessionId. Provide a candidate to initialize."
}
```

### Missing Message on an Active Session

```json
{
  "error": "Provide a message for ongoing sessions"
}
```

### Already Completed Session

```json
{
  "reply": "This interview session has already been completed.",
  "done": true
}
```

---

# 🧪 Testing & Verification

The project was validated using:

```bash
# Type check
npx tsc --noEmit

# Linting
npm run lint

# Production build
npm run build
```

The final QA process additionally tested:

- API initialization
- Sequential interview turns
- Multiple turns using the same `sessionId`
- Missing `sessionId`
- Missing candidate
- Missing message
- Empty messages
- Whitespace-only messages
- Completed sessions
- Strong technical answers
- Mixed technical answers
- Concise technical answers
- Weak answers
- "I don't know" answers
- All-IDK interviews
- Multiple candidate profiles
- Adaptive difficulty
- Curriculum coverage
- Duplicate-question prevention
- Context preservation
- Fallback mode without an API key
- Final structured feedback
- Frontend integration
- Theme switching
- Repository state

---

# 🧪 Candidate Simulation Results

The fallback engine was tested using different synthetic candidate behaviors.

## Junior / Mixed Candidate

The candidate provided a mixture of technically correct answers and explicit `"I don't know"` responses.

Expected behavior:

- Demonstrated competencies become strengths
- Unsupported areas become gaps
- IDK answers do not create false strengths
- The interview continues instead of looping

## Mid-Level / Strong Candidate

The candidate consistently provided technically relevant answers.

Expected behavior:

- Strong evidence across assessed competencies
- Increasing difficulty
- Multiple strengths
- Few or no gaps

## Senior / Concise Technical Candidate

The candidate provided technically correct but concise answers.

This scenario was specifically important because the initial evaluator could under-score concise answers.

After the evaluation fix:

- Technically correct concise answers receive appropriate credit
- Strengths are populated correctly
- False failure summaries are avoided
- No false strengths are introduced for IDK answers

## All-IDK Candidate

A candidate responding with `"I don't know"` throughout the interview is expected to produce:

```text
Strengths: []
Gaps: multiple assessed competencies
```

with a final summary indicating that the candidate did not demonstrate sufficient technical knowledge.

This behavior was explicitly tested after the evaluator changes.

---

# 🧪 Final QA Results

| Area | Result |
|---|---|
| TypeScript | ✅ PASS |
| ESLint | ✅ PASS |
| Production Build | ✅ PASS |
| API Contract | ✅ PASS |
| Multi-turn Interview | ✅ PASS |
| Candidate Personalization | ✅ PASS |
| Adaptive Difficulty | ✅ PASS |
| Context Preservation | ✅ PASS |
| Follow-up Questions | ✅ PASS |
| 8 Question Minimum | ✅ PASS |
| 4 Curriculum Day Minimum | ✅ PASS |
| IDK Handling | ✅ PASS |
| Concise Answer Evaluation | ✅ PASS |
| Duplicate Prevention | ✅ PASS |
| Fallback Mode | ✅ PASS |
| Structured Feedback | ✅ PASS |
| Frontend Integration | ✅ PASS |
| Theme Toggle | ✅ PASS |
| Security Checks | ✅ PASS |
| Repository State | ✅ CLEAN |

No critical or high-priority issues remained after the final audit.

The only non-blocking observation from the final API audit was that malformed JSON sent directly to the API can result in an HTTP 500 response from the route's JSON parsing path. This does not affect the normal application flow or the stated minimum requirements.

---

# 🗂️ Project Structure

```text
ai-interview-agent/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── interview/
│   │   │       └── route.ts
│   │   │
│   │   ├── interview/
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── InterviewConsole.tsx
│   │   └── ThemeToggle.tsx
│   │
│   └── lib/
│       └── interview/
│           ├── engine.ts
│           ├── evaluator.ts
│           ├── fallback.ts
│           ├── feedback.ts
│           ├── llm.ts
│           ├── planner.ts
│           ├── question-generator.ts
│           └── state.ts
│
├── public/
├── curriculum.json
├── candidates.json
├── technical-spec.md
├── PROMPTS.md
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

---

# 🎨 Frontend & Design

The frontend is designed as a **technical assessment console rather than a generic chatbot**.

The interface includes:

- Candidate selection
- Candidate context
- Interview track
- Current competency
- Interview progress
- Interviewer questions
- Candidate response area
- Final assessment
- Demonstrated strengths
- Knowledge gaps
- Recommended next steps
- Theme toggle

The visual system was deliberately refined away from a generic AI dashboard aesthetic.

The final design uses:

- Warm neutral surfaces
- Deep forest green accents
- Muted brass/gold details
- Thin borders
- Minimal shadows
- Restrained semantic colors
- Clear typography hierarchy
- Subtle geometric elements
- Consistent spacing and component proportions

The application also supports a light/dark theme toggle without changing the underlying interview logic.

---

# 🔐 Security & Configuration

API credentials are intended to remain server-side.

The LLM configuration is controlled through environment variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

The value shown above is only a placeholder.

**No real API key is included in this repository or README.**

If `OPENAI_API_KEY` is omitted, the application automatically operates in deterministic Demo Fallback Mode.

The candidate and curriculum data supplied for the hackathon are synthetic.

---

# 📱 Scope & Out of Scope

The following were intentionally kept outside the scope of this implementation:

- Voice interaction
- User authentication
- Persistent user accounts
- Long-term conversation history
- Mobile applications

The implementation focuses specifically on the adaptive technical interview-agent problem described in the challenge.

---

# 🚀 Quick Start & Local Setup

## Prerequisites

- Node.js 18+
- npm

## Clone the Repository

```bash
git clone https://github.com/gauranshi1707/ai-interview-agent.git
cd ai-interview-agent
```

## Install Dependencies

```bash
npm install
```

## Optional — Configure LLM Mode

Copy the environment template:

```bash
cp .env.example .env.local
```

Then add your own API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

If no API key is configured, the application automatically uses deterministic fallback mode.

## Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏭 Production Build

Before deployment, the project can be validated with:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

The production build was successfully validated during the final QA process.

The deployed application is hosted on Vercel.

---

# 🤖 AI-Assisted Development

The project was developed through an iterative AI-assisted workflow involving:

- Architecture planning
- Code generation
- Refactoring
- Debugging
- LLM integration
- Fallback-engine development
- Evaluation design
- UI development
- Visual refinement
- Testing
- QA
- Bug diagnosis and resolution

AI tools were used as development assistants rather than as a single-shot code-generation pipeline.

The development process evolved through:

```text
Architecture Planning
        |
        v
Interview State
        |
        v
Adaptive Engine
        |
        v
Deterministic Fallback
        |
        v
LLM Integration
        |
        v
Technical Console
        |
        v
Assessment System
        |
        v
Visual Redesign
        |
        v
Theme Support
        |
        v
QA Audit
        |
        v
Evaluation Bug Fix
        |
        v
Final Verification
```

A detailed record of the major AI-assisted prompts and development phases is available in:

```text
PROMPTS.md
```

---

# 📜 Development History

Major implementation milestones included:

1. Initial interview-agent foundation
2. Candidate and curriculum data layer
3. Interview session engine
4. Adaptive interview engine
5. Deterministic fallback engine
6. LLM reasoning integration
7. Technical interview console
8. Interview assessment and feedback
9. Evidence-based evaluation improvements
10. Visual redesign
11. Theme toggle
12. Fallback evaluation improvements
13. Comprehensive QA
14. Final Problem Statement verification

The repository history preserves these stages through Git commits.

---

# 📌 Requirement Checklist

## Interview

- ✅ Conversational technical interview
- ✅ Personalized candidate experience
- ✅ Multi-turn interaction
- ✅ Context preservation
- ✅ Intelligent follow-up questions
- ✅ Adaptive difficulty

## Curriculum & Candidate Data

- ✅ Candidate history integration
- ✅ Completed mission awareness
- ✅ Failed mission awareness
- ✅ Skipped mission awareness
- ✅ Curriculum grounding
- ✅ Curriculum day tracking

## Evaluation

- ✅ Evidence-based answer evaluation
- ✅ Weak-answer handling
- ✅ "I don't know" handling
- ✅ Concise technical-answer handling
- ✅ Strength detection
- ✅ Gap detection
- ✅ Actionable next steps

## Interview Constraints

- ✅ Minimum 8 questions
- ✅ Minimum 4 curriculum days
- ✅ Duplicate-question prevention
- ✅ Topic rotation
- ✅ Session-based state

## Reliability

- ✅ Deterministic fallback without API key
- ✅ API request validation
- ✅ Production build validation
- ✅ TypeScript validation
- ✅ ESLint validation
- ✅ Final end-to-end QA

## Interface

- ✅ Candidate selection
- ✅ Interview console
- ✅ Progress indicators
- ✅ Final assessment
- ✅ Theme toggle
- ✅ Responsive presentation

---

# 🔗 Links

### Live Demo

https://ai-interview-agent-opal.vercel.app/

### GitHub Repository

https://github.com/gauranshi1707/ai-interview-agent

### AI Usage Log

`PROMPTS.md`

---

# 🏁 Final Status

The application was subjected to a final pre-submission QA audit covering:

- Static validation
- Production build
- API contract
- Full interview flow
- Adaptivity
- Context preservation
- Follow-up behavior
- Candidate personalization
- Weak-answer handling
- IDK handling
- Concise technical-answer evaluation
- Duplicate prevention
- Fallback mode
- Structured feedback
- Frontend behavior
- Theme behavior
- Repository state

### Final Status

```text
Critical blockers: 0
High-priority issues: 0
Submission status: READY
```

---

## 📄 License

Built for the **ABTalks Vibe Code Hackathon — Problem Statement 2: The AI Interview Agent**.
