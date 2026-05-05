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
import { ReactNode } from "react";

export function PlayerCard({
  player,
  children,
}: {
  player: Player;
  children?: ReactNode;
}) {
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
      {children && <ItemActions>{children}</ItemActions>}
    </Item>
  );
}
