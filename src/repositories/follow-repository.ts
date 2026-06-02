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
): Promise<GetFollowersResponseDTO[]> {
  return await prisma.follow.findMany({ where: { followingId: userId } });
}

export async function findFollowingByUserIdRepository(
  userId: string,
): Promise<GetFollowingResponseDTO[]> {
  return await prisma.follow.findMany({ where: { followerId: userId } });
}
