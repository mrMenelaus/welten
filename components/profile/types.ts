import {z} from "zod";
import { imageSchema } from "../admin/types";

export const commentSchema = z.object({
  content: z.string().min(6, "Комментарий не может быть меньше 6 символов").max(280, "Комментарий не может быть больше 280 символов"),
});

export const postSchema = z.object({
  images: imageSchema.array(),
  content: z.string().min(12, "Текст поста не может быть меньше 12 символов").max(600, "Комментарий не должен быть больше 600 символов"),
});