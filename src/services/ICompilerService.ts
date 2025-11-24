import { CompilerResponse } from '../types/compiler.types';

export interface ICompilerService {
  execute(code: string, stdin?: string): Promise<CompilerResponse>;
}
