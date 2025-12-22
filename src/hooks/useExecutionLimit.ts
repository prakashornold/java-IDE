import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { executionLimitService } from '../services/ExecutionLimitService';

export interface UseExecutionLimitResult {
  canExecute: boolean;
  remainingExecutions: number;
  executionCount: number;
  incrementCount: () => void;
  resetCount: () => void;
}

export function useExecutionLimit(): UseExecutionLimitResult {
  const { user } = useAuth();
  const [executionCount, setExecutionCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setExecutionCount(executionLimitService.getExecutionCount());
    } else {
      executionLimitService.resetExecutionCount();
      setExecutionCount(0);
    }
  }, [user]);

  const incrementCount = () => {
    if (!user) {
      executionLimitService.incrementExecutionCount();
      setExecutionCount(executionLimitService.getExecutionCount());
    }
  };

  const resetCount = () => {
    executionLimitService.resetExecutionCount();
    setExecutionCount(0);
  };

  return {
    canExecute: user !== null || executionLimitService.canExecute(),
    remainingExecutions: executionLimitService.getRemainingExecutions(),
    executionCount,
    incrementCount,
    resetCount,
  };
}
