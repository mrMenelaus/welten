import { getPlayer } from "@/components/profile/get-player";
import { TransferForm } from "@/components/transfer/transfer-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import coin from "@/public/wcoin.png";
import Image from "next/image";
import Link from "next/link";

export default async function Bank() {
  const session = await getSession();
  if (!session) return null;

  const player = await getPlayer(session.name);
  if (!player) return null;

  const players = await prisma.player.findMany({
    where: { id: { not: player.id } },
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>История переводов</CardTitle>
          <CardAction>
            <Button asChild variant="outline">
              <Link href={"/bank/operations"}>Посмотреть</Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Привет, {player.name}</CardDescription>
          <CardTitle className="flex items-center text-2xl font-black">
            Баланс: {player.balance}
            <Image src={coin} className="size-6 m-1" alt="coin" />
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Моментальные операции</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="block">
          <TransferForm players={players} balance={player.balance} />
        </CardFooter>
      </Card>
    </div>
  );
}
