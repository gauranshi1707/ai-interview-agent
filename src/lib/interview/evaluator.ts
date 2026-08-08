import { EvaluationResult, InterviewState } from './types';
import { callLLM } from './llm';
import { evaluateFallback } from './fallback';

export async function evaluateAnswer(
  state: InterviewState,
  answer: string
): Promise<EvaluationResult> {
  const currentTopic = state.currentCompetency ?? 'AI Engineering';

  if (!process.env.OPENAI_API_KEY) {
    return evaluateFallback(answer, currentTopic);
  }

  const systemPrompt = `You are evaluating a technical interview answer for an AI Engineering candidate.
The candidate was asked: "${state.currentQuestion}"
Their experience level: ${state.candidate.yearsOfExperience} years.
Current interview difficulty: ${state.difficulty}.

Evaluate the answer and return ONLY a strict JSON object:
{
  "correctness": <0.0-1.0>,
  "depth": <0.0-1.0>,
  "practicality": <0.0-1.0>,
  "reasoning": <0.0-1.0>,
  "observations": ["<brief factual observation, not rating language>"],
  "strengths": ["<specific strength demonstrated>"],
  "weaknesses": ["<specific gap identified>"],
  "recommendedAction": "<probe_deeper|clarify|increase_difficulty|decrease_difficulty|test_application|test_debugging|test_tradeoffs|move_competency>"
}

Rules:
- If the answer is "I don't know", "not sure", "idk", or very short (<15 words), set all scores to 0 and use "move_competency" or "decrease_difficulty".
- Do not reveal evaluation scores to the candidate.
- observations, strengths, weaknesses should be concise factual statements.`;

  const result = await callLLM(systemPrompt, `Candidate answer: "${answer}"`, 'json_object');

  if (!result) return evaluateFallback(answer, currentTopic);

  try {
    const parsed = JSON.parse(result) as EvaluationResult;
    // Validate structure
    if (typeof parsed.correctness !== 'number') throw new Error('Invalid schema');
    return parsed;
  } catch {
    console.error('Failed to parse evaluation JSON, using fallback heuristics');
    return evaluateFallback(answer, currentTopic);
  }
}
