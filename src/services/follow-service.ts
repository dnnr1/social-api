import AppError from "../appError.js";
import {
  createFollowRepository,
  deleteFollowRepository,
  findFollowRepository,
  findFollowersByUserIdRepository,
  findFollowingByUserIdRepository,
} from "../repositories/follow-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";

export async function followUserService(
  followerId: string,
  followingId: string,
) {
  if (followerId === followingId) {
    throw new AppError("Cannot follow yourself", 400);
  }

  const follower = await findUserByIdRepository(followerId);

  if (!follower) {
    throw new AppError("User not found", 404);
  }

  const following = await findUserByIdRepository(followingId);

  if (!following) {
    throw new AppError("User not found", 404);
  }

  const alreadyFollowing = await findFollowRepository({
    followerId,
    followingId,
  });

  if (alreadyFollowing) {
    throw new AppError("Already following", 400);
  }

  return await createFollowRepository({ followerId, followingId });
}

export async function unfollowUserService(
  followerId: string,
  followingId: string,
) {
  if (followerId === followingId) {
    throw new AppError("Cannot unfollow yourself", 400);
  }

  const follow = await findFollowRepository({ followerId, followingId });

  if (!follow) {
    throw new AppError("Follow relationship not found", 404);
  }

  return await deleteFollowRepository({ followerId, followingId });
}

export async function getFollowersService(userId: string) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await findFollowersByUserIdRepository(userId);
}

export async function getFollowingService(userId: string) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await findFollowingByUserIdRepository(userId);
}
