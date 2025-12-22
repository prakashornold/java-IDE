export interface IExecutionLimitService {
  canExecute(): boolean;
  incrementExecutionCount(): void;
  getExecutionCount(): number;
  getRemainingExecutions(): number;
  resetExecutionCount(): void;
}

export class ExecutionLimitService implements IExecutionLimitService {
  private readonly storageKey: string;
  private readonly limit: number;

  constructor(storageKey: string = 'code_execution_count', limit: number = 3) {
    this.storageKey = storageKey;
    this.limit = limit;
  }

  canExecute(): boolean {
    return this.getExecutionCount() < this.limit;
  }

  incrementExecutionCount(): void {
    const currentCount = this.getExecutionCount();
    localStorage.setItem(this.storageKey, (currentCount + 1).toString());
  }

  getExecutionCount(): number {
    return parseInt(localStorage.getItem(this.storageKey) || '0', 10);
  }

  getRemainingExecutions(): number {
    return Math.max(0, this.limit - this.getExecutionCount());
  }

  resetExecutionCount(): void {
    localStorage.removeItem(this.storageKey);
  }

  getLimit(): number {
    return this.limit;
  }
}

export const executionLimitService = new ExecutionLimitService();
