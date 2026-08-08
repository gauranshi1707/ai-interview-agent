# AI Usage Log & Development History

This log documents the authentic AI-assisted development workflow used during the ABTalks Vibe Code Hackathon rebuild for Problem Statement 2 (The AI Interview Agent).

---

## 🛠️ AI Tools Used

- **Claude 3.7 Sonnet / Gemini 3.6 Flash / Antigravity AI Assistant**: Core architecture design, code generation, refactoring, type checking, and bug fixes.
- **Git CLI & Next.js Tools**: Repository initialization and build verification.

---

## 📝 Major Development Prompts & Evolution

### Phase 1: Architecture Planning & Spec Alignment
- **Prompt:** *"Analyze technical-spec.md, curriculum.json, and candidates.json. Outline a clean server-side session state and an adaptive 3-layer context model (Candidate History + Curriculum Grounding + Live Evidence)."*
- **Outcome:** Formulated state interface containing `skillState`, `observations`, `askedQuestions`, `curriculumDaysCovered`, and `consecutiveTopicCount`.

### Phase 2: Engine & Fallback Implementation
- **Prompt:** *"Build a deterministic fallback engine that runs without an LLM API key. It must handle 'I don't know' responses, prevent duplicate questions via normalization and similarity scoring, track 8+ questions across 4+ curriculum days, and generate structured feedback."*
- **Outcome:** Implemented `fallback.ts` with a 12-question bank, Jaccard overlap similarity check, IDK pattern matching, and heuristic evaluations.

### Phase 3: AI Reasoning Integration
- **Prompt:** *"Create LLM modules for planner, evaluator, and question-generator using structured JSON output. Ensure API keys remain strictly server-side and fall back gracefully on API errors."*
- **Outcome:** Created `planner.ts`, `evaluator.ts`, `question-generator.ts`, `feedback.ts`, and `llm.ts`.

### Phase 4: Technical Console UI & Lint Hardening
- **Prompt:** *"Rebuild the frontend into a technical interview console with candidate header, progress indicators, responsive chat layout, and structured final feedback panel. Fix React hook purity and async route params for Next.js App Router."*
- **Outcome:** Built `src/components/InterviewConsole.tsx`, `src/app/page.tsx`, and `src/app/interview/[sessionId]/page.tsx` adhering to Next.js App Router conventions.
