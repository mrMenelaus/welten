"use server";

import { z } from "zod";
import { commentSchema } from "./types";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function leaveComment(
  type: "post" | "player",
  entityId: string,
  data: z.input<typeof commentSchema>,
) {
  const session = await getSession();
  if (!session) return "error";

  const parsed = commentSchema.safeParse(data);

  if (parsed.error) {
    return "error";
  }

  await prisma.comment.create({
    data: {
      ...parsed.data,
      authorId: session.sub,
      [type === "player" ? "playerId" : "postId"]: entityId,
    },
  });

  refresh();
  return "success";
}

export async function like(commentId: string) {
  const session = await getSession();
  if (!session) return "error";

  const comment = await prisma.like.findFirst({
    where: { commentId, authorId: session.sub },
  });

  if (comment) {
    await prisma.like.delete({ where: { id: comment.id } });
  } else {
    await prisma.like.create({
      data: { commentId, authorId: session.sub },
    });
  }

  refresh();
  return "success";
}
