import { Comment } from "../comment/comment";
import ShowMore from "../layout/show-more";
import { CommentForm } from "../comment/comment-form";
import { Comment as CommentType, Player } from "@/lib/generated/prisma/client";
import { Suspense } from "react";

export async function ProfileComments({ comments,id }: { comments: (CommentType & {author: Player, likes: {authorId: string}[]})[], id: string }) {

  return (
    <div className="space-y-4 flex-1">
      <div className="block text-2xl font-semibold">
        Комментарии ({comments.length})
      </div>
      <ShowMore initial={2}>
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </ShowMore>
        <Suspense>
        <CommentForm type="player" entityId={id} />
        </Suspense>
    </div>
  );
}
