import { prisma } from "../db.js";
import type {
  CreateCommentDTO,
  CreateCommentResponseDTO,
  EditCommentDTO,
  EditCommentResponseDTO,
  GetCommentResponseDTO,
  GetPostCommentsResponseDTO,
} from "../dto/commentDTO.js";

export async function createCommentRepository(
  data: CreateCommentDTO,
): Promise<CreateCommentResponseDTO> {
  const comment = await prisma.comment.create({ data });

  return comment;
}

export async function editCommentRepository(
  data: EditCommentDTO,
): Promise<EditCommentResponseDTO> {
  const { id, content } = data;

  const comment = await prisma.comment.update({
    where: { id },
    data: { content },
  });

  return comment;
}

export async function findCommentByIdRepository(
  id: string,
): Promise<GetCommentResponseDTO | null> {
  return await prisma.comment.findUnique({ where: { id } });
}

export async function findCommentsByPostIdRepository(
  postId: string,
): Promise<GetPostCommentsResponseDTO[]> {
  return await prisma.comment.findMany({ where: { postId } });
}
