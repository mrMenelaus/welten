import { UnderDevelopment } from "@/components/layout/under-development";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { getSession } from "@/lib/auth/get-session";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import coin from "@/public/wcoin.png";

export default async function Operations() {
  const session = await getSession();
  if (!session) {
    return <UnderDevelopment />;
  }

  const transfers = await prisma.transfer.findMany({
    where: { OR: [{ targetId: session.sub }, { sourceId: session.sub }] },
    orderBy: { time: "desc" },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
            Все операции
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transfers.map((transfer) => (
          <Item key={transfer.id} variant="outline">
            <ItemContent>
              <ItemDescription>Перевод</ItemDescription>
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
        ))}
      </CardContent>
    </Card>
  );
}
