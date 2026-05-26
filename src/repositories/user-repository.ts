import { prisma } from "../db.js";
import type { CreateUserDTO, CreateUserResponseDTO } from "../dto/userDTO.js";

export async function createUserRepository(
  data: CreateUserDTO,
): Promise<CreateUserResponseDTO> {
  const user = await prisma.user.create({ data });

  return user;
}

export async function findUserByEmailRepository(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  return user;
}

export async function findUserByIdRepository(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });

  return user;
}
