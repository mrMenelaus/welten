"use client";

import { Heart } from "lucide-react";
import { useAuth } from "../auth/auth-provider";
import { Button } from "../ui/button";
import { Likeable } from "./types";
import { like } from "./like-actions";
import { cn } from "@/lib/utils";

export function Like({
  count,
  type,
  entityId,
  isLiked,
  size = "sm",
}: {
  isLiked: boolean;
  count: number;
  type: Likeable;
  entityId: string;
  size?: "xs" | "sm" | "lg";
}) {
  const session = useAuth();

  return (
    <Button
      variant="outline"
      size={size}
      disabled={!session}
      onClick={() => like(type, entityId)}
    >
      <Heart className={cn({ "fill-card-foreground": isLiked })} />
      {count}
    </Button>
  );
}
