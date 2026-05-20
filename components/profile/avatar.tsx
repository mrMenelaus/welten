import { Player } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties } from "react";

export async function Avatar({
  player,
  className,
}: {
  player: Player;
  className?: string;
}) {
  return (
    <Link href={`/player/${player.name}`}>
      <div
        style={
          {
            "--opacity": player.opacity,
            "--primary": player.accent,
            "--custom":
              "color-mix(in oklab, var(--primary) var(--opacity), transparent)",
          } as CSSProperties
        }
        className={cn(
          "overflow-clip relative bg-linear-to-br from-(--custom) to-45% to-background",
          className,
        )}
      >
        <Image className="-scale-x-100" fill src={player.skin} alt="avatar" />
      </div>
    </Link>
  );
}
