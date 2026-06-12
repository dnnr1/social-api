import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { getRedis } from "./redis.js";
import { buildCacheKey } from "./cache.js";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY_SEC = 7 * 24 * 60 * 60;
const REFRESH_TOKEN_EXPIRY = "7d";

interface TokenPayload {
  id: string;
  role: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret as string, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.jwtSecret as string, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

export async function storeRefreshToken(userId: string, token: string): Promise<void> {
  try {
    const redis = getRedis();
    const key = buildCacheKey("refresh", userId);
    await redis.setex(key, REFRESH_TOKEN_EXPIRY_SEC, token);
  } catch {
  }
}

export async function verifyRefreshToken(token: string): Promise<TokenPayload | null> {
  try {
    const decoded = jwt.verify(token, config.jwtSecret as string) as TokenPayload;

    const redis = getRedis();
    const key = buildCacheKey("refresh", decoded.id);
    const stored = await redis.get(key);

    if (stored !== token) return null;

    return decoded;
  } catch {
    return null;
  }
}

export async function revokeRefreshToken(userId: string): Promise<void> {
  try {
    const redis = getRedis();
    const key = buildCacheKey("refresh", userId);
    await redis.del(key);
  } catch {
  }
}

export async function generateTokens(payload: TokenPayload) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await storeRefreshToken(payload.id, refreshToken);

  return { accessToken, refreshToken };
}
