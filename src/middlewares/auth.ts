import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/types.js";

const secret = process.env.JWT_SECRET;

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  if (!token) {
    throw new Error("Token is missing!");
  }

  try {
    const decoded = jwt.verify(token, secret as string);
    req.user = decoded as TokenPayload;
  } catch (error) {
    throw new Error("Invalid Token");
  }

  next();
}

export default authMiddleware;
