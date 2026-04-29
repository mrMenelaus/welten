import { prisma } from "@/lib/prisma";
import { EventEmitter } from "events";
import z from "zod";
import { Vibrant } from "node-vibrant/node";

const emitter = new EventEmitter();

export async function getGradientFromImage(imageUrl: string) {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();

    // Выбираем яркие цвета в порядке приоритета
    const colors = [
      palette.DarkMuted?.hex,
      palette.DarkVibrant?.hex,
      palette.LightVibrant?.hex,
      palette.Muted?.hex,
      palette.DarkMuted?.hex,
    ].filter(Boolean) as string[];

    if (colors.length < 2) {
      return "linear-gradient(120deg, #3b82f6, #8b5cf6)"; // fallback
    }

    // Берём топ 3 цвета для красивого градиента
    const selectedColors = colors.slice(0, 3);

    return `linear-gradient(120deg, ${selectedColors.join(", ")})`;
  } catch {
    return "linear-gradient(120deg, #3b82f6, #8b5cf6)";
  }
}

const playerSchema = z.object({
  name: z.string(),
  balance: z.number(),
  status: z.enum(["ONLINE", "OFFLINE"]),
  skin: z.object({
    textures: z.object({
      SKIN: z.object({
        url: z.string(),
        metadata: z
          .object({
            model: z.enum(["slim", "default"]).default("default"),
          })
          .default({ model: "default" }),
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

  const src = `https://nmsr.nickac.dev/bust/${parsed.data.skin.textures.SKIN.url.split("/").at(-1)}?${parsed.data.skin.textures.SKIN.metadata.model === "default" ? "steve" : "alex"}`;
  const background = await getGradientFromImage(src);

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
