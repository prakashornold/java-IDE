import { createContext, useContext, ReactNode } from 'react';
import { ProblemRepositoryFactory } from '../repositories/ProblemRepositoryFactory';
import { ProblemService } from '../services/ProblemService';
import { JavaCompilerService } from '../services/JavaCompilerService';
import { ICompilerService } from '../services/ICompilerService';

interface ServiceContextType {
  problemService: ProblemService;
  compilerService: ICompilerService;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const problemRepository = ProblemRepositoryFactory.create();
  const problemService = new ProblemService(problemRepository);
  const compilerService = new JavaCompilerService();

  return (
    <ServiceContext.Provider value={{ problemService, compilerService }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}
