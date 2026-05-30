import AppError from "../appError.js";
import type { CreatePostDTO, EditPostDTO } from "../dto/postDTO.js";
import {
  createPostRepository,
  editPostRepository,
  findPostByIdRepository,
  findPostsByUserIdRepository,
} from "../repositories/post-repository.js";
import { findUserByIdRepository } from "../repositories/user-repository.js";

export async function getPostService(postId: string) {
  const post = await findPostByIdRepository(postId);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  return post;
}

export async function getAllPosts(userId: string) {
  const user = await findUserByIdRepository(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const posts = await findPostsByUserIdRepository(userId);

  return posts;
}

export async function createPostService(data: CreatePostDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const createdPost = await createPostRepository(data);

  return createdPost;
}

export async function editPostService(data: EditPostDTO) {
  const user = await findUserByIdRepository(data.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const post = await findPostByIdRepository(data.id);

  if (!post) {
    throw new AppError("Post not found", 404);
  }

  const updatedPost = await editPostRepository(data);

  return updatedPost;
}
