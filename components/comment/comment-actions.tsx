"use server";

import { z } from "zod";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";
import { commentSchema } from "../profile/types";

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

export async function view(postId: string) {
  const session = await getSession();
  if (!session) return "error";

  const existing = await prisma.view.findFirst({
    where: { postId, playerId: session.sub },
  });
  if (existing) return;
  await prisma.view.create({ data: { postId, playerId: session.sub } });
}


export async function deleteComment(commentId: string) {
  const session = await getSession();
  if (!session) return "error";

  await prisma.comment.delete({
    where: { id: commentId, authorId: session.sub },
  });

  refresh();
  return "success";
}

export async function editComment(
  commentId: string,
  data: z.input<typeof commentSchema>,
) {
  const session = await getSession();
  if (!session) return "error";

  const parsed = commentSchema.safeParse(data);

  if (parsed.error) {
    return "error";
  }

  await prisma.comment.update({
    where: { id: commentId },
    data: parsed.data,
  });

  refresh();
  return "success";
}
