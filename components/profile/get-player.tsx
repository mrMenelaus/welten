import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const getPlayer = cache(async (name: string) => {
  const session = await getSession();

  if (!session) throw new Error("Unauthorized");

  const player = await prisma.player.findUnique({
    where: { name },
    include: {
      roles: true,
      playerComments: {
        orderBy: { createdAt: "desc" },
        include: {
          likes: { where: { authorId: session.sub } },
          author: true,
          _count: { select: { likes: true } },
        },
      },
      posts: {
        orderBy: { createdAt: "desc" },
        include: {
          views: {
            where: {
              playerId: session.sub,
            },
          },
          likes: {
            where: {
              authorId: session.sub,
            },
          },
          images: true,
          _count: {
            select: {
              comments: true,
              views: true,
              likes: true,
            },
          },
        },
      },
    },
  });

  if (!player) return null;

  return {
    ...player,
    posts: player.posts.map((p) => ({
      ...p,
      isLiked: p.likes.length > 0,
      isViewed: p.views.length > 0,
    })),
    comments: player.playerComments.map((c) => ({
      ...c,
      isLiked: c.likes.length > 0,
    })),
  };
});

export type MappedPlayer = NonNullable<Awaited<ReturnType<typeof getPlayer>>>

export type Post = MappedPlayer["posts"][number]
export type Comment = MappedPlayer["comments"][number]

