"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  createAchievementSchema,
  createDonateSchema,
  createRecordSchema,
} from "./types";
import { refresh, revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/get-session";


export async function createDonate(data: z.infer<typeof createDonateSchema>) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createDonateSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  const { images, ...all } = parsed.data;

  await prisma.donate.create({
    data: { ...all, image: { create: images[0] } },
  });

  refresh();
  return { success: true };
}

export async function editDonate(
  id: string,
  data: z.infer<typeof createDonateSchema>,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createDonateSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  const { images, ...all } = parsed.data;

  await prisma.donate.update({ data: { ...all, image: {update: images[0]} }, where: { id } });

  refresh();
  return { success: true };
}

export async function deleteDonate(id: string) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.donate.delete({ where: { id } });
  refresh();
  return { success: true };
}

export async function createRecord(data: z.infer<typeof createRecordSchema>) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createRecordSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  await prisma.record.create({
    data: {
      content: parsed.data.content,
      images: { createMany: { data: parsed.data.images } },
    },
  });

  revalidatePath("/");
  refresh();

  return { success: true };
}

export async function editRecord(
  id: string,
  data: z.infer<typeof createRecordSchema>,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createRecordSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  await prisma.record.update({
    data: { content: parsed.data.content },
    where: { id },
  });

  revalidatePath("/");
  refresh();

  return { success: true };
}

export async function deleteRecord(id: string) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.record.delete({ where: { id } });
  revalidatePath("/");
  refresh();
  return { success: true };
}

export async function createAchievement(
  data: z.infer<typeof createAchievementSchema>,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createAchievementSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  const { images, ...all } = parsed.data;

  await prisma.achievement.create({
    data: { ...all, image: { create: images[0] } },
  });

  refresh();
  return { success: true };
}

export async function editAchievement(
  id: string,
  data: z.infer<typeof createAchievementSchema>,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  const parsed = createAchievementSchema.safeParse(data);
  if (parsed.error) {
    throw new Error();
  }

  const { images, ...all } = parsed.data;

  await prisma.achievement.update({
    data: { ...all, image: { update: images[0] } },
    where: {
      id,
    },
  });

  refresh();
  return { success: true };
}

export async function deleteAchievement(id: string) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.achievement.delete({ where: { id } });
  refresh();
  return { success: true };
}

export async function grantAchievement(
  playerId: string,
  achievementId: string,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.player.update({
    where: { id: playerId },
    data: { achievements: { connect: { id: achievementId } } },
  });
  refresh();
  return { success: true };
}

export async function revokeAchievement(
  playerId: string,
  achievementId: string,
) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) throw new Error();
  await prisma.player.update({
    where: { id: playerId },
    data: { achievements: { disconnect: { id: achievementId } } },
  });
  refresh();
  return { success: true };
}
