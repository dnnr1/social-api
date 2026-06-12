import AppError from "../appError.js";
import type { CreatePostDTO, EditPostDTO } from "../dto/postDTO.js";
import {
  createPostRepository,
  editPostRepository,
  findPostByIdRepository,
  findPostsByUserIdRepository,
} from "../repositories/post-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";
import { HTTP_NOT_FOUND } from "../constants/httpStatus.js";

export async function getPostService(postId: string) {
  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  return post;
}

export async function getAllPosts(userId: string, skip: number = 0, limit: number = 20) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const posts = await findPostsByUserIdRepository(userId, skip, limit);

  return posts;
}

export async function createPostService(data: CreatePostDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const createdPost = await createPostRepository(data);

  return createdPost;
}

export async function editPostService(data: EditPostDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const post = await findPostByIdRepository(data.id);

  if (!post) {
    throw new AppError("Post not found", HTTP_NOT_FOUND);
  }

  const updatedPost = await editPostRepository(data);

  return updatedPost;
}
