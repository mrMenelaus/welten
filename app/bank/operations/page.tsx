import { UnderDevelopment } from "@/components/layout/under-development";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import coin from "@/public/wcoin.png";
import { Avatar } from "@/components/profile/avatar";

export default async function Operations() {
  const session = await getSession();
  if (!session) {
    return <UnderDevelopment />;
  }

  const transfers = await prisma.transfer.findMany({
    where: { OR: [{ targetId: session.sub }, { sourceId: session.sub }] },
    orderBy: { time: "desc" },
    include: { source: true, target: true },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Все операции</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {transfers.map((transfer) => {
            const display =
              transfer.targetId === session.sub
                ? transfer.source
                : transfer.target;

            return (
              <Item key={transfer.id} variant="outline">
                <ItemMedia>
                  {display && (
                    <Avatar className="size-16 rounded-2xl" player={display} />
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemDescription>{display?.name ?? "Система"}</ItemDescription>
                  <ItemTitle
                    className={
                      transfer.sourceId === session.sub
                        ? "text-red-500"
                        : "text-green-500"
                    }
                  >
                    {transfer.sourceId === session.sub ? "-" : "+"}
                    {transfer.amount}
                    <Image src={coin} className="size-4" alt="coin" />
                  </ItemTitle>
                </ItemContent>

                {transfer.comment && (
                  <ItemFooter>
                    <p>{transfer.comment}</p>
                  </ItemFooter>
                )}
              </Item>
            );
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
