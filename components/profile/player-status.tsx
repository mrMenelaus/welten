"use client";

import { useEffect, useState } from "react";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

import wcoin from "@/public/wcoin.png";


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
      setInfo((prev) => ({ ...prev, status: data.status }));
    };

    stream.addEventListener("message", handler);

    return () => {
      stream.removeEventListener("message", handler);
    };
  }, []);

  return (
    <div className="font-semibold flex gap-4 items-center mb-2">
      <span className="flex gap-1 items-center">
        <div
          className={cn("size-4 rounded-full bg-linear-to-t", {
            "from-lime-600 to-lime-400": info.status === "ONLINE",
            "from-red-600 to-red-400": info.status === "OFFLINE",
          })}
        />
        {info.status}
      </span>
      <Separator orientation="vertical" />
      <span className="flex gap-1 items-center">
        {info.balance} <Image src={wcoin} alt="wcoin" className="size-4" />
      </span>
    </div>
  );
}
