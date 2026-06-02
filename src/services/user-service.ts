import AppError from "../appError.js";
import type { CreateUserDTO, LoginUserDTO } from "../dto/userDTO.js";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user-repository.js";
import decrypt from "../utils/decrypt.js";
import encrypt from "../utils/encrypt.js";
import { HTTP_BAD_REQUEST, HTTP_NOT_FOUND } from "../constants/httpStatus.js";

export async function createUserService(data: CreateUserDTO) {
  const { email, password } = data;

  const userAlreadyExists = await findUserByEmailRepository(email);

  if (userAlreadyExists) {
    throw new AppError("Email already in use", HTTP_BAD_REQUEST);
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
    throw new AppError("User not found", HTTP_NOT_FOUND);
  }

  const checkPassword = await decrypt(data.password, userDb.password);

  if (!checkPassword) {
    throw new AppError("Email or Password incorrect", HTTP_BAD_REQUEST);
  }

  return userDb;
}
