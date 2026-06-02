import type { Request, Response } from "express";
import {
  getPostLikesService,
  likePostService,
  unlikePostService,
} from "../services/like-service.js";

export async function likePostController(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const like = await likePostService(userId, postId);

  return res.status(201).json({
    code: 201,
    message: "Post liked successfully!",
    data: like,
  });
}

export async function unlikePostController(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const like = await unlikePostService(userId, postId);

  return res.status(200).json({
    code: 200,
    message: "Post unliked successfully!",
    data: like,
  });
}

export async function getPostLikesController(req: Request, res: Response) {
  const postId = req.params.id as string;

  const likes = await getPostLikesService(postId);

  return res.status(200).json({
    code: 200,
    message: "Likes retrieved successfully!",
    data: likes,
  });
}
