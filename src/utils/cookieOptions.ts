import { config } from "../config/index.js";
import type { CookieOptions } from "express";

export function getCookieOptions(): CookieOptions {
  const isProduction = config.nodeEnv === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  } as CookieOptions;
}