import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  statusCode: number;
  stack?: string;
}

class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const error: ErrorResponse = {
    message: err.message || 'Server Error',
    statusCode: 'statusCode' in err ? err.statusCode : 500,
  };

  // Add stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    error.stack = err.stack;
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(error.stack && { stack: error.stack }),
  });
};

export { errorHandler, AppError };
