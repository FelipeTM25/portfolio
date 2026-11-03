import type { StackLayer } from './types'

/**
 * Language-independent stack data. `usedIn` keys are translated in each locale.
 * `relevance` (1–5) drives the ORDER BY and the bar in the table: 5 = what I use
 * every day at Bancolombia.
 */
export const STACK: { name: string; layers: StackLayer[]; usedIn: string[]; relevance: number }[] = [
  { name: 'Java', layers: ['backend'], usedIn: ['work', 'Voll Med'], relevance: 5 },
  { name: 'Spring Boot', layers: ['backend'], usedIn: ['work', 'Voll Med'], relevance: 5 },
  { name: 'Angular', layers: ['frontend'], usedIn: ['work', 'Fuelix', 'Conciliador'], relevance: 5 },
  { name: 'PostgreSQL', layers: ['datos'], usedIn: ['work', 'Fuelix', 'Voll Med', 'IoT'], relevance: 5 },
  { name: 'Azure DevOps', layers: ['infra'], usedIn: ['work'], relevance: 5 },
  { name: 'AWS', layers: ['infra'], usedIn: ['work', 'IoT'], relevance: 5 },
  { name: 'TypeScript', layers: ['frontend', 'backend'], usedIn: ['work', 'Fuelix', 'Fitally'], relevance: 4 },
  { name: 'Git · GitHub', layers: ['infra'], usedIn: ['everything'], relevance: 4 },
  { name: 'React', layers: ['frontend'], usedIn: ['Fitally', 'Unicash', 'Sphera', 'portfolio'], relevance: 4 },
  { name: 'NestJS', layers: ['backend'], usedIn: ['Fuelix'], relevance: 3 },
  { name: 'Node.js + Express', layers: ['backend'], usedIn: ['Fitally'], relevance: 3 },
  { name: 'Supabase', layers: ['datos'], usedIn: ['Fuelix', 'Fitally'], relevance: 3 },
  { name: 'Tailwind CSS', layers: ['frontend'], usedIn: ['Fuelix', 'Fitally', 'Unicash'], relevance: 3 },
  { name: 'Docker', layers: ['infra'], usedIn: ['IoT', 'Fuelix'], relevance: 3 },
  { name: 'Python + FastAPI', layers: ['backend'], usedIn: ['Conciliador', 'IoT'], relevance: 2 },
  { name: 'Three.js', layers: ['frontend'], usedIn: ['Sphera'], relevance: 2 },
  { name: 'MySQL', layers: ['datos'], usedIn: ['university'], relevance: 2 },
  { name: 'PL/pgSQL · T-SQL', layers: ['datos'], usedIn: ['university'], relevance: 2 },
]
