"use client";

import { useAuth } from "../auth/auth-provider";
import { EditComment } from "./edit-comment";
import { Like } from "../like/like";
import { DeleteComment } from "./delete-comment";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Comment, Player } from "@/lib/generated/prisma/client";

export function CommentControls({ comment }: { comment: Comment & {author: Player, likes: {authorId: string}[]} }) {
  const session = useAuth();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <>
      <Like
        likes={comment.likes}
        entityId={comment.id}
        type="comment"
      />
      {comment.author.id === session?.sub && (
        <>
          <EditComment
            open={editOpen}
            setOpen={setEditOpen}
            comment={comment}
          />
          <DeleteComment
            open={deleteOpen}
            setOpen={setDeleteOpen}
            comment={comment}
          />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" />}
            >
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pen /> Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash /> Удалить
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  );
}
