import AppError from "../appError.js";
import {
  createLikeRepository,
  deleteLikeRepository,
  findLikeRepository,
  findLikesByPostIdRepository,
} from "../repositories/like-repository.js";
import { findPostByIdRepository } from "../repositories/post-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";

export async function likePostService(userId: string, postId: string) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const alreadyLiked = await findLikeRepository({ userId, postId });

  if (alreadyLiked) {
    throw new AppError("Post already liked", 400);
  }

  return await createLikeRepository({ userId, postId });
}

export async function unlikePostService(userId: string, postId: string) {
  const like = await findLikeRepository({ userId, postId });

  if (!like) {
    throw new AppError("Like not found", 404);
  }

  return await deleteLikeRepository({ userId, postId });
}

export async function getPostLikesService(postId: string) {
  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return await findLikesByPostIdRepository(postId);
}
