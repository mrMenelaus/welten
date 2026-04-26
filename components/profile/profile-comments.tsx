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

import { Player, PlayerComment } from "@/lib/generated/prisma/client";
import { CommentForm } from "./comment-form";
import { Animated } from "../layout/animated";
import { CommentControls } from "./comment-controls";
import { Avatar } from "./avatar";
import { getSession } from "@/lib/auth/get-session";
import AuthMessage from "@/lib/auth/auth-message";

export async function ProfileComments({ name }: { name: string }) {
  const session = await getSession();
  const player = await getPlayer(name);
  if (!player) return null;

  return (
    <div className="space-y-4">
      <div className="block text-2xl font-semibold">
        Комментарии ({player.playerComments.length})
      </div>
      <ShowMore initial={2}>
        {player.playerComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ShowMore>
      {session ? <CommentForm playerId={player.id} /> : <AuthMessage />}
    </div>
  );
}

function Comment({ comment }: { comment: PlayerComment & { author: Player } }) {
  return (
    <Animated>
      <Item variant="outline">
        <ItemMedia>
          <Avatar className="size-16 rounded-full" player={comment.author} />
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
