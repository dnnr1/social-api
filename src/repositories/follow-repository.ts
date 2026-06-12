import { prisma } from "../db.js";
import type {
  FollowDTO,
  FollowResponseDTO,
  GetFollowersResponseDTO,
  GetFollowingResponseDTO,
} from "../dto/followDTO.js";
import { getCachedData, setCachedData, invalidateCache, buildCacheKey } from "../utils/cache.js";

export async function createFollowRepository(
  data: FollowDTO,
): Promise<FollowResponseDTO> {
  const follow = await prisma.follow.create({ data });

  await invalidateCache(buildCacheKey("follow:*"));

  return follow;
}

export async function deleteFollowRepository(
  data: FollowDTO,
): Promise<FollowResponseDTO> {
  const { followerId, followingId } = data;

  const follow = await prisma.follow.delete({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  await invalidateCache(buildCacheKey("follow:*"));

  return follow;
}

export async function findFollowRepository(
  data: FollowDTO,
): Promise<FollowResponseDTO | null> {
  const { followerId, followingId } = data;

  const cacheKey = buildCacheKey("follow", followerId, followingId);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const follow = await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });

  if (follow) {
    await setCachedData(cacheKey, follow, 300);
  }

  return follow;
}

export async function findFollowersByUserIdRepository(
  userId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetFollowersResponseDTO[]> {
  const cacheKey = buildCacheKey("follow", "followers", userId, `skip:${skip}`, `limit:${limit}`);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const followers = await prisma.follow.findMany({
    where: { followingId: userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  await setCachedData(cacheKey, followers, 300);

  return followers;
}

export async function findFollowingByUserIdRepository(
  userId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetFollowingResponseDTO[]> {
  const cacheKey = buildCacheKey("follow", "following", userId, `skip:${skip}`, `limit:${limit}`);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const following = await prisma.follow.findMany({
    where: { followerId: userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  await setCachedData(cacheKey, following, 300);

  return following;
}
