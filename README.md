# AI Interview Agent â€” "Build the interviewer, not the interview."

[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-interview-agent-opal.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.0-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An adaptive, state-driven technical interview platform built for the **ABTalks 31-Day AI Engineering Cohort**. The system dynamically evaluates candidates based on their completed cohort missions, live interview responses, and historical gapsâ€”replacing rigid static questionnaires with evidence-grounded technical dialogue.

---

## 1. Overview

**AI Interview Agent** addresses **Problem Statement 2: The Interview Agent**.

In traditional technical hiring and cohort assessment, candidates are evaluated using static, one-size-fits-all question sets. These questionnaires fail to reflect a candidate's specific background, past failures, or live reasoning capabilities.

This project shifts the paradigm: **"Build the interviewer, not the interview."**

Instead of hardcoding a sequence of questions, the AI Interview Agent maintains an active **Interview State Machine** that synthesizes three context layers:
1. **Candidate History**: Completed, skipped, and failed curriculum missions from the 31-day cohort.
2. **Curriculum Grounding**: A 31-day enterprise AI engineering curriculum covering RAG, vector databases, MCP, function calling, and production observability.
3. **Live Answer Evidence**: Per-turn scoring of technical correctness, depth, reasoning, and practicality.

The system dynamically selects topics, adjusts difficulty across six progression levels, probes weak areas, prevents duplicate questions, and generates structured, evidence-grounded feedback reports upon interview completion.

---

## 2. Live Demo

- **Live Web Application**: [https://ai-interview-agent-opal.vercel.app/](https://ai-interview-agent-opal.vercel.app/)
- **GitHub Repository**: [https://github.com/gauranshi1707/ai-interview-agent](https://github.com/gauranshi1707/ai-interview-agent)

---

## 3. Problem Statement

Learners in AI engineering cohorts often complete complex practical missionsâ€”such as building RAG pipelines, fine-tuning models, or configuring vector indexersâ€”yet struggle to articulate their architectural decisions during live technical interviews.

### The Challenge
- **Static Questionnaires**: Traditional platforms ask the same questions regardless of whether a candidate is a junior developer with skipped topics or a senior data engineer with 31 completed missions.
- **Unstructured Evaluation**: Human interviewers often rely on subjective impressions rather than systematic evidence logs.
- **Superficial Feedback**: Generic AI SaaS platforms generate generic praise ("Great job!") rather than identifying specific technical gaps and actionable learning paths.

### The Solution
A personalized, curriculum-grounded AI interviewer that conducts a 8+ turn technical conversation, adjusts difficulty dynamically, handles "I don't know" responses without loop deadlocks, and compiles an evidence-backed assessment.

---

## 4. Solution Architecture & Context Layers

The core engine evaluates candidate responses across three distinct context layers before generating each turn:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                    CONTEXT LAYERS                       â”‚
â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
â”‚  1. Candidate History   (Missions: Done / Skip / Fail)  â”‚
â”‚  2. Curriculum Map      (31-Day AI Engineering Topics)  â”‚
â”‚  3. Live Answer Log     (Per-turn Evidence & Scores)    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                             â–¼
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚  Adaptive Decision Engine   â”‚
              â”‚  - Selects Topic            â”‚
              â”‚  - Adjusts Difficulty       â”‚
              â”‚  - Checks Duplicate Rules   â”‚
              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                             â”‚
                             â–¼
              â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
              â”‚ Next Technical Question /   â”‚
              â”‚ Structured Final Feedback   â”‚
              â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Candidate History Layer**: Reads completed, skipped, and failed mission IDs to prioritize unverified or previously failed topics.
2. **Curriculum Grounding Layer**: Ensures questions map strictly to validated cohort competencies (e.g. HyDE, HNSW indexes, MCP server architecture, prompt injection defense).
3. **Live Answer Evidence Layer**: Tracks candidate performance turn-by-turn to scale difficulty or shift focus if the candidate struggles.

---

## 5. Key Features

- **Candidate Personalization**: Maps interview strategy to candidate YOE, role, and cohort mission record (e.g., Sarah 1 YOE vs Marcus 5 YOE vs David 10 YOE).
- **Adaptive Difficulty Progression**: Dynamically shifts across 6 difficulty tiers: `fundamentals` â†’ `application` â†’ `debugging` â†’ `architecture` â†’ `tradeoffs` â†’ `production`.
- **Context-Aware Follow-Ups**: Probes technical details based on observations from previous turns.
- **Evidence-Based Evaluation**: Scores candidate answers across four dimensions: correctness, depth, practicality, and reasoning.
- **Strict "I Don't Know" Handling**: Recognizes explicit non-answers ("idk", "not sure", "skip"), sets scores to `0.0`, shifts competency, and logs technical gaps without looping.
- **Concise Technical Answer Support**: Evaluates concise but technically accurate responses based on core concept presence, preventing false failures.
- **Duplicate Question Filtering**: Uses word-set overlap similarity (intersection / union > 60% on words longer than 4 characters) to filter rephrased or repeated questions.
- **Topic Rotation Control**: Limits consecutive questions on the same competency to 2 turns (`consecutiveTopicCount >= 2`) to ensure broad curriculum coverage.
- **Completion Threshold Enforcement**: Guarantees a minimum of **8 questions** and **4 distinct curriculum days** before allowing session termination.
- **Structured Final Feedback**: Generates structured JSON feedback with `summary`, `strengths`, `gaps`, and `next` recommendations.
- **Deterministic Fallback Engine**: Fully functional in demo mode without an `OPENAI_API_KEY`, using a deterministic question bank and fallback evaluator.
- **Warm Editorial UI & Theme Toggle**: Styled with a warm ivory/charcoal palette, serif typography, and a zero-flash light/dark theme toggle.

---

## 6. How the Interview Works

```
  Candidate Selection (Roster Grid)
                 â”‚
                 â–¼
      POST /api/interview (Init)
                 â”‚
                 â–¼
     generateInterviewPlan()
                 â”‚
                 â–¼
    generateNextQuestion() â”€â”€â–º Q1 Generated
                                  â”‚
                                  â–¼
                        Candidate Input Response
                                  â”‚
                                  â–¼
                       POST /api/interview (Turn)
                                  â”‚
                                  â–¼
                         evaluateAnswer()
                                  â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
                 â–¼                                 â–¼
       Record Answer Evidence             Update Skill State &
       (Correctness, Depth, etc.)         Adapt Difficulty Tiers
                 â”‚                                 â”‚
                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                  â”‚
                                  â–¼
                    Check Threshold Criteria
                    (Questions >= 8 & Days >= 4)
                                  â”‚
                 â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
            No   â”‚                                 â”‚   Yes
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜                                 â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â–¼                                                               â–¼
generateNextQuestion()                                generateInterviewFeedback()
  â”‚                                                               â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–º [ Loop Back ]                             â–¼
                                                        Render Final Assessment
```

---

## 7. Adaptive Interview Engine

The state engine manages an in-memory session object (`InterviewState`) per candidate session:

```typescript
interface InterviewState {
  sessionId: string;
  candidate: Candidate;
  interviewPlan: string;
  messages: { role: 'interviewer' | 'candidate'; content: string }[];
  currentQuestion: string | null;
  askedQuestions: string[];
  questionCount: number;
  curriculumDaysCovered: number[];
  competenciesCovered: string[];
  currentCompetency: string | null;
  skillState: Record<string, SkillCompetencyState>;
  evidences: AnswerEvidence[];
  observations: string[];
  difficulty: 'fundamentals' | 'application' | 'debugging' | 'architecture' | 'tradeoffs' | 'production';
  consecutiveTopicCount: number;
  done: boolean;
  feedback: InterviewFeedback | null;
}
```

The engine prevents static script behavior by evaluating `consecutiveTopicCount` and `difficulty` state after every turn:
- If a candidate answers 2 consecutive questions on the same topic, the engine forces a topic switch.
- If the evaluator signals ``increase_difficulty`` for a strong answer, or ``decrease_difficulty`` for a weak one, the engine advances or retreats one step along the progression ladder.

---

## 8. Adaptivity & Difficulty Progression

The interview engine advances through six explicit difficulty levels:

| Tier | Level Name | Target Knowledge & Scenario |
|---|---|---|
| **1** | `fundamentals` | Basic concepts, definitions, component roles (e.g., embeddings vs vectors). |
| **2** | `application` | Practical usage, API integrations, tool calling end-to-end. |
| **3** | `debugging` | Troubleshooting latency, hallucination detection, index accuracy loss. |
| **4** | `architecture` | System design, multi-agent decomposition, state orchestration. |
| **5** | `tradeoffs` | Evaluating cost vs latency vs accuracy (e.g. HNSW indexing, reranking). |
| **6** | `production` | Rate limiting, observability metrics, prompt injection defense. |

Candidate experience level initializes the starting difficulty:
- **< 2 YOE**: Starts at `fundamentals`
- **2â€“4 YOE**: Starts at `application`
- **5â€“8 YOE**: Starts at `debugging`
- **9+ YOE**: Starts at `architecture`

---

## 9. Candidate Personalization

Candidate profiles directly dictate topic selection and initial planning:

```json
{
  "id": "cand-001",
  "name": "Sarah",
  "role": "Junior AI Engineer",
  "yearsOfExperience": 1,
  "education": "B.S. Computer Science",
  "completedMissions": [1, 2, 3, 4, 5, 6, 7, 8, 9],
  "failedMissions": [10, 11, 15],
  "skippedMissions": [12, 13, 14]
}
```

- **Topic Prioritization**: The engine prioritizes candidate **failed missions** (Day 10 RAG, Day 11 Advanced RAG) and **skipped missions** (Day 12 Function Calling) before testing general completed topics.
- **Customized Strategy**: Sarah (1 YOE) begins with core RAG failure modes, whereas David (10 YOE, 31 completed missions) is immediately challenged with multi-agent orchestration and MCP security.

---

## 10. Follow-Up & Context Handling

The system retains past turns to build contextually coherent follow-up questions:

### Context Adaptation Example
> **Turn 1 (Interviewer)**: *"Walk me through a RAG pipeline. At what points can it fail, and how would you detect each failure mode?"*
> 
> **Candidate Answer**: *"We perform chunking, store vector embeddings in ChromaDB, retrieve using cosine similarity, and send retrieved context to the LLM."*
> 
> **Evaluation**: Correctness = `1.0`, Depth = `0.6` (concise technical response). Topic: `Retrieval Augmented Generation (RAG)`.
> 
> **Turn 2 (Follow-up Question)**: *"A user complains the chatbot is hallucinating despite retrieval being active. What would you check first?"*

---

## 11. Evaluation System

Answer evaluation parses candidate input across four weighted dimensions:

1. **Correctness (0.0 - 1.0)**: Technical accuracy of concepts mentioned.
2. **Depth (0.0 - 1.0)**: Thoroughness of explanation and detail.
3. **Practicality (0.0 - 1.0)**: Mentions of production tools, implementation verbs (`deploy`, `index`, `query`).
4. **Reasoning (0.0 - 1.0)**: Presence of architectural justification (`because`, `tradeoff`, `compared`).

### Scoring Criteria
- **"I Don't Know" / IDK**: `correctness = 0.0`, `depth = 0.0`, `isDontKnow = true`. Mapped directly to gaps.
- **Concise Technical Answers**: High correctness (`>= 0.7`) combined with 2+ matched technical terms guarantees classification as a demonstrated strength, avoiding false failures.
- **Non-Technical Fillers**: Long responses containing zero technical terms are assigned `correctness = 0.1` and flagged as weak.

---

## 12. Deterministic Fallback Mode

When `OPENAI_API_KEY` is not present in the environment (Demo Mode), the application seamlessly switches to `fallback.ts`:

- **Question Bank**: 12 curated curriculum questions covering RAG, MCP, function calling, agents, observability, and vector indexing.
- **Rule-Based Evaluator**: Evaluates technical keyword matches, term densities, connector words, and IDK patterns.
- **Session Continuity**: Maintains exact multi-turn state, threshold checks, topic rotation, and structured JSON feedback generation.
- **No External Dependency**: Guarantees the application runs reliably in zero-config demo environments.

---

## 13. LLM Architecture

When an `OPENAI_API_KEY` is configured, the system invokes specialized modular LLM prompts:

| Module | File | Responsibility | Output Format |
|---|---|---|---|
| **Planner** | `planner.ts` | Generates candidate-specific interview strategy | Text string |
| **Question Generator** | `question-generator.ts` | Synthesizes contextual technical question based on difficulty & history | JSON (`{ question, competency, day }`) |
| **Evaluator** | `evaluator.ts` | Grades technical response across 4 scoring axes & observations | JSON (`EvaluationResult`) |
| **Feedback** | `feedback.ts` | Compiles final assessment summary, strengths, gaps, and recommendations | JSON (`InterviewFeedback`) |
| **LLM Client** | `llm.ts` | Manages OpenAI API calls (`gpt-4o-mini`) with JSON mode support | String / JSON |

*Security*: All API requests and credentials remain strictly server-side inside Next.js Route Handlers.

---

## 14. Architecture Diagram

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                          NEXT.JS FRONTEND                              â”‚
â”‚   Landing Roster  â”€â”€â–º  Interview Console  â”€â”€â–º  Assessment Report UI    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                   â”‚
                         POST /api/interview
                                   â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                           API ROUTE HANDLER                            â”‚
â”‚                 (Session Validation & Error Handling)                  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                   â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                       ADAPTIVE INTERVIEW ENGINE                        â”‚
â”‚                                                                        â”‚
â”‚   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”   â”‚
â”‚   â”‚   planner.ts     â”‚   â”‚ question-gen.ts  â”‚   â”‚   evaluator.ts   â”‚   â”‚
â”‚   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â””â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜   â”‚
â”‚            â”‚                      â”‚                      â”‚             â”‚
â”‚            â–¼                      â–¼                      â–¼             â”‚
â”‚    [Strategy Plan]        [Next Question]        [Answer Evidence]     â”‚
â”‚                                                                        â”‚
â”‚   â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€   â”‚
â”‚                         state.ts (Session Store)                       â”‚
â”‚     - Asked Questions    - Competencies Covered   - Skill Tiers        â”‚
â”‚     - Evidence Logs      - Difficulty State       - Topic Counts       â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                   â”‚
                     (If OPENAI_API_KEY Unset)
                                   â”‚
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚                      DETERMINISTIC FALLBACK BANK                       â”‚
â”‚       - Curated Questions   - Keyword Evaluator   - Rule Feedback      â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

---

## 15. API Specification (`POST /api/interview`)

### 1. Initialization Request
**Endpoint**: `POST /api/interview`

```json
{
  "sessionId": "session-cand-001-9f2b1a8c",
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

**Response (`200 OK`)**:
```json
{
  "reply": "Walk me through a RAG pipeline. At what points can it fail, and how would you detect each failure mode?",
  "done": false,
  "meta": {
    "questionCount": 1,
    "curriculumDaysCovered": [10],
    "competenciesCovered": ["Retrieval Augmented Generation (RAG)"],
    "currentCompetency": "Retrieval Augmented Generation (RAG)",
    "difficulty": "fundamentals"
  }
}
```

---

### 2. Subsequent Turn Request
**Endpoint**: `POST /api/interview`

```json
{
  "sessionId": "session-cand-001-9f2b1a8c",
  "message": "We chunk documents, convert them to vector embeddings using OpenAI models, index in ChromaDB, retrieve using cosine similarity, and pass context to the LLM."
}
```

**Response (`200 OK`)**:
```json
{
  "reply": "A user complains the chatbot is hallucinating despite retrieval being active. What would you check first?",
  "done": false,
  "meta": {
    "questionCount": 2,
    "curriculumDaysCovered": [10],
    "competenciesCovered": ["Retrieval Augmented Generation (RAG)"],
    "currentCompetency": "Retrieval Augmented Generation (RAG)",
    "difficulty": "application"
  }
}
```

---

### 3. Final Turn Response (Completion)
When `questionCount >= 8` and `curriculumDaysCovered.length >= 4`:

**Response (`200 OK`)**:
```json
{
  "reply": "Interview completed.",
  "done": true,
  "feedback": {
    "summary": "Sarah demonstrated solid understanding in some areas (Retrieval Augmented Generation (RAG), Evaluation Metrics), but did not demonstrate knowledge in other assessed topics during this interview.",
    "strengths": [
      "Demonstrated understanding of Retrieval Augmented Generation (RAG).",
      "Demonstrated understanding of Evaluation Metrics."
    ],
    "gaps": [
      "Did not demonstrate understanding of Function Calling during this interview."
    ],
    "next": [
      "Practice building hands-on function calling and multi-agent workflows."
    ]
  },
  "meta": {
    "questionCount": 8,
    "curriculumDaysCovered": [10, 11, 12, 20, 23, 26, 28, 7],
    "competenciesCovered": ["RAG", "Advanced RAG", "Function Calling", "Evaluation Metrics", "Security", "Observability", "Readiness", "Embeddings"],
    "currentCompetency": "Embeddings",
    "difficulty": "application"
  }
}
```

---

## 16. Problem Statement Compliance Matrix

| Requirement | Implementation Details | Status |
|---|---|---|
| **1. Conversational Technical Interview** | Interactive turn-by-turn dialogue via Next.js API & custom UI | âœ… PASS |
| **2. Candidate Mission Assessment** | Personalizes interview based on completed, skipped, and failed days | âœ… PASS |
| **3. Natural Adaptation** | Dynamic difficulty scaling across 6 tiers based on live scoring | âœ… PASS |
| **4. Intelligent Follow-ups** | Probes deeper into technical nuances when candidate provides partial answers | âœ… PASS |
| **5. Maintain Context** | Preserves full turn history and skill state in `__sessionStore` | âœ… PASS |
| **6. Minimum 8 Questions** | Enforced by `MIN_QUESTIONS = 8` in `engine.ts` | âœ… PASS |
| **7. Minimum 4 Curriculum Days** | Enforced by `MIN_CURRICULUM_DAYS = 4` in `engine.ts` | âœ… PASS |
| **8. Structured Final Feedback** | JSON schema with `summary`, `strengths`, `gaps`, `next` | âœ… PASS |
| **9. POST /api/interview** | Fully implemented route handling init, turns, errors, and completion | âœ… PASS |
| **10. Session State via sessionId** | State stored and retrieved per `sessionId` key | âœ… PASS |
| **11. No Authentication Required** | Direct API access route with validation checks | âœ… PASS |
| **12. Deterministic Fallback Mode** | Complete zero-dependency execution when API key is missing | âœ… PASS |

---

## 17. Tech Stack

- **Framework**: [Next.js 16.3.0](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript 5.0](https://www.typescriptlang.org/)
- **UI Library**: [React 19.2.8](https://react.dev/)
- **Styling**: [Tailwind CSS v4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [OpenAI API](https://platform.openai.com/) (`gpt-4o-mini`)
- **Deployment**: [Vercel Platform](https://vercel.com/)

---

## 18. Project Structure

```
ai-interview-agent/
â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ candidates.json           # Cohort candidate roster profiles
â”‚   â””â”€â”€ curriculum.json           # 31-Day AI Engineering curriculum map
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ app/
â”‚   â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”‚   â””â”€â”€ interview/
â”‚   â”‚   â”‚       â””â”€â”€ route.ts      # POST /api/interview API Handler
â”‚   â”‚   â”œâ”€â”€ interview/
â”‚   â”‚   â”‚   â””â”€â”€ [sessionId]/
â”‚   â”‚   â”‚       â””â”€â”€ page.tsx      # Active Interview Route Page
â”‚   â”‚   â”œâ”€â”€ globals.css           # Global theme variables & typography
â”‚   â”‚   â”œâ”€â”€ layout.tsx            # Root layout with theme script injection
â”‚   â”‚   â””â”€â”€ page.tsx              # Landing Candidate Selection Roster
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ InterviewConsole.tsx  # Interview workspace & feedback report UI
â”‚   â”‚   â””â”€â”€ ThemeToggle.tsx       # Light/Dark mode toggle component
â”‚   â””â”€â”€ lib/
â”‚       â””â”€â”€ interview/
â”‚           â”œâ”€â”€ candidates.ts     # Candidate dataset loader
â”‚           â”œâ”€â”€ curriculum.ts     # Curriculum dataset loader
â”‚           â”œâ”€â”€ engine.ts         # Main state machine engine
â”‚           â”œâ”€â”€ evaluator.ts      # Multi-axis answer evaluator
â”‚           â”œâ”€â”€ fallback.ts       # Deterministic demo engine & bank
â”‚           â”œâ”€â”€ feedback.ts       # Evidence-backed feedback generator
â”‚           â”œâ”€â”€ llm.ts            # OpenAI client wrapper
â”‚           â”œâ”€â”€ planner.ts        # Strategy plan generator
â”‚           â”œâ”€â”€ question-generator.ts # Contextual question generator
â”‚           â”œâ”€â”€ state.ts          # In-memory session store
â”‚           â””â”€â”€ types.ts          # TypeScript interfaces
â”œâ”€â”€ .env.example                  # Environment configuration template
â”œâ”€â”€ next.config.ts                # Next.js configuration
â”œâ”€â”€ package.json                  # Dependencies & build scripts
â”œâ”€â”€ PROMPTS.md                    # Detailed AI prompts & engineering log
â””â”€â”€ README.md                     # Project documentation
```

---

## 19. Local Setup

### 1. Clone & Install
```bash
git clone https://github.com/gauranshi1707/ai-interview-agent.git
cd ai-interview-agent
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```
*Note*: If `OPENAI_API_KEY` is omitted, the application automatically runs in **Deterministic Fallback Demo Mode**.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 20. Testing & Validation

The repository has been validated against all static checks and API requirements:

```bash
# 1. Type Safety Check
npx tsc --noEmit

# 2. Code Quality & Formatting
npm run lint

# 3. Production Build Validation
npm run build
```

- **TypeScript**: 0 compilation errors.
- **ESLint**: 0 errors, 0 warnings.
- **Production Build**: Successful static page generation and dynamic route compilation.

---

## 21. UI / UX Design

The user interface was designed with a **Warm Editorial & Assessment Workspace** visual identity:
- **Ivory & Charcoal Palette**: Warm off-white background (`#F7F4EC`), deep charcoal text (`#171A18`), forest green accents (`#245C49`), and muted gold highlights (`#B88632`).
- **Typography Hierarchy**: Playfair Display serif for primary hero titles and question indices, paired with Inter for body text and JetBrains Mono for system metadata.
- **No Cluttered Cards**: Statistics are presented as inline typography (`18 completed Â· 7 skipped Â· 2 failed`) without large colored boxes.
- **Zero-Flash Theme Toggle**: Smoothly transitions between Light and Dark mode, persisting preference in `localStorage`.

---

## 22. AI-Assisted Development

This project was designed and built iteratively using **Antigravity (Google DeepMind)** AI pairing. AI assistance was utilized across:
- **System Architecture**: Designing the 3-layer context model and state machine threshold logic.
- **Engine Implementation**: Developing duplicate question detection algorithms and evaluation metrics.
- **Fallback Engineering**: Building a robust, deterministic evaluation bank for zero-config execution.
- **UI Design System**: Refining editorial layout compositions and custom theme tokens.

*Detailed logs of AI system prompts, architectural decisions, and iteration histories are documented in [`PROMPTS.md`](./PROMPTS.md).*

---

## 23. Final Status

Final validation completed successfully and the project is ready for submission to the **ABTalks Vibe Code Hackathon**.

