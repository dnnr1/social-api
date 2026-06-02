import AppError from "../appError.js";
import {
  createLikeRepository,
  deleteLikeRepository,
  findLikeRepository,
  findLikesByPostIdRepository,
} from "../repositories/like-repository.js";
import { findPostByIdRepository } from "../repositories/post-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../constants/httpStatus.js";

export async function likePostService(userId: string, postId: string) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  const alreadyLiked = await findLikeRepository({ userId, postId });

  if (alreadyLiked) {
    throw new AppError("Post already liked", HTTP_BAD_REQUEST);
  }

  return await createLikeRepository({ userId, postId });
}

export async function unlikePostService(userId: string, postId: string) {
  const like = await findLikeRepository({ userId, postId });

  if (!like) {
    throw new AppError("Like not found", HTTP_NOT_FOUND);
  }

  return await deleteLikeRepository({ userId, postId });
}

export async function getPostLikesService(postId: string) {
  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  return await findLikesByPostIdRepository(postId);
}
