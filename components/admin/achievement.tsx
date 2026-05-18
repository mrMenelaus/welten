import Image from "next/image";
import { getPlayersCount, type Achievement } from "../profile/get-player";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Badge } from "../ui/badge";
import { Image as ImageType } from "@/lib/generated/prisma/client";

export async function Achievement({
  achievement,
}: {
  achievement: Achievement & { image: ImageType };
}) {
  const players = await getPlayersCount();
  return (
    <Item variant="outline" size="xs">
      <ItemMedia className="size-16">
        <Image
          fill
          src={achievement.image.ufsUrl}
          alt={achievement.image.name}
          className="object-cover rounded-sm"
        />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{achievement.name}</ItemTitle>
        <ItemDescription>{achievement.description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="default">
          {((achievement._count.players / players) * 100).toFixed(2)}%
        </Badge>
      </ItemActions>
    </Item>
  );
}
