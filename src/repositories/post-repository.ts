import { prisma } from "../db.js";
import type {
  CreatePostDTO,
  CreatePostReponseDTO,
  EditPostDTO,
  EditPostResponseDTO,
  GetAllPostsResponseDTO,
  GetPostResponseDTO,
} from "../dto/postDTO.js";

export async function createPostRepository(
  data: CreatePostDTO,
): Promise<CreatePostReponseDTO> {
  const post = await prisma.post.create({ data });

  return post;
}

export async function editPostRepository(
  data: EditPostDTO,
): Promise<EditPostResponseDTO> {
  const { id, content, media, visibility } = data;

  const post = await prisma.post.update({
    where: {
      id,
    },
    data: { content, media, visibility },
  });

  return post;
}

export async function findPostByIdRepository(
  id: string,
): Promise<GetPostResponseDTO | null> {
  return await prisma.post.findUnique({ where: { id } });
}

export async function findPostsByUserIdRepository(
  userId: string,
): Promise<GetAllPostsResponseDTO[]> {
  return await prisma.post.findMany({ where: { userId } });
}
