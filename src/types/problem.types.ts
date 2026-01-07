export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

export interface JavaProblem {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  input: string;
  solution: string;
  output: string;
  hints?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemFilter {
  difficulty?: DifficultyLevel | 'all';
  searchTerm?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
