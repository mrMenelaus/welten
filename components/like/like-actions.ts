"use server";

import { getSession } from "@/lib/auth/get-session";
import { Likeable } from "./types";
import { prisma } from "@/lib/prisma";
import { refresh, revalidateTag, updateTag } from "next/cache";
import { getTagHelper } from "@/lib/get-tag-helper";

const fields = {
  comment: "commentId",
  post: "postId",
} satisfies Record<Likeable, string>;

export async function like(type: Likeable, entityId: string) {
  const session = await getSession();
  if (!session) return "error";

  const field = fields[type];

  const existing = await prisma.like.findFirst({
    where: { authorId: session.sub, [field]: entityId },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { authorId: session.sub, [field]: entityId },
    });
  }
  
  return "success";
}
