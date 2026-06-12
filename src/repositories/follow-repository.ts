import { prisma } from "../db.js";
import type {
  FollowDTO,
  FollowResponseDTO,
  GetFollowersResponseDTO,
  GetFollowingResponseDTO,
} from "../dto/followDTO.js";

export async function createFollowRepository(
  data: FollowDTO,
): Promise<FollowResponseDTO> {
  const follow = await prisma.follow.create({ data });

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

  return follow;
}

export async function findFollowRepository(
  data: FollowDTO,
): Promise<FollowResponseDTO | null> {
  const { followerId, followingId } = data;

  return await prisma.follow.findUnique({
    where: {
      followerId_followingId: { followerId, followingId },
    },
  });
}

export async function findFollowersByUserIdRepository(
  userId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetFollowersResponseDTO[]> {
  return await prisma.follow.findMany({
    where: { followingId: userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });
}

export async function findFollowingByUserIdRepository(
  userId: string,
  skip: number = 0,
  limit: number = 20,
): Promise<GetFollowingResponseDTO[]> {
  return await prisma.follow.findMany({
    where: { followerId: userId },
    skip,
    take: limit,
    orderBy: { created_at: "desc" },
  });
}
