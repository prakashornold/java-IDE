export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface ServiceResponse<T> {
  data?: T;
  error?: string;
  status: 'success' | 'error';
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export type AsyncOperation<T> = Promise<ServiceResponse<T>>;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface LayoutConfig {
  mode: 'bottom' | 'side';
  outputSize: number;
  isMobile: boolean;
}
