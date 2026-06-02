import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import AppError from "../appError.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
} from "../constants/httpStatus.js";

const errorHandler = (
  err: Error | z.ZodError | unknown,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  __: NextFunction,
) => {
  if (err instanceof z.ZodError) {
    res.status(HTTP_BAD_REQUEST).json({
      ok: false,
      status: HTTP_BAD_REQUEST,
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

  res.status(HTTP_INTERNAL_SERVER_ERROR).json({
    ok: false,
    status: HTTP_INTERNAL_SERVER_ERROR,
    message: err instanceof Error ? err.message : "Internal server error",
  });
};

export default errorHandler;
