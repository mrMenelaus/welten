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
import { useState, useTransition } from "react";
import { postSchema } from "./types";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createPost } from "./post-actions";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { MultiUploader } from "@/lib/upload-button";
import { toast } from "sonner";

export function CreatePost() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      const result = await createPost(data);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.message);
      }
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        <Pencil />
        Создать пост
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Создание поста</DialogTitle>
          <DialogDescription>Что у тебя сегодня на уме?</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          id="create-post"
          className="no-scrollbar max-h-[50vh] overflow-y-auto"
        >
          <FieldGroup>
            <Controller
              name="images"
              control={form.control}
              render={({ field }) => (
                <MultiUploader
                  endpoint="imageUploader"
                  setUploaded={field.onChange}
                  uploaded={field.value}
                />
              )}
            />
            <Controller
              control={form.control}
              name="content"
              render={({ fieldState, field }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="content">
                    Текст поста
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      id="content"
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
            form="create-post"
            type="submit"
            variant="default"
            size="sm"
            disabled={isPending}
          >
            {isPending && <Spinner />}
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
