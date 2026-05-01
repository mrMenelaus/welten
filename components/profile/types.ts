import {z} from "zod";

export const commentSchema = z.object({
  content: z.string().min(6, "Комментарий не может быть меньше 6 символов").max(280, "Комментарий не может быть больше 280 символов"),
});

export const postSchema = z.object({
  images: z.object({
    name: z.string(),
    ufsUrl: z.string(),
  }).array(),
  content: z.string().max(600, "Комментарий не должен быть больше 600 символов"),
});