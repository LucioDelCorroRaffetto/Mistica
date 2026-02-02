import { Response } from 'express';

export interface ApiResponse<T = any> {
  ok: boolean;
  payload?: T;
  message?: string;
  error?: string;
}

export function sendSuccess<T>(
  res: Response,
  payload: T,
  statusCode: number = 200
): Response {
  return res.status(statusCode).json({
    ok: true,
    payload,
  } as ApiResponse<T>);
}

export function sendValidationError(
  res: Response,
  errors: string[]
): Response {
  return res.status(400).json({
    ok: false,
    error: 'Validation Error',
    message: errors.join('; '),
  } as ApiResponse);
}

export function sendNotFound(res: Response, message: string): Response {
  return res.status(404).json({
    ok: false,
    error: 'Not Found',
    message,
  } as ApiResponse);
}

export function sendUnauthorized(res: Response, message: string = 'No autorizado'): Response {
  return res.status(401).json({
    ok: false,
    error: 'Unauthorized',
    message,
  } as ApiResponse);
}

export function sendConflict(res: Response, message: string): Response {
  return res.status(409).json({
    ok: false,
    error: 'Conflict',
    message,
  } as ApiResponse);
}

export function sendServerError(
  res: Response,
  message: string = 'Error interno del servidor'
): Response {
  return res.status(500).json({
    ok: false,
    error: 'Internal Server Error',
    message,
  } as ApiResponse);
}
