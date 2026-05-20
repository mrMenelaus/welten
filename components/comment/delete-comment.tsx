"use client";

import { Trash2Icon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Comment } from "@/lib/generated/prisma/client";
import { deleteComment } from "./comment-actions";
import { Dispatch } from "react";
import { toast } from "sonner";

export function DeleteComment({
  comment,
  open,
  setOpen,
}: {
  comment: Comment;
  open: boolean;
  setOpen: Dispatch<boolean>;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Удалить комментарий?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие нельзя будет отменить
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Выйти</AlertDialogCancel>

          <AlertDialogAction
            onClick={async () => {
              const result = await deleteComment(comment.id);
              if (result.success) {
                toast.success(result.message);
              } else {
                toast.error(result.message);
              }
            }}
            variant="destructive"
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
