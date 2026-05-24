import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/shared/error/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      data: { message: err.message },
      success: false,
    });
  }

  return res.status(500).json({
    data: { message: 'Internal server error' },
    success: false,
  });
}
