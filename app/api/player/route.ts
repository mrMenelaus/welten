import { prisma } from "@/lib/prisma";
import { EventEmitter } from "events";
import z from "zod";
import { getPalette } from "colorthief";

const emitter = new EventEmitter();

const playerSchema = z.object({
  name: z.string(),
  balance: z.number(),
  status: z.enum(["ONLINE", "OFFLINE"]),
  skin: z.object({
    textures: z.object({
      SKIN: z.object({
        url: z.string(),
      }),
    }),
  }),
});

export async function POST(req: Request) {
  const data = await req.json();
  const parsed = playerSchema.safeParse(data);
  if (parsed.error) {
    return new Response(JSON.stringify(parsed.error), { status: 400 });
  }

  const src = `https://nmsr.nickac.dev/bust/${parsed.data.skin.textures.SKIN.url.split("/").at(-1)}`;
  const res = await fetch(src);
  const buffer = Buffer.from(await res.arrayBuffer());
  const palette = await getPalette(buffer, { colorCount: 2 });

  const background = palette
    ? `linear-gradient(135deg, ${palette[0].hex()} 0%, ${palette[1].hex()} 100%)`
    : "transparent";

  await prisma.player.upsert({
    create: {
      ...parsed.data,
      skin: src,
      background,
    },
    update: {
      ...parsed.data,
      skin: src,
      background,
    },
    where: { name: parsed.data.name },
  });

  emitter.emit("player", JSON.stringify(data));

  return Response.json({ status: "ok" });
}

export function GET(req: Request) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  const listener = (data: string) => {
    writer.write(encoder.encode(`data: ${data}\n\n`));
  };

  emitter.on("player", listener);

  // initial ping
  writer.write(encoder.encode(`: connected\n\n`));

  req.signal.addEventListener("abort", () => {
    emitter.off("player", listener);
    writer.close();
  });

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
