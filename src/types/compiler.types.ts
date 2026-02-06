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
  };
}
