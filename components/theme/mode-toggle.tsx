import { Palette } from "./palette";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";

export async function ModeToggle() {

  const session = await getSession()
  if (!session) return null
  
  const player = await prisma.player.findUnique({where: {id: session.sub}, include: {colors: true}})
  if (!player) return null


  return (
      <Palette colors={player.colors} accent={player.accent} background={player.background}  />
  );
}
