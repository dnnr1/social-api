import { userLoginSchema } from "./../schemas.js";
import type { Request, Response } from "express";
import {
  createUserService,
  loginUserService,
} from "../services/user-service.js";
import { userRegisterSchema } from "../schemas.js";
import jwt from "jsonwebtoken";

export async function createUserController(req: Request, res: Response) {
  const user = userRegisterSchema.parse(req.body);
  const createdUser = await createUserService(user);

  const token = await jwt.sign({ user }, process.env.JWT_SECRET as string);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
  });

  return res.status(201).json({
    code: 201,
    message: "User created successfully!",
    data: { ...createdUser, password: undefined },
  });
}

export async function loginUserController(req: Request, res: Response) {
  const data = userLoginSchema.parse(req.body);

  const user = await loginUserService(data);

  const token = await jwt.sign({ user }, process.env.JWT_SECRET as string);

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: true,
  });

  return res.status(200).json({
    code: 200,
    message: "User logged successfully!",
    data: { ...user, password: undefined },
  });
}
