import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET() {
  const player = await prisma.player.findUnique({
    where: { name: "JustJabka" },
  });
  if (!player) {
    return Response.json({ status: "ok" });
  }
  const token = jwt.sign(
    { sub: player.id, name: player.name },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  redirect(`/auth?key=${token}`)
}
