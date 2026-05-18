import { z } from "zod";

export const transferSchema = z.object({
  amount: z.coerce.number<string>("Не число").int("Не целое число").positive("Не положительное число"),
  comment: z.string(),
  target: z.object({ id: z.string(), name: z.string() }, "Обязательное поле"),
});
