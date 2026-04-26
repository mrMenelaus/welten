import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { cache } from "react";

export const getPlayer = cache(async (name: string) => {
  console.log(name);
  
  
  const player = await prisma.player.findUnique({
    where: { name: name },
    include: {
      playerComments: {
        orderBy: { createdAt: "desc" },
        include: { author: true },
      },
    },
  });

  return player;
});
