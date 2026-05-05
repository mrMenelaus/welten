import { prisma } from "@/lib/prisma";
import z from "zod";

const transferSchema = z.object({
  target: z.string().optional(),
  source: z.string().optional(),
  amount: z.int(),
  comment: z.string().optional(),
});

export async function POST(request: Request) {
  const key = request.headers.get("welten-api-key");
  if (key !== process.env.API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();
  const parsed = transferSchema.safeParse(body);

  if (parsed.error) {
    return new Response(JSON.stringify(parsed.error), { status: 400 });
  }

  const { amount, comment, source, target } = parsed.data;

  if (!source && !target) {
    return new Response("Error", { status: 400 });
  }

  if (source) {
    const player = await prisma.player.findUnique({
      where: { name: source },
      select: { balance: true },
    });
    if (!player) {
      return new Response("Error", { status: 400 });
    }

    if (player.balance < amount) {
      return new Response("Error", { status: 400 });
    }
  }

  if (target && !source) {
    const [player] = await prisma.$transaction([
      prisma.player.update({
        data: { balance: { increment: amount } },
        where: { name: target },
      }),
      prisma.transfer.create({
        data: { amount, comment, target: { connect: { name: target } } },
      }),
    ]);

    return new Response(JSON.stringify({ balance: player.balance }), {
      status: 200,
    });
  }

  if (!target && source) {
    const [player] = await prisma.$transaction([
      prisma.player.update({
        data: { balance: { decrement: amount } },
        where: { name: source },
      }),
      prisma.transfer.create({
        data: { amount, comment, source: { connect: { name: source } } },
      }),
    ]);

    return new Response(JSON.stringify({ balance: player.balance }), {
      status: 200,
    });
  }

  if (target && source) {
    const [targetPlayer, sourcePlayer] = await prisma.$transaction([
      prisma.player.update({
        data: { balance: { increment: amount } },
        where: { name: target },
      }),
      prisma.player.update({
        data: { balance: { decrement: amount } },
        where: { name: source },
      }),
      prisma.transfer.create({
        data: {
          amount,
          comment,
          source: { connect: { name: source } },
          target: { connect: { name: target } },
        },
      }),
    ]);

    return new Response(
      JSON.stringify({
        targetBalance: targetPlayer.balance,
        sourceBalance: sourcePlayer.balance,
      }),
      { status: 200 },
    );
  }
}
