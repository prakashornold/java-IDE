import { DifficultyLevel } from '../types/problem.types';

interface DifficultyTheme {
  color: string;
  bgColor: string;
  badgeClass: string;
}

const DIFFICULTY_THEMES: Record<DifficultyLevel | 'default', DifficultyTheme> = {
  basic: {
    color: '#6aab73',
    bgColor: 'rgba(106, 171, 115, 0.06)',
    badgeClass: 'bg-[#6aab73]/12 text-[#6aab73] border border-[#6aab73]/25',
  },
  intermediate: {
    color: '#5294d0',
    bgColor: 'rgba(82, 148, 208, 0.06)',
    badgeClass: 'bg-[#5294d0]/12 text-[#5294d0] border border-[#5294d0]/25',
  },
  advanced: {
    color: '#cc7832',
    bgColor: 'rgba(204, 120, 50, 0.06)',
    badgeClass: 'bg-[#cc7832]/12 text-[#cc7832] border border-[#cc7832]/25',
  },
  expert: {
    color: '#cf6679',
    bgColor: 'rgba(207, 102, 121, 0.06)',
    badgeClass: 'bg-[#cf6679]/12 text-[#cf6679] border border-[#cf6679]/25',
  },
  default: {
    color: '#d5d9e0',
    bgColor: 'transparent',
    badgeClass: 'bg-[#9ba1ad]/12 text-[#9ba1ad] border border-[#9ba1ad]/25',
  },
};

export function getDifficultyColor(difficulty: string): string {
  const theme = DIFFICULTY_THEMES[difficulty as DifficultyLevel] || DIFFICULTY_THEMES.default;
  return theme.color;
}

export function getDifficultyBgColor(difficulty: string): string {
  const theme = DIFFICULTY_THEMES[difficulty as DifficultyLevel] || DIFFICULTY_THEMES.default;
  return theme.bgColor;
}

export function getDifficultyBadgeClass(difficulty: string): string {
  const theme = DIFFICULTY_THEMES[difficulty as DifficultyLevel] || DIFFICULTY_THEMES.default;
  return theme.badgeClass;
}

export const DIFFICULTY_ORDER: Record<DifficultyLevel, number> = {
  basic: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

export function compareDifficulty(a: string, b: string): number {
  const orderA = DIFFICULTY_ORDER[a as DifficultyLevel] ?? 99;
  const orderB = DIFFICULTY_ORDER[b as DifficultyLevel] ?? 99;
  return orderA - orderB;
}
