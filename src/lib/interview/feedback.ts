import { InterviewState, InterviewFeedback } from './types';
import { callLLM } from './llm';
import { generateFallbackFeedback } from './fallback';

/**
 * Generates structured final feedback strictly derived from evidence gathered during the interview.
 */
export async function generateInterviewFeedback(
  state: InterviewState
): Promise<InterviewFeedback> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackFeedback(state);
  }

  // Format full evidence log for LLM evaluation
  const evidenceLog = state.evidences.map((e, idx) => ({
    turn: idx + 1,
    question: e.question,
    answer: e.answer,
    competency: e.competency,
    isDontKnow: e.evaluation.isDontKnow,
    scores: {
      correctness: e.evaluation.correctness,
      depth: e.evaluation.depth,
      practicality: e.evaluation.practicality,
      reasoning: e.evaluation.reasoning,
    },
    strengths: e.evaluation.strengths,
    weaknesses: e.evaluation.weaknesses,
  }));

  const systemPrompt = `You are a senior AI engineering interviewer generating final structured feedback.
Return ONLY a strict JSON object matching this schema:
{
  "summary": "<2-3 sentence factual assessment derived strictly from candidate evidence>",
  "strengths": ["<specific demonstrated technical strength 1>", ...],
  "gaps": ["<specific tested gap or un-demonstrated competency 1>", ...],
  "next": ["<practical actionable learning recommendation 1>", ...]
}

CRITICAL RULES:
1. NO FALSE STRENGTHS: strengths MUST be an empty array [] if the candidate did not demonstrate technical correctness (e.g. answered "idk" or non-technical responses). NEVER include behavioral/session metadata like "Completed the interview", "Answered all questions", or "Engaged with the session" as strengths.
2. GAPS: gaps MUST reference specific competencies that were TESTED during this session where candidate failed to demonstrate knowledge. Do NOT list competencies that were never asked (untested).
3. SUMMARY: If no technical strengths were demonstrated, summary MUST state that limited/no technical understanding was demonstrated.
4. NEXT STEPS: Provide concrete learning steps targeting the identified technical gaps.`;

  const userPrompt = `Candidate: ${state.candidate.name} (${state.candidate.role}, ${state.candidate.yearsOfExperience} YOE)
Total Questions Asked: ${state.questionCount}
Competencies Assessed: ${state.competenciesCovered.join(', ')}

Per-Question Answer Evidence Log:
${JSON.stringify(evidenceLog, null, 2)}

Generate evidence-based feedback.`;

  const raw = await callLLM(systemPrompt, userPrompt, 'json_object');

  if (!raw) return generateFallbackFeedback(state);

  try {
    const parsed = JSON.parse(raw) as InterviewFeedback;
    if (!parsed.summary || !Array.isArray(parsed.strengths) || !Array.isArray(parsed.gaps) || !Array.isArray(parsed.next)) {
      throw new Error('Invalid feedback JSON structure');
    }

    // Safety check: if all answers were IDK / 0 score, enforce empty strengths array
    const allDontKnowOrZero = state.evidences.length > 0 && state.evidences.every(
      (e) => e.evaluation.isDontKnow || (e.evaluation.correctness === 0 && e.evaluation.depth === 0)
    );
    if (allDontKnowOrZero) {
      parsed.strengths = [];
      if (!parsed.summary.toLowerCase().includes('limited') && !parsed.summary.toLowerCase().includes('no technical')) {
        parsed.summary = 'Limited technical understanding was demonstrated during this interview session across the assessed competencies.';
      }
    }

    return parsed;
  } catch {
    return generateFallbackFeedback(state);
  }
}
