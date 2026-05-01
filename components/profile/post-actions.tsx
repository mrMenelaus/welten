"use server";

import { z } from "zod";
import { postSchema } from "./types";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function leavePost(data: z.input<typeof postSchema>) {
  const session = await getSession();
  if (!session) return "error";

  const parsed = postSchema.safeParse(data);

  if (parsed.error) {
    return "error";
  }

  await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: session.sub,
      images: { createMany: { data: parsed.data.images } },
    },
  });

  refresh();
  return "success";
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) return "error";

  await prisma.post.delete({
    where: { id: postId, authorId: session.sub },
  });

  refresh();
  return "success";
}
