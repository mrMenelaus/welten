import ShowMore from "../layout/show-more";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { getPlayer } from "./get-player";

import { Player, PlayerComment, PlayerCommentLike } from "@/lib/generated/prisma/client";
import { CommentForm } from "./comment-form";
import { Animated } from "../layout/animated";
import { CommentControls } from "./comment-controls";
import { Avatar } from "./avatar";
import { getSession } from "@/lib/auth/get-session";
import AuthMessage from "@/lib/auth/auth-message";
import { Suspense } from "react";

export async function ProfileComments({ name }: { name: string }) {
  const session = await getSession();
  const player = await getPlayer(name);
  if (!player) return null;

  return (
    <div className="space-y-4 flex-1">
      <div className="block text-2xl font-semibold">
        Комментарии ({player.playerComments.length})
      </div>
      <ShowMore initial={2}>
        {player.playerComments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </ShowMore>
      {session ? (
        session.sub !== player.id && <CommentForm playerId={player.id} />
      ) : (
        <AuthMessage />
      )}
    </div>
  );
}

function Comment({ comment }: { comment: PlayerComment & { author: Player, likes: PlayerCommentLike[] } }) {
  return (
    <Animated>
      <Item variant="outline" size="xs">
        {/* <ItemHeader>{comment.createdAt.toLocaleString()}</ItemHeader> */}
        <ItemMedia>
          <Avatar className="size-12 rounded-full" player={comment.author} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{comment.author.name}</ItemTitle>
          <p className="flex gap-4">{comment.content}</p>
        </ItemContent>
        <Suspense>
          <ItemActions>
            <CommentControls comment={comment} />
          </ItemActions>
        </Suspense>
        {/* <ItemFooter className="items-end"> */}
        {/* </ItemFooter> */}
      </Item>
    </Animated>
  );
}
