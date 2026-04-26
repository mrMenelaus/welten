import {z} from "zod";

export const commentSchema = z.object({
  content: z.string().max(280, "Комментарий не должен быть больше 280 символов"),
});