"use server";

import { z } from "zod";
import { commentSchema } from "./types";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function leaveComment(
  playerId: string,
  data: z.input<typeof commentSchema>,
) {
  return null
  // const session = await auth.api.getSession({ headers: await headers() });
  // if (!session) return "error";

  // const parsed = commentSchema.safeParse(data);

  // if (parsed.error) {
  //   return "error";
  // }

  // await new Promise((res) => setTimeout(res, 1000));
  // await prisma.playerComment.create({
  //   data: { ...parsed.data, authorId: session.user.id, playerId },
  // });

  // refresh()
  // return "success";
}
