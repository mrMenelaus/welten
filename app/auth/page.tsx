import { Animated } from "@/components/layout/animated";
import { Avatar } from "@/components/profile/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { FingerprintPattern } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LinkPage({ searchParams }: PageProps<"/auth">) {
  const { key } = await searchParams;
  if (!key) {
    return <div>Invalid page</div>;
  }

  const verified = jwt.verify(key as string, process.env.JWT_SECRET!) as {
    name: string;
  };
  const player = await prisma.player.findUnique({
    where: { name: verified.name },
  });
  if (!player) return null;

  const token = jwt.sign(
    { sub: player.id, name: player.name },
    process.env.JWT_SECRET!,
    { expiresIn: "30d" },
  );

  async function claimPlayer() {
    "use server";
    (await cookies()).set({ name: "token", value: token });
    redirect("/me");
  }

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Animated className="flex p-16 rounded-4xl border-border border flex-col items-center text-center h-3/4 gap-4">
        <Avatar className="size-64 rounded-2xl" player={player} />
        <div>
          <div className="leading-12 font-black text-3xl">{player.name}</div>
          <div className="text-lg">Баланс: {player.balance}</div>
        </div>
        <div className="flex-1"/>
        <form action={claimPlayer}>
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="hover:bg-primary ease-in-out duration-1000"
          >
            <FingerprintPattern />
            Войти в аккаунт
          </Button>
        </form>
      </Animated>
    </div>
  );
}
