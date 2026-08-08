import { Candidate } from './types';
import { callLLM } from './llm';
import { getCurriculum } from './curriculum';
import { generateFallbackPlan } from './fallback';

export async function generateInterviewPlan(candidate: Candidate): Promise<string> {
  const curriculum = getCurriculum();
  const topicList = curriculum.map((c) => `Day ${c.day}: ${c.topic}`).join('\n');

  const systemPrompt = `You are a senior technical interviewer planning an AI Engineering interview.
Output a concise interview strategy (3-5 sentences). Focus on:
- Candidate's background and role
- Their cohort strengths (completed days) and weaknesses (failed/skipped days)  
- What topics to prioritise and what difficulty level to start at
- Any specific areas to probe based on their profile
Do NOT list individual questions. Just describe the strategy.`;

  const userPrompt = `Candidate: ${candidate.name}
Role: ${candidate.role}
Experience: ${candidate.yearsOfExperience} years
Education: ${candidate.education}
Completed missions (days): ${JSON.stringify(candidate.completedMissions)}
Failed missions (days): ${JSON.stringify(candidate.failedMissions)}
Skipped missions (days): ${JSON.stringify(candidate.skippedMissions)}
First-try performance: ${(candidate.firstTryPerformance * 100).toFixed(0)}%
Commit days: ${candidate.commitDays}/31

Available curriculum topics:
${topicList}

Generate the interview strategy.`;

  const result = await callLLM(systemPrompt, userPrompt, 'text');
  return result ?? generateFallbackPlan(candidate);
}
