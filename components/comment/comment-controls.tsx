"use client";

import { useAuth } from "../auth/auth-provider";
import { EditComment } from "./edit-comment";
import { Like } from "../like/like";
import { DeleteComment } from "./delete-comment";
import { Comment } from "../profile/get-player";

export function CommentControls({ comment }: { comment: Comment }) {
  const session = useAuth();

  return (
    <>
      <Like
        isLiked={Boolean(comment.likes.length)}
        count={comment._count.likes}
        entityId={comment.id}
        type="comment"
        size="xs"
      />
      {comment.author.id === session?.sub && (
        <>
          <EditComment comment={comment} key={comment.content} />
          <DeleteComment comment={comment} />
        </>
      )}
    </>
  );
}
