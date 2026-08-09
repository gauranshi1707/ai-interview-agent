# AI Usage Log & Development History

This log documents the AI-assisted development workflow used during the ABTalks Vibe Code Hackathon rebuild for Problem Statement 2 (The AI Interview Agent).

The project was developed iteratively using AI-assisted planning, implementation, debugging, evaluation, and visual refinement. AI was used as a development assistant; project requirements, design decisions, testing, and final integration were reviewed throughout the process.

---

## 🛠️ AI Tools Used

- **Claude 3.7 Sonnet / Gemini 3.6 Flash / Antigravity AI Assistant**: Architecture design, code generation, refactoring, debugging, type checking, UI implementation, and visual refinement.
- **Git CLI**: Version control, commit management, branch management, and repository verification.
- **Next.js tooling**: Development server, linting, production builds, and route validation.

---

## 📝 Major Development Prompts & Evolution

### Phase 1: Architecture Planning & Spec Alignment

- **Prompt:** *"Analyze technical-spec.md, curriculum.json, and candidates.json. Outline a clean server-side session state and an adaptive 3-layer context model (Candidate History + Curriculum Grounding + Live Evidence)."*

- **Outcome:** Formulated the core interview state around:
  - `skillState`
  - `observations`
  - `askedQuestions`
  - `curriculumDaysCovered`
  - `consecutiveTopicCount`

This established the foundation for a state-driven adaptive interview rather than a static question-and-answer flow.

---

### Phase 2: Engine & Fallback Implementation

- **Prompt:** *"Build a deterministic fallback engine that runs without an LLM API key. It must handle 'I don't know' responses, prevent duplicate questions via normalization and similarity scoring, track 8+ questions across 4+ curriculum days, and generate structured feedback."*

- **Outcome:** Implemented the deterministic fallback engine in `fallback.ts`, including:
  - A 12-question fallback bank
  - Question normalization
  - Jaccard overlap similarity checking
  - Explicit "I don't know" pattern detection
  - Heuristic answer evaluation
  - Question progression and topic coverage tracking
  - Structured fallback feedback

This ensured that the interview remained functional even when an LLM provider was unavailable.

---

### Phase 3: AI Reasoning Integration

- **Prompt:** *"Create LLM modules for planner, evaluator, and question-generator using structured JSON output. Ensure API keys remain strictly server-side and fall back gracefully on API errors."*

- **Outcome:** Created the LLM reasoning modules:
  - `planner.ts`
  - `evaluator.ts`
  - `question-generator.ts`
  - `feedback.ts`
  - `llm.ts`

The LLM layer was separated from the deterministic interview engine so that planning, evaluation, question generation, and feedback could be handled independently while preserving the fallback path.

---

### Phase 4: Technical Console UI & Lint Hardening

- **Prompt:** *"Rebuild the frontend into a technical interview console with candidate header, progress indicators, responsive chat layout, and structured final feedback panel. Fix React hook purity and async route params for Next.js App Router."*

- **Outcome:** Built and refined:
  - `src/components/InterviewConsole.tsx`
  - `src/app/page.tsx`
  - `src/app/interview/[sessionId]/page.tsx`

The interface was structured around:
- Candidate context
- Interview progress
- Current competency/topic
- Interviewer questions
- Candidate responses
- Final evidence-based assessment

Next.js App Router conventions, React hook rules, and route parameter handling were also hardened during this phase.

---

### Phase 5: Visual Design Refinement

- **Prompt:** *"Keep the existing interview platform structure and functionality, but refine the visual language so it feels like a deliberate technical interview product rather than a generic AI-generated dashboard. Use a restrained editorial visual system with a warm off-white background, deep forest green, muted brass/gold accents, thin borders, minimal shadows, and clear typography. Do not change the application logic or interaction flow."*

- **Outcome:** Refined the visual system across the candidate-selection page, interview console, and assessment report.

Key design decisions included:
- Warm off-white primary background
- Deep forest green as the primary action/accent color
- Muted brass/gold for secondary emphasis
- Dark neutral text instead of excessive white-on-black contrast
- Thin borders instead of heavy card shadows
- Minimal decorative geometric elements
- More restrained use of semantic colors
- Consistent card proportions and spacing
- Editorial-style typography while preserving readability

The goal was to make the interface feel like a purpose-built assessment platform rather than a generic AI product template.

---

### Phase 6: Interview Console & Assessment Visual Consistency

- **Prompt:** *"Apply the same visual language to the live interview and final assessment screens. Preserve all existing interview logic, question progression, answer handling, evaluation, and routing. Only change presentation: colors, surfaces, borders, spacing, typography hierarchy, and component styling."*

- **Outcome:** Applied the visual system consistently to:
  - Live interview header
  - Interviewer question blocks
  - Candidate response blocks
  - Response input area
  - Overall assessment
  - Demonstrated strengths
  - Gaps
  - Recommended next steps

Semantic information remained intact while avoiding overly saturated red/green status cards and excessive colored surfaces.

---

### Phase 7: Theme Toggle & Hero Refinement

- **Prompt:** *"Add a lightweight theme toggle while preserving the existing visual design. Refine the hero heading hierarchy so 'Technical Interview' and 'Console' have stronger visual presence without changing the page structure or application logic. Keep the existing editorial design language and make the theme transition consistent across the application."*

- **Outcome:** Added:
  - `src/components/ThemeToggle.tsx`
  - Theme-aware styling
  - Updated layout handling in `src/app/layout.tsx`
  - Refined hero typography and spacing
  - Consistent theme behavior across the application

The theme toggle was implemented as a UI enhancement without changing interview state, routing, evaluation, or backend behavior.

---

### Phase 8: Comprehensive QA & Problem Statement Verification

- **Prompt:** *"Perform one final, thorough QA pass on the current codebase against the ABTalks Problem Statement and technical specification. Test the API contract, complete multi-turn interviews, adaptivity, context preservation, follow-up behavior, IDK handling, duplicate prevention, candidate personalization, minimum question/curriculum coverage, fallback mode, frontend integration, and repository readiness. Do not modify the code; report blockers and non-blocking issues."*

- **Outcome:** Performed a comprehensive QA audit covering the application from both the API and user-flow perspectives.

The audit verified:

- TypeScript compilation
- ESLint
- Next.js production build
- `POST /api/interview` contract
- Multi-turn session handling
- Minimum 8-question requirement
- Minimum 4 curriculum-day requirement
- Candidate personalization
- Adaptive difficulty
- Follow-up behavior
- Context preservation
- Duplicate-question prevention
- `"I don't know"` handling
- Fallback mode without an API key
- Structured final feedback
- Frontend integration
- Theme behavior
- Repository cleanliness

The initial audit identified an evaluation edge case where concise but technically correct answers could fall into a scoring dead zone, resulting in neither a strength nor a gap being recorded.

---

### Phase 9: Evidence-Based Fallback Evaluation Fix

- **Prompt:** *"Fix the fallback evaluation dead zone where concise but technically correct answers can receive enough correctness to avoid being classified as a gap, but not enough average score to be classified as a strength. Preserve strict IDK handling and do not introduce false strengths. Expand technical-term recognition where appropriate and ensure the final summary remains consistent with the collected evidence."*

- **Outcome:** Updated `src/lib/interview/fallback.ts` to improve evidence-based fallback evaluation.

The changes included:

- Expanded recognition of relevant technical terminology
- Improved identification of technically strong concise answers
- Removed the scoring dead zone between strengths and gaps
- Preserved strict `"I don't know"` handling
- Improved final summary logic when evidence is mixed or inconclusive

The fix was validated against multiple synthetic candidate behaviors, including:

- Strong technical answers
- Mixed strong and weak answers
- Concise technically correct answers
- All-IDK answers

The previously failing concise-answer scenario was re-tested successfully.

---

### Phase 10: Final Pre-Submission Verification

- **Prompt:** *"Perform one final read-only pre-submission QA audit. Do not modify, commit, or push anything. Verify the build, API contract, full interview flow, adaptivity, context, follow-ups, IDK handling, concise technical answers, duplicate prevention, candidate personalization, completion requirements, fallback mode, frontend behavior, security, and repository state."*

- **Outcome:** Final audit confirmed:

  - TypeScript: 0 errors
  - ESLint: 0 errors, 0 warnings
  - Production build: passed
  - API contract: passed
  - Multi-turn interview: passed
  - 8-question minimum: passed
  - 4-curriculum-day minimum: passed
  - Adaptive difficulty: passed
  - Context preservation: passed
  - Follow-up behavior: passed
  - Candidate personalization: passed
  - IDK handling: passed
  - Concise technical answer evaluation: passed
  - Duplicate prevention: passed
  - Deterministic fallback mode: passed
  - Frontend integration: passed
  - Theme toggle: passed
  - Security checks: passed
  - Repository state: clean

No critical or high-priority issues remained.

The only non-blocking observation was that malformed JSON sent directly to the API results in an HTTP 500 response rather than a 400 response. This does not affect the stated minimum requirements or normal application flow.

## 🧪 Validation & Version Control

After the major implementation and visual refinement stages, the project was repeatedly validated using:

- ESLint
- TypeScript compilation
- Next.js production builds
- Route generation checks
- Git working-tree verification

The visual redesign was committed separately from the underlying interview-engine fixes to preserve clear rollback points during development.

### Key commits

- `80078e4` — Fix assessment engine: evidence-based evaluation, zero false strengths for IDK, track per-turn `AnswerEvidence`
- `9bffd1f` — Fix live header dynamic `currentCompetency` label and update assessment summary wording
- `59cae0e` — Refine interview platform visual design
- `0ca6349` — Add theme toggle and refine hero layout
- `77c12a9` — Revise AI usage log and enhance visual structure
- `e24b52c` — Fix fallback evaluation for concise technical answers

The final validated branch was rebased onto the latest `main`, verified, and pushed to GitHub with a clean working tree.

