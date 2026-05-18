"use client";

import { Achievement, Image as ImageType } from "@/lib/generated/prisma/client";
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
  createAchievement,
  deleteAchievement as serverDeleteAchievement,
  editAchievement as serverEditAchievement,
} from "./actions";
import { createAchievementSchema } from "./types";
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
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "../ui/empty";
import { MultiUploader } from "@/lib/upload-button";

type ExpandedAchievement = Achievement & {
  image: ImageType;
};

export function AchievementsPanel({
  achievements,
}: {
  achievements: ExpandedAchievement[];
}) {
  const [state, setState] = useOptimistic(achievements);

  return (
    <div className="space-y-4">
      <CreateAchievement setState={setState} />
      <Card>
        <CardHeader>
          <CardTitle>Все достижения</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {state.length ? (
              state.map((achievement) => (
                <Item key={achievement.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{achievement.name}</ItemTitle>
                    <ItemDescription>{achievement.description}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {(achievement as { optimistic?: boolean }).optimistic ? (
                      <Spinner />
                    ) : (
                      <AchievementActions
                        setState={setState}
                        achievement={achievement}
                      />
                    )}
                  </ItemActions>
                </Item>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>Достижений нет</EmptyTitle>
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

function AchievementActions({
  setState,
  achievement,
}: {
  setState: Dispatch<SetStateAction<ExpandedAchievement[]>>;
  achievement: ExpandedAchievement;
}) {
  const { control, handleSubmit } = useForm({
    values: { ...achievement, images: [achievement.image] },
    resolver: zodResolver(createAchievementSchema),
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const deleteDonate = () =>
    startTransition(async () => {
      setState((prev) => prev.filter((e) => e.id !== achievement.id));
      await serverDeleteAchievement(achievement.id);
    });

  const onSubmit = handleSubmit((data) =>
    startTransition(async () => {
      setState((prev) =>
        prev.map((e) => (e.id === achievement.id ? { ...e, ...data } : e)),
      );
      await serverEditAchievement(achievement.id, data);
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
            <AlertDialogTitle>Удалить достижение?</AlertDialogTitle>
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
            <DialogTitle>Изменить достижение</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} id="create-achievement">
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
                    <FieldLabel htmlFor="username">
                      Название достижения
                    </FieldLabel>
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
                name="description"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="description">Описание</FieldLabel>
                    <Textarea {...field} id="description" placeholder="" />
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

function CreateAchievement({
  setState,
}: {
  setState: Dispatch<SetStateAction<ExpandedAchievement[]>>;
}) {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      description: "",
      name: "",
      images: [],
    },
    resolver: zodResolver(createAchievementSchema),
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

      await createAchievement(data);
      reset();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить достижение</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} id="create-achievement">
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
                  <FieldLabel htmlFor="username">
                    Название достижения
                  </FieldLabel>
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
          form="create-achievement"
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
