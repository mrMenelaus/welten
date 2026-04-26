"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { BadgeCent } from "lucide-react";

export function PlayerStatus({
  initial,
}: {
  initial: { status: "OFFLINE" | "ONLINE"; balance: number };
}) {
  const [info, setInfo] = useState(initial);

  useEffect(() => {
    const stream = new EventSource("/api/player");
    const handler = (message: MessageEvent) => {
      const data = JSON.parse(message.data);
      setInfo({status: data.status, balance: data.balance});
    };

    stream.addEventListener("message", handler);

    return () => {
      stream.removeEventListener("message", handler);
    };
  }, []);

  return (
    <div className="font-semibold flex gap-4 items-center mb-2">
      <span>{info.status}</span>
      <Separator orientation="vertical" />
      <span className="flex gap-1 items-center">
        {info.balance} <BadgeCent className="size-4" />
      </span>
    </div>
  );
}
