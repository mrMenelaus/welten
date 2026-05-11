import { Animated } from "../layout/animated";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemTitle,
} from "../ui/item";
import { MappedPlayer } from "./get-player";
import { PlayerStatus } from "./player-status";
import { Badge } from "../ui/badge";
import { ProfileComments } from "./profile-comments";
import { Avatar } from "./avatar";
import Image from "next/image";
import cover from "@/public/cover.png";

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
                  <Badge variant="outline" key={e.id}>{e.value}</Badge>
                ))}
              </div>
            </ItemContent>
          </Item>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="block text-2xl font-semibold">Достижения (10)</div>
          <div className="grid grid-cols-2 gap-2">
            <Item variant="outline" size="xs">
              <ItemHeader>
                <div className="relative aspect-video w-full">
                  <Image
                    className="object-cover rounded-sm"
                    fill
                    src={cover}
                    alt="img"
                  />
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemTitle>Новичок</ItemTitle>
                <ItemDescription>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Quibusdam sapiente nobis non sunt pariatur dolore omnis neque
                  quos quidem illo.
                </ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="outline" size="xs">
              <ItemHeader>
                <div className="relative aspect-video w-full">
                  <Image
                    className="object-cover rounded-sm"
                    fill
                    src={cover}
                    alt="img"
                  />
                </div>
              </ItemHeader>
              <ItemContent>
                <ItemTitle>Новичок</ItemTitle>
                <ItemDescription>
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Quibusdam sapiente nobis non sunt pariatur dolore omnis neque
                  quos quidem illo.
                </ItemDescription>
              </ItemContent>
            </Item>
          </div>
        </CardContent>
        <CardFooter className="block">
          <ProfileComments player={player}  />
        </CardFooter>
      </Card>
    </Animated>
  );
}
