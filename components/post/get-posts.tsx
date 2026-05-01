"use server";

import { prisma } from "@/lib/prisma";

export function getPosts({
  authorId,
  userId,
}: {
  authorId: string;
  userId: string;
}) {
  return prisma.post.findMany({
    where: { authorId },
    include: {
      images: true,
      comments: {
        include: {
          author: true,
          _count: { select: { likes: true } },
          likes: { where: { authorId: userId } },
        },
      },
      _count: { select: { comments: true, likes: true, views: true } },
    },
  });
}
