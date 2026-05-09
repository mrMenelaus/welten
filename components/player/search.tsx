"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { fa } from "zod/v4/locales";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { SearchIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";

export default function Search() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [initial] = useState(q);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Form action="">
      <InputGroup>
        <InputGroupInput
          name="q"
          placeholder="Искать по нику"
          defaultValue={initial}
          onChange={(e) => {
            const newSearchParams = new URLSearchParams(
              searchParams.toString(),
            );
            newSearchParams.set("q", e.target.value);
            startTransition(() => {
              router.push(`?${newSearchParams.toString()}`, {
                scroll: false,
              });
            });
          }}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        {isPending && (
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>
    </Form>
  );
}
