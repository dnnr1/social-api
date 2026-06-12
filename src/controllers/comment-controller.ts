import type { Request, Response } from "express";
import { commentCreateSchema, commentEditSchema } from "../schemas.js";
import {
  createCommentService,
  editCommentService,
  getCommentService,
  getCommentsByPostService,
} from "../services/comment-service.js";
import { HTTP_CREATED, HTTP_OK } from "../constants/httpStatus.js";

export async function getCommentController(req: Request, res: Response) {
  const commentId = req.params.id as string;

  const comment = await getCommentService(commentId);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Comment retrieved successfully!",
    data: comment,
  });
}

export async function getPostCommentsController(req: Request, res: Response) {
  const postId = req.params.id as string;
  const { skip = 0, limit = 20 } = req.pagination || {};

  const comments = await getCommentsByPostService(postId, skip, limit);

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Comments retrieved successfully!",
    data: comments,
  });
}

export async function createCommentController(req: Request, res: Response) {
  const comment = commentCreateSchema.parse(req.body);
  const userId = req.user!.id;
  const postId = req.params.id as string;

  const newComment = await createCommentService({
    ...comment,
    userId,
    postId,
  });

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "Comment created successfully!",
    data: newComment,
  });
}

export async function editCommentController(req: Request, res: Response) {
  const comment = commentEditSchema.parse(req.body);
  const userId = req.user!.id;
  const commentId = req.params.id as string;

  const editedComment = await editCommentService({
    ...comment,
    userId,
    id: commentId,
  });

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "Comment edited successfully!",
    data: editedComment,
  });
}
