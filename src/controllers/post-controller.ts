import type { Request, Response } from "express";
import { postCreateSchema, postEditSchema } from "../schemas.js";
import {
  createPostService,
  editPostService,
  getAllPosts,
  getPostService,
} from "../services/post-service.js";
import { HTTP_CREATED, HTTP_OK } from "../constants/httpStatus.js";

export async function getAllPostsController(req: Request, res: Response) {
  const userId = req.user!.id;

  const posts = await getAllPosts(userId);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Posts retrieved successfully!",
    data: posts,
  });
}

export async function getPostController(req: Request, res: Response) {
  const postId = req.params.id as string;

  const post = await getPostService(postId);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Post retrieved successfully!",
    data: post,
  });
}

export async function createPostController(req: Request, res: Response) {
  const post = postCreateSchema.parse(req.body);
  const userId = req.user!.id;

  const newPost = await createPostService({ ...post, userId });

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "Post created successfully!",
    data: newPost,
  });
}

export async function editPostController(req: Request, res: Response) {
  const post = postEditSchema.parse(req.body);
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const editedPost = await editPostService({
    ...post,
    userId,
    id: postId,
  });

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "Post edited successfully!",
    data: editedPost,
  });
}
