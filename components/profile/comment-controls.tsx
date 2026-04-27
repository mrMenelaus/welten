"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import {
  Player,
  PlayerComment,
  PlayerCommentLike,
} from "@/lib/generated/prisma/client";
import { useAuth } from "../auth/auth-provider";
import { like } from "./comment-actions";
import { cn } from "@/lib/utils";

export function CommentControls({
  comment,
}: {
  comment: PlayerComment & { author: Player; likes: PlayerCommentLike[] };
}) {
  const session = useAuth();

  return (
    <>
      <Button
        variant="outline"
        size="xs"
        disabled={!session}
        onClick={() => like(comment.id)}
      >
        <Heart
          className={cn({
            "fill-rose-500": comment.likes.find(
              (e) => e.authorId === session?.sub,
            ),
          })}
        />
        {comment.likes.length}
      </Button>
    </>
  );
}
