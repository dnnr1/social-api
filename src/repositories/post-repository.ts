import { prisma } from "../db.js";
import type { CreatePostDTO, CreatePostReponseDTO } from "../dto/postDTO.js";

export async function createPostRepository(
  data: CreatePostDTO,
): Promise<CreatePostReponseDTO> {
  const post = await prisma.post.create({ data });

  return post;
}
