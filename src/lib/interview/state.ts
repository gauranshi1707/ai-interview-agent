import { InterviewState } from './types';

// Survive hot-reloads in Next.js dev mode
declare global {
  var __sessionStore: Map<string, InterviewState> | undefined;
}

const store: Map<string, InterviewState> =
  global.__sessionStore ?? new Map<string, InterviewState>();

if (process.env.NODE_ENV !== 'production') {
  global.__sessionStore = store;
}

export function getSession(sessionId: string): InterviewState | undefined {
  return store.get(sessionId);
}

export function saveSession(state: InterviewState): void {
  store.set(state.sessionId, state);
}

export function deleteSession(sessionId: string): void {
  store.delete(sessionId);
}
