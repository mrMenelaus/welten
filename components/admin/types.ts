import z from "zod";

export const createDonateSchema = z.object({
  param: z.string().nonempty("Обязательное поле"),
  name: z.string().nonempty("Обязательное поле"),
  description: z.string().nonempty("Обязательное поле"),
  background: z.string().nonempty("Обязательное поле"),
  cost: z.string().nonempty("Обязательное поле"),
});
