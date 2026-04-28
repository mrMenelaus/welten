import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPlayer = cache(async (name: string) => {
  const player = await prisma.player.findUnique({
    where: { name: name },
    include: {
      playerComments: {
        orderBy: { createdAt: "desc" },
        include: { author: true, likes: true },
      },
      posts: { include: { _count: { select: { comments: true } } } },
    },
  });

  return player;
});
