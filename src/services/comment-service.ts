import AppError from "../appError.js";
import type { CreateCommentDTO, EditCommentDTO } from "../dto/commentDTO.js";
import {
  createCommentRepository,
  editCommentRepository,
  findCommentByIdRepository,
  findCommentsByPostIdRepository,
} from "../repositories/comment-repository.js";
import { findPostByIdRepository } from "../repositories/post-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";
import { HTTP_NOT_FOUND } from "../constants/httpStatus.js";

export async function getCommentService(commentId: string) {
  const comment = await findCommentByIdRepository(commentId);

  if (!comment) {
    throw new AppError("Comment not found", HTTP_NOT_FOUND);
  }

  return comment;
}

export async function getCommentsByPostService(postId: string) {
  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  const comments = await findCommentsByPostIdRepository(postId);

  return comments;
}

export async function createCommentService(data: CreateCommentDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const post = await findPostByIdRepository(data.postId);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  const createdComment = await createCommentRepository(data);

  return createdComment;
}

export async function editCommentService(data: EditCommentDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const comment = await findCommentByIdRepository(data.id);

  if (!comment) {
    throw new AppError("Comment not found", HTTP_NOT_FOUND);
  }

  const updatedComment = await editCommentRepository(data);

  return updatedComment;
}
