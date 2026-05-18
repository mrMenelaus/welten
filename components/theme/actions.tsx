"use server";

import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";

export async function setAccent(color: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.player.update({
    data: { accent: color },
    where: { id: session.sub },
  });
}

export async function setBackground(color: string) {
  const session = await getSession();
  if (!session) return;

  await prisma.player.update({
    data: { background: color },
    where: { id: session.sub },
  });
}
