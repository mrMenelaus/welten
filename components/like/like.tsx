"use client";

import { Heart } from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { Button } from "../ui/button";
import { Likeable } from "./types";
import { like } from "./like-actions";
import { cn } from "@/lib/utils";
import { useOptimistic } from "react";

export function Like({
  type,
  entityId,
  likes,
  size = "sm",
}: {
  likes: { authorId: string }[];
  type: Likeable;
  entityId: string;
  size?: "xs" | "sm" | "lg";
}) {
  const session = useAuth();

  const isLiked = likes.some((e) => e.authorId === session?.sub);
  const count = likes.length;

  const [optimisticLikes, setOptimisticLikes] = useOptimistic({
    count,
    isLiked,
  });

  return (
    <form
      action={async () => {
        setOptimisticLikes((prev) => ({
          isLiked: !prev.isLiked,
          count: prev.isLiked ? prev.count - 1 : prev.count + 1,
        }));
        await like(type, entityId);
      }}
    >
      <Button variant="outline" size={size} disabled={!session} type="submit">
        <Heart
          className={cn({ "fill-card-foreground": optimisticLikes.isLiked })}
        />
        {optimisticLikes.count}
      </Button>
    </form>
  );
}
