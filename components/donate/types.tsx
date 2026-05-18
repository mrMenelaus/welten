import z from "zod";

export const donateSchema = z.object({
  player: z.object({
    id: z.string(),
    name: z.string(),
  }),
});
