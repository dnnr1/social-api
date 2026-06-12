import type { Request, Response } from "express";
import {
  followUserService,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
} from "../services/follow-service.js";
import { HTTP_CREATED, HTTP_OK } from "../constants/httpStatus.js";

export async function followUserController(req: Request, res: Response) {
  const followerId = req.user!.id;
  const followingId = req.params.id as string;

  const follow = await followUserService(followerId, followingId);

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "User followed successfully!",
    data: follow,
  });
}

export async function unfollowUserController(req: Request, res: Response) {
  const followerId = req.user!.id;
  const followingId = req.params.id as string;

  const follow = await unfollowUserService(followerId, followingId);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "User unfollowed successfully!",
    data: follow,
  });
}

export async function getFollowersController(req: Request, res: Response) {
  const userId = req.params.id as string;
  const { skip = 0, limit = 20 } = req.pagination || {};

  const followers = await getFollowersService(userId, skip, limit);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Followers retrieved successfully!",
    data: followers,
  });
}

export async function getFollowingController(req: Request, res: Response) {
  const userId = req.params.id as string;
  const { skip = 0, limit = 20 } = req.pagination || {};

  const following = await getFollowingService(userId, skip, limit);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Following retrieved successfully!",
    data: following,
  });
}
