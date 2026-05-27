import type { Request, Response } from "express";
import { postCreateSchema } from "../schemas.js";
import { createPostService } from "../services/post-service.js";

export async function createPostController(req: Request, res: Response) {
  const post = postCreateSchema.parse(req.body);

  const newPost = await createPostService(post);

  return res.status(201).json({
    code: 201,
    message: "Post created successfully!",
    data: newPost,
  });
}
