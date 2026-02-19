export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/** Problem data as returned by the java_problems table */
export interface JavaProblem {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  description?: string;
  input?: string;
  output?: string;
  starter_code?: string;
  solution_code?: string;
  hints?: string;
  created_at: string;
  updated_at: string;
}

/** Filter criteria for querying problems */
export interface ProblemFilter {
  difficulty?: DifficultyLevel | 'all';
  searchTerm?: string;
}

/** DTO for creating a new problem via the admin panel */
export interface AddProblemData {
  title: string;
  category: string;
  difficulty: string;
  description?: string;
  input?: string;
  output?: string;
  starter_code: string;
  solution_code: string;
  hints?: string;
}

/** Complete problem record from the database (Admin view) */
export interface ProblemData {
  id: string;
  number: number;
  title: string;
  category: string;
  difficulty: string;
  description?: string;
  starter_code?: string;
  solution_code?: string;
  hints?: string;
  created_at: string;
  updated_at: string;
}
