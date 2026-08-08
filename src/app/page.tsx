import { randomUUID } from 'crypto';
import Link from 'next/link';
import { getCandidates } from '@/lib/interview/candidates';


export default function Home() {
  const candidates = getCandidates();

  return (
    <div className="min-h-screen bg-[#020817] text-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">AI Interview Agent</h1>
              <p className="text-xs text-slate-500">ABTalks 31-Day AI Cohort</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Demo Mode Active
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="max-w-5xl w-full">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-800/50 rounded-full px-4 py-1.5 text-xs text-blue-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block"></span>
              Adaptive · Personalised · Curriculum-Grounded
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Technical Interview<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Console</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Select a candidate to begin a dynamic, state-driven technical interview.
              Each interview is uniquely tailored to the candidate&apos;s cohort journey,
              experience level, and real-time answers.
            </p>
          </div>

          {/* Candidate Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Select Candidate
              </h3>
              <span className="text-xs text-slate-600">{candidates.length} candidates available</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {candidates.map((candidate) => {
                const sessionId = `session-${candidate.id}-${randomUUID()}`;
                const track =
                  candidate.yearsOfExperience >= 9
                    ? 'Senior Track'
                    : candidate.yearsOfExperience >= 3
                    ? 'Mid Track'
                    : 'Junior Track';

                return (
                  <div
                    key={candidate.id}
                    className="group bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 hover:bg-slate-900 transition-all duration-200 hover:shadow-xl hover:shadow-blue-950/20"
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-5">
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-slate-400 mt-0.5">{candidate.role}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1">
                        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md font-mono">
                          {candidate.yearsOfExperience} YOE
                        </span>
                        <span className="text-xs text-slate-500">{track}</span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                      <div className="bg-emerald-950/40 border border-emerald-900/30 rounded-lg py-2">
                        <div className="text-emerald-400 font-bold text-lg leading-none">{candidate.completedMissions.length}</div>
                        <div className="text-emerald-700 text-xs mt-1">Done</div>
                      </div>
                      <div className="bg-amber-950/30 border border-amber-900/20 rounded-lg py-2">
                        <div className="text-amber-400 font-bold text-lg leading-none">{candidate.skippedMissions.length}</div>
                        <div className="text-amber-700 text-xs mt-1">Skipped</div>
                      </div>
                      <div className="bg-rose-950/30 border border-rose-900/20 rounded-lg py-2">
                        <div className="text-rose-400 font-bold text-lg leading-none">{candidate.failedMissions.length}</div>
                        <div className="text-rose-700 text-xs mt-1">Failed</div>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="text-xs text-slate-500 mb-5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {candidate.education}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/interview/${sessionId}?candidateId=${candidate.id}`}
                      id={`start-interview-${candidate.id}`}
                      className="block w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white text-center rounded-xl font-semibold text-sm transition-colors group-hover:shadow-lg group-hover:shadow-blue-900/30"
                    >
                      Start Interview →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info footer */}
          <div className="border-t border-slate-800/50 pt-8 grid sm:grid-cols-3 gap-6 text-sm text-slate-500">
            <div>
              <div className="text-slate-300 font-medium mb-1">State-Driven Engine</div>
              <div>Every question adapts based on your previous answers, not a fixed script.</div>
            </div>
            <div>
              <div className="text-slate-300 font-medium mb-1">Curriculum-Grounded</div>
              <div>Questions map to the 31-day AI Engineering cohort curriculum.</div>
            </div>
            <div>
              <div className="text-slate-300 font-medium mb-1">Structured Feedback</div>
              <div>Receive a personalised assessment with strengths, gaps, and next steps.</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
