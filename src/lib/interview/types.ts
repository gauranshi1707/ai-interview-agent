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

export type CompetencyStatus = 'strong' | 'developing' | 'not_demonstrated' | 'not_assessed';

export interface EvaluationResult {
  correctness: number; // 0.0 to 1.0
  depth: number;       // 0.0 to 1.0
  practicality: number;// 0.0 to 1.0
  reasoning: number;   // 0.0 to 1.0
  isDontKnow: boolean;
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

export interface AnswerEvidence {
  question: string;
  answer: string;
  competency: string;
  day: number;
  evaluation: EvaluationResult;
}

export interface SkillState {
  score: number;
  confidence: 'low' | 'medium' | 'high';
  status: CompetencyStatus;
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
  evidences: AnswerEvidence[];
  observations: string[];
  difficulty: 'fundamentals' | 'application' | 'debugging' | 'architecture' | 'tradeoffs' | 'production';
  consecutiveTopicCount: number;
  done: boolean;
  feedback: InterviewFeedback | null;
}
