import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemHeader,
  ItemTitle,
} from "../ui/item";
import { getPlayer } from "./get-player";
import { UnderDevelopment } from "../layout/under-development";
import { PlayerStatus } from "./player-status";
import { Badge } from "../ui/badge";
import { Suspense } from "react";
import { ProfileComments } from "./profile-comments";
import Image from "next/image";

export async function ProfileCard({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return <UnderDevelopment />;

  return (
    <Animated>
      <Card>
        <CardHeader>
          <Item className="items-center flex-col">
            <ItemHeader>
              <div className="size-48 relative bg-linear-to-tl border border-border from-primary/30 to-primary/5 rounded-lg">
                <Image
                  fill
                  src={`https://nmsr.nickac.dev/bust/${JSON.parse(player.skin as string).profileId}`}
                  alt={player.name}
                />
              </div>
            </ItemHeader>
            <ItemContent className="flex flex-col items-center">
              <ItemTitle className="text-2xl font-bold">
                {player.name}
              </ItemTitle>

              <PlayerStatus
                initial={{ status: player.status, balance: player.balance }}
              />
              <div className="flex gap-1 flex-wrap">
                <Badge>Player</Badge>
                <Badge>Admin</Badge>
              </div>
            </ItemContent>
          </Item>
          <CardContent></CardContent>
          <CardFooter>
            <Suspense>
              <ProfileComments name={name} />
            </Suspense>
          </CardFooter>
        </CardHeader>
      </Card>
    </Animated>
  );
}

// function PlayerNotFound (){
//     return UnderDevelopment
// }
