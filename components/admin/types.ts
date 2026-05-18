import z from "zod";

export const imageSchema = z.object({
  name: z.string(),
  ufsUrl: z.string(),
  size: z.number(),
  key: z.string(),
});

export const createDonateSchema = z.object({
  param: z.string().nonempty("Обязательное поле"),
  name: z.string().nonempty("Обязательное поле"),
  description: z.string().nonempty("Обязательное поле"),
  content: z.string().nonempty("Обязательное поле"),
  images: imageSchema.array().min(1),
  cost: z.string().nonempty("Обязательное поле"),
});

export const createAchievementSchema = z.object({
  name: z.string().nonempty("Обязательное поле"),
  description: z.string().nonempty("Обязательное поле"),
  images: imageSchema.array().min(1),
});

export const createRecordSchema = z.object({
  content: z.string().nonempty("Обязательное поле"),
  images: imageSchema.array().min(1),
});
