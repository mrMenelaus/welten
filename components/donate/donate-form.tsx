"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { donateSchema } from "./types";
import { donate as donateAction } from "./actions";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { Spinner } from "../ui/spinner";
import { Donate } from "@/lib/generated/prisma/client";

export function DonateForm({
  players,
  donate,
}: {
  donate: Donate;
  players: { name: string; id: string }[];
}) {
  const [isPending, startTransition] = useTransition();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(donateSchema),
    defaultValues: { player: null! },
  });

  const onSubmit = handleSubmit((data) =>
    startTransition(async () => {
      await donateAction(donate.id, data);
    }),
  );

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="player"
          control={control}
          render={({ field, fieldState }) => (
            <Field orientation="responsive">
              <FieldContent>
                <FieldLabel htmlFor="combobox">Игрок для доната</FieldLabel>
                <FieldDescription>
                  Вы можете купить донат любому игроку. Будьте внимательны!
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </FieldContent>
              <Combobox
                id="combobox"
                value={field.value}
                onValueChange={(value) => field.onChange(value)}
                items={players}
                itemToStringLabel={(item) => item.name}
              >
                <ComboboxInput placeholder="Выберите игрока" />
                <ComboboxContent>
                  <ComboboxEmpty>Игрок не найден.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: { name: string; id: string }) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />} Купить
        </Button>
      </FieldGroup>
    </form>
  );
}
