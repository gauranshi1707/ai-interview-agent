import fs from 'fs';
import path from 'path';
import { CurriculumTopic } from './types';

let _cache: CurriculumTopic[] | null = null;

export function getCurriculum(): CurriculumTopic[] {
  if (_cache) return _cache;
  const filePath = path.join(process.cwd(), 'data', 'curriculum.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  _cache = JSON.parse(raw) as CurriculumTopic[];
  return _cache;
}

export function getCurriculumDay(day: number): CurriculumTopic | undefined {
  return getCurriculum().find((t) => t.day === day);
}
