import type { CreatePostDTO } from "../dto/postDTO.js";
import { createPostRepository } from "../repositories/post-repository.js";

export async function createPostService(data: CreatePostDTO) {
  const createdPost = await createPostRepository(data);

  return createdPost;
}
