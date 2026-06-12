import { prisma } from "../db.js";
import type {
  GetPostLikesResponseDTO,
  LikeDTO,
  LikeResponseDTO,
} from "../dto/likeDTO.js";

export async function createLikeRepository(
  data: LikeDTO,
): Promise<LikeResponseDTO> {
  const like = await prisma.like.create({ data });

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

  return like;
}

export async function findLikeRepository(
  data: LikeDTO,
): Promise<LikeResponseDTO | null> {
  const { userId, postId } = data;

  return await prisma.like.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });
}

export async function findLikesByPostIdRepository(
  postId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetPostLikesResponseDTO[]> {
  return await prisma.like.findMany({
    where: { postId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });
}
