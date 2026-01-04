import { IProblemRepository } from './IProblemRepository';
import { ApiProblemRepository } from './ApiProblemRepository';
import { appConfig } from '../config/app.config';

export class ProblemRepositoryFactory {
  static create(): IProblemRepository {
    const { api } = appConfig;
    return new ApiProblemRepository(api.baseUrl);
  }
}
