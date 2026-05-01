import { Player } from "@/lib/generated/prisma/client";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Avatar } from "../profile/avatar";
import { Button } from "../ui/button";
import { SmilePlus } from "lucide-react";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Item variant="outline">
      <ItemMedia>
        <Avatar className="size-24 rounded-2xl" player={player} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{player.name}</ItemTitle>
        <ItemDescription>
          Bio: I am a frontend developer from Russia
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline">
          <SmilePlus /> Добавить в друзья
        </Button>
      </ItemActions>
    </Item>
  );
}
