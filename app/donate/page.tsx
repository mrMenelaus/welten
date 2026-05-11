import { Button } from "@/components/ui/button";
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
  title: "ДОНАТ",
};

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { prisma } from "@/lib/prisma";

export default async function Donate() {
  "use cache";
  cacheLife("minutes");

  const donates = await prisma.donate.findMany()

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8 ">
      {donates.map((e) => (
        <Card key={e.id} className="relative overflow-clip aspect-3/4 group">
          <div className="absolute inset-0 z-0">
            <Image
            className="object-cover"
              src={e.background}
              fill
              alt="background"
            />
          </div>
          <div className="flex-1" />
          <CardHeader className="z-50">
            <CardTitle className="leading-1.5 font-black text-4xl">
              {e.name}
            </CardTitle>
            <CardDescription className="font-semibold text-4xl">
              {e.cost} &#8381;
            </CardDescription>
          </CardHeader>
          <CardFooter className="z-50">
            <Button
              nativeButton={false}
              className="w-full"
              variant="outline"
              render={<Link href={`/donate/${e.param}`} />}
            >
              Подробнее <ChevronRight />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
