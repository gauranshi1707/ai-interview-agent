import { Candidate, InterviewState, InterviewFeedback, AnswerEvidence, CompetencyStatus } from './types';
import { generateInterviewPlan } from './planner';
import { evaluateAnswer } from './evaluator';
import { generateNextQuestion } from './question-generator';
import { generateInterviewFeedback } from './feedback';

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
    evidences: [],
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

  // Record structured evidence
  const currentDay = state.curriculumDaysCovered[state.curriculumDaysCovered.length - 1] ?? 1;
  const evidence: AnswerEvidence = {
    question: state.currentQuestion ?? '',
    answer,
    competency: state.currentCompetency ?? 'General',
    day: currentDay,
    evaluation,
  };
  state.evidences.push(evidence);

  // Record observations
  if (evaluation.observations.length > 0) {
    state.observations.push(...evaluation.observations);
  }

  // Update skill state for current competency
  if (state.currentCompetency) {
    const topic = state.currentCompetency;
    const existing = state.skillState[topic] ?? {
      score: 0,
      confidence: 'low' as const,
      status: 'not_assessed' as CompetencyStatus,
      evidence: [],
    };

    const avgScore = evaluation.isDontKnow
      ? 0.0
      : (evaluation.correctness + evaluation.depth + evaluation.practicality + evaluation.reasoning) / 4;

    const newScore = existing.evidence.length === 0 ? avgScore : (existing.score + avgScore) / 2;

    const status: CompetencyStatus =
      evaluation.isDontKnow || newScore < 0.3
        ? 'not_demonstrated'
        : newScore < 0.7
        ? 'developing'
        : 'strong';

    state.skillState[topic] = {
      score: newScore,
      confidence: avgScore > 0.7 ? 'high' : avgScore > 0.4 ? 'medium' : 'low',
      status,
      evidence: [
        ...existing.evidence,
        ...evaluation.strengths,
        ...evaluation.weaknesses,
      ].filter(Boolean).slice(0, 5),
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

  // Check if minimum interview thresholds are met
  if (
    state.questionCount >= MIN_QUESTIONS &&
    state.curriculumDaysCovered.length >= MIN_CURRICULUM_DAYS
  ) {
    state.done = true;
    state.feedback = await generateFinalFeedback(state);
    state.messages.push({
      role: 'interviewer',
      content:
        "Thank you — that brings our interview to a close. I'll now compile your technical assessment based on the evidence demonstrated.",
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
  return generateInterviewFeedback(state);
}
