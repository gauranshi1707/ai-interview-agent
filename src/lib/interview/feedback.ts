import { InterviewState, InterviewFeedback } from './types';
import { callLLM } from './llm';
import { generateFallbackFeedback } from './fallback';

/**
 * Generates structured final feedback based on actual interview evidence.
 */
export async function generateInterviewFeedback(
  state: InterviewState
): Promise<InterviewFeedback> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackFeedback(state);
  }

  const skillSummary = Object.entries(state.skillState)
    .map(([topic, skill]) => `${topic}: score=${skill.score.toFixed(2)}, confidence=${skill.confidence}`)
    .join('\n');

  const systemPrompt = `You are a senior AI engineering interviewer providing final structured feedback.
Return ONLY a strict JSON object matching this schema:
{
  "summary": "<2-3 sentence overall assessment based on actual evidence>",
  "strengths": ["<specific strength demonstrated during the interview>", ...],
  "gaps": ["<specific gap or weakness identified>", ...],
  "next": ["<actionable next step for candidate growth>", ...]
}

Rules:
- Feedback must be strictly derived from evidence gathered during the interview.
- Do NOT output generic praise or static templates.
- Strengths and gaps must reference specific concepts discussed (e.g. RAG, embeddings, agents, observability).`;

  const userPrompt = `Candidate: ${state.candidate.name} (${state.candidate.role}, ${state.candidate.yearsOfExperience} YOE)
Questions asked: ${state.questionCount}
Curriculum days covered: ${state.curriculumDaysCovered.join(', ')}
Competencies assessed: ${state.competenciesCovered.join(', ')}

Competency state:
${skillSummary || 'No specific skill scores recorded.'}

Interview observations log:
${state.observations.join('\n') || 'Completed technical interview session.'}

Generate structured final feedback.`;

  const raw = await callLLM(systemPrompt, userPrompt, 'json_object');

  if (!raw) return generateFallbackFeedback(state);

  try {
    const parsed = JSON.parse(raw) as InterviewFeedback;
    if (!parsed.summary || !Array.isArray(parsed.strengths) || !Array.isArray(parsed.gaps) || !Array.isArray(parsed.next)) {
      throw new Error('Invalid feedback JSON structure');
    }
    return parsed;
  } catch {
    return generateFallbackFeedback(state);
  }
}
