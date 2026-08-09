'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, MutableRefObject } from 'react';
import type { Candidate, InterviewFeedback } from '@/lib/interview/types';

interface Message {
  role: 'interviewer' | 'candidate';
  content: string;
}

interface InterviewConsoleProps {
  sessionId: string;
  candidate: Candidate;
}

export default function InterviewConsole({ sessionId, candidate }: InterviewConsoleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [questionCount, setQuestionCount] = useState(0);
  const [curriculumDays, setCurriculumDays] = useState<number[]>([]);
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [currentCompetency, setCurrentCompetency] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasStarted: MutableRefObject<boolean> = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Auto-start the interview
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const start = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, candidate }),
        });
        const data = await res.json();
        if (data.reply) {
          setMessages([{ role: 'interviewer', content: data.reply }]);
          setQuestionCount(1);
        }
        if (data.meta) {
          setCurriculumDays(data.meta.curriculumDaysCovered ?? []);
          setCompetencies(data.meta.competenciesCovered ?? []);
          if (data.meta.currentCompetency) setCurrentCompetency(data.meta.currentCompetency);
          if (data.meta.difficulty) setDifficulty(data.meta.difficulty);
        }
        if (data.done) {
          setDone(true);
          setFeedback(data.feedback);
        }
      } catch {
        setError('Failed to start the interview. Please refresh and try again.');
      } finally {
        setLoading(false);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    start();
  }, [sessionId, candidate]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || done) return;

    const userMessage: Message = { role: 'candidate', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      if (data.meta) {
        setCurriculumDays(data.meta.curriculumDaysCovered ?? []);
        setCompetencies(data.meta.competenciesCovered ?? []);
        if (data.meta.currentCompetency) setCurrentCompetency(data.meta.currentCompetency);
        if (data.meta.difficulty) setDifficulty(data.meta.difficulty);
      }

      if (data.done) {
        setDone(true);
        setFeedback(data.feedback);
        if (data.reply && data.reply !== 'Interview completed.') {
          setMessages((prev) => [
            ...prev,
            { role: 'interviewer', content: data.reply },
          ]);
        }
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: 'interviewer', content: data.reply },
        ]);
        setQuestionCount((n) => n + 1);
      }
    } catch {
      setError('Network error. Your message may not have been received.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const track =
    candidate.yearsOfExperience >= 9
      ? 'Senior Track'
      : candidate.yearsOfExperience >= 3
      ? 'Mid Track'
      : 'Junior Track';

  const activeAssessingTopic = currentCompetency || (competencies.length > 0 ? competencies[competencies.length - 1] : 'AI Engineering');

  if (done && feedback) {
    return <FeedbackScreen candidate={candidate} feedback={feedback} questionCount={questionCount} competencies={competencies} />;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] flex flex-col">
      {/* ── Header ── */}
      <header className="border-b border-[#DED8CB] bg-[#F7F4EC] sticky top-0 z-10">
        {/* Top row: candidate identity + question counter */}
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-lg bg-[#245C49] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-semibold font-serif">
                {candidate.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#171A18] font-semibold">{candidate.name}</span>
                <span className="text-[#DED8CB] text-sm">·</span>
                <span className="text-[#6E6A61] text-sm">{candidate.role}</span>
                <span className="text-[#DED8CB] text-sm">·</span>
                <span className="text-[#6E6A61] text-sm">{candidate.yearsOfExperience} YOE</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs text-[#245C49] border border-[#C5DACE] bg-[#EBF2EE] rounded-full px-2.5 py-0.5">
                  <span className="w-1 h-1 rounded-full bg-[#245C49] inline-block"></span>
                  Tailored to Cohort Journey
                </span>
                <span className="text-xs text-[#9A9590]">{track}</span>
                {difficulty && (
                  <span className="text-xs text-[#6E6A61] capitalize border border-[#DED8CB] bg-[#F0EDE4] px-2 py-0.5 rounded">
                    Difficulty: {difficulty}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Question counter — prominent per reference */}
          <div className="flex-shrink-0 text-right">
            <div className="font-serif text-2xl font-medium text-[#171A18] leading-none">
              Q{questionCount}
            </div>
            <div className="text-xs text-[#9A9590] mt-0.5">
              {curriculumDays.length} topic{curriculumDays.length !== 1 ? 's' : ''} covered
            </div>
          </div>
        </div>

        {/* Sub-row: inline stats + assessing topic */}
        <div className="max-w-4xl mx-auto px-4 pb-2.5 border-t border-[#EAE6DC] pt-2">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-[#245C49] font-medium">{candidate.completedMissions.length} completed</span>
            <span className="text-[#DED8CB]">·</span>
            <span className="text-[#B88632]">{candidate.skippedMissions.length} skipped</span>
            <span className="text-[#DED8CB]">·</span>
            <span className="text-[#8C4A3C]">{candidate.failedMissions.length} failed</span>
            {activeAssessingTopic && (
              <>
                <span className="text-[#DED8CB]">·</span>
                <span className="text-[#6E6A61]">
                  Assessing: <span className="text-[#171A18] font-medium">{activeAssessingTopic}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {messages.map((msg, i) => {
            const isInterviewer = msg.role === 'interviewer';
            return (
              <div
                key={i}
                className={`flex gap-3 animate-fade-in ${!isInterviewer ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold font-serif
                  ${isInterviewer
                    ? 'bg-[#245C49] text-white'
                    : 'bg-[#EAE6DC] text-[#6E6A61] border border-[#DED8CB]'
                  }`}>
                  {isInterviewer ? 'AI' : candidate.name.charAt(0).toUpperCase()}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 max-w-[75%] ${!isInterviewer ? 'items-end' : 'items-start'}`}>
                  <span className={`text-xs ${isInterviewer ? 'text-[#9A9590]' : 'text-[#9A9590]'}`}>
                    {isInterviewer ? 'Interviewer' : candidate.name}
                    {isInterviewer && i === messages.length - 1 && activeAssessingTopic && (
                      <span className="ml-2 text-[#245C49]/60">· {activeAssessingTopic}</span>
                    )}
                  </span>

                  {/* Interviewer message — bordered editorial card */}
                  {isInterviewer ? (
                    <div className="bg-[#F7F4EC] border border-[#DED8CB] rounded-lg px-5 py-4 leading-relaxed text-sm text-[#171A18] shadow-sm">
                      {msg.content}
                    </div>
                  ) : (
                    /* Candidate response — warm surface, right-aligned, restrained */
                    <div className="bg-[#EAE6DC] border border-[#CEC8BA] rounded-lg px-5 py-4 leading-relaxed text-sm text-[#171A18]">
                      {msg.content}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-[#245C49] flex-shrink-0 flex items-center justify-center text-xs font-bold text-white font-serif">AI</div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#9A9590]">Interviewer</span>
                <div className="bg-[#F7F4EC] border border-[#DED8CB] rounded-lg px-5 py-4 flex items-center gap-1.5 shadow-sm">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="border border-[#DED8CB] bg-[#F5EDEB] text-[#8C4A3C] text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Input ── */}
      {!done && (
        <div className="border-t border-[#DED8CB] bg-[#F0EDE4]">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading || done}
                placeholder="Type your response... (Enter to send, Shift+Enter for new line)"
                rows={3}
                id="candidate-input"
                className="flex-1 bg-[#F7F4EC] border border-[#DED8CB] rounded-lg px-4 py-3 text-sm text-[#171A18] placeholder-[#9A9590] resize-none focus:outline-none focus:border-[#245C49]/50 focus:ring-1 focus:ring-[#245C49]/20 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || done || !input.trim()}
                id="send-button"
                className="px-5 border border-[#245C49] text-[#245C49] hover:bg-[#245C49] hover:text-white disabled:border-[#DED8CB] disabled:text-[#9A9590] disabled:bg-transparent rounded-lg font-medium text-sm transition-colors self-end h-[52px] flex-shrink-0"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-[#9A9590] mt-2 text-center">
              Question {questionCount} · {Math.max(0, 8 - questionCount)} more required · Press Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Feedback Screen ──
function FeedbackScreen({
  candidate,
  feedback,
  questionCount,
  competencies,
}: {
  candidate: Candidate;
  feedback: InterviewFeedback;
  questionCount: number;
  competencies: string[];
}) {
  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#171A18]">
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#EBF2EE] border border-[#C5DACE] mb-5">
            <svg className="w-7 h-7 text-[#245C49]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#171A18] mb-2">Technical Interview Complete</h1>
          <p className="text-[#6E6A61] text-sm">
            {candidate.name} · {candidate.role} · {questionCount} questions · {competencies.length || 4} competencies assessed
          </p>
        </div>

        {/* Overall Assessment */}
        <div className="bg-[#F0EDE4] border border-[#DED8CB] rounded-lg p-6 mb-5">
          <h2 className="text-xs font-semibold text-[#9A9590] uppercase tracking-widest mb-4">Overall Assessment</h2>
          {/* Gold left-border quote per reference */}
          <div className="border-l-2 border-[#B88632] pl-4">
            <p className="text-[#171A18] leading-relaxed">{feedback.summary}</p>
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-[#F0EDE4] border border-[#DED8CB] rounded-lg p-6 mb-5">
          <h2 className="text-xs font-semibold text-[#245C49] uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            Demonstrated Strengths
          </h2>
          <div className="border-t border-[#DED8CB] pt-4">
            {feedback.strengths.length > 0 ? (
              <ul className="space-y-2.5">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#171A18]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#245C49] mt-1.5 flex-shrink-0"></span>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#9A9590] italic">No technical strengths demonstrated during this session.</p>
            )}
          </div>
        </div>

        {/* Gaps */}
        <div className="bg-[#F0EDE4] border border-[#DED8CB] rounded-lg p-6 mb-5">
          <h2 className="text-xs font-semibold text-[#B88632] uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Gaps
          </h2>
          <div className="border-t border-[#DED8CB] pt-4">
            {feedback.gaps.length > 0 ? (
              <ul className="space-y-2.5">
                {feedback.gaps.map((g, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#171A18]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B88632] mt-1.5 flex-shrink-0"></span>
                    {g}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#9A9590] italic">No technical gaps identified.</p>
            )}
          </div>
        </div>

        {/* Recommended Next Steps */}
        <div className="bg-[#F0EDE4] border border-[#DED8CB] rounded-lg p-6 mb-8">
          <h2 className="text-xs font-semibold text-[#245C49] uppercase tracking-widest mb-4 flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Recommended Next Steps
          </h2>
          <div className="border-t border-[#DED8CB] pt-4 space-y-0">
            {feedback.next.map((n, i) => (
              <div key={i} className={`flex items-start gap-4 py-3 text-sm ${i < feedback.next.length - 1 ? 'border-b border-[#DED8CB]/60' : ''}`}>
                <span className="font-mono text-[#6E6A61] text-xs w-6 flex-shrink-0 pt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                {/* Vertical pipe separator per reference */}
                <span className="border-l border-[#DED8CB] pl-4 text-[#171A18] leading-relaxed">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#DED8CB] bg-[#F0EDE4] hover:border-[#245C49]/40 hover:bg-[#EBF2EE]/40 text-[#6E6A61] rounded-lg font-medium text-sm transition-colors"
          >
            ← Interview Another Candidate
          </Link>
        </div>
      </div>
    </div>
  );
}
