import { prisma } from "../db.js";
import type {
  CreateCommentDTO,
  CreateCommentResponseDTO,
  EditCommentDTO,
  EditCommentResponseDTO,
  GetCommentResponseDTO,
  GetPostCommentsResponseDTO,
} from "../dto/commentDTO.js";
import { getCachedData, setCachedData, invalidateCache, buildCacheKey } from "../utils/cache.js";

export async function createCommentRepository(
  data: CreateCommentDTO,
): Promise<CreateCommentResponseDTO> {
  const comment = await prisma.comment.create({ data });

  await invalidateCache(buildCacheKey("comment:*", data.postId));

  return comment;
}

export async function editCommentRepository(
  data: EditCommentDTO,
): Promise<EditCommentResponseDTO> {
  const { id, content } = data;

  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  await invalidateCache(buildCacheKey("comment:*"));

  return comment;
}

export async function findCommentByIdRepository(
  id: string,
): Promise<GetCommentResponseDTO | null> {
  const cacheKey = buildCacheKey("comment", "id", id);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  return await prisma.comment.findUnique({ where: { id } });
}

export async function findCommentsByPostIdRepository(
  postId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetPostCommentsResponseDTO[]> {
  const cacheKey = buildCacheKey("comment", "post", postId, `skip:${skip}`, `limit:${limit}`);
  const cached = await getCachedData(cacheKey);
  if (cached) return cached;

  const comments = await prisma.comment.findMany({
    where: { postId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });

  await setCachedData(cacheKey, comments, 300);

  return comments;
}
