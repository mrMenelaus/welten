import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPlayer = cache(async (name: string) => {
  const session = await getSession()
  const addon = session ? { likes: { where: { authorId: session.sub } } } : {};

  const player = await prisma.player.findUnique({
    where: { name: name },
    include: {
      roles: true,
      playerComments: {
        orderBy: { createdAt: "desc" },
        include: { ...addon, author: true, _count: {select: {likes: true}} },
      },
      posts: {
        include: { ...addon, images: true, _count: { select: { comments: true, views: true, likes: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return player;
});
