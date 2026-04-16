import { Request, Response, NextFunction } from 'express';

const VALIDATION_KEYWORDS = [
  'already exists',
  'not found',
  'empty',
  'invalid',
  'Playlist is empty',
];

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isValidationError = VALIDATION_KEYWORDS.some(keyword =>
    err.message.includes(keyword)
  );

  const statusCode = isValidationError ? 400 : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message,
    timestamp: new Date().toISOString(),
  });
}
