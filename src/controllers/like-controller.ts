import type { Request, Response } from "express";
import {
  getPostLikesService,
  likePostService,
  unlikePostService,
} from "../services/like-service.js";
import { HTTP_CREATED, HTTP_OK } from "../constants/httpStatus.js";

export async function likePostController(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const like = await likePostService(userId, postId);

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "Post liked successfully!",
    data: like,
  });
}

export async function unlikePostController(req: Request, res: Response) {
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const like = await unlikePostService(userId, postId);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Post unliked successfully!",
    data: like,
  });
}

export async function getPostLikesController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { skip = 0, limit = 20 } = req.pagination || {};

  const likes = await getPostLikesService(postId, skip, limit);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Likes retrieved successfully!",
    data: likes,
  });
}
