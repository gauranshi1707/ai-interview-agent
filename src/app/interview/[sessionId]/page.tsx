import { notFound } from 'next/navigation';
import { getCandidateById } from '@/lib/interview/candidates';
import InterviewConsole from '@/components/InterviewConsole';

interface Props {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ candidateId?: string }>;
}

export default async function InterviewPage({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { candidateId } = await searchParams;

  if (!candidateId) {
    notFound();
  }

  const candidate = getCandidateById(candidateId);

  if (!candidate) {
    notFound();
  }

  return (
    <InterviewConsole
      sessionId={sessionId}
      candidate={candidate}
    />
  );
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { sessionId } = await params;
  const { candidateId } = await searchParams;
  const candidate = candidateId ? getCandidateById(candidateId) : undefined;

  return {
    title: candidate
      ? `Interview — ${candidate.name} | AI Interview Agent`
      : `Interview ${sessionId} | AI Interview Agent`,
  };
}
