import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import AppError from "../appError.js";

const errorHandler = (
  err: Error | z.ZodError | unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(400).json({
      ok: false,
      status: 400,
      message: "Validation error",
      errors: err.issues,
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ok: false,
      status: err.statusCode,
      message: err.message,
    });
    return;
  }

  res.status(500).json({
    ok: false,
    status: 500,
    message: err instanceof Error ? err.message : "Internal server error",
  });
};

export default errorHandler;
