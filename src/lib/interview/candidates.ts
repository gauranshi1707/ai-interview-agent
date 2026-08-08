import fs from 'fs';
import path from 'path';
import { Candidate } from './types';

let _cache: Candidate[] | null = null;

export function getCandidates(): Candidate[] {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), 'data', 'candidates.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  _cache = JSON.parse(raw) as Candidate[];
  return _cache;
}

export function getCandidateById(id: string): Candidate | undefined {
  return getCandidates().find((c) => c.id === id);
}
