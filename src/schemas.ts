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
  content: z.string(),
  media: z.string(),
});

export const postEditSchema = z
  .object({
    content: z.string(),
    media: z.string(),
    visibility: z.string(),
  })
  .partial();

export const commentCreateSchema = z.object({
  content: z.string(),
});

export const commentEditSchema = z
  .object({
    content: z.string(),
  })
  .partial();
