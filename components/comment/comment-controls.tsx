"use client";

import {
  Player,
  Comment,
  Like as LikeType,
} from "@/lib/generated/prisma/client";
import { useAuth } from "../auth/auth-provider";
import { EditComment } from "./edit-comment";
import { Like } from "../like/like";
import { DeleteComment } from "./delete-comment";

export function CommentControls({
  comment,
}: {
  comment: Comment & {
    author: Player;
    _count: { likes: number };
    likes: LikeType[];
  };
}) {
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
