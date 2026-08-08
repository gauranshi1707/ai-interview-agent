import { InterviewState } from './types';
import { callLLM } from './llm';
import { getCurriculum } from './curriculum';
import { getNextFallbackQuestion } from './fallback';

interface NextQuestion {
  question: string;
  competency: string;
  day: number;
}

function normalise(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
}

function isTooSimilar(candidate: string, existing: string[]): boolean {
  const norm = normalise(candidate);
  for (const q of existing) {
    const qNorm = normalise(q);
    // Exact match or very high word overlap
    if (norm === qNorm) return true;
    const wordsA = new Set(norm.split(' ').filter((w) => w.length > 4));
    const wordsB = new Set(qNorm.split(' ').filter((w) => w.length > 4));
    const intersection = [...wordsA].filter((w) => wordsB.has(w)).length;
    const union = new Set([...wordsA, ...wordsB]).size;
    if (union > 0 && intersection / union > 0.6) return true;
  }
  return false;
}

export async function generateNextQuestion(state: InterviewState): Promise<NextQuestion> {
  const curriculum = getCurriculum();

  if (!process.env.OPENAI_API_KEY) {
    return getNextFallbackQuestion(state) ?? {
      question: 'What has been the most technically challenging AI project you have worked on?',
      competency: 'General',
      day: 31,
    };
  }

  // Build context for the LLM
  const coveredDays = state.curriculumDaysCovered;
  const uncoveredTopics = curriculum
    .filter((c) => !coveredDays.includes(c.day))
    .slice(0, 12)
    .map((c) => `Day ${c.day}: ${c.topic}`);

  const recentObservations = state.observations.slice(-4);
  const lastEvalSummary = recentObservations.join(' | ');
  const tooManyOnSameTopic = state.consecutiveTopicCount >= 2;

  const systemPrompt = `You are generating the next technical interview question for an AI Engineering candidate.
Return ONLY a strict JSON object:
{
  "question": "<the technical question>",
  "competency": "<curriculum topic name>",
  "day": <curriculum day number>
}

Rules:
1. The question must test real engineering understanding — tradeoffs, debugging, architecture, production — not just definitions.
2. Do NOT repeat or closely rephrase any of these already-asked questions: ${JSON.stringify(state.askedQuestions)}
3. Current interview difficulty level: ${state.difficulty}
4. Candidate experience: ${state.candidate.yearsOfExperience} years
5. If consecutiveTopicCount >= 2, MUST move to a different topic. Current topic: "${state.currentCompetency}". Move topic: ${tooManyOnSameTopic}
6. Prioritise uncovered curriculum topics: ${JSON.stringify(uncoveredTopics)}
7. Interview plan: ${state.interviewPlan.substring(0, 300)}
8. Recent evaluation signals: ${lastEvalSummary || 'none yet'}
9. Difficulty progression: fundamentals → application → debugging → architecture → tradeoffs → production`;

  const userPrompt = 'Generate the next interview question JSON.';

  for (let attempt = 0; attempt < 3; attempt++) {
    const raw = await callLLM(systemPrompt, userPrompt, 'json_object');
    if (!raw) break;

    try {
      const parsed = JSON.parse(raw) as NextQuestion;
      if (!parsed.question || !parsed.competency || !parsed.day) continue;
      if (isTooSimilar(parsed.question, state.askedQuestions)) continue;
      return parsed;
    } catch {
      continue;
    }
  }

  // LLM failed or generated duplicates — use fallback
  return getNextFallbackQuestion(state) ?? {
    question: 'What has been the most technically challenging AI project you have worked on?',
    competency: 'General',
    day: 31,
  };
}
