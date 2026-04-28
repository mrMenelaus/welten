"use client";

import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Controller, useForm } from "react-hook-form";
import { useTransition } from "react";
import { postSchema } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { leavePost } from "./post-actions";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { UploadButton } from "@/lib/uploadthing";

export function CreatePost() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      image: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log("aboba");
    startTransition(async () => {
      await leavePost(data);
      form.reset();
    });
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
          Создать пост
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Создание поста</DialogTitle>
            <DialogDescription>Что у тебя сегодня на уме?</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Controller
                name="image"
                control={form.control}
                render={({ field }) => (
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].ufsUrl);
                    }}
                  />
                )}
              />
            </Field>
            <Controller
              control={form.control}
              name="content"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="block-end-textarea">
                    Текст поста
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
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Выйти</Button>
            </DialogClose>
            <Button
              type="submit"
              variant="default"
              size="sm"
              className="ml-auto"
              disabled={isPending}
            >
              {isPending && <Spinner />}
              Создать
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
