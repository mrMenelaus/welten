import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Item, ItemContent, ItemHeader, ItemTitle } from "../ui/item";
import { getPlayer } from "./get-player";
import { UnderDevelopment } from "../layout/under-development";
import { PlayerStatus } from "./player-status";
import { Badge } from "../ui/badge";
import { Suspense } from "react";
import { ProfileComments } from "./profile-comments";
import { Avatar } from "./avatar";

export async function ProfileCard({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return <UnderDevelopment />;

  return (
    <Animated>
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
