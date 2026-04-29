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
    <Animated>
      <Item variant="outline" className="flex-col items-center w-xs py-10 mx-auto ">
        <ItemHeader>
          <Avatar className="size-32 rounded-2xl" player={player} />
        </ItemHeader>
        <ItemContent>
          <ItemTitle>{player.name}</ItemTitle>
          <ItemDescription>Баланс: {player.balance}</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <form action={claimPlayer}>
            <Button type="submit" variant="outline" size="lg">
              <FingerprintPattern />
              Войти в аккаунт
            </Button>
          </form>
        </ItemFooter>
      </Item>
    </Animated>
  );
}
