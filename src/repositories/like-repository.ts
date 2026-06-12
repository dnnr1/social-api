import { prisma } from "../db.js";
import type {
  GetPostLikesResponseDTO,
  LikeDTO,
  LikeResponseDTO,
} from "../dto/likeDTO.js";
import { getCachedData, setCachedData, invalidateCache, buildCacheKey } from "../utils/cache.js";

export async function createLikeRepository(
  data: LikeDTO,
): Promise<LikeResponseDTO> {
  const like = await prisma.like.create({ data });

  await invalidateCache(buildCacheKey("like:*", data.postId));

  return like;
}

export async function deleteLikeRepository(
  data: LikeDTO,
): Promise<LikeResponseDTO> {
  const { userId, postId } = data;

  const like = await prisma.like.delete({
    where: {
      userId_postId: { userId, postId },
    },
  });

  await invalidateCache(buildCacheKey("like:*", postId));

  return like;
}

export async function findLikeRepository(
  data: LikeDTO,
): Promise<LikeResponseDTO | null> {
  const { userId, postId } = data;

  const cacheKey = buildCacheKey("like", userId, postId);
  const cached = await getCachedData<LikeResponseDTO | null>(cacheKey);
  if (cached) return cached;

  const like = await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (like) {
    await setCachedData(cacheKey, like, 300);
  }

  return like;
}

export async function findLikesByPostIdRepository(
  postId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetPostLikesResponseDTO[]> {
  const cacheKey = buildCacheKey("like", "post", postId, `skip:${skip}`, `limit:${limit}`);
  const cached = await getCachedData<GetPostLikesResponseDTO[]>(cacheKey);
  if (cached) return cached;

  const likes = await prisma.like.findMany({
    where: { postId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  await setCachedData(cacheKey, likes, 300);

  return likes;
}
