import { getSession } from "@/lib/auth/get-session";
import { Comment } from "../comment/comment";
import ShowMore from "../layout/show-more";
import { MappedPlayer } from "./get-player";
import { CommentForm } from "../comment/comment-form";

export async function ProfileComments({ player }: { player: MappedPlayer }) {
  const session = await getSession();
  if (!session) return null;

  return (
    <div className="space-y-4 flex-1">
      <div className="block text-2xl font-semibold">
        Комментарии ({player.comments.length})
      </div>
      <ShowMore initial={2}>
        {player.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ShowMore>
      {session.sub !== player.id && (
        <CommentForm type="player" entityId={player.id} />
      )}
    </div>
  );
}
