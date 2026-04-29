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
        style={{
          background: player.background,
        }}
        className={cn("overflow-clip relative", className)}
      >
        <Image className="-scale-x-100" fill src={player.skin} alt="avatar" />
      </div>
    </Link>
  );
}
