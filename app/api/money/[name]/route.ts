import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  ctx: RouteContext<"/api/money/[name]">,
) {

  const key = request.headers.get("welten-api-key")
  if (key !== process.env.API_KEY) {
    return new Response("Unauthorized", {status: 401})
  }
  
  const { name } = await ctx.params;
  const player = await prisma.player.findUnique({
    where: { name },
    select: { balance: true },
  });

  return new Response(JSON.stringify(player), { status: 200 });
}
