export interface IErrorHandler {
  handleError(error: unknown): string;
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
}

export const errorHandlingService = new ErrorHandlingService();
