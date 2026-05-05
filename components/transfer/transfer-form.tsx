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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { transferSchema } from "./types";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { transfer } from "./transfer-actions";
import { useRef, useState } from "react";
import { Spinner } from "../ui/spinner";

export function TransferForm({
  balance,
  players,
}: {
  players: Player[];
  balance: number;
}) {
  const keyRef = useRef<null | string>(null);

  const [isPending, setIsPending] = useState(false);

  function getKey() {
    if (keyRef.current) {
      return keyRef.current;
    }

    keyRef.current = crypto.randomUUID();
    return keyRef.current;
  }

  const form = useForm<z.infer<typeof transferSchema>>({
    defaultValues: { amount: 0, comment: "" },
    resolver: zodResolver(transferSchema),
  });

  // eslint-disable-next-line react-hooks/refs
  const onSubmit = form.handleSubmit(async (data) => {
    setIsPending(true);
    const key = getKey();
    const result = await transfer(data, key);
    if (result.success) {
      keyRef.current = null;
      form.reset();
    }
    setIsPending(false);
  });

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
                <Input
                  placeholder="150"
                  id="sum"
                  type="number"
                  min={0}
                  max={balance}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(
                      Number.isNaN(event.target.valueAsNumber)
                        ? 0
                        : event.target.valueAsNumber,
                    );
                  }}
                />
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
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите игрока" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectGroup>
                      <SelectLabel>Игроки</SelectLabel>
                      {players.map((player) => (
                        <SelectItem value={player.id} key={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>Игрок для получения</FieldDescription>
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
        <Button disabled={isPending}>
          {isPending && <Spinner />} Перевести
        </Button>
      </FieldGroup>
    </form>
  );
}
