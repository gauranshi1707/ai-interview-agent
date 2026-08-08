import { EvaluationResult, InterviewState } from './types';
import { callLLM } from './llm';
import { evaluateFallback, isDontKnow } from './fallback';

export async function evaluateAnswer(
  state: InterviewState,
  answer: string
): Promise<EvaluationResult> {
  const currentTopic = state.currentCompetency ?? 'AI Engineering';

  // Fast path for explicit IDK / non-technical answers
  if (isDontKnow(answer)) {
    return evaluateFallback(answer, currentTopic);
  }

  if (!process.env.OPENAI_API_KEY) {
    return evaluateFallback(answer, currentTopic);
  }

  const systemPrompt = `You are evaluating a technical interview answer for an AI Engineering candidate.
The candidate was asked: "${state.currentQuestion}"
Current topic: "${currentTopic}"
Candidate experience level: ${state.candidate.yearsOfExperience} years.

Evaluate the answer and return ONLY a strict JSON object:
{
  "correctness": <0.0-1.0>,
  "depth": <0.0-1.0>,
  "practicality": <0.0-1.0>,
  "reasoning": <0.0-1.0>,
  "isDontKnow": false,
  "observations": ["<factual technical observation>"],
  "strengths": ["<specific technical strength demonstrated, if any>"],
  "weaknesses": ["<specific technical gap identified, if any>"],
  "recommendedAction": "<probe_deeper|clarify|increase_difficulty|decrease_difficulty|test_application|test_debugging|test_tradeoffs|move_competency>"
}

CRITICAL RULES:
1. NEVER treat response length or long explanations as evidence of competence if the technical content is missing or incorrect.
2. Strengths MUST be empty array [] unless the candidate demonstrated genuine technical correctness/reasoning.
3. NEVER add generic non-technical praise like "Completed the question" or "Engaged with the interviewer".
4. If candidate said "idk", "I don't know", "not sure", or gave a non-answer, set all scores to 0.0, set isDontKnow: true, strengths: [], weaknesses: ["Could not demonstrate understanding of ${currentTopic}"], and recommendedAction: "move_competency".`;

  const result = await callLLM(systemPrompt, `Candidate answer: "${answer}"`, 'json_object');

  if (!result) return evaluateFallback(answer, currentTopic);

  try {
    const parsed = JSON.parse(result) as EvaluationResult;
    if (typeof parsed.correctness !== 'number') throw new Error('Invalid schema');
    return parsed;
  } catch {
    console.error('Failed to parse evaluation JSON, using fallback');
    return evaluateFallback(answer, currentTopic);
  }
}
