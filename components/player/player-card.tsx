import { Player, Role } from "@/lib/generated/prisma/client";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Avatar } from "../profile/avatar";
import { ReactNode } from "react";
import { Badge } from "../ui/badge";

export function PlayerCard({
  player,
  children,
  roles,
}: {
  player: Player;
  roles?: Role[];
  children?: ReactNode;
}) {
  return (
    <Item variant="outline">
      <ItemMedia>
        <Avatar className="size-24 rounded-2xl" player={player} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{player.name}</ItemTitle>
        {roles && (
          <div className="flex gap-2 items-center">
            {roles.map((role) => (
              <Badge key={role.id}>{role.value}</Badge>
            ))}
          </div>
        )}
      </ItemContent>
      {children && <ItemActions>{children}</ItemActions>}
    </Item>
  );
}
