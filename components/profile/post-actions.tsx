"use server";

import { z } from "zod";
import { postSchema } from "./types";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { refresh } from "next/cache";

export async function createPost(data: z.input<typeof postSchema>) {
  const session = await getSession();
  if (!session) return { success: false, message: "Не авторизован" };

  const parsed = postSchema.safeParse(data);

  if (parsed.error) {
    return { success: false, message: "Плохой запрос" };
  }

  await prisma.post.create({
    data: {
      content: parsed.data.content,
      authorId: session.sub,
      images: { createMany: { data: parsed.data.images } },
    },
  });

  refresh();
  return { success: true, message: "Пост успешно создан" };
}

export async function deletePost(postId: string) {
  const session = await getSession();
  if (!session) return { success: false, message: "Не авторизован" };

  await prisma.post.delete({
    where: { id: postId, authorId: session.sub },
  });

  refresh();

  return { success: true, message: "Пост успешно удалён" };
}
