/**
 * Deterministic fallback interview engine.
 * Used when no OPENAI_API_KEY is set (demo mode).
 */

import { InterviewState, InterviewFeedback, EvaluationResult, Candidate } from './types';

interface FallbackQuestion {
  topic: string;
  day: number;
  text: string;
  followUp: string;
}

const QUESTION_BANK: FallbackQuestion[] = [
  {
    topic: 'Embeddings',
    day: 7,
    text: 'How do embeddings capture semantic meaning, and why is cosine similarity often preferred over Euclidean distance when comparing them?',
    followUp: 'Your embeddings look good in isolation, but retrieval precision is poor. Walk me through how you would diagnose that problem.',
  },
  {
    topic: 'Vector Databases',
    day: 8,
    text: 'You need to serve 10 million embeddings with sub-100ms latency. What indexing strategy would you choose and what are the tradeoffs?',
    followUp: 'What happens to index accuracy when you use approximate nearest-neighbor search instead of exact search?',
  },
  {
    topic: 'Retrieval Augmented Generation (RAG)',
    day: 10,
    text: 'Walk me through a RAG pipeline. At what points can it fail, and how would you detect each failure mode?',
    followUp: 'A user complains the chatbot is hallucinating despite retrieval being active. What would you check first?',
  },
  {
    topic: 'Advanced RAG',
    day: 11,
    text: 'What is HyDE (Hypothetical Document Embeddings) and when would you use it over standard query embedding?',
    followUp: 'How does reranking improve RAG quality and what are the latency and cost tradeoffs involved?',
  },
  {
    topic: 'Prompt Engineering',
    day: 6,
    text: 'Explain chain-of-thought prompting. When does it help, and when might it actually hurt performance or cost?',
    followUp: 'How would you systematically evaluate whether one prompt outperforms another on a production task?',
  },
  {
    topic: 'Function Calling',
    day: 12,
    text: 'A user asks your AI assistant to "book me a flight to Paris next Friday." Describe how function calling handles this end-to-end.',
    followUp: 'How do you prevent the model from calling a destructive function like delete_all_records without user confirmation?',
  },
  {
    topic: 'Custom Agents',
    day: 17,
    text: 'You already have a single agent capable of calling all your tools. What would justify decomposing it into multiple specialized agents?',
    followUp: 'How do you handle state and context passing between agents in a multi-agent workflow?',
  },
  {
    topic: 'Model Context Protocol (MCP)',
    day: 19,
    text: 'How does the Model Context Protocol differ from standard REST APIs when exposing tools and resources to an LLM?',
    followUp: 'What security concerns arise when an MCP server exposes file system or database access to a language model?',
  },
  {
    topic: 'Evaluation Metrics',
    day: 20,
    text: 'Why is BLEU score often insufficient for evaluating RAG output quality? What would you use instead?',
    followUp: 'Describe how you would set up an LLM-as-a-judge evaluation pipeline and identify its failure modes.',
  },
  {
    topic: 'Security in AI Apps',
    day: 23,
    text: 'What is a prompt injection attack? Give a realistic example and explain how you would defend against it in production.',
    followUp: 'How would you test your production AI system for prompt injection vulnerabilities before launch?',
  },
  {
    topic: 'Production Observability',
    day: 26,
    text: 'Your RAG system is live in production. Describe what metrics, traces, and logs you would collect and why each matters.',
    followUp: 'How would you detect and respond to retrieval quality degradation before users start complaining?',
  },
  {
    topic: 'Production Readiness',
    day: 28,
    text: 'An LLM API starts returning 429 rate-limit errors under load. How would you design your system to handle this gracefully?',
    followUp: 'What is your strategy for cost management when AI usage spikes unexpectedly in production?',
  },
];

/** Signals indicating "I don't know" type responses */
const IDK_PATTERNS = [
  "don't know", "not sure", "idk", "no idea", "i don't remember",
  "not familiar", "haven't learned", "skip", "pass", "nah", "dunno",
];

export function isDontKnow(answer: string): boolean {
  const lower = answer.toLowerCase().trim();
  if (lower.length < 15) return true;
  return IDK_PATTERNS.some((p) => lower.includes(p));
}

export function evaluateFallback(answer: string, questionTopic: string): EvaluationResult {
  if (isDontKnow(answer)) {
    return {
      correctness: 0,
      depth: 0,
      practicality: 0,
      reasoning: 0,
      observations: [`Candidate did not demonstrate knowledge of ${questionTopic}.`],
      strengths: [],
      weaknesses: [`No knowledge demonstrated for ${questionTopic}.`],
      recommendedAction: 'move_competency',
    };
  }

  const wordCount = answer.trim().split(/\s+/).length;
  const lower = answer.toLowerCase();

  const technicalTerms = [
    'vector', 'embedding', 'retrieval', 'token', 'context', 'latency',
    'tradeoff', 'index', 'score', 'chunk', 'pipeline', 'prompt', 'fine-tune',
    'agent', 'tool', 'function', 'model', 'inference', 'hallucin', 'rerank',
  ];
  const technicalScore = technicalTerms.filter((t) => lower.includes(t)).length;

  const correctness = Math.min(1, 0.4 + (wordCount > 50 ? 0.2 : 0) + technicalScore * 0.05);
  const depth = Math.min(1, wordCount > 100 ? 0.8 : wordCount > 50 ? 0.6 : 0.4);
  const reasoningKws = ['because', 'therefore', 'tradeoff', 'however', 'alternatively', 'compared'];
  const reasoning = reasoningKws.some((k) => lower.includes(k)) ? 0.75 : 0.5;
  const practicalKws = ['would', 'implement', 'production', 'deploy', 'use case'];
  const practicality = practicalKws.some((k) => lower.includes(k)) ? 0.7 : 0.5;

  const avgScore = (correctness + depth + practicality + reasoning) / 4;
  const action: EvaluationResult['recommendedAction'] =
    avgScore > 0.75 ? 'increase_difficulty' :
    avgScore > 0.55 ? 'move_competency' :
    avgScore > 0.35 ? 'probe_deeper' :
    'decrease_difficulty';

  return {
    correctness,
    depth,
    practicality,
    reasoning,
    observations: [
      wordCount > 80
        ? `Demonstrated understanding of ${questionTopic} with a detailed response (${wordCount} words).`
        : `Brief answer on ${questionTopic}.`,
    ],
    strengths: avgScore > 0.6 ? [`Demonstrated understanding of ${questionTopic}.`] : [],
    weaknesses: avgScore < 0.5 ? [`Limited depth on ${questionTopic}.`] : [],
    recommendedAction: action,
  };
}

export function getNextFallbackQuestion(
  state: InterviewState
): { question: string; competency: string; day: number } | null {
  const skippedDays = state.candidate.skippedMissions;
  const failedDays = state.candidate.failedMissions;
  const tooManyOnSameTopic = state.consecutiveTopicCount >= 2;
  const currentTopic = state.currentCompetency;

  // Priority: failed → skipped → any unasked, skipping current topic if overused
  const prioritised = [
    ...QUESTION_BANK.filter((q) => failedDays.includes(q.day)),
    ...QUESTION_BANK.filter((q) => skippedDays.includes(q.day)),
    ...QUESTION_BANK,
  ];

  for (const q of prioritised) {
    if (state.askedQuestions.includes(q.text)) continue;
    if (tooManyOnSameTopic && q.topic === currentTopic) continue;
    return { question: q.text, competency: q.topic, day: q.day };
  }

  // Try follow-ups if all primary questions are exhausted
  for (const q of QUESTION_BANK) {
    if (!state.askedQuestions.includes(q.followUp)) {
      return { question: q.followUp, competency: q.topic, day: q.day };
    }
  }

  return null;
}

export function generateFallbackPlan(candidate: Candidate): string {
  const strong = candidate.completedMissions.slice(0, 5).join(', ');
  const weakParts: string[] = [];
  if (candidate.failedMissions.length > 0) {
    weakParts.push(`Failed: days ${candidate.failedMissions.join(', ')}`);
  }
  if (candidate.skippedMissions.length > 0) {
    weakParts.push(`Skipped: days ${candidate.skippedMissions.join(', ')}`);
  }
  return (
    `${candidate.name} is a ${candidate.role} with ${candidate.yearsOfExperience} years of experience. ` +
    `Completed missions include days: ${strong}. ` +
    (weakParts.length > 0 ? weakParts.join('. ') + '. ' : '') +
    `Strategy: start with core AI concepts appropriate for ${candidate.yearsOfExperience >= 9 ? 'senior' : candidate.yearsOfExperience >= 3 ? 'mid-level' : 'junior'} engineers, probe areas of weakness, and finish with production reasoning.`
  );
}

export function generateFallbackFeedback(state: InterviewState): InterviewFeedback {
  const strengthObs = state.observations.filter(
    (o) => o.startsWith('Demonstrated')
  ).slice(0, 3);
  const gapObs = state.observations.filter(
    (o) => o.includes('did not demonstrate') || o.includes('Limited depth')
  ).slice(0, 3);

  const coveredList = state.competenciesCovered.slice(0, 3).join(', ') || 'AI engineering topics';

  return {
    summary:
      strengthObs.length >= gapObs.length
        ? `${state.candidate.name} demonstrated solid technical foundations across ${coveredList}. Answers showed appropriate depth for their experience level.`
        : `${state.candidate.name} showed foundational knowledge with room to deepen expertise in ${gapObs.length > 0 ? state.competenciesCovered.slice(-2).join(' and ') : 'advanced production topics'}.`,
    strengths:
      strengthObs.length > 0
        ? strengthObs
        : ['Completed the full technical interview session.', 'Engaged with all topic areas presented.'],
    gaps:
      gapObs.length > 0
        ? gapObs
        : ['Some answers could benefit from more depth on production-level considerations.'],
    next: [
      'Review RAG pipeline failure modes and practice diagnosis exercises.',
      'Study production observability: logging, tracing, and LLM-specific monitoring.',
      'Build a hands-on multi-agent or MCP integration project.',
    ],
  };
}
