import { IProblemRepository } from '../repositories/IProblemRepository';
import { JavaProblem, ProblemFilter } from '../types/problem.types';

export class ProblemService {
  constructor(private repository: IProblemRepository) {}

  async getAllProblems(): Promise<JavaProblem[]> {
    return this.repository.getAll();
  }

  async getProblemById(id: string): Promise<JavaProblem | null> {
    return this.repository.getById(id);
  }

  async getProblemByNumber(number: number): Promise<JavaProblem | null> {
    return this.repository.getByNumber(number);
  }

  async getRandomProblem(): Promise<JavaProblem | null> {
    return this.repository.getRandom();
  }

  async getProblemsByFilter(filter: ProblemFilter): Promise<JavaProblem[]> {
    return this.repository.getByFilter(filter);
  }

  extractPracticeCode(solution: string): string {
    const mainMethodRegex = /public\s+static\s+void\s+main\s*\([^)]*\)\s*\{([\s\S]*?)\n\s*\}/;
    return solution.replace(
      mainMethodRegex,
      'public static void main(String[] args) {\n        \n    }'
    );
  }
}
