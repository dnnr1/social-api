import AppError from "../appError.js";
import type { CreateUserDTO, LoginUserDTO } from "../dto/userDTO.js";
import {
  createUserRepository,
  findUserByEmailRepository,
} from "../repositories/user-repository.js";

export async function createUserService(data: CreateUserDTO) {
  const { email } = data;

  const userAlreadyExists = await findUserByEmailRepository(email);

  if (userAlreadyExists) {
    throw new AppError("User already exists", 400);
  }

  const user = await createUserRepository(data);

  return user;
}

export async function loginUserService(data: LoginUserDTO) {
  const userDb = await findUserByEmailRepository(data.email);

  console.log(userDb, data);

  if (userDb?.password !== data.password) {
    throw new AppError("Email or Password incorrect", 400);
  }

  return userDb;
}
