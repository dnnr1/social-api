import { prisma } from "../db.js";
import type { CreateUserDTO, CreateUserResponseDTO } from "../dto/userDTO.js";
import { getCachedData, setCachedData, invalidateCache, buildCacheKey } from "../utils/cache.js";

export async function createUserRepository(
  data: CreateUserDTO,
): Promise<CreateUserResponseDTO> {
  const user = await prisma.user.create({ data, omit: { password: true } });

  await invalidateCache(buildCacheKey("user:*"));

  return user;
}

export async function findUserByEmailRepository(email: string) {
  const cacheKey = buildCacheKey("user", "email", email);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    await setCachedData(cacheKey, user, 600);
  }

  return user;
}

export async function findUserByIdRepository(id: string) {
  const cacheKey = buildCacheKey("user", "id", id);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user) {
    await setCachedData(cacheKey, user, 600);
  }

  return user;
}
