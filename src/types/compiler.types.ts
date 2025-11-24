export interface CompilerRequest {
  language: string;
  code: string;
  stdin: string;
  filename: string;
}

export interface CompilerResponse {
  output?: string;
  error?: string;
  status?: string;
}

export interface CompilerAPIResponse {
  data: {
    output?: string;
    error?: string;
    codeStatus?: {
      id: number;
      description: string;
    };
    time?: string;
    memory?: number;
  };
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'error';

export interface ExecutionResult {
  output: string;
  hasError: boolean;
  status: ExecutionStatus;
}
