import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Донат",
};

import Link from "next/link";
import { cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

export default async function Donate() {
  "use cache";
  cacheLife("minutes");

  const donates = await prisma.donate.findMany({ include: { image: true } });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 ">
      {donates.map((e) => (
        <Card className="group pt-0" key={e.id}>
          <div className="relative aspect-square w-full overflow-clip">
            <Image
              src={e.image.ufsUrl}
              alt={e.image.name}
              fill
              className="object-cover group-hover:scale-105 ease-out duration-500"
            />
          </div>
          <CardHeader>
            <CardTitle>{e.name}</CardTitle>
            <CardDescription className="line-clamp-2">
              {e.description}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link
              className={buttonVariants({
                variant: "secondary",
                className: "w-full",
              })}
              href={`/donate/${e.param}`}
            >
              Подробности
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
