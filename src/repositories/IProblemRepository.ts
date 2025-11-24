import { JavaProblem, ProblemFilter } from '../types/problem.types';

export interface IProblemRepository {
  getAll(): Promise<JavaProblem[]>;
  getById(id: string): Promise<JavaProblem | null>;
  getByNumber(number: number): Promise<JavaProblem | null>;
  getRandom(): Promise<JavaProblem | null>;
  getByFilter(filter: ProblemFilter): Promise<JavaProblem[]>;
}
