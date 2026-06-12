import { getRedis } from "./redis.js";

const DEFAULT_TTL = 300;

let cacheEnabled = true;

export function enableCache(enabled: boolean): void {
  cacheEnabled = enabled;
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  if (!cacheEnabled) return null;

  try {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
  if (!cacheEnabled) return;

  try {
    const redis = getRedis();
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch {
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  if (!cacheEnabled) return;

  try {
    const redis = getRedis();
    let cursor = "0";
    do {
      const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = nextCursor;
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch {
  }
}

export function buildCacheKey(...parts: string[]): string {
  return `cache:${parts.join(":")}`;
}
