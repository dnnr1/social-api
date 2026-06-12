import { userLoginSchema } from "./../schemas.js";
import type { Request, Response } from "express";
import {
  createUserService,
  loginUserService,
} from "../services/user-service.js";
import { userRegisterSchema } from "../schemas.js";
import { HTTP_CREATED, HTTP_OK } from "../constants/httpStatus.js";
import tokenGenerate from "../utils/tokenGenerate.js";
import { TokenPayload } from "../types/types.js";
import { getCookieOptions } from "../utils/cookieOptions.js";

export async function createUserController(req: Request, res: Response) {
  const user = userRegisterSchema.parse(req.body);
  const createdUser = await createUserService(user);

  const token = tokenGenerate({
    id: createdUser.id,
    role: createdUser.role,
  } as TokenPayload);

  res.cookie("token", token, getCookieOptions());

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "User created successfully!",
    data: createdUser,
  });
}

export async function loginUserController(req: Request, res: Response) {
  const data = userLoginSchema.parse(req.body);
  const user = await loginUserService(data);

  const token = tokenGenerate({
    id: user.id,
    role: user.role,
  } as TokenPayload);

  res.cookie("token", token, getCookieOptions());

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "User logged successfully!",
    data: { ...user, password: undefined },
  });
}

export async function logoutUserController(_: Request, res: Response) {
  res.clearCookie("token", getCookieOptions());

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "User logged out successfully!",
  });
}
