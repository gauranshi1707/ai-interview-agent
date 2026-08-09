import { randomUUID } from 'crypto';
import Link from 'next/link';
import { getCandidates } from '@/lib/interview/candidates';

export default function Home() {
  const candidates = getCandidates();

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#171A18] flex flex-col">

      {/* Header */}
      <header className="border-b border-[#DED8CB] px-6 py-4 bg-[#F7F4EC]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#245C49] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[#171A18]">AI Interview Agent</h1>
              <p className="text-xs text-[#9A9590]">ABTalks 31-Day AI Cohort</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-[#6E6A61]">
            <span className="w-2 h-2 rounded-full bg-[#245C49] inline-block"></span>
            Demo Mode Active
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center py-16 px-4">
        <div className="max-w-5xl w-full">

          {/* Hero */}
          <div className="text-center mb-16 relative">
            {/* Subtle geometric marks */}
            <div className="absolute left-8 top-16 text-[#DED8CB] text-xs select-none pointer-events-none hidden lg:block" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="12" y1="0" x2="12" y2="24" stroke="currentColor" strokeWidth="0.75"/>
                <line x1="0" y1="12" x2="24" y2="12" stroke="currentColor" strokeWidth="0.75"/>
              </svg>
            </div>
            <div className="absolute right-8 top-24 text-[#DED8CB] text-xs select-none pointer-events-none hidden lg:block" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <line x1="10" y1="0" x2="10" y2="20" stroke="currentColor" strokeWidth="0.75"/>
                <line x1="0" y1="10" x2="20" y2="10" stroke="currentColor" strokeWidth="0.75"/>
              </svg>
            </div>

            {/* Adaptive badge */}
            <div className="inline-flex items-center gap-2 border border-[#DED8CB] bg-[#F0EDE4] rounded-full px-4 py-1.5 text-xs text-[#6E6A61] mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#245C49] inline-block"></span>
              Adaptive · Personalised · Curriculum-Grounded
            </div>

            {/* Main heading — Playfair serif */}
            <h2 className="font-serif text-5xl font-medium tracking-tight text-[#171A18] mb-1 leading-tight">
              Technical Interview
            </h2>
            {/* "Console" italic green + sparkle decorations */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[#B88632] text-lg select-none" aria-hidden="true">✦</span>
              <h2 className="font-serif text-5xl font-medium italic text-[#245C49] tracking-tight leading-tight">
                Console
              </h2>
              <span className="text-[#B88632] text-lg select-none" aria-hidden="true">✦</span>
            </div>

            <p className="text-[#6E6A61] text-base max-w-xl mx-auto leading-relaxed">
              Select a candidate to begin a dynamic, state-driven technical interview.
              Each interview is uniquely tailored to the candidate&apos;s cohort journey,
              experience level, and real-time answers.
            </p>
          </div>

          {/* Candidate Cards */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-semibold text-[#6E6A61] uppercase tracking-widest border-b border-[#B88632] pb-0.5">
                Select Candidate
              </h3>
              <span className="text-xs text-[#9A9590]">{candidates.length} candidates available</span>
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
                    className="group bg-[#F0EDE4] border border-[#DED8CB] rounded-lg p-6 hover:border-[#245C49]/40 hover:bg-[#EBF2EE]/30 transition-all duration-200"
                  >
                    {/* Card header — name + YOE badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-serif text-xl font-medium text-[#171A18] group-hover:text-[#245C49] transition-colors leading-tight">
                          {candidate.name}
                        </h4>
                        <p className="text-sm text-[#6E6A61] mt-0.5">{candidate.role}</p>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 flex-shrink-0 ml-3">
                        <span className="bg-[#EAE6DC] border border-[#DED8CB] text-[#6E6A61] text-xs px-2 py-0.5 rounded font-mono">
                          {candidate.yearsOfExperience} YOE
                        </span>
                        <span className="text-xs text-[#9A9590]">{track}</span>
                      </div>
                    </div>

                    {/* Stats — inline, no colored boxes */}
                    <div className="grid grid-cols-3 gap-3 mb-5 text-center border-t border-[#DED8CB] pt-4">
                      <div>
                        <div className="text-[#245C49] font-semibold text-xl leading-none">{candidate.completedMissions.length}</div>
                        <div className="text-[#9A9590] text-xs mt-1">Done</div>
                      </div>
                      <div>
                        <div className="text-[#B88632] font-semibold text-xl leading-none">{candidate.skippedMissions.length}</div>
                        <div className="text-[#9A9590] text-xs mt-1">Skipped</div>
                      </div>
                      <div>
                        <div className="text-[#8C4A3C] font-semibold text-xl leading-none">{candidate.failedMissions.length}</div>
                        <div className="text-[#9A9590] text-xs mt-1">Failed</div>
                      </div>
                    </div>

                    {/* Education */}
                    <div className="text-xs text-[#9A9590] mb-5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      </svg>
                      {candidate.education}
                    </div>

                    {/* CTA — outlined green, matching reference */}
                    <Link
                      href={`/interview/${sessionId}?candidateId=${candidate.id}`}
                      id={`start-interview-${candidate.id}`}
                      className="block w-full py-2.5 px-4 border border-[#245C49] text-[#245C49] hover:bg-[#245C49] hover:text-white text-center rounded-md font-medium text-sm transition-colors duration-150"
                    >
                      Start Interview →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Info footer */}
          <div className="border-t border-[#DED8CB] pt-8 grid sm:grid-cols-3 gap-6 text-sm text-[#9A9590]">
            <div>
              <div className="text-[#6E6A61] font-medium mb-1">State-Driven Engine</div>
              <div>Every question adapts based on your previous answers, not a fixed script.</div>
            </div>
            <div>
              <div className="text-[#6E6A61] font-medium mb-1">Curriculum-Grounded</div>
              <div>Questions map to the 31-day AI Engineering cohort curriculum.</div>
            </div>
            <div>
              <div className="text-[#6E6A61] font-medium mb-1">Structured Feedback</div>
              <div>Receive a personalised assessment with strengths, gaps, and next steps.</div>
            </div>
          </div>

          {/* Bottom tagline */}
          <div className="text-center mt-10 text-xs text-[#9A9590] flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5 text-[#B88632]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure · Private · Built for Technical Excellence
          </div>
        </div>
      </main>
    </div>
  );
}
