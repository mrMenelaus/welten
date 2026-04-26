import { Player } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function Avatar({
  player,
  className,
}: {
  player: Player;
  className?: string;
}) {
  return (
    <Link href={`/player/${player.name}`}>
      <div
        className={cn(
          "overflow-clip relative bg-linear-to-tl border border-border from-primary/30 to-primary/5",
          className,
        )}
      >
        <Image
          className="-scale-x-100"
          fill
          src={`https://nmsr.nickac.dev/bust/${JSON.parse(player.skin as string).profileId}`}
          alt="avatar"
        />
      </div>
    </Link>
  );
}
