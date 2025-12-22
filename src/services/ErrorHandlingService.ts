export interface IErrorHandler {
  handleError(error: unknown): string;
  isNetworkError(error: unknown): boolean;
  isAuthError(error: unknown): boolean;
}

export class ErrorHandlingService implements IErrorHandler {
  handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message: unknown }).message);
    }

    return 'An unexpected error occurred';
  }

  isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.toLowerCase().includes('network') ||
             error.message.toLowerCase().includes('connection');
    }
    return false;
  }

  isAuthError(error: unknown): boolean {
    if (error instanceof Error) {
      return error.message.toLowerCase().includes('auth') ||
             error.message.toLowerCase().includes('unauthorized') ||
             error.message.toLowerCase().includes('forbidden');
    }
    return false;
  }
}

export const errorHandlingService = new ErrorHandlingService();
