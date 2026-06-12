import AppError from "../appError.js";
import {
  createFollowRepository,
  deleteFollowRepository,
  findFollowRepository,
  findFollowersByUserIdRepository,
  findFollowingByUserIdRepository,
} from "../repositories/follow-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../constants/httpStatus.js";

export async function followUserService(
  followerId: string,
  followingId: string,
) {
  if (followerId === followingId) {
    throw new AppError("Cannot follow yourself", HTTP_BAD_REQUEST);
  }

  const follower = await findUserByIdRepository(followerId);

  if (!follower) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const following = await findUserByIdRepository(followingId);

  if (!following) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const alreadyFollowing = await findFollowRepository({
    followerId,
    followingId,
  });

  if (alreadyFollowing) {
    throw new AppError("Already following", HTTP_BAD_REQUEST);
  }

  return await createFollowRepository({ followerId, followingId });
}

export async function unfollowUserService(
  followerId: string,
  followingId: string,
) {
  if (followerId === followingId) {
    throw new AppError("Cannot unfollow yourself", HTTP_BAD_REQUEST);
  }

  const follow = await findFollowRepository({ followerId, followingId });

  if (!follow) {
    throw new AppError("Follow relationship not found", HTTP_NOT_FOUND);
  }

  return await deleteFollowRepository({ followerId, followingId });
}

export async function getFollowersService(userId: string, skip: number = 0, limit: number = 20) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  return await findFollowersByUserIdRepository(userId, skip, limit);
}

export async function getFollowingService(userId: string, skip: number = 0, limit: number = 20) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  return await findFollowingByUserIdRepository(userId, skip, limit);
}
