"use client";

import { Controller, useForm } from "react-hook-form";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { commentSchema } from "./types";
import { leaveComment } from "./comment-actions";
import { Spinner } from "../ui/spinner";

export function CommentForm({ playerId }: { playerId: string }) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      await leaveComment(playerId, data);
      form.reset()
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Controller
        control={form.control}
        name="content"
        render={({ fieldState, field }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="block-end-textarea">
              Оставьте комментарий
            </FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id="block-end-textarea"
                placeholder="Я тебя люблю..."
                {...field}
                aria-invalid={fieldState.invalid}
              />
              <InputGroupAddon align="block-end">
                <InputGroupText data-invalid={fieldState.invalid}>
                  {field.value.length}/280
                </InputGroupText>
                <InputGroupButton
                  type="submit"
                  variant="default"
                  size="sm"
                  className="ml-auto"
                  disabled={isPending}
                >
                  {isPending && <Spinner />}
                  Отправить
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <FieldDescription>
              Вы можете оставить только один комментарий
            </FieldDescription>
          </Field>
        )}
      />
    </form>
  );
}
