"use client";

import { Donate } from "@/lib/generated/prisma/client";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "../ui/item";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { Spinner } from "../ui/spinner";
import {
  createDonate,
  deleteDonate as serverDeleteDonate,
  editDonate as serverEditDonate,
} from "./actions";
import { z } from "zod";
import { createDonateSchema } from "./types";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical, Pen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  DialogContent,
  DialogHeader,
  Dialog,
  DialogClose,
  DialogTitle,
} from "../ui/dialog";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty";

export function AdminPanel({ donates }: { donates: Donate[] }) {
  const [state, setState] = useOptimistic(donates);

  console.log(donates);

  return (
    <div className="space-y-4">
      <CreateDonate setState={setState} />
      <Card>
        <CardHeader>
          <CardTitle>Все донаты</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {state.length ? (
              state.map((donate) => (
                <Item key={donate.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{donate.name}</ItemTitle>
                    <ItemDescription>
                      Страница: <code>{`/donate/${donate.param}`}</code>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {(donate as { optimistic?: boolean }).optimistic ? (
                      <Spinner />
                    ) : (
                      <DonateActions setState={setState} donate={donate} />
                    )}
                  </ItemActions>
                </Item>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Донатов нет</EmptyTitle>
                  <EmptyDescription>Но вы можете их создать</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  );
}

function DonateActions({
  setState,
  donate,
}: {
  setState: Dispatch<SetStateAction<Donate[]>>;
  donate: Donate;
}) {
  const { control, handleSubmit } = useForm<z.infer<typeof createDonateSchema>>(
    {
      values: donate,
      resolver: zodResolver(createDonateSchema),
    },
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const deleteDonate = () =>
    startTransition(async () => {
      setState((prev) => prev.filter((e) => e.id !== donate.id));
      await serverDeleteDonate(donate.id);
    });

  const onSubmit = handleSubmit((data) =>
    startTransition(async () => {
      setState((prev) =>
        prev.map((e) => (e.id === donate.id ? { ...e, ...data } : e)),
      );
      await serverEditDonate(donate.id, data);
    }),
  );

  return (
    <>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash />
            </AlertDialogMedia>
            <AlertDialogTitle>Удалить донат?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие невожможно отменить
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Выйти</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={deleteDonate}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Изменить комментарий</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} id="create-donate">
            <FieldGroup>
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="username">Название доната</FieldLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Deluxe"
                      {...field}
                    />
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="param"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="param">Страница</FieldLabel>
                    <Input
                      id="param"
                      type="text"
                      placeholder="deluxe"
                      {...field}
                    />
                    <FieldDescription>
                      Используется в URL страницы /donate/страница
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="description">Описание</FieldLabel>
                    <Textarea
                      {...field}
                      id="description"
                      placeholder="# Преимущества"
                    />
                    <FieldDescription>
                      Вы можете использовать markdown
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <DialogClose>Закрыть</DialogClose>
              <DialogClose type="submit">Сохранить</DialogClose>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>

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
  );
}

function CreateDonate({
  setState,
}: {
  setState: Dispatch<SetStateAction<Donate[]>>;
}) {
  const { handleSubmit, control, reset } = useForm<
    z.infer<typeof createDonateSchema>
  >({
    defaultValues: {
      description: "",
      name: "",
      param: "",
      background: "",
      cost: "100.00",
    },
    resolver: zodResolver(createDonateSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      setState((prev) => [
        {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          optimistic: true,
        },
        ...prev,
      ]);
      await createDonate(data);
      reset();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить донат</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} id="create-donate">
          <FieldGroup>
            <Controller
              name="background"
              control={control}
              render={({ field }) => (
                <Field>
                  <UploadButton
                    endpoint="donate"
                    onClientUploadComplete={(res) => {
                      field.onChange(res[0].ufsUrl);
                    }}
                  />
                  {field.value && (
                    <div className="aspect-video rounded-2xl relative overflow-clip">
                      <Image
                        src={field.value}
                        alt="bg"
                        className="object-contain"
                        fill
                      />
                    </div>
                  )}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="username">Название доната</FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Deluxe"
                    {...field}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="param"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="param">Страница</FieldLabel>
                  <Input
                    id="param"
                    type="text"
                    placeholder="deluxe"
                    {...field}
                  />
                  <FieldDescription>
                    Используется в URL страницы /donate/страница
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="description">Описание</FieldLabel>
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="# Преимущества"
                  />
                  <FieldDescription>
                    Вы можете использовать markdown
                  </FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          form="create-donate"
          type="submit"
          variant="outline"
          disabled={isPending}
        >
          {isPending && <Spinner />} Создать
        </Button>
      </CardFooter>
    </Card>
  );
}
