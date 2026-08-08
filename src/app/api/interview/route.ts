import { NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/interview/state';
import { initializeInterview, processAnswer } from '@/lib/interview/engine';
import type { Candidate } from '@/lib/interview/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, candidate, message } = body as {
      sessionId?: string;
      candidate?: Candidate;
      message?: string;
    };

    // --- Validation ---
    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid sessionId' }, { status: 400 });
    }

    let state = getSession(sessionId);

    // --- Initialization request ---
    if (!state) {
      if (!candidate) {
        return NextResponse.json(
          { error: 'No active session for this sessionId. Provide a candidate to start.' },
          { status: 400 }
        );
      }

      state = await initializeInterview(sessionId, candidate);
      saveSession(state);

      const reply = state.messages[state.messages.length - 1].content;
      return NextResponse.json({ reply, done: false });
    }

    // --- Already done ---
    if (state.done) {
      return NextResponse.json({
        reply: 'This interview session has already been completed.',
        done: true,
        feedback: state.feedback,
      });
    }

    // --- Conversation turn ---
    if (message === undefined || message === null) {
      return NextResponse.json(
        { error: 'Provide a message for ongoing sessions' },
        { status: 400 }
      );
    }

    state = await processAnswer(state, String(message));
    saveSession(state);

    if (state.done) {
      return NextResponse.json({
        reply: 'Interview completed.',
        done: true,
        feedback: state.feedback,
      });
    }

    const reply = state.messages[state.messages.length - 1].content;
    return NextResponse.json({ reply, done: false });
  } catch (err) {
    console.error('Interview API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
