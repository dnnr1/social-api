import type { Request, Response, NextFunction } from "express";

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function paginationMiddleware(
  defaultLimit: number = 20,
  maxLimit: number = 100
) {
  return (req: Request, _: Response, next: NextFunction) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };
    next();
  };
}

declare global {
  namespace Express {
    interface Request {
      pagination?: PaginationParams;
    }
  }
}