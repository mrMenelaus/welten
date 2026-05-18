import { Player } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

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
        className={cn("overflow-clip relative bg-linear-to-br from-primary/25 to-45% to-background", className)}
      >
        <Image className="-scale-x-100" fill src={player.skin} alt="avatar" />
      </div>
    </Link>
  );
}
