import ShowMore from "../layout/show-more";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { getPlayer } from "./get-player";
import { Avatar, AvatarFallback } from "../ui/avatar";

import { Player, PlayerComment } from "@/lib/generated/prisma/client";
import { CommentForm } from "./comment-form";
import { Animated } from "../layout/animated";
import { CommentControls } from "./comment-controls";

export async function ProfileComments({ name }: { name: string }) {
  const player = await getPlayer(name);
  if (!player) return null;

  return (
    <div className="space-y-4 max-w-sm">
      <div className="block text-2xl font-semibold">
        Комментарии ({player.playerComments.length})
      </div>
      <ShowMore initial={2}>
        {player.playerComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ShowMore>
      <CommentForm playerId={player.id} />
    </div>
  );
}

function Comment({ comment }: { comment: PlayerComment & { author: Player } }) {
  return (
    <Animated>
      <Item variant="outline">
        <ItemMedia>
          <Avatar className="size-8">
            <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{comment.author.name}</ItemTitle>
          <ItemDescription className="flex gap-4">
            {comment.content}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <CommentControls />
        </ItemActions>
      </Item>
    </Animated>
  );
}
