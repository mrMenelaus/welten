"use client";

import { Pen } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { Dispatch, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { commentSchema } from "../profile/types";
import { editComment } from "./comment-actions";
import { Comment } from "@/lib/generated/prisma/client";
import { getTagHelper } from "@/lib/get-tag-helper";
import { toast } from "sonner";

const getId = getTagHelper("comment", "edit");

export function EditComment({
  comment,
  open,
  setOpen,
}: {
  comment: Comment;
  open: boolean;
  setOpen: Dispatch<boolean>;
}) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    values: {
      content: comment.content,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await editComment(comment.id, data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Изменить комментарий</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} id={getId(comment.id)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="content"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={getId(comment.id, field.name)}>
                    Текст комментария
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id={getId(comment.id, field.name)}
                      placeholder="Я тебя люблю..."
                      {...field}
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText data-invalid={fieldState.invalid}>
                        {field.value.length}/600
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Выйти</DialogClose>
          <Button
            form={getId(comment.id)}
            type="submit"
            variant="default"
            size="sm"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
