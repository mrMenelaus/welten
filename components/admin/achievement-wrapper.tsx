import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import { AchievementActions } from "./achievement-actions";
import { MappedPlayer } from "../profile/get-player";

export async function AchievementWrapper({ player }: { player: MappedPlayer }) {
  const session = await getSession();
  if (!session?.roles.includes(process.env.ADMIN_ROLE!)) return null;

  const achievements = await prisma.achievement.findMany({include: {image: true}});

  return (
    <AchievementActions
      playerId={player.id}
      achievements={achievements}
      playerAchievements={player.achievements}
    />
  );
}
