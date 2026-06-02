import type { Request, Response } from "express";
import {
  followUserService,
  getFollowersService,
  getFollowingService,
  unfollowUserService,
} from "../services/follow-service.js";

export async function followUserController(req: Request, res: Response) {
  const followerId = req.user!.id;
  const followingId = req.params.id as string;

  const follow = await followUserService(followerId, followingId);

  return res.status(201).json({
    code: 201,
    message: "User followed successfully!",
    data: follow,
  });
}

export async function unfollowUserController(req: Request, res: Response) {
  const followerId = req.user!.id;
  const followingId = req.params.id as string;

  const follow = await unfollowUserService(followerId, followingId);

  return res.status(200).json({
    code: 200,
    message: "User unfollowed successfully!",
    data: follow,
  });
}

export async function getFollowersController(req: Request, res: Response) {
  const userId = req.params.id as string;

  const followers = await getFollowersService(userId);

  return res.status(200).json({
    code: 200,
    message: "Followers retrieved successfully!",
    data: followers,
  });
}

export async function getFollowingController(req: Request, res: Response) {
  const userId = req.params.id as string;

  const following = await getFollowingService(userId);

  return res.status(200).json({
    code: 200,
    message: "Following retrieved successfully!",
    data: following,
  });
}
