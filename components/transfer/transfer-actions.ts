"use server";

import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import z from "zod";
import { transferSchema } from "./types";

export async function transfer(data: z.infer<typeof transferSchema>, key: string) {
  const session = await getSession();
  if (!session) return {success: false};
  const player = await prisma.player.findUnique({ where: { id: session.sub } });
  if (!player) return {success: false};

  const parsed = transferSchema.safeParse(data);

  if (parsed.error) {
    return {success: false};
  }

  if (parsed.data.amount > player.balance) {
    return {success: false};
  }

  await prisma.$transaction([
    prisma.player.update({
      where: { id: player.id },
      data: { balance: { decrement: parsed.data.amount } },
    }),
    prisma.player.update({
      where: { id: parsed.data.target },
      data: { balance: { increment: parsed.data.amount } },
    }),
    prisma.transfer.create({
      data: {
        comment: parsed.data.comment,
        amount: parsed.data.amount,
        sourceId: player.id,
        targetId: parsed.data.target,
      },
    }),
  ]);

  return {success: true}
}
