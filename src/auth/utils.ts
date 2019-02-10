import { Response, Request, NextFunction } from 'express';

export function loginRequired(request: Request, response: Response, next: NextFunction) {
  if (!request.user) {
    return response.status(401).json({ message: "Please log in." });
  }
  
  return next();
}