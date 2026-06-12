import { userLoginSchema } from "./../schemas.js";
import type { Request, Response } from "express";
import {
  createUserService,
  loginUserService,
} from "../services/user-service.js";
import { userRegisterSchema } from "../schemas.js";
import { HTTP_CREATED, HTTP_OK, HTTP_BAD_REQUEST } from "../constants/httpStatus.js";
import AppError from "../appError.js";
import { generateTokens, verifyRefreshToken, revokeRefreshToken } from "../utils/tokenGenerate.js";
import { getCookieOptions } from "../utils/cookieOptions.js";

export async function createUserController(req: Request, res: Response) {
  const user = userRegisterSchema.parse(req.body);
  const createdUser = await createUserService(user);

  const tokens = await generateTokens({
    id: createdUser.id,
    role: createdUser.role,
  });

  res.cookie("access_token", tokens.accessToken, getCookieOptions());
  res.cookie("refresh_token", tokens.refreshToken, {
    ...getCookieOptions(),
    path: "/api/v1/auth",
  });

  return res.status(HTTP_CREATED).json({
    code: HTTP_CREATED,
    message: "User created successfully!",
    data: createdUser,
  });
}

export async function loginUserController(req: Request, res: Response) {
  const data = userLoginSchema.parse(req.body);
  const user = await loginUserService(data);

  const tokens = await generateTokens({
    id: user.id,
    role: user.role,
  });

  res.cookie("access_token", tokens.accessToken, getCookieOptions());
  res.cookie("refresh_token", tokens.refreshToken, {
    ...getCookieOptions(),
    path: "/api/v1/auth",
  });

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "User logged successfully!",
    data: { ...user, password: undefined },
  });
}

export async function logoutUserController(req: Request, res: Response) {
  const userId = req.user?.id;
  if (userId) {
    await revokeRefreshToken(userId);
  }

  res.clearCookie("access_token", getCookieOptions());
  res.clearCookie("refresh_token", { ...getCookieOptions(), path: "/api/v1/auth" });

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "User logged out successfully!",
  });
}

export async function refreshTokenController(req: Request, res: Response) {
  const token = req.cookies.refresh_token;

  if (!token) {
    throw new AppError("Refresh token is missing", HTTP_BAD_REQUEST);
  }

  const decoded = await verifyRefreshToken(token);

  if (!decoded) {
    throw new AppError("Invalid or expired refresh token", HTTP_BAD_REQUEST);
  }

  const tokens = await generateTokens({ id: decoded.id, role: decoded.role });

  res.cookie("access_token", tokens.accessToken, getCookieOptions());
  res.cookie("refresh_token", tokens.refreshToken, {
    ...getCookieOptions(),
    path: "/api/v1/auth",
  });

  return res.status(HTTP_OK).json({
    code: HTTP_OK,
    message: "Tokens refreshed successfully!",
  });
}
