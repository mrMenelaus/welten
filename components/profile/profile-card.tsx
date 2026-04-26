import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";
import { getPlayer } from "./get-player";
import { UnderDevelopment } from "../layout/under-development";
import { PlayerModel } from "./player-model";
import { PlayerStatus } from "./player-status";;
import { Badge } from "../ui/badge";
import { Suspense } from "react";
import { ProfileComments } from "./profile-comments";

export async function ProfileCard({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return <UnderDevelopment />;

  return (
    <Animated>
      <Card>
        <CardHeader>
          <Item>
            <ItemMedia>
              <PlayerModel skin={player.skin} />
            </ItemMedia>
            <ItemContent>
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
