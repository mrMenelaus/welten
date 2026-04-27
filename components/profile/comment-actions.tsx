"use server";

import { z } from "zod";
import { commentSchema } from "./types";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function leaveComment(
  playerId: string,
  data: z.input<typeof commentSchema>,
) {
  const session = await getSession();
  if (!session) return "error";

  const parsed = commentSchema.safeParse(data);

  if (parsed.error) {
    return "error";
  }

  await new Promise((res) => setTimeout(res, 1000));
  await prisma.playerComment.create({
    data: { ...parsed.data, authorId: session.sub, playerId },
  });

  refresh();
  return "success";
}

export async function like(commentId: string) {
  const session = await getSession();
  if (!session) return "error";

  const comment = await prisma.playerCommentLike.findFirst({
    where: { playerCommentId: commentId, authorId: session.sub },
  });

  if (comment) {
    await prisma.playerCommentLike.delete({ where: { id: comment.id } });
  } else {
    await prisma.playerCommentLike.create({
      data: { playerCommentId: commentId, authorId: session.sub },
    });
  }

  refresh();
  return "success";
}
