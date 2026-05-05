import { z } from "zod";

export const transferSchema = z.object({
  amount: z.int(),
  comment: z.string(),
  target: z.string(),
});
