import { prisma } from "../db.js";
import type {
  CreatePostDTO,
  CreatePostReponseDTO,
  EditPostDTO,
  EditPostResponseDTO,
  GetAllPostsResponseDTO,
  GetPostResponseDTO,
} from "../dto/postDTO.js";
import { getCachedData, setCachedData, invalidateCache, buildCacheKey } from "../utils/cache.js";

export async function createPostRepository(
  data: CreatePostDTO,
): Promise<CreatePostReponseDTO> {
  const post = await prisma.post.create({ data });

  await invalidateCache(buildCacheKey("post:*", data.userId));

  return post;
}

export async function editPostRepository(
  data: EditPostDTO,
): Promise<EditPostResponseDTO> {
  const { id, content, media, visibility } = data;

  const post = await prisma.post.update({
    where: { id },
    data: { content, media, visibility },
  });

  await invalidateCache(buildCacheKey("post:*"));

  return post;
}

export async function findPostByIdRepository(
  id: string,
): Promise<GetPostResponseDTO | null> {
  const cacheKey = buildCacheKey("post", "id", id);
  const cached = await getCachedData<GetPostResponseDTO | null>(cacheKey);
  if (cached) return cached;

  const post = await prisma.post.findUnique({ where: { id } });

  if (post) {
    await setCachedData(cacheKey, post, 300);
  }

  return post;
}

export async function findPostsByUserIdRepository(
  userId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetAllPostsResponseDTO[]> {
  const cacheKey = buildCacheKey("post", "user", userId, `skip:${skip}`, `limit:${limit}`);
  const cached = await getCachedData<GetAllPostsResponseDTO[]>(cacheKey);
  if (cached) return cached;

  const posts = await prisma.post.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  await setCachedData(cacheKey, posts, 300);

  return posts;
}
