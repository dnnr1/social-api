import AppError from "../appError.js";
import type { CreateUserDTO, LoginUserDTO } from "../dto/userDTO.js";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user-repository.js";
import decrypt from "../utils/decrypt.js";
import encrypt from "../utils/encrypt.js";

export async function createUserService(data: CreateUserDTO) {
  const { email, password } = data;

  const userAlreadyExists = await findUserByEmailRepository(email);

  if (userAlreadyExists) {
    throw new AppError("Email already in use", 400);
  }

  const hashedPassword = await encrypt(password);

  const user = await createUserRepository({
    ...data,
    password: hashedPassword,
  });

  return user;
}

export async function loginUserService(data: LoginUserDTO) {
  const userDb = await findUserByEmailRepository(data.email);

  if (!userDb) {
    throw new AppError("User not found", 404);
  }

  const checkPassword = await decrypt(data.password, userDb.password);

  if (!checkPassword) {
    throw new AppError("Email or Password incorrect", 400);
  }

  return userDb;
}
