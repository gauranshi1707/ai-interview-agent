export interface Candidate {
  id: string;
  name: string;
  role: string;
  yearsOfExperience: number;
  education: string;
  completedMissions: number[];
  failedMissions: number[];
  skippedMissions: number[];
  attempts: Record<string, number>;
  commitDays: number;
  missionsCompleted: number;
  firstTryPerformance: number;
}

export interface CurriculumTopic {
  day: number;
  topic: string;
  objectives: string[];
}

export interface SkillState {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  evidence: string[];
}

export interface InterviewFeedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
}

export interface InterviewMessage {
  role: 'interviewer' | 'candidate';
  content: string;
}

export interface InterviewState {
  sessionId: string;
  candidate: Candidate;
  interviewPlan: string;
  messages: InterviewMessage[];
  currentQuestion: string | null;
  askedQuestions: string[];
  questionCount: number;
  curriculumDaysCovered: number[];
  competenciesCovered: string[];
  currentCompetency: string | null;
  skillState: Record<string, SkillState>;
  observations: string[];
  difficulty: 'fundamentals' | 'application' | 'debugging' | 'architecture' | 'tradeoffs' | 'production';
  consecutiveTopicCount: number;
  done: boolean;
  feedback: InterviewFeedback | null;
}

export interface EvaluationResult {
  correctness: number;
  depth: number;
  practicality: number;
  reasoning: number;
  observations: string[];
  strengths: string[];
  weaknesses: string[];
  recommendedAction:
    | 'probe_deeper'
    | 'clarify'
    | 'increase_difficulty'
    | 'decrease_difficulty'
    | 'test_application'
    | 'test_debugging'
    | 'test_tradeoffs'
    | 'move_competency';
}
