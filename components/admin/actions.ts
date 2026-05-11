"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createDonateSchema } from "./types";
import { refresh } from "next/cache";
import { getSession } from "@/lib/auth/get-session";

export async function createDonate(data: z.infer<typeof createDonateSchema>) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createDonateSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  await prisma.donate.create({ data: parsed.data });

  refresh();
  return { success: true };
}

export async function editDonate(id: string, data: z.infer<typeof createDonateSchema>) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createDonateSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  await prisma.donate.update({ data: data, where: { id } });

  refresh();
  return { success: true };
}

export async function deleteDonate(id: string) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.donate.delete({ where: { id } });
  refresh();
  return { success: true };
}
