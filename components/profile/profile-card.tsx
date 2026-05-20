import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "../ui/item";
import { MappedPlayer } from "./get-player";
import { PlayerStatus } from "./player-status";
import { Badge } from "../ui/badge";
import { ProfileComments } from "./profile-comments";
import { Avatar } from "./avatar";
import { Suspense } from "react";
import { AchievementWrapper } from "../admin/achievement-wrapper";
import ShowMore from "../layout/show-more";
import { Achievement } from "../admin/achievement";
import { getTagHelper } from "@/lib/get-tag-helper";
import { prisma } from "@/lib/prisma";
import { cacheTag } from "next/cache";

const getTag = getTagHelper("player")

export async function ProfileCard({ name }: { name: string }) {
  "use cache"
  cacheTag(getTag(name))

  const player = await prisma.player.findUnique({where: {name}, include: {roles: true, playerComments: {include: {author: true, likes: {select: {authorId: true}}}}, achievements: {include: {image: true, _count: {select: {players: true}}}}}})
  if (!player) return null
  
  return (
    <Animated
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.7, 1],
      }}
    >
      <Card size="sm">
        <CardHeader>
          <Item className="items-center flex-col">
            <ItemHeader>
              <Avatar className="size-48 rounded-md" player={player} />
            </ItemHeader>
            <ItemContent className="flex flex-col items-center">
              <ItemTitle className="text-2xl font-bold">
                {player.name}
              </ItemTitle>
              <PlayerStatus
                initial={{ status: player.status, balance: player.balance }}
              />
              <div className="flex gap-1 flex-wrap">
                {player.roles.map((e) => (
                  <Badge variant="outline" key={e.id}>
                    {e.value}
                  </Badge>
                ))}
              </div>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="block text-2xl font-semibold">
            Достижения ({player.achievements.length})
          </div>
          <ShowMore initial={2}>
            {player.achievements.map((e) => (
              <Achievement achievement={e} key={e.id} />
            ))}
          </ShowMore>
          {/* <Suspense>
            <AchievementWrapper player={player as MappedPlayer} />
          </Suspense> */}
        </CardContent>
        <CardFooter className="block">
          <ProfileComments id={player.id} comments={player.playerComments} />
        </CardFooter>
      </Card>
    </Animated>
  );
}
