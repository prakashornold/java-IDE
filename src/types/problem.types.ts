export type DifficultyLevel = 'basic' | 'intermediate' | 'advanced' | 'expert';

/**
 * Complete problem data from database
 * Represents all columns from java_problems table
 */
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

/**
 * Display-optimized problem data
 * Interface Segregation - UI components use only what they need
 */
export interface ProblemDisplayData {
  id: string;
  number: number;
  title: string;
  difficulty: DifficultyLevel;
  category: string;
  description?: string;
  input?: string;
  output?: string;
  hints?: string;
}

/**
 * Code-related problem data
 * Separates code concerns from metadata
 */
export interface ProblemCodeData {
  starter_code?: string;
  solution_code?: string;
  solution?: string;
}

/**
 * Type guard to check if a field has displayable content
 */
export function hasContent(value: string | undefined | null): boolean {
  return Boolean(value && value.trim().length > 0);
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
