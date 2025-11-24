import { IProblemRepository } from './IProblemRepository';
import { SupabaseProblemRepository } from './SupabaseProblemRepository';
import { appConfig } from '../config/app.config';

export class ProblemRepositoryFactory {
  static create(): IProblemRepository {
    const { database } = appConfig;

    switch (database.type) {
      case 'supabase':
        if (!database.supabase) {
          throw new Error('Supabase configuration is missing');
        }
        return new SupabaseProblemRepository(
          database.supabase.url,
          database.supabase.anonKey
        );

      default:
        throw new Error(`Unsupported database type: ${database.type}`);
    }
  }
}
