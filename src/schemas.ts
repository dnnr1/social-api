import z from "zod";

export const userRegisterSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
  name: z.string(),
});

export const userLoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const postCreateSchema = z.object({
  userId: z.string(),
  content: z.string(),
  media: z.string(),
});
