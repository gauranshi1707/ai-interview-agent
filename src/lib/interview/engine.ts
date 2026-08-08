import { Candidate, InterviewState, InterviewFeedback } from './types';
import { generateInterviewPlan } from './planner';
import { evaluateAnswer } from './evaluator';
import { generateNextQuestion } from './question-generator';
import { callLLM } from './llm';
import { generateFallbackFeedback } from './fallback';

// Minimum interview thresholds
const MIN_QUESTIONS = 8;
const MIN_CURRICULUM_DAYS = 4;

function getDifficultyFromExperience(
  years: number
): InterviewState['difficulty'] {
  if (years < 2) return 'fundamentals';
  if (years < 5) return 'application';
  if (years < 9) return 'debugging';
  return 'architecture';
}

export async function initializeInterview(
  sessionId: string,
  candidate: Candidate
): Promise<InterviewState> {
  const plan = await generateInterviewPlan(candidate);

  const state: InterviewState = {
    sessionId,
    candidate,
    interviewPlan: plan,
    messages: [],
    currentQuestion: null,
    askedQuestions: [],
    questionCount: 0,
    curriculumDaysCovered: [],
    competenciesCovered: [],
    currentCompetency: null,
    skillState: {},
    observations: [],
    difficulty: getDifficultyFromExperience(candidate.yearsOfExperience),
    consecutiveTopicCount: 0,
    done: false,
    feedback: null,
  };

  const next = await generateNextQuestion(state);

  state.currentQuestion = next.question;
  state.askedQuestions.push(next.question);
  state.questionCount = 1;
  state.currentCompetency = next.competency;
  state.consecutiveTopicCount = 1;
  if (!state.curriculumDaysCovered.includes(next.day)) {
    state.curriculumDaysCovered.push(next.day);
  }
  if (!state.competenciesCovered.includes(next.competency)) {
    state.competenciesCovered.push(next.competency);
  }

  state.messages.push({ role: 'interviewer', content: next.question });

  return state;
}

export async function processAnswer(
  state: InterviewState,
  answer: string
): Promise<InterviewState> {
  // Record candidate message
  state.messages.push({ role: 'candidate', content: answer });

  // Evaluate the answer
  const evaluation = await evaluateAnswer(state, answer);

  // Accumulate observations for final feedback
  state.observations.push(...evaluation.observations);

  // Update skill state for current competency
  if (state.currentCompetency) {
    const topic = state.currentCompetency;
    const existing = state.skillState[topic] ?? {
      score: 0,
      confidence: 'low' as const,
      evidence: [],
    };
    const avgScore =
      (evaluation.correctness + evaluation.depth + evaluation.practicality + evaluation.reasoning) / 4;

    state.skillState[topic] = {
      score: (existing.score + avgScore) / 2,
      confidence:
        avgScore > 0.7 ? 'high' : avgScore > 0.4 ? 'medium' : 'low',
      evidence: [
        ...existing.evidence,
        ...evaluation.strengths.slice(0, 1),
        ...evaluation.weaknesses.slice(0, 1),
      ].slice(0, 5),
    };
  }

  // Adapt difficulty
  const action = evaluation.recommendedAction;
  if (action === 'increase_difficulty') {
    const order: InterviewState['difficulty'][] = [
      'fundamentals', 'application', 'debugging', 'architecture', 'tradeoffs', 'production',
    ];
    const idx = order.indexOf(state.difficulty);
    if (idx < order.length - 1) state.difficulty = order[idx + 1];
  } else if (action === 'decrease_difficulty') {
    const order: InterviewState['difficulty'][] = [
      'fundamentals', 'application', 'debugging', 'architecture', 'tradeoffs', 'production',
    ];
    const idx = order.indexOf(state.difficulty);
    if (idx > 0) state.difficulty = order[idx - 1];
  }

  // Check if we've satisfied minimum thresholds to end interview
  if (
    state.questionCount >= MIN_QUESTIONS &&
    state.curriculumDaysCovered.length >= MIN_CURRICULUM_DAYS
  ) {
    state.done = true;
    state.feedback = await generateFinalFeedback(state);
    state.messages.push({
      role: 'interviewer',
      content:
        "Thank you — that brings our interview to a close. I appreciate the depth of your answers. I'll now compile your assessment.",
    });
    return state;
  }

  // Generate next question
  const next = await generateNextQuestion(state);

  state.currentQuestion = next.question;
  state.askedQuestions.push(next.question);
  state.questionCount += 1;

  if (!state.curriculumDaysCovered.includes(next.day)) {
    state.curriculumDaysCovered.push(next.day);
  }
  if (!state.competenciesCovered.includes(next.competency)) {
    state.competenciesCovered.push(next.competency);
  }

  if (state.currentCompetency === next.competency) {
    state.consecutiveTopicCount += 1;
  } else {
    state.currentCompetency = next.competency;
    state.consecutiveTopicCount = 1;
  }

  state.messages.push({ role: 'interviewer', content: next.question });

  return state;
}

async function generateFinalFeedback(
  state: InterviewState
): Promise<InterviewFeedback> {
  if (!process.env.OPENAI_API_KEY) {
    return generateFallbackFeedback(state);
  }

  // Build competency summary for the LLM
  const skillSummary = Object.entries(state.skillState)
    .map(([topic, skill]) => `${topic}: score=${skill.score.toFixed(2)}, confidence=${skill.confidence}`)
    .join('\n');

  const systemPrompt = `You are a senior engineering manager providing final structured feedback for an AI Engineering candidate.
Return ONLY a strict JSON object:
{
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<specific strength 1>", "<specific strength 2>", ...],
  "gaps": ["<specific gap 1>", "<specific gap 2>", ...],
  "next": ["<actionable next step 1>", "<actionable next step 2>", ...]
}

Rules:
- Summary must be specific to this candidate's actual interview performance. Not generic.
- Strengths should cite specific things the candidate demonstrated.
- Gaps should cite specific areas where knowledge was shallow or absent.
- Next steps should be practical and learning-focused.
- Do NOT expose internal scores or chain-of-thought.`;

  const userPrompt = `Candidate: ${state.candidate.name}, ${state.candidate.role}, ${state.candidate.yearsOfExperience} YOE
Questions asked: ${state.questionCount}
Curriculum days covered: ${state.curriculumDaysCovered.join(', ')}
Competencies assessed: ${state.competenciesCovered.join(', ')}

Skill state:
${skillSummary}

Observations from interview:
${state.observations.join('\n')}

Generate the final feedback JSON.`;

  const raw = await callLLM(systemPrompt, userPrompt, 'json_object');

  if (!raw) return generateFallbackFeedback(state);

  try {
    const parsed = JSON.parse(raw) as InterviewFeedback;
    if (!parsed.summary || !Array.isArray(parsed.strengths)) throw new Error('bad schema');
    return parsed;
  } catch {
    return generateFallbackFeedback(state);
  }
}
