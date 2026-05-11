import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("name")

  if (!query) {
    return Response.json({ status: "ok" });
  }

  const player = await prisma.player.findUnique({
    where: { name: query },
  });

  if (!player) {
    return Response.json({ status: "ok" });
  }

  const token = jwt.sign(
    { sub: player.id, name: player.name },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  redirect(`/auth?key=${token}`);
}
