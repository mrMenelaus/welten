"use client";

import { Player } from "@/lib/generated/prisma/client";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { transferSchema } from "./types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transfer } from "./transfer-actions";
import { useRef, useTransition } from "react";
import { Spinner } from "../ui/spinner";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";

export function TransferForm({
  balance,
  players,
}: {
  players: Player[];
  balance: number;
}) {
  const keyRef = useRef<null | string>(null);

  const [isPending, startTransition] = useTransition();

  function getKey() {
    if (keyRef.current) {
      return keyRef.current;
    }

    keyRef.current = crypto.randomUUID();
    return keyRef.current;
  }

  const form = useForm({
    defaultValues: { amount: "0", comment: "", target: null! },
    resolver: zodResolver(transferSchema),
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit((data) =>
    startTransition(async () => {
      await transfer(data);
    }),
  );

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <div className="grid grid-cols-2 gap-2">
          <Controller
            name="amount"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="sum">Сумма</FieldLabel>
                <Input placeholder="150" id="sum" max={balance} {...field} />
                <FieldDescription>Сумма для перевода</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="target"
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="receiver">Получатель</FieldLabel>
                <Combobox
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  items={players}
                  itemToStringLabel={(item) => item.name}
                >
                  <ComboboxInput placeholder="Выберите игрока" />
                  <ComboboxContent>
                    <ComboboxEmpty>Игрок не найден.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: Player) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>

                <FieldDescription>Игрок для перевода</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          control={form.control}
          name="comment"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="comment">Комментарий</FieldLabel>
              <Textarea
                placeholder="С днём рождения!"
                id="comment"
                {...field}
              />
              <FieldDescription>Комментарий. Необязательно</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button disabled={isPending} type="submit">
          {isPending && <Spinner />} Перевести
        </Button>
      </FieldGroup>
    </form>
  );
}
