import { prisma } from "@/lib/prisma";
import { EventEmitter } from "events";
import z from "zod";
// import { Vibrant } from "node-vibrant/node";

const emitter = new EventEmitter();

export async function getGradientFromImage(imageUrl: string) {
  return "linear-gradient(120deg, #bdc3c7, #2c3e50)";
  // try {
  //   const palette = await Vibrant.from(imageUrl).getPalette();

  //   // Выбираем яркие цвета в порядке приоритета
  //   const colors = [palette.DarkVibrant?.hex, palette.LightVibrant?.hex].filter(
  //     Boolean,
  //   ) as string[];

  //   if (colors.length < 2) {
  //     return "linear-gradient(120deg, #3b82f6, #8b5cf6)"; // fallback
  //   }

  //   return `linear-gradient(120deg, ${colors.join(", ")})`;
  // } catch (e) {
  //   return "linear-gradient(120deg, #bdc3c7, #2c3e50)";
  // }
}

const playerSchema = z.object({
  name: z.string(),
  status: z.enum(["ONLINE", "OFFLINE"]),
  nodes: z.string().array(),
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
  const key = req.headers.get("welten-api-key");
  if (key !== process.env.API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await req.json();
  const parsed = playerSchema.safeParse(data);
  if (parsed.error) {
    return new Response(JSON.stringify(parsed.error), { status: 400 });
  }

  const roles = parsed.data.nodes.map((node) => ({ value: node }));

  const src = `https://nmsr.nickac.dev/bust/${parsed.data.skin.textures.SKIN.url.split("/").at(-1)}?${parsed.data.skin.textures.SKIN.metadata.model === "default" ? "steve" : "alex"}`;
  const background = await getGradientFromImage(src);

  // const {nodes} = parsed.data;

  await prisma.role.createMany({ skipDuplicates: true, data: roles });

  await prisma.player.upsert({
    create: {
      status: parsed.data.status,
      name: parsed.data.name,
      skin: src,
      background,
      roles: {
        connect: roles,
      },
    },
    update: {
      skin: src,
      background,
      status: parsed.data.status,
      roles: {
        set: roles,
      },
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
