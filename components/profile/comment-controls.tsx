"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";

export function CommentControls({ commentId }: { commentId?: string }) {
  return (
    <>
      <Button size="lg" variant="outline">
        <Heart className="m-1"/> 100
      </Button>
    </>
  );
}
