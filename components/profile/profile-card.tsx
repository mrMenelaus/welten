import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Item, ItemContent, ItemHeader, ItemTitle } from "../ui/item";
import { MappedPlayer } from "./get-player";
import { PlayerStatus } from "./player-status";
import { Badge } from "../ui/badge";
import { ProfileComments } from "./profile-comments";
import { Avatar } from "./avatar";

export async function ProfileCard({ player }: { player: MappedPlayer }) {
  return (
    <Animated
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
      transition={{
        duration: 0.8,
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
                  <Badge key={e.id}>{e.value}</Badge>
                ))}
              </div>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="block">
          <ProfileComments comments={player.comments} />
        </CardFooter>
      </Card>
    </Animated>
  );
}
