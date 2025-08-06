export class Logger {
  constructor(private context: string) {}

  info(message: string, data?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${this.context}] ${message}`, data || '');
    }
  }

  error(error: unknown, sensitiveData?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const errorId = Math.random().toString(36).substring(2, 15);

    const safeLog: Record<string, any> = {
      errorId,
      timestamp,
      context: this.context,
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.constructor.name : typeof error,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined,
      }),
    };

    if (sensitiveData) {
      safeLog.data = this.sanitizeData(sensitiveData);
    }

    if (typeof window === 'undefined') {
      console.error(`[${this.context}] Error ${errorId}:`, safeLog);
    }

    return errorId;
  }

  private sanitizeData(data: Record<string, any>): Record<string, any> {
    return Object.keys(data).reduce(
      (acc, key) => {
        if (
          key.toLowerCase().includes('key') ||
          key.toLowerCase().includes('token')
        ) {
          acc[key] = '[REDACTED]';
        } else if (
          typeof data[key] === 'string' &&
          data[key].length > 100
        ) {
          acc[key] = data[key].substring(0, 100) + '...[TRUNCATED]';
        } else {
          acc[key] = data[key];
        }
        return acc;
      },
      {} as Record<string, any>
    );
  }
}