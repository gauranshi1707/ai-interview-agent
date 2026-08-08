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
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Use a ref-based mount guard to avoid calling setState synchronously in effect
  const hasStarted: MutableRefObject<boolean> = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  // Auto-start the interview (ref guard avoids setState-in-effect lint error)
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

      // Update progress from response headers or embedded data
      if (data.meta) {
        setCurriculumDays(data.meta.curriculumDaysCovered ?? []);
        setCompetencies(data.meta.competenciesCovered ?? []);
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

  if (done && feedback) {
    return <FeedbackScreen candidate={candidate} feedback={feedback} questionCount={questionCount} competencies={competencies} />;
  }

  return (
    <div className="min-h-screen bg-[#020817] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-white font-semibold">{candidate.name}</span>
                <span className="text-slate-500 text-sm">·</span>
                <span className="text-slate-400 text-sm">{candidate.role}</span>
                <span className="text-slate-500 text-sm">·</span>
                <span className="text-slate-400 text-sm">{candidate.yearsOfExperience} YOE</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs text-blue-400 bg-blue-950/50 border border-blue-800/40 rounded-full px-2 py-0.5">
                  <span className="w-1 h-1 rounded-full bg-blue-400 inline-block"></span>
                  Tailored to Cohort Journey
                </span>
                <span className="text-xs text-slate-500">{track}</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex-shrink-0 text-right">
            <div className="text-white font-semibold text-sm">Q{questionCount}</div>
            <div className="text-xs text-slate-500">
              {curriculumDays.length} topic{curriculumDays.length !== 1 ? 's' : ''} covered
            </div>
          </div>
        </div>

        {/* Cohort stats bar */}
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="text-emerald-400">{candidate.completedMissions.length} completed</span>
            <span>·</span>
            <span className="text-amber-400">{candidate.skippedMissions.length} skipped</span>
            <span>·</span>
            <span className="text-rose-400">{candidate.failedMissions.length} failed</span>
            {competencies.length > 0 && (
              <>
                <span>·</span>
                <span className="text-slate-400">Assessing: {competencies.slice(-2).join(', ')}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fade-in ${msg.role === 'candidate' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold
                ${msg.role === 'interviewer' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                {msg.role === 'interviewer' ? 'AI' : candidate.name.charAt(0).toUpperCase()}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] sm:max-w-[72%] ${msg.role === 'candidate' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <span className="text-xs text-slate-500">
                  {msg.role === 'interviewer' ? 'Interviewer' : candidate.name}
                </span>
                <div className={`rounded-2xl px-4 py-3 leading-relaxed text-sm
                  ${msg.role === 'interviewer'
                    ? 'bg-slate-800 text-slate-200 rounded-tl-sm'
                    : 'bg-blue-600 text-white rounded-tr-sm'
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-slate-500">Interviewer</span>
                <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-rose-950/50 border border-rose-800/50 text-rose-300 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!done && (
        <div className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
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
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || done || !input.trim()}
                id="send-button"
                className="px-5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium text-sm transition-colors self-end h-[52px] flex-shrink-0"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-slate-600 mt-2 text-center">
              Question {questionCount} · {Math.max(0, 8 - questionCount)} more required · Press Enter to send
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Feedback Screen Component
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
    <div className="min-h-screen bg-[#020817] text-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 mb-5">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Complete</h1>
          <p className="text-slate-400">
            {candidate.name} · {candidate.role} · {questionCount} questions · {competencies.length || 4} competencies assessed
          </p>
        </div>

        {/* Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Overall Assessment</h2>
          <p className="text-slate-200 leading-relaxed">{feedback.summary}</p>
        </div>

        {/* Strengths */}
        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-2xl p-6 mb-4">
          <h2 className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Demonstrated Strengths
          </h2>
          {feedback.strengths.length > 0 ? (
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  {s}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No technical strengths demonstrated during this session.
            </p>
          )}
        </div>

        {/* Gaps */}
        <div className="bg-amber-950/20 border border-amber-900/30 rounded-2xl p-6 mb-4">
          <h2 className="text-xs font-semibold text-amber-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Gaps
          </h2>
          <ul className="space-y-2">
            {feedback.gaps.map((g, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0"></span>
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-950/20 border border-blue-900/30 rounded-2xl p-6 mb-8">
          <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Recommended Next Steps
          </h2>
          <ul className="space-y-2">
            {feedback.next.map((n, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-blue-200">
                <span className="font-mono text-blue-500 text-xs mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
                {n}
              </li>
            ))}
          </ul>
        </div>

        {/* Back button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium text-sm transition-colors"
          >
            ← Interview Another Candidate
          </Link>
        </div>
      </div>
    </div>
  );
}
