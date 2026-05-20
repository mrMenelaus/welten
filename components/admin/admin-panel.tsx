"use client";

import { Donate, Image } from "@/lib/generated/prisma/client";
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
  DialogFooter,
} from "../ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty";
import { MultiUploader } from "@/lib/upload-button";
import { getTagHelper } from "@/lib/get-tag-helper";

type ExpandedDonate = Donate & { image: Image };

const getId = getTagHelper("donate", "edit");

export function AdminPanel({ donates }: { donates: ExpandedDonate[] }) {
  const [state, setState] = useOptimistic(donates);

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
  setState: Dispatch<SetStateAction<ExpandedDonate[]>>;
  donate: ExpandedDonate;
}) {
  const { control, handleSubmit } = useForm<z.infer<typeof createDonateSchema>>(
    {
      values: { ...donate, images: [donate.image] },
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
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Изменить донат</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={onSubmit}
            id={getId(donate.id)}
            className="no-scrollbar max-h-[50vh] overflow-y-auto"
          >
            <FieldGroup>
              <Controller
                control={control}
                name="images"
                render={({ field }) => (
                  <MultiUploader
                    endpoint="imageUploader"
                    setUploaded={field.onChange}
                    uploaded={field.value}
                  />
                )}
              />
              <Controller
                control={control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={getId(donate.id, field.name)}>
                      Название доната
                    </FieldLabel>
                    <Input
                      id={getId(donate.id, field.name)}
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
                    <FieldLabel htmlFor={getId(donate.id, field.name)}>
                      Страница
                    </FieldLabel>
                    <Input
                      id={getId(donate.id, field.name)}
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
                    <FieldLabel htmlFor={getId(donate.id, field.name)}>
                      Описание
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={getId(donate.id, field.name)}
                      placeholder="Базовый уровень поддержки"
                    />
                    <FieldDescription>
                      Короткое описание доната
                    </FieldDescription>
                    <FieldError errors={[fieldState.error]} />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="content"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={getId(donate.id, field.name)}>
                      Содержание
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={getId(donate.id, field.name)}
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
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              Закрыть
            </DialogClose>
            <DialogClose
              type="submit"
              form={getId(donate.id)}
              render={<Button variant="default" />}
            >
              Сохранить
            </DialogClose>
          </DialogFooter>
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
  setState: Dispatch<SetStateAction<ExpandedDonate[]>>;
}) {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      description: "",
      name: "",
      param: "",
      images: [],
      content: "",
      cost: "100.00",
    },
    resolver: zodResolver(createDonateSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      const id = Date.now().toString();
      const date = new Date(Date.now());

      setState((prev) => [
        {
          ...data,
          id,
          image: {
            ...data.images[0],
            id,
            postId: null,
            recordId: null,
          },
          imageId: id,
          createdAt: date,
          updatedAt: date,
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
              name="images"
              control={control}
              render={({ field }) => (
                <MultiUploader
                  endpoint="imageUploader"
                  uploaded={field.value}
                  setUploaded={field.onChange}
                />
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
                    placeholder="Базовый уровень поддержки"
                  />
                  <FieldDescription>Короткое описание доната</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="content"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="content">Содержание</FieldLabel>
                  <Textarea
                    {...field}
                    id="content"
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
