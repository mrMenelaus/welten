"use server";

import { getSession } from "@/lib/auth/get-session";
import { Answer } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function startFriendship(playerId: string) {
  const session = await getSession();
  if (!session) return;

  const existing = await prisma.friendship.findFirst({
    where: {
      OR: [
        { receiverId: playerId, senderId: session.sub },
        { receiverId: session.sub, senderId: playerId },
      ],
    },
  });

  if (existing) {
    return "ok";
  }

  await prisma.friendship.create({
    data: { receiverId: playerId, senderId: session.sub },
  });
  return "ok";
}

export async function answerFriendship(id: string, answer: Answer) {
  await prisma.friendship.update({
    data: { answer },
    where: { id },
  });

  refresh()
  return "ok";
}
