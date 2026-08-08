/**
 * Deterministic fallback interview engine.
 * Used when no OPENAI_API_KEY is set (demo mode).
 * Strictly evidence-based answer evaluation and feedback generation.
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

/** Signals indicating "I don't know" or non-technical responses */
const IDK_PATTERNS = [
  "don't know", "not sure", "idk", "no idea", "i don't remember",
  "not familiar", "haven't learned", "skip", "pass", "nah", "dunno",
  "no clue", "dont know", "n/a", "nothing",
];

const TECHNICAL_TERMS = [
  'vector', 'embedding', 'retrieval', 'token', 'context', 'latency',
  'tradeoff', 'index', 'score', 'chunk', 'pipeline', 'prompt', 'fine-tune',
  'agent', 'tool', 'function', 'model', 'inference', 'hallucin', 'rerank',
  'cosine', 'euclidean', 'distance', 'semantic', 'ragas', 'bleu', 'hyde',
  'mcp', 'protocol', 'injection', 'guardrail', 'circuit breaker', 'backoff',
  'rate limit', 'opentelemetry', 'tracing', 'logging', 'few-shot', 'zero-shot',
  'chain-of-thought', 're-ranking', 'bm25', 'hybrid search', 'ann', 'hnsw',
];

export function isDontKnow(answer: string): boolean {
  const lower = answer.toLowerCase().trim();
  if (lower.length < 15 && !TECHNICAL_TERMS.some((t) => lower.includes(t))) {
    return true;
  }
  return IDK_PATTERNS.some((p) => lower.includes(p));
}

export function evaluateFallback(answer: string, questionTopic: string): EvaluationResult {
  if (isDontKnow(answer)) {
    return {
      correctness: 0.0,
      depth: 0.0,
      practicality: 0.0,
      reasoning: 0.0,
      isDontKnow: true,
      observations: [`Candidate answered '${answer.substring(0, 30)}' showing no demonstrated knowledge of ${questionTopic}.`],
      strengths: [],
      weaknesses: [`Could not demonstrate understanding of ${questionTopic}.`],
      recommendedAction: 'move_competency',
    };
  }

  const lower = answer.toLowerCase();
  const matchedTerms = TECHNICAL_TERMS.filter((t) => lower.includes(t));
  const wordCount = answer.trim().split(/\s+/).length;

  // If answer contains zero technical terms, length alone is NOT competence
  if (matchedTerms.length === 0) {
    return {
      correctness: 0.1,
      depth: 0.1,
      practicality: 0.1,
      reasoning: 0.1,
      isDontKnow: false,
      observations: [`Non-technical response provided for ${questionTopic}.`],
      strengths: [],
      weaknesses: [`Answer lacked technical concepts for ${questionTopic}.`],
      recommendedAction: 'decrease_difficulty',
    };
  }

  const correctness = Math.min(1.0, 0.3 + matchedTerms.length * 0.15);
  const depth = Math.min(1.0, wordCount > 60 ? 0.8 : 0.5);
  const reasoningKws = ['because', 'therefore', 'tradeoff', 'however', 'alternatively', 'compared', 'leads to'];
  const reasoning = reasoningKws.some((k) => lower.includes(k)) ? 0.8 : 0.5;
  const practicalKws = ['would', 'implement', 'production', 'deploy', 'use case', 'metrics', 'monitor', 'test'];
  const practicality = practicalKws.some((k) => lower.includes(k)) ? 0.8 : 0.5;

  const avgScore = (correctness + depth + practicality + reasoning) / 4;

  const action: EvaluationResult['recommendedAction'] =
    avgScore >= 0.75 ? 'increase_difficulty' :
    avgScore >= 0.55 ? 'move_competency' :
    avgScore >= 0.35 ? 'probe_deeper' :
    'decrease_difficulty';

  const strengths = avgScore >= 0.65 ? [`Demonstrated understanding of ${questionTopic}.`] : [];
  const weaknesses = avgScore < 0.5 ? [`Limited technical depth on ${questionTopic}.`] : [];

  return {
    correctness,
    depth,
    practicality,
    reasoning,
    isDontKnow: false,
    observations: [
      avgScore >= 0.65
        ? `Demonstrated technical understanding of ${questionTopic}.`
        : `Answer on ${questionTopic} showed limited technical depth.`,
    ],
    strengths,
    weaknesses,
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
  // Aggregate actual evidence from answered questions ONLY
  const strongEvidences = state.evidences.filter((e) => {
    if (e.evaluation.isDontKnow) return false;
    const avg = (e.evaluation.correctness + e.evaluation.depth + e.evaluation.practicality + e.evaluation.reasoning) / 4;
    return avg >= 0.65;
  });

  const weakEvidences = state.evidences.filter((e) => {
    if (e.evaluation.isDontKnow) return true;
    const avg = (e.evaluation.correctness + e.evaluation.depth + e.evaluation.practicality + e.evaluation.reasoning) / 4;
    return avg < 0.5;
  });

  // Strengths MUST come ONLY from strong answers
  const strengths: string[] = [];
  for (const ev of strongEvidences) {
    const s = ev.evaluation.strengths.find(Boolean) || `Demonstrated understanding of ${ev.competency}.`;
    if (!strengths.includes(s)) {
      strengths.push(s);
    }
  }

  // Gaps MUST come ONLY from tested topics where performance was weak/IDK
  const gaps: string[] = [];
  for (const ev of weakEvidences) {
    const g = ev.evaluation.isDontKnow
      ? `Did not demonstrate understanding of ${ev.competency} during this interview.`
      : ev.evaluation.weaknesses.find(Boolean) || `Limited depth demonstrated on ${ev.competency}.`;
    if (!gaps.includes(g)) {
      gaps.push(g);
    }
  }

  // Summary logic
  let summary = '';
  if (strengths.length === 0) {
    summary = `The candidate did not demonstrate technical knowledge across the assessed competencies during this interview.`;
  } else if (gaps.length > 0) {
    const strongTopics = strongEvidences.map((e) => e.competency).join(', ');
    summary = `${state.candidate.name} demonstrated solid understanding in some areas (${strongTopics}), but did not demonstrate knowledge in other assessed topics during this interview.`;
  } else {
    summary = `${state.candidate.name} demonstrated strong technical capability across all assessed competencies during the interview.`;
  }

  // Recommendations based on actual gaps
  const next: string[] = [];
  if (gaps.some((g) => g.toLowerCase().includes('rag') || g.toLowerCase().includes('embedding'))) {
    next.push('Review the fundamentals of embeddings and vector retrieval pipelines.');
  }
  if (gaps.some((g) => g.toLowerCase().includes('agent') || g.toLowerCase().includes('function'))) {
    next.push('Practice building hands-on function calling and multi-agent workflows.');
  }
  if (gaps.some((g) => g.toLowerCase().includes('observability') || g.toLowerCase().includes('security') || g.toLowerCase().includes('readiness'))) {
    next.push('Study production AI system design, observability, and prompt security.');
  }

  if (next.length === 0) {
    next.push('Review advanced production architecture and failure mode mitigation.');
    next.push('Practice complex system design scenarios for enterprise AI deployment.');
  }

  return {
    summary,
    strengths, // Strictly empty [] if no technical strengths demonstrated!
    gaps,
    next,
  };
}
