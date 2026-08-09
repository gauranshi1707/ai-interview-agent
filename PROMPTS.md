# AI Usage Log & Development History

This document records the AI-assisted development process used during the
ABTalks Vibe Code Hackathon for Problem Statement 2 — The Interview Agent.

The project was developed iteratively using AI-assisted planning, code
generation, debugging, testing, and UI refinement.

---

## AI Tools Used

- Claude — architecture planning, implementation, debugging, and refactoring.
- Gemini — code assistance, debugging, and implementation support.
- Antigravity — primary AI-assisted coding environment.
- Next.js / TypeScript tooling — development and build verification.
- Git CLI — version control and repository management.

---

# Development Timeline

## Phase 1 — Problem Understanding & Architecture

### Prompt

> Analyze the supplied technical specification, curriculum JSON, and candidate
> profiles. Design the architecture for an AI Interview Agent that conducts
> a multi-turn technical interview personalized to each candidate's cohort
> journey.

### Outcome

Defined the major system components:

- Candidate profile loading
- Curriculum grounding
- Interview session state
- Question generation
- Answer evaluation
- Adaptive follow-up logic
- Interview completion
- Structured feedback generation

---

## Phase 2 — Candidate & Curriculum Context

### Prompt

> Analyze curriculum.json and candidates.json and determine how candidate
> history, completed missions, skipped topics, failed attempts, and curriculum
> topics should influence the interview.

### Outcome

Implemented a context model combining:

1. Candidate History
2. Curriculum Grounding
3. Live Interview Evidence

The session state tracks information such as:

- skill state
- observations
- asked questions
- curriculum days covered
- consecutive topic count

---

## Phase 3 — Interview Engine

### Prompt

> Build the interview engine as a state-driven multi-turn system. It must
> maintain conversation context, select questions based on the candidate's
> cohort journey, avoid repeatedly asking the same question, and adapt the
> interview based on previous responses.

### Outcome

Implemented the core interview session flow and state management.

The engine maintains the current interview state and uses previous answers
when selecting subsequent questions.

---

## Phase 4 — Deterministic Fallback Engine

### Prompt

> Build a deterministic fallback interview engine that works without an LLM
> API key. It must handle "I don't know" responses, avoid duplicate questions,
> cover at least 8 questions across at least 4 curriculum areas, and generate
> structured final feedback.

### Outcome

Implemented `fallback.ts` containing:

- question bank
- IDK detection
- question normalization
- similarity checking
- adaptive question selection
- interview completion logic
- structured feedback generation

The fallback allows the application to remain functional even when an LLM
provider is unavailable.

---

## Phase 5 — LLM Integration

### Prompt

> Create separate LLM modules for interview planning, answer evaluation,
> question generation, and final feedback. Use structured JSON responses and
> keep API keys strictly server-side. If an LLM request fails, gracefully
> fall back to the deterministic interview engine.

### Outcome

Implemented:

- `planner.ts`
- `evaluator.ts`
- `question-generator.ts`
- `feedback.ts`
- `llm.ts`

The architecture separates planning, evaluation, question generation, and
feedback responsibilities.

---

## Phase 6 — Adaptive Interview Behaviour

### Prompt

> Make the interview adaptive rather than a fixed questionnaire. Strong
> answers should allow deeper questioning, weak or uncertain answers should
> influence the next question, and the system should avoid repeatedly
> targeting the same competency.

### Outcome

The interview tracks live evidence from candidate responses and uses it when
selecting subsequent questions.

The system can change topic or difficulty based on the candidate's responses.

---

## Phase 7 — "I Don't Know" Handling

### Prompt

> Test and improve the handling of candidates who answer "I don't know".
> The system should correctly treat this as lack of demonstrated knowledge
> rather than attempting to invent evidence of competency.

### Outcome

Implemented IDK pattern detection and verified that repeated "I don't know"
responses produce an appropriate assessment rather than falsely identifying
technical strengths.

---

## Phase 8 — Interview Coverage & Duplicate Prevention

### Prompt

> Ensure the interview satisfies the minimum requirement of 8 questions
> covering at least 4 curriculum days. Prevent duplicate or near-duplicate
> questions using normalization and similarity checking.

### Outcome

The fallback question bank and session state enforce the required minimum
coverage while avoiding repeated questions.

---

## Phase 9 — Interview UI

### Prompt

> Build a technical interview console around the existing interview engine.
> Include candidate context, cohort progress, interviewer messages, candidate
> responses, question progress, and a structured final assessment.

### Outcome

Implemented the primary interview interface including:

- candidate header
- cohort information
- interview progress
- interviewer/candidate conversation
- response input
- question progression
- final assessment

Main UI components include:

- `InterviewConsole.tsx`
- candidate selection page
- interview session page
- final assessment view

---

## Phase 10 — Next.js Debugging

### Prompt

> Fix the Next.js App Router error caused by accessing dynamic route params
> synchronously. Update the implementation to correctly handle asynchronous
> route parameters in the current Next.js version without changing the
> interview logic.

### Outcome

Updated the dynamic interview route to correctly handle the asynchronous
`params` API.

---

## Phase 11 — Interview Testing

The interview was manually tested with different response patterns.

### Test Case 1 — Strong Technical Responses

The system was tested with technically detailed answers across the interview.

Observed behaviour:

- questions continued across multiple competencies
- final feedback identified demonstrated strengths
- gaps were generated for areas not demonstrated

### Test Case 2 — Repeated "I Don't Know"

The interview was tested with consecutive `idk` responses.

Observed behaviour:

- technical strengths were not falsely assigned
- competencies were marked as not demonstrated
- final feedback reflected the lack of demonstrated technical knowledge
- recommended next steps were generated

### Test Case 3 — Mixed Responses

The interview was tested using a mixture of weak/uncertain and detailed
technical answers.

Observed behaviour:

- the interview continued for the required number of questions
- final assessment reflected demonstrated and missing competencies

---

## Phase 12 — UI Refinement

### Prompt

> Review the existing interview UI and refine the visual design so it feels
> like a professional technical interview platform rather than a generic AI
> SaaS dashboard. Preserve the existing interview functionality and focus on
> visual hierarchy, spacing, colors, and component styling.

### Outcome

Iterated on:

- interview console styling
- candidate selection
- assessment results
- color system
- status indicators
- responsive layout

The final direction retained the existing application structure while reducing
generic AI-dashboard visual patterns.

---

## Phase 13 — Final Visual Audit

### Prompt

> Audit the interface for visual patterns that make it look like a generic
> AI-generated SaaS application. Reduce unnecessary pills, repeated colored
> metric cards, excessive rounded containers, decorative AI elements, and
> unnecessary visual effects while preserving the existing functionality.

### Outcome

Refined:

- candidate statistics
- status indicators
- cards
- buttons
- spacing
- color usage
- interview message styling
- assessment sections

The goal was to make the interface communicate the product's actual purpose:
a technical assessment platform.

---

## Phase 14 — Final Verification

### Prompt

> Verify the complete application against the Problem Statement requirements.
> Test candidate selection, interview initialization, multi-turn responses,
> adaptive questioning, minimum question coverage, final feedback, and the
> required HTTP endpoint. Run the production build and fix any remaining
> errors.

### Outcome

Verified:

- conversational interview flow
- multi-turn context
- adaptive question selection
- minimum 8-question interview
- curriculum coverage
- structured final feedback
- fallback behaviour
- frontend rendering
- production build
