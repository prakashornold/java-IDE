import { IProblemRepository } from './IProblemRepository';
import { SupabaseProblemRepository } from './SupabaseProblemRepository';

export class ProblemRepositoryFactory {
  static create(): IProblemRepository {
    return new SupabaseProblemRepository();
  }
}
