import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please check your input fields.',
      errors: formattedErrors
    });
  }

  // Mongoose Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(
      res,
      `A record with this ${field} already exists: ${err.keyValue[field]}`,
      409
    );
  }

  // Mongoose CastError (Invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Resource not found. Invalid ID: ${err.value}`, 404);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    return sendError(res, `Validation error: ${messages.join(', ')}`, 400);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token. Please authenticate again.', 401);
  }
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired. Please login again.', 401);
  }

  // Generic status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error. Please try again later.';

  return sendError(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : undefined);
};
