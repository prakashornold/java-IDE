export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface JavaProblem {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description?: string;
  starter_code?: string;
  solution_code?: string;
  input?: string;
  solution?: string;
  output?: string;
  hints?: string;
  created_at: string;
  updated_at: string;
}

export function hasContent(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export interface ProblemFilter {
  difficulty?: DifficultyLevel | 'all';
  searchTerm?: string;
}
