"use client";

import { Image as ImageType, Record } from "@/lib/generated/prisma/client";
import {
  Item,
  ItemActions,
  ItemContent,
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
  createRecord,
  editRecord as serverEditRecord,
  deleteRecord as serverDeleteRecord,
} from "./actions";
import { createRecordSchema } from "./types";
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

type ExpandedRecord = Record & {
  images: ImageType[];
};

export function RecordPanel({ records }: { records: ExpandedRecord[] }) {
  const [state, setState] = useOptimistic(records);

  return (
    <div className="space-y-4">
      <CreateRecord setState={setState} />
      <Card>
        <CardHeader>
          <CardTitle>Все записи</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {state.length ? (
              state.map((record) => (
                <Item key={record.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{record.createdAt.toDateString()}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    {(record as { optimistic?: boolean }).optimistic ? (
                      <Spinner />
                    ) : (
                      <RecordActions setState={setState} record={record} />
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

function RecordActions({
  setState,
  record,
}: {
  setState: Dispatch<SetStateAction<ExpandedRecord[]>>;
  record: ExpandedRecord;
}) {
  const { control, handleSubmit } = useForm({
    values: record,
    resolver: zodResolver(createRecordSchema),
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const deleteRecord = () =>
    startTransition(async () => {
      setState((prev) => prev.filter((e) => e.id !== record.id));
      await serverDeleteRecord(record.id);
    });

  const onSubmit = handleSubmit((data) =>
    startTransition(async () => {
      // setState((prev) =>
      //   prev.map((e) => (e.id === record.id ? { ...e, ...data } : e)),
      // );
      await serverEditRecord(record.id, data);
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
            <AlertDialogAction variant="destructive" onClick={deleteRecord}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="w-7xl">
          <DialogHeader>
            <DialogTitle>Изменить донат</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={onSubmit}
            className="no-scrollbar max-h-[50vh] overflow-y-auto"
          >
            <FieldGroup>
              <Controller
                control={control}
                name="images"
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
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              Закрыть
            </DialogClose>
            <DialogClose type="submit" render={<Button variant="default" />}>
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

function CreateRecord({
  setState,
}: {
  setState: Dispatch<SetStateAction<ExpandedRecord[]>>;
}) {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      content: "",
      images: [],
    },
    resolver: zodResolver(createRecordSchema),
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = handleSubmit((data) => {
    startTransition(async () => {
      setState((prev) => [
        {
          ...data,
          images: [],
          id: Date.now().toString(),
          createdAt: new Date(Date.now()),
          updatedAt: new Date(Date.now()),
          optimistic: true,
        },
        ...prev,
      ]);
      await createRecord(data);
      reset();
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Добавить запись</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} id="create-record">
          <FieldGroup>
            <Controller
              control={control}
              name="images"
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
              name="content"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="content">Содержание</FieldLabel>
                  <Textarea
                    {...field}
                    id="content"
                    placeholder="# Новый пост"
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
          form="create-record"
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
