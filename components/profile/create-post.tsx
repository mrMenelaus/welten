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
import { leavePost } from "./post-actions";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { Spinner } from "../ui/spinner";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

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
    console.log("aboba");
    startTransition(async () => {
      await leavePost(data);
      setOpen(false);
      form.reset();
    });
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            <Controller
              name="images"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      field.onChange(res);
                    }}
                  />
                  <div className="grid gap-2 grid-cols-4">
                    {field.value.map((image) => (
                      <div
                        key={image.name}
                        className="aspect-square rounded-md overflow-clip relative"
                      >
                        <Image fill src={image.ufsUrl} alt={image.name} />
                      </div>
                    ))}
                  </div>
                </Field>
              )}
            />
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
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
