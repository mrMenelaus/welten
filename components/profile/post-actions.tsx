"use server";

import { z } from "zod"
import { postSchema } from "./types";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function leavePost(
  data: z.input<typeof postSchema>,
) {
  const session = await getSession();
  if (!session) return "error";

  const parsed = postSchema.safeParse(data);

  if (parsed.error) {
    return "error";
  }

  await new Promise((res) => setTimeout(res, 1000));
  await prisma.post.create({
    data: { ...parsed.data, authorId: session.sub  },
  });

  refresh();
  return "success";
}
