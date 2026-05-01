import {
  Player,
  Comment as CommentType,
  Like,
} from "@/lib/generated/prisma/client";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemMedia,
  ItemTitle,
} from "../ui/item";
import { Avatar } from "../profile/avatar";
import { Suspense } from "react";
import { CommentControls } from "./comment-controls";

export function Comment({
  comment,
}: {
  comment: CommentType & { author: Player; _count: {likes: number}, likes: Like[] };
}) {
  return (
    <Item variant="outline" size="xs">
      <ItemMedia>
        <Avatar className="size-12 rounded-full" player={comment.author} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{comment.author.name}</ItemTitle>
        <ItemDescription>
          {comment.createdAt.toLocaleDateString()}
        </ItemDescription>
      </ItemContent>
      <Suspense>
        <ItemActions>
          <CommentControls comment={comment} />
        </ItemActions>
      </Suspense>
      <ItemFooter className="items-end p-2">
        <p className="flex gap-4 text-muted-foreground">{comment.content}</p>
      </ItemFooter>
    </Item>
  );
}
