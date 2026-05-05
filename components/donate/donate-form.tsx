"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { donate } from "./donate-actions";

export function DonateForm({id}: {id: string}) {


  return <form action={donate}>
    <input type="text" name="id" defaultValue={id} className="hidden" />
    <SubmitButton />
  </form>;
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button variant="outline" type="submit" disabled={pending}>
      {pending && <Spinner/>} Продолжить <ChevronRight />
    </Button>
  );
}
