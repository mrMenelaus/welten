import ShowMore from "../layout/show-more";
import { getPlayer } from "./get-player";

import { getSession } from "@/lib/auth/get-session";
import AuthMessage from "@/lib/auth/auth-message";
import { Comment } from "../comment/comment";
import { CommentForm } from "../comment/comment-form";

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
            <Comment comment={comment} key={comment.id} />
        ))}
      </ShowMore>
      {session ? (
        session.sub !== player.id && (
          <CommentForm type="player" entityId={player.id} />
        )
      ) : (
        <AuthMessage />
      )}
    </div>
  );
}
